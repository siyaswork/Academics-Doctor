import { supabase } from '../lib/supabase/client'
import type { Note as DBNote, NoteBlock as DBNoteBlock } from '../types/database'
import type { Note as FrontNote, RichTextContent } from '../types/notes'

async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser()
  return data?.user?.id ?? null
}

/**
 * Convert DB note to frontend Note stub (content is loaded separately).
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
  return { note, blocks: blocks ?? [], error: blocksError }
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
  const { data, error } = await supabase.from('notes').delete().eq('id', noteId).eq('user_id', userId)
  return { data, error }
}

/* Note blocks CRUD (DB shape) */
export async function createNoteBlock(noteId: string, block: Partial<DBNoteBlock>) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }

  const payload = {
    ...block,
    note_id: noteId,
    user_id: userId,
  }
  const { data, error } = await supabase.from('note_blocks').insert(payload).select().maybeSingle()
  return { data, error }
}

export async function updateNoteBlock(blockId: string, updates: Partial<DBNoteBlock>) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const { data, error } = await supabase.from('note_blocks').update(updates).eq('id', blockId).eq('user_id', userId).select().maybeSingle()
  return { data, error }
}

export async function deleteNoteBlock(blockId: string) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const { data, error } = await supabase.from('note_blocks').delete().eq('id', blockId).eq('user_id', userId)
  return { data, error }
}

/**
 * Replace blocks for a note: delete existing blocks for the note and insert the new ones.
 * Converts frontend RichTextContent -> DB note_block shape (block_type + content JSON).
 */
export async function replaceBlocksForNote(noteId: string, content: RichTextContent[]) {
  const userId = await getCurrentUserId()
  if (!userId) return { error: new Error('Not authenticated') }

  // Delete existing blocks
  const del = await supabase.from('note_blocks').delete().eq('note_id', noteId).eq('user_id', userId)
  if (del.error) return { error: del.error }

  // Insert new blocks
  const inserts = content.map((block, idx) => ({
    note_id: noteId,
    user_id: userId,
    block_type: block.type,
    content: block, // store the RichTextContent object as JSON
    position: idx,
  }))

  const { data, error } = await supabase.from('note_blocks').insert(inserts).select()
  return { data, error }
}
