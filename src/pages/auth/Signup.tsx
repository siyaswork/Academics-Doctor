import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import { useAuth } from '../../contexts/AuthContext'

export const Signup: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { signUp } = useAuth()

  function isValidEmail(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const { error: sbError } = await signUp(email, password, name)
    setLoading(false)

    if (sbError) {
      if (typeof sbError.message === 'string') {
        setError(sbError.message)
      } else {
        setError('Unable to create account. Please try again.')
      }
      return
    }

    navigate('/dashboard')
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: 24 }}>
      <h2>Create account</h2>
      <form onSubmit={submit}>
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input label="Confirm password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        <div style={{ marginTop: 12 }}>
          <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</Button>
        </div>
      </form>
    </div>
  )
}