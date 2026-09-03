import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase/client'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sessionPresent, setSessionPresent] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Supabase JS v2 parses the recovery link automatically on client init
    // (detectSessionInUrl is on by default) — just check the resulting session.
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      setSessionPresent(Boolean(data.session))
    })()
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setError(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const { error: sbError } = await supabase.auth.updateUser({ password })
      if (sbError) {
        setError(typeof sbError.message === 'string' ? sbError.message : 'Unable to reset password. Try again.')
        setLoading(false)
        return
      }
      setMessage('Password updated. You can now sign in with your new password.')
      setLoading(false)
      setTimeout(() => navigate('/login'), 1800)
    } catch (err: any) {
      setError('Unexpected error. Please try again.')
      setLoading(false)
    }
  }

  if (!sessionPresent) {
    return (
      <div style={{ maxWidth: 420, margin: '0 auto', padding: 24 }}>
        <h2>Reset password</h2>
        <p>
          To reset your password, click the link in the password reset email and you should be redirected here. If you were not redirected or the link expired, request a new reset link on the
          Forgot Password page.
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: 24 }}>
      <h2>Set a new password</h2>
      <form onSubmit={submit}>
        <Input label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input label="Confirm password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        {message && <div style={{ color: 'green', marginTop: 8 }}>{message}</div>}
        <div style={{ marginTop: 12 }}>
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save new password'}</Button>
        </div>
      </form>
    </div>
  )
}