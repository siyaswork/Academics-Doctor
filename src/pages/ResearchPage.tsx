import React, { useState } from 'react'
import { readJSON, writeJSON } from '../utils/storage'
import { createId } from '../utils/id'
import styles from './ResearchPage.module.css'

interface ResearchEntry {
  id: string
  topic: string
  source: string
  notes: string
  createdAt: number
}

const RESEARCH_KEY = 'academ_research'

export const ResearchPage: React.FC = () => {
  const [entries, setEntries] = useState<ResearchEntry[]>(() => readJSON<ResearchEntry[]>(RESEARCH_KEY, []))
  const [form, setForm] = useState({ topic: '', source: '', notes: '' })

  const persist = (next: ResearchEntry[]) => {
    setEntries(next)
    writeJSON(RESEARCH_KEY, next)
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.topic.trim()) return
    const entry: ResearchEntry = { id: createId('research'), ...form, createdAt: Date.now() }
    persist([entry, ...entries])
    setForm({ topic: '', source: '', notes: '' })
  }

  const remove = (id: string) => persist(entries.filter((entry) => entry.id !== id))

  return (
    <section className={styles.page} aria-labelledby="research-title">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Research workspace</p>
        <h1 id="research-title" className={styles.title}>
          Research
        </h1>
        <p className={styles.subtitle}>Collect topics, sources, and quick findings while you investigate a subject.</p>
      </header>

      <form className={styles.form} onSubmit={submit} aria-label="Add a research entry">
        <label>
          Topic
          <input
            required
            value={form.topic}
            onChange={(event) => setForm((prev) => ({ ...prev, topic: event.target.value }))}
            placeholder="e.g. Renaissance art"
          />
        </label>
        <label>
          Source (optional)
          <input
            value={form.source}
            onChange={(event) => setForm((prev) => ({ ...prev, source: event.target.value }))}
            placeholder="Book, article, or link"
          />
        </label>
        <label>
          Notes
          <textarea
            rows={3}
            value={form.notes}
            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
            placeholder="Key findings…"
          />
        </label>
        <button type="submit">＋ Add entry</button>
      </form>

      {entries.length === 0 ? (
        <p className={styles.empty}>No research entries yet — add your first topic above.</p>
      ) : (
        <ul className={styles.list}>
          {entries.map((entry) => (
            <li key={entry.id} className={styles.entry}>
              <div className={styles.entryHeader}>
                <h2>{entry.topic}</h2>
                <button type="button" onClick={() => remove(entry.id)} aria-label={`Remove ${entry.topic}`}>
                  Remove
                </button>
              </div>
              {entry.source && <p className={styles.source}>{entry.source}</p>}
              {entry.notes && <p className={styles.notes}>{entry.notes}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
