import { supabase } from '../../lib/supabase/client'
import type { Reminder } from '../../types/database'

async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser()
  return data?.user?.id ?? null
}

export async function listReminders() {
  const userId = await getCurrentUserId()
  if (!userId) return { data: [], error: new Error('Not authenticated') }
  const { data, error } = await supabase.from('reminders').select('*').eq('user_id', userId).order('due_at', { ascending: true })
  return { data, error }
}

export async function createReminder(payload: Partial<Reminder>) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const { data, error } = await supabase.from('reminders').insert({ ...payload, user_id: userId }).select().maybeSingle()
  return { data, error }
}

export async function updateReminder(id: string, updates: Partial<Reminder>) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const { data, error } = await supabase.from('reminders').update(updates).eq('id', id).eq('user_id', userId).select().maybeSingle()
  return { data, error }
}

export async function deleteReminder(id: string) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const { data, error } = await supabase.from('reminders').delete().eq('id', id).eq('user_id', userId)
  return { data, error }
}
