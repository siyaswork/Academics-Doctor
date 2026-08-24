import React, { useEffect, useMemo, useState } from 'react'
import { useNotes } from '../contexts/NotesContext'
import { Note, NoteColor, SubjectType } from '../types/notes'
import { CalculatorModal } from './CalculatorModal'
import { DrawingCanvas } from './DrawingCanvas'
import { RichTextEditor } from './RichTextEditor'
import styles from './NoteEditor.module.css'

interface NoteEditorProps {
  note: Note
  onBack: () => void
}

const subjectOptions: Array<{ value: SubjectType; label: string }> = [
  { value: 'math', label: 'Mathematics' },
  { value: 'science', label: 'Science' },
  { value: 'history', label: 'History' },
  { value: 'literature', label: 'Literature' },
  { value: 'other', label: 'Other' },
]

const colorOptions: Array<{ value: NoteColor; label: string }> = [
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'purple', label: 'Purple' },
  { value: 'orange', label: 'Orange' },
  { value: 'pink', label: 'Pink' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'red', label: 'Red' },
  { value: 'neutral', label: 'Neutral' },
]

const formatAutosaveStatus = (status: string, savedAt: Date | null) => {
  if (status === 'saving') {
    return 'Autosaving…'
  }

  if (status === 'error') {
    return 'Autosave failed'
  }

  if (savedAt) {
    return `Saved ${savedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
  }

  return 'Ready'
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, onBack }) => {
  const {
    updateNote,
    updateNoteContent,
    addDrawingBlock,
    updateDrawingBlock,
    removeDrawingBlock,
    deleteNote,
    saveNote,
    saveStatus,
    lastSavedAt,
  } = useNotes()
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)

  const textContent = useMemo(() => note.content.filter((block) => block.type !== 'drawing'), [note.content])
  const drawingBlocks = useMemo(
    () =>
      note.content
        .filter((block) => block.type === 'drawing' && block.drawingBlockId)
        .map((block) => (block.drawingBlockId ? note.drawings.get(block.drawingBlockId) : undefined))
        .filter(Boolean),
    [note.content, note.drawings],
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        saveNote(note.id)
      }

      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === 'd') {
        event.preventDefault()
        addDrawingBlock(note.id)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [addDrawingBlock, note.id, saveNote])

  return (
    <section className={styles.page} aria-labelledby="note-editor-title">
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <button type="button" className={styles.backButton} onClick={onBack}>
            ← Back to library
          </button>
          <div>
            <p className={styles.eyebrow}>Digital notes workspace</p>
            <h1 id="note-editor-title" className={styles.title}>Open note</h1>
            <p className={styles.status} aria-live="polite">
              {formatAutosaveStatus(saveStatus, lastSavedAt)}
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button type="button" onClick={() => setIsCalculatorOpen(true)} title="Open calculator" aria-label="Open calculator">
            🧮
          </button>
          <button type="button" onClick={() => addDrawingBlock(note.id)} title="Add drawing block (Ctrl/Cmd+Shift+D)">
            + Drawing
          </button>
          <button type="button" onClick={() => saveNote(note.id)} title="Save now (Ctrl/Cmd+S)">
            Save
          </button>
        </div>
      </header>

      <div className={styles.settingsCard}>
        <label className={styles.field}>
          <span>Title</span>
          <input
            value={note.title}
            onChange={(event) => updateNote(note.id, { title: event.target.value })}
            placeholder="Untitled Note"
          />
        </label>
        <label className={styles.field}>
          <span>Subject</span>
          <select value={note.subject} onChange={(event) => updateNote(note.id, { subject: event.target.value as SubjectType })}>
            {subjectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <div className={styles.field}>
          <span>Accent color</span>
          <div className={styles.colorPicker} role="radiogroup" aria-label="Note accent color">
            {colorOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`${styles.colorOption} ${styles[option.value]} ${note.color === option.value ? styles.selected : ''}`}
                aria-label={option.label}
                aria-pressed={note.color === option.value}
                onClick={() => updateNote(note.id, { color: option.value })}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.editorCard}>
        <div className={styles.sectionHeading}>
          <div>
            <h2>Writing area</h2>
            <p>Format text with headings, emphasis, lists, and alignment.</p>
          </div>
          <span className={styles.shortcutHint}>Shortcuts: Ctrl/Cmd+S save • Ctrl/Cmd+Shift+D drawing</span>
        </div>
        <RichTextEditor content={textContent} onChange={(content) => updateNoteContent(note.id, content)} />
      </div>

      <div className={styles.drawingsSection}>
        <div className={styles.sectionHeading}>
          <div>
            <h2>Drawing blocks</h2>
            <p>Add diagrams, sketches, and annotations that stay inside this note.</p>
          </div>
        </div>
        {drawingBlocks.length ? (
          <div className={styles.drawingsStack}>
            {drawingBlocks.map((block, index) => (
              <DrawingCanvas
                key={block!.id}
                drawingBlock={block!}
                onChange={(nextBlock) => updateDrawingBlock(note.id, nextBlock)}
                onRemove={() => removeDrawingBlock(note.id, block!.id)}
                title={`Drawing block ${index + 1}`}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyDrawings}>
            <p>No drawings yet.</p>
            <button type="button" onClick={() => addDrawingBlock(note.id)}>
              Add your first drawing block
            </button>
          </div>
        )}
      </div>

      <div className={styles.footerActions}>
        <button type="button" className={styles.deleteButton} onClick={() => {
          if (window.confirm('Delete this note?')) {
            deleteNote(note.id)
            onBack()
          }
        }}>
          Delete note
        </button>
        <button type="button" className={styles.backPrimary} onClick={onBack}>
          Return to library
        </button>
      </div>

      <CalculatorModal isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
    </section>
  )
}
