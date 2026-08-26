import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Input } from '../../src/components/Input'
import { Button } from '../../src/components/Button'
import { useAuth } from '../../src/contexts/AuthContext'

export const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { signIn } = useAuth()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const { error } = await signIn(email, password)
    if (error) {
      setError('Unable to sign in. Check your credentials and try again.')
      return
    }
    navigate('/')
  }

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: 24 }}>
      <h2>Sign in</h2>
      <form onSubmit={submit}>
        <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
        <label style={{ display: 'block', marginTop: 8 }}>
          <input type="checkbox" checked={showPassword} onChange={() => setShowPassword((s) => !s)} /> Show password
        </label>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        <div style={{ marginTop: 12 }}>
          <Button type="submit">Sign in</Button>
        </div>
      </form>
      <div style={{ marginTop: 12 }}>
        <Link to="/forgot-password">Forgot password?</Link>
      </div>
      <div style={{ marginTop: 12 }}>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </div>
    </div>
  )
}
