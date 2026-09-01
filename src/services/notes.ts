import { supabase } from '../lib/supabase/client'
import type { Note as DBNote, NoteBlock as DBNoteBlock } from '../types/database'
import type { Note as FrontNote, RichTextContent } from '../types/notes'

async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser()
  return data?.user?.id ?? null
}

/**
 * Convert DB note to frontend Note stub (content is loaded separately via dbBlocksToFrontContent).
 */
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
 * Convert an ordered array of DB note_blocks back into frontend RichTextContent[].
 * Each block's `content` JSONB column stores the full RichTextContent object as
 * written by replaceBlocksForNote, so we just extract it and sort by position.
 */
export function dbBlocksToFrontContent(blocks: DBNoteBlock[]): RichTextContent[] {
  return [...blocks]
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .flatMap((block): RichTextContent[] => {
      if (block.content != null && typeof block.content === 'object' && !Array.isArray(block.content)) {
        const c = block.content as Partial<RichTextContent>
        if (typeof c.type === 'string') return [c as RichTextContent]
      }
      // Fallback: reconstruct minimal block from DB column
      return [{ type: block.block_type as RichTextContent['type'], content: '' }]
    })
}

export async function listNotes() {
  const userId = await getCurrentUserId()
  if (!userId) return { data: [], error: new Error('Not authenticated') }
  const { data, error } = await supabase.from('notes').select('*').eq('user_id', userId).order('created_at', { ascending: false })
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

  const { data: note, error: noteError } = await supabase.from('notes').select('*').eq('id', noteId).eq('user_id', userId).maybeSingle()
  if (noteError) return { note: null, blocks: [], error: noteError }
  if (!note) return { note: null, blocks: [], error: new Error('Note not found or access denied') }

  const { data: blocks, error: blocksError } = await supabase.from('note_blocks').select('*').eq('note_id', noteId).eq('user_id', userId).order('position', { ascending: true })
  return { note, blocks: (blocks ?? []) as DBNoteBlock[], error: blocksError }
}

export async function updateNote(noteId: string, updates: Partial<DBNote>) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const { data, error } = await supabase.from('notes').update(updates).eq('id', noteId).eq('user_id', userId).select().maybeSingle()
  return { data, error }
}

export async function deleteNote(noteId: string) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const { error } = await supabase.from('notes').delete().eq('id', noteId).eq('user_id', userId)
  return { error }
}

/**
 * Replace all blocks for a note in Supabase.
 *
 * Converts frontend RichTextContent[] → DB note_block rows (block_type + content JSONB).
 *
 * NOTE: delete-then-insert is not atomic. If the insert fails after a successful
 * delete, blocks will be empty in Supabase. Local state (React + localStorage) is
 * unaffected, so the user does NOT lose data — the next autosave will retry.
 */
export async function replaceBlocksForNote(noteId: string, content: RichTextContent[]) {
  const userId = await getCurrentUserId()
  if (!userId) return { error: new Error('Not authenticated') }

  // Delete existing blocks
  const { error: delError } = await supabase.from('note_blocks').delete().eq('note_id', noteId).eq('user_id', userId)
  if (delError) return { error: delError }

  if (content.length === 0) return { error: null }

  // Insert new blocks
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
