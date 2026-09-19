import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase/client'
import { useSubscriptionAccess } from '../hooks/useSubscriptionAccess'
import { TrialExpiredNotice } from '../components/TrialExpiredNotice'

export default function SubjectPage() {
  const { subject: slug } = useParams()
  const [subject, setSubject] = useState<any>(null)
  const [topics, setTopics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [query, setQuery] = useState('')
  const { loading: accessLoading, hasAccess } = useSubscriptionAccess()

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

  const filteredTopics = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return topics
    return topics.filter((t) => t.topic?.toLowerCase().includes(q) || t.summary?.toLowerCase().includes(q))
  }, [topics, query])

  if (accessLoading || loading) return <p>Loading subject...</p>
  if (!hasAccess) return <TrialExpiredNotice />

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>{subject.name}</h1>
          <p style={{ marginTop: 0 }}>{subject.description}</p>
        </div>
        <input
          type="text"
          placeholder="Search topics..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={`Search topics in ${subject.name}`}
          style={{
            padding: '0.6rem 0.9rem',
            fontSize: '1rem',
            borderRadius: 8,
            border: '1px solid var(--color-border, #ccc)',
            minWidth: 220,
          }}
        />
      </div>

      <h2 style={{ marginTop: '1.5rem' }}>Topics</h2>
      {filteredTopics.length === 0 ? (
        <p>{query ? `No topics match "${query}".` : 'No topics published yet — check back soon.'}</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {filteredTopics.map((t) => (
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
