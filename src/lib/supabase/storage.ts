import { supabase } from './client'

/**
 * Storage helpers.
 *
 * Conventions (do not change bucket names here):
 * - avatars bucket: avatars/{user_id}/{filename}
 * - note-files bucket: note-files/{user_id}/{note_id}/{filename}
 * - research-files bucket: research-files/{user_id}/{research_id}/{filename}
 *
 * NOTE: Signed URLs are used for private buckets when returning a URL to the client.
 * We store only the file path in the DB (not the signed URL).
 */

export async function uploadAvatar(userId: string, file: File) {
  const path = `avatars/${userId}/${file.name}`
  const { data, error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
  return { data, error, path }
}

export async function uploadNoteFile(userId: string, noteId: string, file: File) {
  const path = `note-files/${userId}/${noteId}/${file.name}`
  const { data, error } = await supabase.storage.from('note-files').upload(path, file)
  return { data, error, path }
}

export async function uploadResearchFile(userId: string, researchId: string, file: File) {
  const path = `research-files/${userId}/${researchId}/${file.name}`
  const { data, error } = await supabase.storage.from('research-files').upload(path, file)
  return { data, error, path }
}

/**
 * Returns an object with { publicUrl?, signedUrl?, error }.
 * For private buckets we try to return a signed URL (recommended).
 *
 * expiresSeconds defaults to 60 seconds — adjust in callers if needed.
 */
export async function getFileUrl(bucket: string, path: string, expiresSeconds = 60) {
  try {
    // Try to create a signed URL first (works for private buckets)
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresSeconds)
    if (error || !data) {
      // Fallback to public URL
      const publicRes = supabase.storage.from(bucket).getPublicUrl(path)
      return { publicUrl: publicRes.data?.publicUrl ?? null, signedUrl: null, error: error ?? null }
    }
    return { publicUrl: null, signedUrl: data.signedUrl, error: null }
  } catch (err: any) {
    // Best-effort fallback to public url
    try {
      const publicRes = supabase.storage.from(bucket).getPublicUrl(path)
      return { publicUrl: publicRes.data?.publicUrl ?? null, signedUrl: null, error: err }
    } catch {
      return { publicUrl: null, signedUrl: null, error: err }
    }
  }
}

export async function deleteFile(bucket: string, path: string) {
  const { data, error } = await supabase.storage.from(bucket).remove([path])
  return { data, error }
}
