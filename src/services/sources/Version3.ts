import { supabase } from '../../lib/supabase/client'
import type { Source } from '../../types/database'

async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser()
  return data?.user?.id ?? null
}

export async function listSources(researchId: string) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: [], error: new Error('Not authenticated') }
  const { data, error } = await supabase.from('sources').select('*').eq('research_id', researchId).eq('user_id', userId).order('created_at', { ascending: true })
  return { data, error }
}

export async function createSource(src: Partial<Source> & { research_id: string }) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const payload = { ...src, user_id: userId }
  const { data, error } = await supabase.from('sources').insert(payload).select().maybeSingle()
  return { data, error }
}

export async function updateSource(id: string, updates: Partial<Source>) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const { data, error } = await supabase.from('sources').update(updates).eq('id', id).eq('user_id', userId).select().maybeSingle()
  return { data, error }
}

export async function deleteSource(id: string) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const { data, error } = await supabase.from('sources').delete().eq('id', id).eq('user_id', userId)
  return { data, error }
}
