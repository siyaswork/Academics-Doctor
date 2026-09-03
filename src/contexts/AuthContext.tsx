import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, } from '../lib/supabase/client'
import { signIn, signOut as sbSignOut, signUp as sbSignUp, onAuthStateChanged } from '../lib/supabase/auth'

type User = {
  id: string
  email?: string | null
  displayName?: string | null
}

type AuthContextValue = {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: any }>
  signIn: (email: string, password: string) => Promise<{ error?: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      const u = data.session?.user ?? null
      const displayName = u?.user_metadata?.full_name ?? null
      setUser(u ? { id: u.id, email: u.email, displayName } : null)
      setLoading(false)
    })()

    const { data: sub } = onAuthStateChanged((_event, session) => {
      const u = session?.user ?? null
      const displayName = u?.user_metadata?.full_name ?? null
      setUser(u ? { id: u.id, email: u.email, displayName } : null)
      setLoading(false)
    })

    return () => {
      mounted = false
      sub?.subscription?.unsubscribe()
    }
  }, [])

  async function _signUp(email: string, password: string, fullName?: string) {
    const { error } = await sbSignUp(email, password, fullName)
    return { error }
  }

  async function _signIn(email: string, password: string) {
    const { error } = await signIn(email, password)
    return { error }
  }

  async function _signOut() {
    await sbSignOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp: _signUp, signIn: _signIn, signOut: _signOut }}>
      {children}
    </AuthContext.Provider>
  )
}