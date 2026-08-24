import { useMemo, useState } from 'react'
import type { Note } from '../types/notes'
import type { Subject } from '../types/subjects'
import { NoteCard } from './NoteCard'
import styles from './NotesLibrary.module.css'

interface NotesLibraryProps { notes: Note[]; subjects: Subject[]; onOpenNote: (noteId: string) => void; onCreateNote: () => void; onToggleFavorite: (noteId: string) => void }

export const NotesLibrary = ({ notes, subjects, onOpenNote, onCreateNote, onToggleFavorite }: NotesLibraryProps) => {
  const [query, setQuery] = useState('')
  const [subjectId, setSubjectId] = useState('all')
  const filteredNotes = useMemo(() => notes.filter((note) => `${note.title} ${note.content.map((block) => block.content).join(' ')}`.toLowerCase().includes(query.toLowerCase()) && (subjectId === 'all' || note.subjectId === subjectId)), [notes, query, subjectId])
  return <section className={`panel ${styles.page}`}><header className={styles.header}><div><h2>My Notes</h2><p>Search and reopen study notes fast.</p></div><button type="button" className="buttonPrimary" onClick={onCreateNote}>+ New note</button></header><div className={styles.filters}><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search notes" /><select value={subjectId} onChange={(event) => setSubjectId(event.target.value)}><option value="all">All subjects</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select></div><div className={styles.grid}>{filteredNotes.length ? filteredNotes.map((note) => <NoteCard key={note.id} note={note} subjectName={subjects.find((subject) => subject.id === note.subjectId)?.name} onOpen={onOpenNote} onToggleFavorite={() => onToggleFavorite(note.id)} />) : <div className="emptyState">No notes match this filter yet.</div>}</div></section>
}
