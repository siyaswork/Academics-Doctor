import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useNotes } from '../contexts/NotesContext'
import { useNoteDrawing } from '../hooks/useNoteDrawing'
import { NoteEditor } from '../components/NoteEditor'
import { DrawingCanvas } from '../components/DrawingCanvas'
import { SaveIndicator } from '../components/SaveIndicator'
import type { NoteColor, SubjectType } from '../types/notes'
import styles from './NoteDetailPage.module.css'

const subjectOptions: SubjectType[] = ['math', 'science', 'history', 'literature', 'other']
const colorOptions: NoteColor[] = ['blue', 'green', 'purple', 'orange', 'pink', 'yellow', 'red', 'neutral']

export const NoteDetailPage: React.FC = () => {
  const { noteId } = useParams<{ noteId: string }>()
  const navigate = useNavigate()
  const { notes, updateNote, deleteNote, setCurrentNote, saveStatus, loadNoteContent } = useNotes()
  const note = notes.find((item) => item.id === noteId)
  const [showDrawing, setShowDrawing] = useState(false)
  const { actions: drawingActions, save: saveDrawing, drawingSaveStatus } = useNoteDrawing(noteId || 'scratch')

  // Register this note as the current note and load its authoritative content from Supabase
  useEffect(() => {
    if (!noteId) return
    setCurrentNote(noteId)
    void loadNoteContent(noteId)
    return () => setCurrentNote(null)
  // loadNoteContent and setCurrentNote are stable callbacks — safe to omit from deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId])

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
          <SaveIndicator status={drawingSaveStatus !== 'idle' ? drawingSaveStatus : saveStatus} />
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
          {showDrawing ? 'Hide drawing' : drawingActions.length > 0 ? 'Show drawing' : '＋ Add a drawing'}
        </button>
        {showDrawing && (
          <DrawingCanvas
            initialActions={drawingActions}
            onChange={saveDrawing}
            onClose={() => setShowDrawing(false)}
          />
        )}
      </div>
    </div>
  )
}
