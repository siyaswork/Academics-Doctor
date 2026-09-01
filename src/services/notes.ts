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
 * Replace all rich-text blocks for a note.
 * IMPORTANT: only deletes/inserts rows where block_type ≠ 'drawing' so that
 * the drawing block (position = -1) is never accidentally clobbered when the
 * user edits the note's text content.
 *
 * NOTE: delete-then-insert is not atomic. If the insert fails after a successful
 * delete, blocks will be empty in Supabase. Local state and localStorage are
 * unaffected so the user does NOT lose data — the next autosave retries.
 */
export async function replaceBlocksForNote(noteId: string, content: RichTextContent[]) {
  const userId = await getCurrentUserId()
  if (!userId) return { error: new Error('Not authenticated') }

  // Delete existing rich-text blocks only (spare the drawing row)
  const { error: delError } = await supabase
    .from('note_blocks')
    .delete()
    .eq('note_id', noteId)
    .eq('user_id', userId)
    .neq('block_type', DRAWING_BLOCK_TYPE)
  if (delError) return { error: delError }

  if (content.length === 0) return { error: null }

  const inserts = content.map((block, idx) => ({
    note_id: noteId,
    user_id: userId,
    block_type: block.type,
    content: block as unknown as Record<string, unknown>,
    position: idx,
  }))

  const { error } = await supabase.from('note_blocks').insert(inserts)
  return { error }
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
