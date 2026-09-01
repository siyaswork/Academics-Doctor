import { supabase } from '../../lib/supabase/client'
import type { StudySession } from '../../types/database'

async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser()
  return data?.user?.id ?? null
}

export async function startSession(payload: Partial<StudySession>) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const s = { ...payload, user_id: userId, started_at: new Date().toISOString() }
  const { data, error } = await supabase.from('study_sessions').insert(s).select().maybeSingle()
  return { data, error }
}

export async function endSession(sessionId: string) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }
  const ended_at = new Date().toISOString()
  const { data: session, error: getErr } = await supabase.from('study_sessions').select('*').eq('id', sessionId).eq('user_id', userId).maybeSingle()
  if (getErr) return { data: null, error: getErr }
  if (!session) return { data: null, error: new Error('Session not found or access denied') }
  const started = session.started_at ? new Date(session.started_at).getTime() : null
  const duration = started ? Math.max(0, Math.round((Date.parse(ended_at) - started) / 1000)) : null

  const { data, error } = await supabase.from('study_sessions').update({ ended_at, duration }).eq('id', sessionId).eq('user_id', userId).select().maybeSingle()
  return { data, error }
}

export async function listStudySessions() {
  const userId = await getCurrentUserId()
  if (!userId) return { data: [], error: new Error('Not authenticated') }
  const { data, error } = await supabase.from('study_sessions').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return { data, error }
}
