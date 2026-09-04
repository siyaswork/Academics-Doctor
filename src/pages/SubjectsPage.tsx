import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase/client'

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSubjects() {
      const { data, error } = await supabase
        .from('content_subjects')
        .select('*')
        .eq('is_published', true)
        .order('display_order')

      if (error) console.error(error)
      else setSubjects(data ?? [])
      setLoading(false)
    }
    fetchSubjects()
  }, [])

  if (loading) return <p>Loading subjects...</p>

  return (
    <div>
      <h1>Subjects</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        {subjects.map((s) => (
          <Link
            key={s.id}
            to={`/dashboard/subjects/${s.slug}`}
            style={{ display: 'block', padding: '1rem', border: '1px solid var(--color-border, #ccc)', borderRadius: '8px', textDecoration: 'none', color: 'inherit' }}
          >
            <h3 style={{ marginTop: 0 }}>{s.name}</h3>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{s.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
