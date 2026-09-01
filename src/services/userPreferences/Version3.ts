import { supabase } from '../../lib/supabase/client'
import type { UserPreference } from '../../types/database'

async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser()
  return data?.user?.id ?? null
}

export async function getUserPreferences() {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const { data, error } = await supabase.from('user_preferences').select('*').eq('user_id', userId).maybeSingle()
  return { data, error }
}

export async function upsertUserPreferences(prefs: Partial<UserPreference>) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const payload = { ...prefs, user_id: userId }
  const { data, error } = await supabase.from('user_preferences').upsert(payload).select().maybeSingle()
  return { data, error }
}
