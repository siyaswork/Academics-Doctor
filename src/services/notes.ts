import { supabase } from '../lib/supabase/client'
import { Note, NoteBlock } from '../types/database'

export async function listNotes(userId: string) {
  const { data, error } = await supabase.from<Note>('notes').select('*').eq('user_id', userId)
  return { data, error }
}

export async function createNote(note: Partial<Note> & { user_id: string }) {
  const { data, error } = await supabase.from('notes').insert(note).select().single()
  return { data, error }
}

export async function upsertNoteBlock(block: Partial<NoteBlock> & { note_id: string; user_id: string }) {
  const { data, error } = await supabase.from('note_blocks').upsert(block).select().single()
  return { data, error }
}
