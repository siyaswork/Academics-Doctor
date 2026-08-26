import { supabase } from '../lib/supabase/client'
import { Profile } from '../types/database'

export async function getProfile(userId: string) {
  const { data, error } = await supabase.from<Profile>('profiles').select('*').eq('user_id', userId).single()
  return { data, error }
}

export async function upsertProfile(profile: Partial<Profile> & { user_id: string }) {
  const { data, error } = await supabase.from('profiles').upsert(profile).select().single()
  return { data, error }
}
