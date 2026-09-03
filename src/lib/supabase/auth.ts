import { supabase } from './client'

export async function signUp(email: string, password: string, fullName?: string) {
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName ?? null } } })
  return { data, error }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signOut() {
  return supabase.auth.signOut()
}

/**
 * Send a password reset email.
 * The redirectTo must land on the app's page that can finish the flow (ResetPassword).
 */
export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/reset-password' })
  return { data, error }
}

export function onAuthStateChanged(handler: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(handler)
}