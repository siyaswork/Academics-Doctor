/**
 * useNoteDrawing — manages drawing state for a single note.
 *
 * Step 9: drawings are now persisted to Supabase via note_blocks
 * (block_type = 'drawing', position = -1).  localStorage is used as
 * a fast-write cache and fallback; it is migrated to Supabase on first load.
 *
 * Public API is unchanged from Step 8:
 *   { actions, save, drawingSaveStatus }
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import type { DrawingAction } from '../types/notes'
import { STORAGE_KEYS, readJSON, writeJSON, removeKey } from '../utils/storage'
import { loadDrawingForNote, upsertDrawingForNote } from '../services/notes'

export type DrawingSaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export interface NoteDrawingState {
  actions: DrawingAction[]
  save: (actions: DrawingAction[]) => void
  drawingSaveStatus: DrawingSaveStatus
}

const DEBOUNCE_MS = 1500

export function useNoteDrawing(noteId: string): NoteDrawingState {
  const [actions, setActions] = useState<DrawingAction[]>([])
  const [drawingSaveStatus, setDrawingSaveStatus] = useState<DrawingSaveStatus>('idle')

  // Refs to avoid stale closures in the debounce timer
  const pendingActionsRef = useRef<DrawingAction[] | null>(null)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const noteIdRef = useRef(noteId)
  noteIdRef.current = noteId

  // ── initial load ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!noteId) return
    let cancelled = false

    async function load() {
      const localKey = STORAGE_KEYS.drawing(noteId)

      // 1. Load from Supabase first
      const { actions: dbActions, error } = await loadDrawingForNote(noteId)

      if (cancelled) return

      if (!error && dbActions !== null) {
        // DB has drawing data — use it as canonical source
        setActions(dbActions)

        // If there's also local data for this note, it may be stale (saved
        // before Step 9).  Remove the local copy since Supabase is now the
        // source of truth.
        const local = readJSON<DrawingAction[] | null>(localKey, null)
        if (local !== null) removeKey(localKey)
        return
      }

      // 2. DB has no drawing (or request failed) — check localStorage for migration
      const local = readJSON<DrawingAction[] | null>(localKey, null)
      if (local !== null && local.length > 0) {
        // Use the local data immediately so the canvas shows it right away
        setActions(local)

        // Attempt to migrate to Supabase
        if (!error) {
          // Only migrate when the Supabase load succeeded (not an auth error)
          setDrawingSaveStatus('saving')
          const { error: saveError } = await upsertDrawingForNote(noteId, local)
          if (!cancelled) {
            if (!saveError) {
              removeKey(localKey) // migration successful — remove local copy
              setDrawingSaveStatus('saved')
            } else {
              // Keep local copy as backup
              setDrawingSaveStatus('error')
            }
          }
        }
      }
      // else: no drawing anywhere — actions stays []
    }

    void load()
    return () => { cancelled = true }
  }, [noteId])

  // ── save ─────────────────────────────────────────────────────────────────

  const save = useCallback((nextActions: DrawingAction[]) => {
    const id = noteIdRef.current

    // 1. Update React state immediately
    setActions(nextActions)

    // 2. Write to localStorage as instant backup
    writeJSON(STORAGE_KEYS.drawing(id), nextActions)

    // 3. Debounce the Supabase write
    pendingActionsRef.current = nextActions
    if (debounceTimer.current !== null) clearTimeout(debounceTimer.current)

    setDrawingSaveStatus('saving')

    debounceTimer.current = setTimeout(async () => {
      const toSave = pendingActionsRef.current
      if (toSave === null) return
      pendingActionsRef.current = null
      debounceTimer.current = null

      const { error } = await upsertDrawingForNote(id, toSave)

      if (!error) {
        // Remove local backup — Supabase is now canonical
        removeKey(STORAGE_KEYS.drawing(id))
        setDrawingSaveStatus('saved')
      } else {
        // Keep local backup in localStorage
        setDrawingSaveStatus('error')
      }
    }, DEBOUNCE_MS)
  }, [])

  // ── cleanup ───────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (debounceTimer.current !== null) {
        clearTimeout(debounceTimer.current)
        debounceTimer.current = null
      }
    }
  }, [])

  return { actions, save, drawingSaveStatus }
}
