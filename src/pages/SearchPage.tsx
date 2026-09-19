import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useNotes } from '../contexts/NotesContext'
import { searchNotes, type SearchResultNote } from '../services/notes'
import { supabase } from '../lib/supabase/client'
import styles from './SearchPage.module.css'

interface SubjectResult {
  id: string
  slug: string
  name: string
}

interface TopicResult {
  id: string
  slug: string
  topic: string
  subjectSlug: string
  subjectName: string
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { notes: localNotes } = useNotes()

  const qParam = searchParams.get('q') || ''
  const [searchTerm, setSearchTerm] = useState(qParam)
  const [noteResults, setNoteResults] = useState<SearchResultNote[]>([])
  const [subjectResults, setSubjectResults] = useState<SubjectResult[]>([])
  const [topicResults, setTopicResults] = useState<TopicResult[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const performSearch = useCallback(async (query: string) => {
    const trimmed = query.trim()
    if (!trimmed) {
      setNoteResults([])
      setSubjectResults([])
      setTopicResults([])
      setHasSearched(false)
      setLoading(false)
      return
    }

    setLoading(true)
    setHasSearched(true)

    try {
      const [dbNotesRes, subjectsRes, topicsRes] = await Promise.all([
        searchNotes(trimmed),
        supabase.from('content_subjects').select('id, slug, name').ilike('name', `%${trimmed}%`).eq('is_published', true).limit(5),
        supabase
          .from('content_topics')
          .select('id, slug, topic, content_subjects(slug, name)')
          .ilike('topic', `%${trimmed}%`)
          .eq('is_published', true)
          .limit(8),
      ])

      const lowerQ = trimmed.toLowerCase()
      const localMatches: SearchResultNote[] = localNotes
        .filter((n) => {
          const titleMatch = n.title.toLowerCase().includes(lowerQ)
          const contentMatch = n.content.some((b) => b.content.toLowerCase().includes(lowerQ))
          return titleMatch || contentMatch
        })
        .map((n) => {
          const matchingBlock = n.content.find((b) => b.content.toLowerCase().includes(lowerQ))
          const snippet = matchingBlock ? matchingBlock.content : ''
          return { id: n.id, title: n.title, snippet, updatedAt: n.updatedAt }
        })

      const resultMap = new Map<string, SearchResultNote>()
      for (const item of dbNotesRes.data) resultMap.set(item.id, item)
      for (const item of localMatches) if (!resultMap.has(item.id)) resultMap.set(item.id, item)
      const mergedNotes = Array.from(resultMap.values())
      mergedNotes.sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0))

      setNoteResults(mergedNotes)
      setSubjectResults((subjectsRes.data ?? []) as SubjectResult[])
      setTopicResults(
        ((topicsRes.data ?? []) as any[]).map((t) => ({
          id: t.id,
          slug: t.slug,
          topic: t.topic,
          subjectSlug: t.content_subjects?.slug ?? '',
          subjectName: t.content_subjects?.name ?? '',
        })),
      )
    } catch {
      setNoteResults([])
      setSubjectResults([])
      setTopicResults([])
    } finally {
      setLoading(false)
    }
  }, [localNotes])

  // Live search: fires as the user types, debounced, no need to press Enter/Search.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      void performSearch(searchTerm)
      setSearchParams(searchTerm.trim() ? { q: searchTerm.trim() } : {}, { replace: true })
    }, 250)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void performSearch(searchTerm)
  }

  const totalResults = noteResults.length + subjectResults.length + topicResults.length

  return (
    <div className={styles.page}>
      <header>
        <span className={styles.eyebrow}>Search</span>
        <h1 className={styles.title}>Search</h1>
        <p className={styles.subtitle}>Search subjects, topics, and your notes.</p>
      </header>

      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Type to search subjects, topics, notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search query"
          autoFocus
        />
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>

      {loading && <div className={styles.loading} aria-live="polite">Searching...</div>}

      {!loading && hasSearched && totalResults === 0 && (
        <div className={styles.emptyState}>
          <h2>No results found</h2>
          <p>We couldn't find anything matching "{qParam || searchTerm}".</p>
        </div>
      )}

      {!loading && subjectResults.length > 0 && (
        <section style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: '1rem' }}>Subjects</h2>
          <div className={styles.resultsList}>
            {subjectResults.map((s) => (
              <div key={s.id} className={styles.resultCard} onClick={() => navigate(`/dashboard/subjects/${s.slug}`)} role="button" tabIndex={0}>
                <div className={styles.resultTitle}>{s.name}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {!loading && topicResults.length > 0 && (
        <section style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: '1rem' }}>Topics</h2>
          <div className={styles.resultsList}>
            {topicResults.map((t) => (
              <div key={t.id} className={styles.resultCard} onClick={() => navigate(`/learn/${t.subjectSlug}/${t.slug}`)} role="button" tabIndex={0}>
                <div className={styles.resultTitle}>{t.topic}</div>
                <div className={styles.resultMeta}>{t.subjectName}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {!loading && noteResults.length > 0 && (
        <section style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: '1rem' }}>My Notes</h2>
          <div className={styles.resultsList}>
            {noteResults.map((note) => (
              <div
                key={note.id}
                className={styles.resultCard}
                onClick={() => navigate(`/notes/${note.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') navigate(`/notes/${note.id}`)
                }}
              >
                <div className={styles.resultTitle}>{note.title}</div>
                {note.snippet && <div className={styles.resultSnippet}>{note.snippet}</div>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
