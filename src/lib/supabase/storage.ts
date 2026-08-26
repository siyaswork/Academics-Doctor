import { supabase } from './client'

export async function uploadAvatar(userId: string, file: File) {
  const path = `avatars/${userId}/${file.name}`
  const { data, error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
  return { data, error, path }
}

export function getPublicUrl(path: string) {
  // For private buckets, use createSignedUrl at runtime instead
  return supabase.storage.from('avatars').getPublicUrl(path)
}

export async function createSignedUrl(bucket: string, path: string, expiresSeconds = 60) {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresSeconds)
  return { data, error }
}

export async function deleteFile(bucket: string, path: string) {
  const { data, error } = await supabase.storage.from(bucket).remove([path])
  return { data, error }
}

export async function uploadNoteFile(userId: string, noteId: string, file: File) {
  const path = `note-files/${userId}/${noteId}/${file.name}`
  const { data, error } = await supabase.storage.from('note-files').upload(path, file)
  return { data, error, path }
}
