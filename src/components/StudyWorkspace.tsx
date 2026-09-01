import React, { useMemo, useState } from 'react'
import { useNotes } from '../contexts/NotesContext'
import { useWorkspacePrefs } from '../contexts/WorkspacePrefsContext'
import { useNoteDrawing } from '../hooks/useNoteDrawing'
import { NoteEditor } from './NoteEditor'
import { DrawingCanvas } from './DrawingCanvas'
import { SplitWorkspace } from './SplitWorkspace'
import { StudyUtilities } from './StudyUtilities'
import type { WorkspaceMode } from '../types/workspace'
import styles from './StudyWorkspace.module.css'

const MODE_LABELS: Record<WorkspaceMode, string> = {
  write: 'Write',
  draw: 'Draw',
  study: 'Study',
}

/**
 * Step 5 centerpiece: a single workspace that switches between a
 * distraction-free writer, a full-screen drawing canvas, and a split
 * write + draw + calculate study layout.
 */
export const StudyWorkspace: React.FC = () => {
  const { notes, createNote } = useNotes()
  const { mode, splitEnabled, gridEnabled, snapEnabled, setMode, toggleGrid, toggleSnap } = useWorkspacePrefs()
  const [noteId, setNoteId] = useState<string | null>(notes[0]?.id ?? null)
  const [utilitiesOpen, setUtilitiesOpen] = useState(false)

  const note = useMemo(() => notes.find((item) => item.id === noteId) ?? notes[0] ?? null, [notes, noteId])
  const { actions, save } = useNoteDrawing(note?.id ?? 'scratch')

  if (!note) {
    return (
      <div className={styles.empty}>
        <p>You don't have any notes yet.</p>
        <button type="button" onClick={() => createNote('Study session', 'other')}>
          Create your first note
        </button>
      </div>
    )
  }

  const drawingPane = (
    <DrawingCanvas
      key={note.id}
      initialActions={actions}
      onChange={save}
      gridEnabled={gridEnabled}
      onToggleGrid={toggleGrid}
      snapEnabled={snapEnabled}
      onToggleSnap={toggleSnap}
    />
  )

  return (
    <div className={styles.workspace}>
      <header className={styles.toolbar}>
        <label className={styles.noteSelect}>
          <span className={styles.srOnly}>Choose a note to study</span>
          <select value={note.id} onChange={(event) => setNoteId(event.target.value)}>
            {notes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <div className={styles.modeSwitch} role="tablist" aria-label="Workspace mode">
          {(Object.keys(MODE_LABELS) as WorkspaceMode[]).map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={mode === item}
              className={mode === item ? styles.modeActive : styles.mode}
              onClick={() => setMode(item)}
            >
              {MODE_LABELS[item]}
            </button>
          ))}
        </div>
        <button type="button" className={styles.utilitiesButton} onClick={() => setUtilitiesOpen(true)}>
          🧮 Utilities
        </button>
      </header>

      <div className={styles.body}>
        {mode === 'write' && (
          <div className={styles.writePane}>
            <NoteEditor note={note} />
          </div>
        )}

        {mode === 'draw' && <div className={styles.drawPane}>{drawingPane}</div>}

        {mode === 'study' &&
          (splitEnabled ? (
            <SplitWorkspace
              textLabel="Notes"
              visualLabel="Drawing canvas"
              text={<NoteEditor note={note} />}
              visual={drawingPane}
            />
          ) : (
            <div className={styles.stacked}>
              <NoteEditor note={note} />
              {drawingPane}
            </div>
          ))}
      </div>

      <StudyUtilities isOpen={utilitiesOpen} onClose={() => setUtilitiesOpen(false)} />
    </div>
  )
}
