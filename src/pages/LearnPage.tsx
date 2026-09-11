import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase/client'
import { useAuth } from '../contexts/AuthContext'
import { useSubscriptionAccess } from '../hooks/useSubscriptionAccess'
import { TrialExpiredNotice } from '../components/TrialExpiredNotice'

export default function LearnPage() {
  const { subject: subjectSlug, topic: topicSlug } = useParams()
  const { user } = useAuth()
  const { loading: accessLoading, hasAccess } = useSubscriptionAccess()
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [subject, setSubject] = useState<any>(null)
  const [topic, setTopic] = useState<any>(null)
  const [definitions, setDefinitions] = useState<any[]>([])
  const [formulas, setFormulas] = useState<any[]>([])
  const [workedExamples, setWorkedExamples] = useState<any[]>([])
  const [practiceQuestions, setPracticeQuestions] = useState<any[]>([])
  const [examQuestions, setExamQuestions] = useState<any[]>([])
  const [favoriteId, setFavoriteId] = useState<string | null>(null)
  const [savingFavorite, setSavingFavorite] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setNotFound(false)

      const { data: subjectData } = await supabase
        .from('content_subjects')
        .select('*')
        .eq('slug', subjectSlug)
        .single()

      if (!subjectData) {
        setNotFound(true)
        setLoading(false)
        return
      }
      setSubject(subjectData)

      const { data: topicData } = await supabase
        .from('content_topics')
        .select('*')
        .eq('subject_id', subjectData.id)
        .eq('slug', topicSlug)
        .eq('is_published', true)
        .single()

      if (!topicData) {
        setNotFound(true)
        setLoading(false)
        return
      }
      setTopic(topicData)

      const [defs, forms, examples, practice, exam, fav] = await Promise.all([
        supabase.from('content_definitions').select('*').eq('topic_id', topicData.id).order('position'),
        supabase.from('content_topic_formulas').select('*').eq('topic_id', topicData.id).order('position'),
        supabase.from('content_worked_examples').select('*').eq('topic_id', topicData.id).order('position'),
        supabase.from('content_practice_questions').select('*').eq('topic_id', topicData.id).order('position'),
        supabase.from('content_exam_questions').select('*').eq('topic_id', topicData.id).order('position'),
        user
          ? supabase
              .from('favorites')
              .select('id')
              .eq('user_id', user.id)
              .eq('item_type', 'topic')
              .eq('item_id', topicData.id)
              .maybeSingle()
          : Promise.resolve({ data: null }),
      ])

      setDefinitions(defs.data ?? [])
      setFormulas(forms.data ?? [])
      setWorkedExamples(examples.data ?? [])
      setPracticeQuestions(practice.data ?? [])
      setExamQuestions(exam.data ?? [])
      setFavoriteId((fav as any)?.data?.id ?? null)
      setLoading(false)
    }

    if (subjectSlug && topicSlug) load()
  }, [subjectSlug, topicSlug, user])

  async function toggleFavorite() {
    if (!user || !topic || savingFavorite) return
    setSavingFavorite(true)
    try {
      if (favoriteId) {
        const { error } = await supabase.from('favorites').delete().eq('id', favoriteId)
        if (!error) setFavoriteId(null)
      } else {
        const { data, error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, item_type: 'topic', item_id: topic.id })
          .select('id')
          .single()
        if (!error && data) setFavoriteId(data.id)
      }
    } finally {
      setSavingFavorite(false)
    }
  }

  if (accessLoading || loading) return <div style={{ padding: 16 }}>Loading...</div>
  if (!hasAccess) return <TrialExpiredNotice />

  if (notFound || !topic || !subject) {
    return (
      <div style={{ padding: 16 }}>
        <h1>Topic not found</h1>
        <Link to={`/dashboard/subjects/${subjectSlug}`}>Back to {subjectSlug}</Link>
      </div>
    )
  }

  const keyConcepts: string[] = Array.isArray(topic.key_concepts) ? topic.key_concepts : []
  const commonMistakes: string[] = Array.isArray(topic.common_mistakes) ? topic.common_mistakes : []
  const tips: string[] = Array.isArray(topic.tips) ? topic.tips : []

  return (
    <div style={{ padding: 16, maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 16 }}>
        <Link to={`/dashboard/subjects/${subjectSlug}`}>&larr; Back to {subject.name}</Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>{topic.topic}</h1>
          {topic.summary && <p style={{ color: 'var(--color-text-secondary)', marginTop: 0 }}>{topic.summary}</p>}
        </div>
        {user && (
          <button
            type="button"
            onClick={toggleFavorite}
            disabled={savingFavorite}
            aria-pressed={!!favoriteId}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 8,
              border: '1px solid var(--color-border, #ccc)',
              background: favoriteId ? 'var(--color-primary, #1c2b39)' : 'transparent',
              color: favoriteId ? '#fff' : 'inherit',
              cursor: savingFavorite ? 'wait' : 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {favoriteId ? 'Saved' : 'Save topic'}
          </button>
        )}
      </div>

      {topic.explanation && (
        <section style={{ marginTop: 20 }}>
          <h2>Explanation</h2>
          <p style={{ lineHeight: 1.6 }}>{topic.explanation}</p>
        </section>
      )}

      {keyConcepts.length > 0 && (
        <section style={{ marginTop: 20 }}>
          <h2>Key Concepts</h2>
          <ul>{keyConcepts.map((k, i) => <li key={i}>{k}</li>)}</ul>
        </section>
      )}

      {definitions.length > 0 && (
        <section style={{ marginTop: 20 }}>
          <h2>Definitions</h2>
          {definitions.map((d) => (
            <p key={d.id}><strong>{d.term}:</strong> {d.definition}</p>
          ))}
        </section>
      )}

      {formulas.length > 0 && (
        <section style={{ marginTop: 20 }}>
          <h2>Formulas</h2>
          <ul>
            {formulas.map((f) => (
              <li key={f.id}><code>{f.formula}</code>{f.description ? ` — ${f.description}` : ''}</li>
            ))}
          </ul>
        </section>
      )}

      {workedExamples.length > 0 && (
        <section style={{ marginTop: 20 }}>
          <h2>Worked Examples</h2>
          {workedExamples.map((ex) => (
            <div key={ex.id} style={{ marginBottom: 16, padding: 12, border: '1px solid var(--color-border, #ddd)', borderRadius: 8 }}>
              <p><strong>Problem:</strong> {ex.problem}</p>
              {Array.isArray(ex.solution_steps) && ex.solution_steps.length > 0 && (
                <ol>{ex.solution_steps.map((s: string, i: number) => <li key={i}>{s}</li>)}</ol>
              )}
              {ex.answer && <p><strong>Answer:</strong> {ex.answer}</p>}
            </div>
          ))}
        </section>
      )}

      {practiceQuestions.length > 0 && (
        <section style={{ marginTop: 20 }}>
          <h2>Practice Questions</h2>
          {practiceQuestions.map((q, i) => (
            <details key={q.id} style={{ marginBottom: 8 }}>
              <summary>{i + 1}. {q.question}</summary>
              {q.answer && <p style={{ marginTop: 4 }}><strong>Answer:</strong> {q.answer}</p>}
            </details>
          ))}
        </section>
      )}

      {examQuestions.length > 0 && (
        <section style={{ marginTop: 20 }}>
          <h2>Exam-Style Questions</h2>
          {examQuestions.map((q, i) => (
            <details key={q.id} style={{ marginBottom: 8 }}>
              <summary>{i + 1}. {q.question} {q.marks ? `[${q.marks} marks]` : ''}</summary>
              {q.answer && <p style={{ marginTop: 4 }}><strong>Answer:</strong> {q.answer}</p>}
            </details>
          ))}
        </section>
      )}

      {commonMistakes.length > 0 && (
        <section style={{ marginTop: 20 }}>
          <h2>Common Mistakes</h2>
          <ul>{commonMistakes.map((m, i) => <li key={i}>{m}</li>)}</ul>
        </section>
      )}

      {tips.length > 0 && (
        <section style={{ marginTop: 20 }}>
          <h2>Tips</h2>
          <ul>{tips.map((t, i) => <li key={i}>{t}</li>)}</ul>
        </section>
      )}
    </div>
  )
}
