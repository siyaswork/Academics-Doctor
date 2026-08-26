import React, { useState } from 'react'
import { Input } from '../../src/components/Input'
import { Button } from '../../src/components/Button'
import { resetPassword } from '../../src/lib/supabase/auth'

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    const { error } = await resetPassword(email)
    if (error) {
      setMessage('Unable to send password reset. Try again later.')
      return
    }
    setMessage('If an account exists for that email, a password reset link has been sent.')
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: 24 }}>
      <h2>Reset password</h2>
      <form onSubmit={submit}>
        <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {message && <div style={{ marginTop: 8 }}>{message}</div>}
        <div style={{ marginTop: 12 }}>
          <Button type="submit">Send reset link</Button>
        </div>
      </form>
    </div>
  )
}
