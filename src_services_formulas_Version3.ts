import { supabase } from '../lib/supabase/client'
import { Formula } from '../types/database'

async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser()
  return data?.user?.id ?? null
}

export async function listFormulas() {
  const userId = await getCurrentUserId()
  if (!userId) return { data: [], error: new Error('Not authenticated') }
  const { data, error } = await supabase.from<Formula>('formulas').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return { data, error }
}

export async function createFormula(payload: Partial<Formula>) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const { data, error } = await supabase.from<Formula>('formulas').insert({ ...payload, user_id: userId }).select().maybeSingle()
  return { data, error }
}

export async function updateFormula(id: string, updates: Partial<Formula>) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const { data, error } = await supabase.from<Formula>('formulas').update(updates).eq('id', id).eq('user_id', userId).select().maybeSingle()
  return { data, error }
}

export async function deleteFormula(id: string) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const { data, error } = await supabase.from<Formula>('formulas').delete().eq('id', id).eq('user_id', userId)
  return { data, error }
}