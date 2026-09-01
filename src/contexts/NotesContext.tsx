import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import type { Note, RichTextContent, SubjectType } from '../types/notes'
import { demoDemoNotes } from '../data/demoNotes'
import { STORAGE_KEYS } from '../utils/storage'
import { deserializeNotes, serializeNotes } from '../utils/notesSerialization'
import { useAuth } from './AuthContext'
import {
  listNotes as dbListNotes,
  createNote as dbCreateNote,
  updateNote as dbUpdateNote,
  deleteNote as dbDeleteNote,
  replaceBlocksForNote,
  getNoteWithBlocks,
  dbBlocksToFrontContent,
} from '../services/notes'

function loadLocalNotes(): Note[] {
  if (typeof window === 'undefined') return demoDemoNotes
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.notes)
    if (!raw) return demoDemoNotes
    const parsed = deserializeNotes(raw)
    return parsed && parsed.length ? parsed : demoDemoNotes
  } catch {
    return demoDemoNotes
  }
}

type SaveKind = 'meta' | 'content' | 'both'
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

function mergeSaveKind(existing: SaveKind | undefined, next: SaveKind): SaveKind {
  if (!existing || existing === next) return next
  return 'both'
}

interface NotesContextType {
  notes: Note[]
  currentNote: Note | null
  isEditing: boolean
  saveStatus: SaveStatus
  createNote: (title: string, subject: string) => Note
  updateNote: (noteId: string, updates: Partial<Note>) => void
  deleteNote: (noteId: string) => void
  setCurrentNote: (noteId: string | null) => void
  setIsEditing: (isEditing: boolean) => void
  updateNoteContent: (noteId: string, content: RichTextContent[]) => void
  appendBlock: (noteId: string, block: RichTextContent) => void
  saveNote: (noteId: string) => void
  loadNoteContent: (noteId: string) => Promise<void>
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

const isSubjectType = (value: string): value is SubjectType =>
  value === 'math' || value === 'science' || value === 'history' || value === 'literature' || value === 'other'

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [notes, setNotes] = useState<Note[]>(loadLocalNotes)
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const isFirstRender = useRef(true)

  // Always holds the latest notes array; used by the debounced save timer to avoid
  // stale closures — the timer reads notesRef.current when it fires, not the
  // captured snapshot from when it was scheduled.
  const notesRef = useRef(notes)

  // Pending saves: noteId → what needs to be written ('meta', 'content', or 'both')
  const pendingSave = useRef<Map<string, SaveKind>>(new Map())
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentNote = currentNoteId ? notes.find((n) => n.id === currentNoteId) || null : null

  // Keep notesRef in sync with React state
  useEffect(() => {
    notesRef.current = notes
  }, [notes])

  // Persist to localStorage whenever notes change (skip the very first mount
  // so we don't immediately re-write what we just loaded).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    window.localStorage.setItem(STORAGE_KEYS.notes, serializeNotes(notes))
  }, [notes])

  // Auto-clear 'saved' status after 2 s
  useEffect(() => {
    if (saveStatus !== 'saved') return
    const t = setTimeout(() => setSaveStatus('idle'), 2000)
    return () => clearTimeout(t)
  }, [saveStatus])

  // Load notes list from Supabase whenever the user signs in
  useEffect(() => {
    if (!user) return
    void (async () => {
      const { data, error } = await dbListNotes()
      if (!error && data.length > 0) {
        setNotes(data)
      }
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  // Flush all pending note saves to Supabase.
  // Reads notesRef.current so it always uses the latest state, not a stale snapshot.
  const flushSaves = useCallback(async () => {
    const pending = new Map(pendingSave.current)
    pendingSave.current.clear()
    saveTimer.current = null
    if (!pending.size) return

    setSaveStatus('saving')
    let anyError = false
    for (const [noteId, kind] of pending) {
      const note = notesRef.current.find((n) => n.id === noteId)
      if (!note) continue
      try {
        if (kind === 'meta' || kind === 'both') {
          const { error } = await dbUpdateNote(noteId, { title: note.title, color: note.color })
          if (error) anyError = true
        }
        if (kind === 'content' || kind === 'both') {
          const { error } = await replaceBlocksForNote(noteId, note.content)
          if (error) anyError = true
        }
      } catch {
        anyError = true
      }
    }
    setSaveStatus(anyError ? 'error' : 'saved')
  }, [])

  // Schedule a debounced Supabase write for a given note.
  // Accumulates multiple rapid edits so we do at most one write per 1.2 s of silence.
  const scheduleSave = useCallback(
    (noteId: string, kind: SaveKind) => {
      if (!user) return
      pendingSave.current.set(noteId, mergeSaveKind(pendingSave.current.get(noteId), kind))
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(flushSaves, 1200)
    },
    [user, flushSaves],
  )

  const createNote = useCallback(
    (title: string, subject: string): Note => {
      const newNote: Note = {
        id: crypto.randomUUID(), // UUID so it's valid as a Supabase primary key
        title: title || 'Untitled Note',
        subject: isSubjectType(subject) ? subject : 'other',
        color: 'blue',
        content: [{ type: 'paragraph', content: '' }],
        drawings: new Map(),
        createdAt: new Date(),
        updatedAt: new Date(),
        hasDrawings: false,
        tags: [subject],
      }

      setNotes((prev) => [newNote, ...prev])
      setCurrentNoteId(newNote.id)
      setIsEditing(true)

      if (user) {
        // Fire-and-forget; if this fails the note lives in localStorage until next session
        dbCreateNote({ id: newNote.id, title: newNote.title, color: newNote.color }).catch(() =>
          setSaveStatus('error'),
        )
      }

      return newNote
    },
    [user],
  )

  const updateNote = useCallback(
    (noteId: string, updates: Partial<Note>) => {
      setNotes((prev) =>
        prev.map((note) => (note.id === noteId ? { ...note, ...updates, updatedAt: new Date() } : note)),
      )
      scheduleSave(noteId, 'meta')
    },
    [scheduleSave],
  )

  const updateNoteContent = useCallback(
    (noteId: string, content: RichTextContent[]) => {
      setNotes((prev) =>
        prev.map((note) => (note.id === noteId ? { ...note, content, updatedAt: new Date() } : note)),
      )
      scheduleSave(noteId, 'content')
    },
    [scheduleSave],
  )

  const appendBlock = useCallback(
    (noteId: string, block: RichTextContent) => {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === noteId
            ? { ...note, content: [...note.content, block], updatedAt: new Date() }
            : note,
        ),
      )
      scheduleSave(noteId, 'content')
    },
    [scheduleSave],
  )

  const deleteNote = useCallback(
    (noteId: string) => {
      setNotes((prev) => prev.filter((note) => note.id !== noteId))
      if (currentNoteId === noteId) {
        setCurrentNoteId(null)
        setIsEditing(false)
      }
      if (user) {
        dbDeleteNote(noteId).catch(() => {})
      }
    },
    [currentNoteId, user],
  )

  const saveNote = useCallback(
    (noteId: string) => {
      updateNote(noteId, { updatedAt: new Date() })
      setIsEditing(false)
    },
    [updateNote],
  )

  /**
   * Load the full block content for a note from Supabase and merge it into local state.
   * Called by NoteDetailPage on mount so the first render uses cached/localStorage data
   * and the content is then hydrated from the authoritative DB source.
   */
  const loadNoteContent = useCallback(
    async (noteId: string) => {
      if (!user) return
      const { note, blocks, error } = await getNoteWithBlocks(noteId)
      if (error || !note) return
      const content = dbBlocksToFrontContent(blocks)
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteId
            ? {
                ...n,
                title: note.title ?? n.title,
                color: (note.color ?? n.color) as Note['color'],
                content,
              }
            : n,
        ),
      )
    },
    [user],
  )

  const value: NotesContextType = {
    notes,
    currentNote,
    isEditing,
    saveStatus,
    createNote,
    updateNote,
    deleteNote,
    setCurrentNote: setCurrentNoteId,
    setIsEditing,
    updateNoteContent,
    appendBlock,
    saveNote,
    loadNoteContent,
  }

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
}

export const useNotes = () => {
  const context = useContext(NotesContext)
  if (!context) {
    throw new Error('useNotes must be used within NotesProvider')
  }
  return context
}
