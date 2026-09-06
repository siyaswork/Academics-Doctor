import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useNotes } from '../contexts/NotesContext'
import { searchNotes, type SearchResultNote } from '../services/notes'
import styles from './SearchPage.module.css'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { notes: localNotes } = useNotes()

  const qParam = searchParams.get('q') || ''
  const [searchTerm, setSearchTerm] = useState(qParam)
  const [results, setResults] = useState<SearchResultNote[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Keep search input term in sync when searchParams change (e.g., page refresh or back/forward)
  useEffect(() => {
    setSearchTerm(qParam)
  }, [qParam])

  const performSearch = useCallback(async (query: string) => {
    const trimmed = query.trim()
    if (!trimmed) {
      setResults([])
      setHasSearched(false)
      setLoading(false)
      return
    }

    setLoading(true)
    setHasSearched(true)

    try {
      const { data: dbResults } = await searchNotes(trimmed)

      // Search local state as fallback / supplement
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
          return {
            id: n.id,
            title: n.title,
            snippet,
            updatedAt: n.updatedAt,
          }
        })

      // Merge DB results and local matches, deduplicating by ID
      const resultMap = new Map<string, SearchResultNote>()
      for (const item of dbResults) {
        resultMap.set(item.id, item)
      }
      for (const item of localMatches) {
        if (!resultMap.has(item.id)) {
          resultMap.set(item.id, item)
        }
      }

      const merged = Array.from(resultMap.values())
      merged.sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0))

      setResults(merged)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [localNotes])

  // Automatically execute search when qParam changes
  useEffect(() => {
    if (qParam) {
      void performSearch(qParam)
    } else {
      setResults([])
      setHasSearched(false)
    }
  }, [qParam, performSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = searchTerm.trim()
    if (trimmed) {
      setSearchParams({ q: trimmed })
    } else {
      setSearchParams({})
    }
  }

  return (
    <div className={styles.page}>
      <header>
        <span className={styles.eyebrow}>Search</span>
        <h1 className={styles.title}>Search Notes</h1>
        <p className={styles.subtitle}>Search across your note titles and content.</p>
      </header>

      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Type keywords to search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search query"
        />
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>

      {loading && (
        <div className={styles.loading} aria-live="polite">
          Searching notes...
        </div>
      )}

      {!loading && hasSearched && results.length === 0 && (
        <div className={styles.emptyState}>
          <h2>No results found</h2>
          <p>We couldn't find any notes matching "{qParam}". Try searching for different keywords.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className={styles.resultsList}>
          {results.map((note) => (
            <div
              key={note.id}
              className={styles.resultCard}
              onClick={() => navigate(`/notes/${note.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate(`/notes/${note.id}`)
                }
              }}
            >
              <div className={styles.resultTitle}>{note.title}</div>
              {note.snippet && <div className={styles.resultSnippet}>{note.snippet}</div>}
              {note.updatedAt && (
                <div className={styles.resultMeta}>
                  Updated {new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(note.updatedAt)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
