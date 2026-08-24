import React, { useMemo, useState } from 'react'
import { plainTextFromHtml } from '../lib/richText'
import { Note, NoteColor, SubjectType } from '../types/notes'
import { NoteCard } from './NoteCard'
import styles from './NotesLibrary.module.css'

interface NotesLibraryProps {
  notes: Note[]
  onOpenNote: (noteId: string) => void
  onCreateNote: () => void
}

const subjects: Array<{ value: SubjectType | 'all'; label: string }> = [
  { value: 'all', label: 'All subjects' },
  { value: 'science', label: 'Science' },
  { value: 'math', label: 'Mathematics' },
  { value: 'history', label: 'History' },
  { value: 'literature', label: 'Literature' },
  { value: 'other', label: 'Other' },
]

export const NotesLibrary: React.FC<NotesLibraryProps> = ({ notes, onOpenNote, onCreateNote }) => {
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState<SubjectType | 'all'>('all')
  const [color, setColor] = useState<NoteColor | 'all'>('all')

  const filteredNotes = useMemo(
    () =>
      notes.filter((note) => {
        const searchableText = `${note.title} ${note.content.map((block) => plainTextFromHtml(block.content)).join(' ')}`.toLowerCase()
        const matchesQuery = searchableText.includes(query.toLowerCase())
        return matchesQuery && (subject === 'all' || note.subject === subject) && (color === 'all' || note.color === color)
      }),
    [notes, query, subject, color],
  )

  return (
    <section className={styles.page} aria-labelledby="notes-library-title">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Your notebook</p>
          <h1 id="notes-library-title" className={styles.title}>My Notes</h1>
          <p className={styles.subtitle}>A calm space for ideas, study notes, and discoveries.</p>
        </div>
        <button type="button" className={styles.newButton} onClick={onCreateNote}>
          ＋ New Note
        </button>
      </header>
      <div className={styles.filters}>
        <label className={styles.search}>
          <span aria-hidden="true">⌕</span>
          <span className={styles.srOnly}>Search notes</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your notes" />
        </label>
        <label className={styles.selectLabel}>
          <span className={styles.srOnly}>Filter by subject</span>
          <select value={subject} onChange={(event) => setSubject(event.target.value as SubjectType | 'all')}>
            {subjects.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.selectLabel}>
          <span className={styles.srOnly}>Filter by color</span>
          <select value={color} onChange={(event) => setColor(event.target.value as NoteColor | 'all')}>
            <option value="all">All colors</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="purple">Purple</option>
            <option value="orange">Orange</option>
            <option value="pink">Pink</option>
            <option value="yellow">Yellow</option>
            <option value="red">Red</option>
            <option value="neutral">Neutral</option>
          </select>
        </label>
      </div>
      <div className={styles.meta}>{filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}</div>
      {filteredNotes.length > 0 ? (
        <div className={styles.grid}>
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} onOpen={onOpenNote} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🗒️</span>
          <h2>No notes found</h2>
          <p>Try another search or create a fresh note.</p>
          <button type="button" onClick={onCreateNote}>Create a note</button>
        </div>
      )}
    </section>
  )
}
