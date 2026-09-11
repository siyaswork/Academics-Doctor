import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase/client'

export function TopicRequestBox() {
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !message.trim() || status === 'sending') return
    setStatus('sending')

    const { error } = await supabase.from('topic_requests').insert({ user_id: user.id, message: message.trim() })

    if (error) {
      setStatus('error')
    } else {
      setMessage('')
      setStatus('sent')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  if (!user) return null

  return (
    <section style={{ marginTop: 24, padding: 16, border: '1px solid var(--color-border, #ddd)', borderRadius: 8 }}>
      <h2 style={{ fontSize: '1rem', marginTop: 0 }}>Suggest a topic</h2>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: 0 }}>
        Is there a subject or topic you'd like to see added? Let us know — we read every suggestion.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. 'Please add Organic Chemistry under Chemistry'"
          rows={3}
          style={{
            padding: '0.6rem 0.8rem',
            borderRadius: 8,
            border: '1px solid var(--color-border, #ccc)',
            fontSize: '0.95rem',
            resize: 'vertical',
          }}
        />
        <button
          type="submit"
          disabled={!message.trim() || status === 'sending'}
          style={{
            alignSelf: 'flex-start',
            padding: '0.5rem 1.2rem',
            borderRadius: 8,
            border: 'none',
            background: 'var(--color-primary, #1c2b39)',
            color: '#fff',
            cursor: message.trim() ? 'pointer' : 'not-allowed',
          }}
        >
          {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent — thank you!' : 'Send suggestion'}
        </button>
        {status === 'error' && <span style={{ color: 'var(--color-danger, #b3261e)', fontSize: '0.85rem' }}>Something went wrong — please try again.</span>}
      </form>
    </section>
  )
}
