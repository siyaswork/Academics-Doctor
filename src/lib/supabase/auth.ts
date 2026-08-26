import { supabase } from './client'

export async function signUp(email: string, password: string, fullName?: string) {
  const { data, error } = await supabase.auth.signUp({ email, password }, { data: { full_name: fullName ?? null } })
  return { data, error }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/login' })
  return { data, error }
}

export function onAuthStateChanged(handler: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(handler)
}
