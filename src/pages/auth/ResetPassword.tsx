import React, { useState } from 'react'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setMessage('If this email exists we have sent reset instructions (placeholder).')
  }

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: 24 }}>
      <h2>Reset password</h2>
      <form onSubmit={submit}>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <div style={{ marginTop: 12 }}>
          <button type="submit">Send reset email</button>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}
