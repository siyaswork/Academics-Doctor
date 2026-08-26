import { supabase } from '../lib/supabase/client'
import { WorkProject } from '../types/database'

async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser()
  return data?.user?.id ?? null
}

export async function listWork() {
  const userId = await getCurrentUserId()
  if (!userId) return { data: [], error: new Error('Not authenticated') }
  const { data, error } = await supabase.from<WorkProject>('work_projects').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return { data, error }
}

export async function createWork(payload: Partial<WorkProject>) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const { data, error } = await supabase.from<WorkProject>('work_projects').insert({ ...payload, user_id: userId }).select().maybeSingle()
  return { data, error }
}

export async function updateWork(id: string, updates: Partial<WorkProject>) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const { data, error } = await supabase.from<WorkProject>('work_projects').update(updates).eq('id', id).eq('user_id', userId).select().maybeSingle()
  return { data, error }
}

export async function deleteWork(id: string) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const { data, error } = await supabase.from<WorkProject>('work_projects').delete().eq('id', id).eq('user_id', userId)
  return { data, error }
}
