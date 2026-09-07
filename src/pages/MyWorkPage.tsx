import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNotes } from '../contexts/NotesContext'
import { useFormulas } from '../contexts/FormulaContext'
import { useCalculator } from '../contexts/CalculatorContext'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase/client'
import styles from './MyWorkPage.module.css'

interface SavedTopic {
  favoriteId: string
  topicId: string
  topicSlug: string
  topicName: string
  subjectSlug: string
  subjectName: string
}

export const MyWorkPage: React.FC = () => {
  const { notes } = useNotes()
  const { formulas } = useFormulas()
  const { history, reuseResult } = useCalculator()
  const { user } = useAuth()
  const [savedTopics, setSavedTopics] = useState<SavedTopic[]>([])
  const [loadingSaved, setLoadingSaved] = useState(true)

  const sortedNotes = [...notes].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

  useEffect(() => {
    async function loadFavorites() {
      if (!user) {
        setSavedTopics([])
        setLoadingSaved(false)
        return
      }
      setLoadingSaved(true)

      const { data: favs } = await supabase
        .from('favorites')
        .select('id, item_id')
        .eq('user_id', user.id)
        .eq('item_type', 'topic')
        .order('created_at', { ascending: false })

      const topicIds = (favs ?? []).map((f) => f.item_id).filter(Boolean)
      if (topicIds.length === 0) {
        setSavedTopics([])
        setLoadingSaved(false)
        return
      }

      const { data: topicsData } = await supabase
        .from('content_topics')
        .select('id, slug, topic, content_subjects(slug, name)')
        .in('id', topicIds)

      const byId = new Map((topicsData ?? []).map((t: any) => [t.id, t]))
      const merged: SavedTopic[] = (favs ?? [])
        .map((f) => {
          const t = byId.get(f.item_id)
          if (!t) return null
          return {
            favoriteId: f.id,
            topicId: t.id,
            topicSlug: t.slug,
            topicName: t.topic,
            subjectSlug: t.content_subjects?.slug ?? '',
            subjectName: t.content_subjects?.name ?? '',
          }
        })
        .filter(Boolean) as SavedTopic[]

      setSavedTopics(merged)
      setLoadingSaved(false)
    }

    loadFavorites()
  }, [user])

  async function removeFavorite(favoriteId: string) {
    await supabase.from('favorites').delete().eq('id', favoriteId)
    setSavedTopics((prev) => prev.filter((t) => t.favoriteId !== favoriteId))
  }

  return (
    <section className={styles.page} aria-labelledby="my-work-title">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Unified workspace</p>
        <h1 id="my-work-title" className={styles.title}>
          My Work
        </h1>
        <p className={styles.subtitle}>Every note, saved formula, saved topic, and recent calculation in one place.</p>
      </header>

      <div className={styles.columns}>
        <section className={styles.column} aria-labelledby="work-notes-title">
          <h2 id="work-notes-title">Notes ({sortedNotes.length})</h2>
          <ul className={styles.list}>
            {sortedNotes.map((note) => (
              <li key={note.id}>
                <Link to={`/notes/${note.id}`} className={styles.item}>
                  <span>{note.title}</span>
                  <span className={styles.meta}>{note.subject}</span>
                </Link>
              </li>
            ))}
            {sortedNotes.length === 0 && <p className={styles.empty}>No notes yet.</p>}
          </ul>
        </section>

        <section className={styles.column} aria-labelledby="work-saved-topics-title">
          <h2 id="work-saved-topics-title">Saved Topics ({savedTopics.length})</h2>
          <ul className={styles.list}>
            {savedTopics.map((t) => (
              <li key={t.favoriteId} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Link to={`/learn/${t.subjectSlug}/${t.topicSlug}`} className={styles.item} style={{ flex: 1 }}>
                  <span>{t.topicName}</span>
                  <span className={styles.meta}>{t.subjectName}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => removeFavorite(t.favoriteId)}
                  aria-label={`Remove ${t.topicName} from saved topics`}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}
                >
                  Remove
                </button>
              </li>
            ))}
            {!loadingSaved && savedTopics.length === 0 && <p className={styles.empty}>No saved topics yet.</p>}
            {loadingSaved && <p className={styles.empty}>Loading...</p>}
          </ul>
        </section>

        <section className={styles.column} aria-labelledby="work-formulas-title">
          <h2 id="work-formulas-title">Formulas ({formulas.length})</h2>
          <ul className={styles.list}>
            {formulas.map((formula) => (
              <li key={formula.id} className={styles.item}>
                <span>{formula.name}</span>
                <span className={styles.meta}>{formula.subject}</span>
              </li>
            ))}
            {formulas.length === 0 && <p className={styles.empty}>No saved formulas yet.</p>}
          </ul>
        </section>

        <section className={styles.column} aria-labelledby="work-history-title">
          <h2 id="work-history-title">Recent calculations ({history.length})</h2>
          <ul className={styles.list}>
            {history.slice(0, 8).map((entry) => (
              <li key={entry.id}>
                <button type="button" className={styles.item} onClick={() => reuseResult(entry)}>
                  <span>{entry.expression}</span>
                  <span className={styles.meta}>= {entry.result}</span>
                </button>
              </li>
            ))}
            {history.length === 0 && <p className={styles.empty}>No calculations yet.</p>}
          </ul>
        </section>
      </div>
    </section>
  )
}
