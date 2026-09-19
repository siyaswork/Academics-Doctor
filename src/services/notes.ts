import { supabase } from '../lib/supabase/client'
import type { Note as DBNote, NoteBlock as DBNoteBlock } from '../types/database'
import type { Note as FrontNote, RichTextContent, DrawingAction } from '../types/notes'

// ─── block_type constants ────────────────────────────────────────────────────

/**
 * Drawing blocks are stored as a single `note_blocks` row per note with
 * `block_type = 'drawing'` and `content = { actions: DrawingAction[] }`.
 * We use position = -1 so it sits outside the rich-text block range (0, 1, 2…)
 * and is never accidentally included in content serialisation.
 */
const DRAWING_BLOCK_TYPE = 'drawing'
const DRAWING_BLOCK_POSITION = -1

// ─── helpers ─────────────────────────────────────────────────────────────────

async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser()
  return data?.user?.id ?? null
}

/** Convert a DB note row → a frontend Note stub (content/drawings loaded separately). */
function dbNoteToFront(note: DBNote): FrontNote {
  return {
    id: note.id,
    title: note.title ?? '',
    subject: 'other' as any, // subject_id mapping not implemented yet
    color: (note.color ?? 'blue') as import('../types/notes').NoteColor,
    content: [],
    drawings: new Map(),
    createdAt: note.created_at ? new Date(note.created_at) : new Date(),
    updatedAt: note.updated_at ? new Date(note.updated_at) : new Date(),
    lastEditedBy: undefined,
    tags: [],
    isPinned: false,
    hasDrawings: false,
  }
}

/**
 * Convert an ordered array of DB note_blocks (excluding drawing blocks) back
 * into frontend RichTextContent[].  Blocks are sorted by position before conversion.
 */
export function dbBlocksToFrontContent(blocks: DBNoteBlock[]): RichTextContent[] {
  return blocks
    .filter((b) => b.block_type !== DRAWING_BLOCK_TYPE)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .flatMap((block): RichTextContent[] => {
      if (block.content != null && typeof block.content === 'object' && !Array.isArray(block.content)) {
        const c = block.content as Partial<RichTextContent>
        if (typeof c.type === 'string') return [c as RichTextContent]
      }
      return [{ type: block.block_type as RichTextContent['type'], content: '' }]
    })
}

/**
 * Extract the DrawingAction[] from a DB note_blocks row that has
 * block_type = 'drawing', or return null if not present / malformed.
 */
export function dbBlockToDrawingActions(block: DBNoteBlock | null | undefined): DrawingAction[] | null {
  if (!block || block.block_type !== DRAWING_BLOCK_TYPE) return null
  const c = block.content
  if (c && typeof c === 'object' && !Array.isArray(c) && Array.isArray((c as any).actions)) {
    return (c as any).actions as DrawingAction[]
  }
  return null
}

// ─── notes CRUD ──────────────────────────────────────────────────────────────

export async function listNotes() {
  const userId = await getCurrentUserId()
  if (!userId) return { data: [], error: new Error('Not authenticated') }
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) return { data: [], error }
  const front = (data ?? []).map(dbNoteToFront)
  return { data: front, error: null }
}

export async function createNote(payload: Partial<DBNote>) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const insert = { ...payload, user_id: userId }
  const { data, error } = await supabase.from('notes').insert(insert).select().maybeSingle()
  return { data, error }
}

export async function getNoteWithBlocks(noteId: string) {
  const userId = await getCurrentUserId()
  if (!userId) return { note: null, blocks: [], error: new Error('Not authenticated') }

  const { data: note, error: noteError } = await supabase
    .from('notes')
    .select('*')
    .eq('id', noteId)
    .eq('user_id', userId)
    .maybeSingle()
  if (noteError) return { note: null, blocks: [], error: noteError }
  if (!note) return { note: null, blocks: [], error: new Error('Note not found or access denied') }

  const { data: blocks, error: blocksError } = await supabase
    .from('note_blocks')
    .select('*')
    .eq('note_id', noteId)
    .eq('user_id', userId)
    .order('position', { ascending: true })
  return { note, blocks: (blocks ?? []) as DBNoteBlock[], error: blocksError }
}

export async function updateNote(noteId: string, updates: Partial<DBNote>) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const { data, error } = await supabase
    .from('notes')
    .update(updates)
    .eq('id', noteId)
    .eq('user_id', userId)
    .select()
    .maybeSingle()
  return { data, error }
}

export async function deleteNote(noteId: string) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const { error } = await supabase.from('notes').delete().eq('id', noteId).eq('user_id', userId)
  return { error }
}

// ─── rich-text blocks ────────────────────────────────────────────────────────

/**
 * Monotonically increasing client revision per block identity (note_id + position).
 * Every save attempt for a block increments its revision and sends it as
 * `client_rev`; the database trigger drops any write whose client_rev is lower
 * than what is already stored, so an out-of-order/stale response can never
 * overwrite newer content. Counters only ever go up within a session.
 */
const clientRevs = new Map<string, number>()

function nextClientRev(noteId: string, position: number): number {
  const key = `${noteId}:${position}`
  const next = (clientRevs.get(key) ?? 0) + 1
  clientRevs.set(key, next)
  return next
}

function isAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException && error.name === 'AbortError') ||
    (error instanceof Error && error.name === 'AbortError')
  )
}

/**
 * Upsert rich-text blocks for a note by their stable note_id + position identity.
 * Drawing blocks use position -1, so they are not affected by this operation.
 *
 * Each block write carries a monotonically increasing `client_rev` so the
 * backend can drop stale writes that arrive out of order. The caller aborts
 * superseded flushes via `signal`; an aborted flush is reported as
 * `{ aborted: true }` rather than as a failure.
 */
export async function replaceBlocksForNote(
  noteId: string,
  content: RichTextContent[],
  signal?: AbortSignal,
): Promise<{ error: Error | null; aborted?: boolean }> {
  if (signal?.aborted) return { error: null, aborted: true }
  const userId = await getCurrentUserId()
  if (signal?.aborted) return { error: null, aborted: true }
  if (!userId) return { error: new Error('Not authenticated') }

  const blocks = content.map((block, position) => ({
    note_id: noteId,
    user_id: userId,
    block_type: block.type,
    content: block as unknown as Record<string, unknown>,
    position,
    client_rev: nextClientRev(noteId, position),
  }))

  if (blocks.length > 0) {
    let upsertQuery = supabase.from('note_blocks').upsert(blocks, { onConflict: 'note_id,position' })
    if (signal) upsertQuery = upsertQuery.abortSignal(signal)
    const { error } = await upsertQuery
    if (error) {
      if (isAbortError(error)) return { error: null, aborted: true }
      return { error }
    }
  }

  if (signal?.aborted) return { error: null, aborted: true }
  let deleteQuery = supabase
    .from('note_blocks')
    .delete()
    .eq('note_id', noteId)
    .eq('user_id', userId)
    .neq('block_type', DRAWING_BLOCK_TYPE)
    .gte('position', content.length)
  if (signal) deleteQuery = deleteQuery.abortSignal(signal)
  const { error } = await deleteQuery
  if (error && isAbortError(error)) return { error: null, aborted: true }
  return { error }
}

// ─── search ─────────────────────────────────────────────────────────

export interface SearchResultNote {
  id: string
  title: string
  snippet?: string
  updatedAt?: Date
}

export async function searchNotes(query: string): Promise<{ data: SearchResultNote[]; error: Error | null }> {
  const userId = await getCurrentUserId()
  if (!userId) return { data: [], error: new Error('Not authenticated') }

  const q = query.trim()
  if (!q) return { data: [], error: null }

  // 1. Search notes by title for current user
  const { data: titleMatches, error: titleErr } = await supabase
    .from('notes')
    .select('id, title, updated_at, created_at')
    .eq('user_id', userId)
    .ilike('title', `%${q}%`)

  if (titleErr) return { data: [], error: titleErr }

  // 2. Search note_blocks by content for current user
  const { data: blockMatches, error: blockErr } = await supabase
    .from('note_blocks')
    .select('note_id, content, block_type')
    .eq('user_id', userId)
    .neq('block_type', DRAWING_BLOCK_TYPE)

  if (blockErr) return { data: [], error: blockErr }

  const matchingNoteIdsFromBlocks = new Set<string>()
  const blockSnippets = new Map<string, string>()

  if (blockMatches) {
    const lowerQ = q.toLowerCase()
    for (const block of blockMatches) {
      if (!block.content) continue
      let text = ''
      if (typeof block.content === 'string') {
        text = block.content
      } else if (typeof block.content === 'object') {
        const c = block.content as Record<string, unknown>
        if (typeof c.content === 'string') {
          text = c.content
        } else if (typeof c.text === 'string') {
          text = c.text
        } else {
          text = JSON.stringify(c)
        }
      }
      if (text.toLowerCase().includes(lowerQ)) {
        matchingNoteIdsFromBlocks.add(block.note_id)
        if (!blockSnippets.has(block.note_id)) {
          const matchIdx = text.toLowerCase().indexOf(lowerQ)
          const start = Math.max(0, matchIdx - 30)
          const end = Math.min(text.length, matchIdx + lowerQ.length + 50)
          const prefix = start > 0 ? '...' : ''
          const suffix = end < text.length ? '...' : ''
          blockSnippets.set(block.note_id, `${prefix}${text.slice(start, end)}${suffix}`)
        }
      }
    }
  }

  const noteIdsToFetch = new Set<string>()
  const titleNotesMap = new Map<string, DBNote>()

  if (titleMatches) {
    for (const note of titleMatches) {
      noteIdsToFetch.add(note.id)
      titleNotesMap.set(note.id, note as DBNote)
    }
  }

  for (const noteId of matchingNoteIdsFromBlocks) {
    noteIdsToFetch.add(noteId)
  }

  if (noteIdsToFetch.size === 0) {
    return { data: [], error: null }
  }

  const missingNoteIds = Array.from(noteIdsToFetch).filter((id) => !titleNotesMap.has(id))
  if (missingNoteIds.length > 0) {
    const { data: missingNotes, error: missingErr } = await supabase
      .from('notes')
      .select('id, title, updated_at, created_at')
      .eq('user_id', userId)
      .in('id', missingNoteIds)

    if (missingErr) return { data: [], error: missingErr }
    if (missingNotes) {
      for (const n of missingNotes) {
        titleNotesMap.set(n.id, n as DBNote)
      }
    }
  }

  const results: SearchResultNote[] = Array.from(noteIdsToFetch).map((id) => {
    const note = titleNotesMap.get(id)
    const title = note?.title || 'Untitled Note'
    const snippet = blockSnippets.get(id) || ''
    const updatedAt = note?.updated_at ? new Date(note.updated_at) : (note?.created_at ? new Date(note.created_at) : new Date())
    return {
      id,
      title,
      snippet,
      updatedAt,
    }
  })

  results.sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0))

  return { data: results, error: null }
}

// ─── drawing block ────────────────────────────────────────────────────────────

/**
 * Load the drawing block for a note. Returns the DrawingAction[] or null if
 * the note has no drawing in Supabase.
 * Scoped to the authenticated user — cannot read another user's drawing.
 */
export async function loadDrawingForNote(noteId: string): Promise<{ actions: DrawingAction[] | null; error: Error | null }> {
  const userId = await getCurrentUserId()
  if (!userId) return { actions: null, error: new Error('Not authenticated') }

  const { data, error } = await supabase
    .from('note_blocks')
    .select('*')
    .eq('note_id', noteId)
    .eq('user_id', userId)
    .eq('block_type', DRAWING_BLOCK_TYPE)
    .maybeSingle()

  if (error) return { actions: null, error }
  const actions = dbBlockToDrawingActions(data as DBNoteBlock | null)
  return { actions, error: null }
}

/**
 * Upsert the drawing for a note: update if a drawing block already exists,
 * insert if not. This is effectively atomic from the application's perspective
 * because we always write a single row by a stable note_id+block_type identity.
 *
 * Pass `actions = []` to mark the drawing as empty (the row is kept so the next
 * load knows the drawing was intentionally cleared, not missing).
 *
 * Security: user_id is always obtained from auth.getUser() — never from the
 * caller.  The DB RLS policy (user_id = auth.uid()) is the ultimate boundary.
 */
export async function upsertDrawingForNote(noteId: string, actions: DrawingAction[]): Promise<{ error: Error | null }> {
  const userId = await getCurrentUserId()
  if (!userId) return { error: new Error('Not authenticated') }

  // Try to find the existing drawing row for this note
  const { data: existing, error: selectError } = await supabase
    .from('note_blocks')
    .select('id')
    .eq('note_id', noteId)
    .eq('user_id', userId)
    .eq('block_type', DRAWING_BLOCK_TYPE)
    .maybeSingle()

  if (selectError) return { error: selectError }

  const payload = {
    note_id: noteId,
    user_id: userId,
    block_type: DRAWING_BLOCK_TYPE,
    content: { actions } as unknown as Record<string, unknown>,
    position: DRAWING_BLOCK_POSITION,
  }

  if (existing?.id) {
    // Row already exists — update it
    const { error } = await supabase
      .from('note_blocks')
      .update({ content: payload.content })
      .eq('id', existing.id)
      .eq('user_id', userId)
    return { error }
  } else {
    // No drawing row yet — insert
    const { error } = await supabase.from('note_blocks').insert(payload)
    return { error }
  }
}
