import { supabase } from '../lib/supabase/client'
import { Research } from '../types/database'

async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser()
  return data?.user?.id ?? null
}

export async function listResearch() {
  const userId = await getCurrentUserId()
  if (!userId) return { data: [], error: new Error('Not authenticated') }
  const { data, error } = await supabase.from<Research>('research').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return { data, error }
}

export async function createResearch(r: Partial<Research>) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const payload = { ...r, user_id: userId }
  const { data, error } = await supabase.from<Research>('research').insert(payload).select().maybeSingle()
  return { data, error }
}

export async function updateResearch(id: string, updates: Partial<Research>) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const { data, error } = await supabase.from<Research>('research').update(updates).eq('id', id).eq('user_id', userId).select().maybeSingle()
  return { data, error }
}

export async function deleteResearch(id: string) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const { data, error } = await supabase.from<Research>('research').delete().eq('id', id).eq('user_id', userId)
  return { data, error }
}
