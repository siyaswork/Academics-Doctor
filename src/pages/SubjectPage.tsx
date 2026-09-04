import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase/client'

export default function SubjectPage() {
  const { subject: slug } = useParams()
  const [subject, setSubject] = useState<any>(null)
  const [topics, setTopics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function fetchSubject() {
      setLoading(true)

      const { data: subjectData, error: subjectError } = await supabase
        .from('content_subjects')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single()

      if (subjectError || !subjectData) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setSubject(subjectData)

      const { data: topicsData, error: topicsError } = await supabase
        .from('content_topics')
        .select('*')
        .eq('subject_id', subjectData.id)
        .eq('is_published', true)

      if (topicsError) console.error(topicsError)
      else setTopics(topicsData ?? [])

      setLoading(false)
    }

    if (slug) fetchSubject()
  }, [slug])

  if (loading) return <p>Loading subject...</p>

  if (notFound || !subject) {
    return (
      <div>
        <h1>Subject not found</h1>
        <Link to="/dashboard/subjects">Back to subjects</Link>
      </div>
    )
  }

  return (
    <div>
      <h1>{subject.name}</h1>
      <p>{subject.description}</p>

      <h2>Topics</h2>
      {topics.length === 0 ? (
        <p>No topics published yet — check back soon.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {topics.map((t) => (
            <Link
              key={t.id}
              to={`/learn/${subject.slug}/${t.slug}`}
              style={{ display: 'block', padding: '1rem', border: '1px solid var(--color-border, #ccc)', borderRadius: '8px', textDecoration: 'none', color: 'inherit' }}
            >
              <h3 style={{ marginTop: 0 }}>{t.topic}</h3>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{t.summary}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
