import { supabase } from '../../lib/supabase/client'

async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser()
  return data?.user?.id ?? null
}

export async function listFavorites() {
  const userId = await getCurrentUserId()
  if (!userId) return { data: [], error: new Error('Not authenticated') }
  const { data, error } = await supabase.from('favorites').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return { data, error }
}

/**
 * Idempotent favorite creation: attempt insert, if conflict or error try to fetch existing.
 */
export async function addFavorite(payload: { item_type: string; item_id: string }) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }

  try {
    const { data, error } = await supabase.from('favorites').insert({
      user_id: userId,
      item_type: payload.item_type,
      item_id: payload.item_id,
    }).select().maybeSingle()

    if (error) {
      const { data: existing, error: fetchErr } = await supabase.from('favorites').select('*').eq('user_id', userId).eq('item_type', payload.item_type).eq('item_id', payload.item_id).maybeSingle()
      return { data: existing, error: fetchErr ?? error }
    }
    return { data, error: null }
  } catch (err: any) {
    const { data: existing, error: _error } = await supabase.from('favorites').select('*').eq('user_id', userId).eq('item_type', payload.item_type).eq('item_id', payload.item_id).maybeSingle()
    return { data: existing, error: err }
  }
}

export async function removeFavorite(id: string) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const { data, error } = await supabase.from('favorites').delete().eq('id', id).eq('user_id', userId)
  return { data, error }
}

export async function isFavorited(item_type: string, item_id: string) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: false, error: new Error('Not authenticated') }
  const { data, error } = await supabase.from('favorites').select('*').eq('user_id', userId).eq('item_type', item_type).eq('item_id', item_id).maybeSingle()
  return { data: !!data, error }
}
