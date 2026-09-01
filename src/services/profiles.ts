import { supabase } from '../lib/supabase/client'
import type { Profile } from '../types/database'

async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser()
  return data?.user?.id ?? null
}

export async function getCurrentProfile() {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }

  const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle()
  return { data, error }
}

export async function createProfileIfMissing(profile: Partial<Profile> = {}) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }

  const { data: existing } = await supabase.from('profiles').select('id').eq('user_id', userId).maybeSingle()
  if (existing) return { data: existing, error: null }

  const payload: Partial<Profile> & { user_id: string } = {
    user_id: userId,
    display_name: profile.display_name ?? undefined,
    email: profile.email ?? undefined,
    avatar_path: profile.avatar_path ?? undefined,
    education_level: profile.education_level ?? undefined,
    bio: profile.bio ?? undefined,
  }

  const { data, error } = await supabase.from('profiles').insert(payload).select().single()
  return { data, error }
}

export async function updateProfile(updates: Partial<Profile>) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .maybeSingle()

  return { data, error }
}

export async function uploadAvatar(file: File) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }

  const path = `avatars/${userId}/${file.name}`
  const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
  if (uploadError) return { data: null, error: uploadError }

  const { data, error } = await supabase
    .from('profiles')
    .upsert({ user_id: userId, avatar_path: path })
    .select()
    .maybeSingle()

  return { data, error }
}

export async function getAvatarUrl(path: string, expiresSeconds = 60) {
  if (!path) return { publicUrl: null, signedUrl: null, error: new Error('No path provided') }
  try {
    const { data, error } = await supabase.storage.from('avatars').createSignedUrl(path, expiresSeconds)
    return { publicUrl: null, signedUrl: data?.signedUrl ?? null, error }
  } catch (err: any) {
    return { publicUrl: null, signedUrl: null, error: err }
  }
}
