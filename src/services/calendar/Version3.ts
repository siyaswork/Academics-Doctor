import { supabase } from '../../lib/supabase/client'
import type { CalendarEvent } from '../../types/database'

async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser()
  return data?.user?.id ?? null
}

export async function listEvents() {
  const userId = await getCurrentUserId()
  if (!userId) return { data: [], error: new Error('Not authenticated') }
  const { data, error } = await supabase.from('calendar_events').select('*').eq('user_id', userId).order('date', { ascending: true })
  return { data, error }
}

export async function createEvent(payload: Partial<CalendarEvent>) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const { data, error } = await supabase.from('calendar_events').insert({ ...payload, user_id: userId }).select().maybeSingle()
  return { data, error }
}

export async function updateEvent(id: string, updates: Partial<CalendarEvent>) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const { data, error } = await supabase.from('calendar_events').update(updates).eq('id', id).eq('user_id', userId).select().maybeSingle()
  return { data, error }
}

export async function deleteEvent(id: string) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const { data, error } = await supabase.from('calendar_events').delete().eq('id', id).eq('user_id', userId)
  return { data, error }
}
