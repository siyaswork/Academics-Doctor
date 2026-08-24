import React, { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useNotes } from '../contexts/NotesContext'
import { useNoteDrawing } from '../hooks/useNoteDrawing'
import { NoteEditor } from '../components/NoteEditor'
import { DrawingCanvas } from '../components/DrawingCanvas'
import type { NoteColor, SubjectType } from '../types/notes'
import styles from './NoteDetailPage.module.css'

const subjectOptions: SubjectType[] = ['math', 'science', 'history', 'literature', 'other']
const colorOptions: NoteColor[] = ['blue', 'green', 'purple', 'orange', 'pink', 'yellow', 'red', 'neutral']

export const NoteDetailPage: React.FC = () => {
  const { noteId } = useParams<{ noteId: string }>()
  const navigate = useNavigate()
  const { notes, updateNote, deleteNote } = useNotes()
  const note = notes.find((item) => item.id === noteId)
  const [showDrawing, setShowDrawing] = useState(false)
  const drawing = useNoteDrawing(noteId || 'scratch')

  if (!note) {
    return (
      <div className={styles.notFound}>
        <p>That note couldn't be found.</p>
        <Link to="/notes">Back to My Notes</Link>
      </div>
    )
  }

  const handleDelete = () => {
    if (window.confirm(`Delete "${note.title}"? This cannot be undone.`)) {
      deleteNote(note.id)
      navigate('/notes')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.topRow}>
        <Link to="/notes" className={styles.back}>
          ← Back to My Notes
        </Link>
        <div className={styles.topActions}>
          <Link to="/workspace" className={styles.workspaceLink}>
            Open in Study Workspace
          </Link>
          <button type="button" onClick={() => updateNote(note.id, { isPinned: !note.isPinned })}>
            {note.isPinned ? 'Unpin' : 'Pin'}
          </button>
          <button type="button" className={styles.deleteButton} onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>

      <input
        className={styles.titleInput}
        value={note.title}
        onChange={(event) => updateNote(note.id, { title: event.target.value })}
        aria-label="Note title"
      />

      <div className={styles.metaRow}>
        <label>
          Subject
          <select
            value={note.subject}
            onChange={(event) => updateNote(note.id, { subject: event.target.value as SubjectType })}
          >
            {subjectOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Color
          <select value={note.color} onChange={(event) => updateNote(note.id, { color: event.target.value as NoteColor })}>
            {colorOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <NoteEditor note={note} />

      <div className={styles.drawingSection}>
        <button type="button" className={styles.toggleDrawing} onClick={() => setShowDrawing((v) => !v)}>
          {showDrawing ? 'Hide drawing' : note.hasDrawings ? 'Show drawing' : '＋ Add a drawing'}
        </button>
        {showDrawing && (
          <DrawingCanvas
            initialActions={drawing.actions}
            onChange={drawing.save}
            onClose={() => setShowDrawing(false)}
          />
        )}
      </div>
    </div>
  )
}
