import { useCallback, useEffect, useState } from 'react'
import type { DrawingAction } from '../types/notes'
import { STORAGE_KEYS, readJSON, writeJSON } from '../utils/storage'
import { useNotes } from '../contexts/NotesContext'

/**
 * Persists a note's drawing actions under `academ_drawing_[noteId]`
 * (Step 5, Feature 10) and keeps the note's `hasDrawings` flag in sync so the
 * notes list badge stays accurate.
 */
export function useNoteDrawing(noteId: string) {
  const { updateNote } = useNotes()
  const [actions, setActions] = useState<DrawingAction[]>(() => readJSON<DrawingAction[]>(STORAGE_KEYS.drawing(noteId), []))

  useEffect(() => {
    setActions(readJSON<DrawingAction[]>(STORAGE_KEYS.drawing(noteId), []))
  }, [noteId])

  const save = useCallback(
    (next: DrawingAction[]) => {
      setActions(next)
      writeJSON(STORAGE_KEYS.drawing(noteId), next)
      updateNote(noteId, { hasDrawings: next.length > 0 })
    },
    [noteId, updateNote],
  )

  return { actions, save }
}
