import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { Note, RichTextContent, SubjectType } from '../types/notes'
import { demoDemoNotes } from '../data/demoNotes'
import { STORAGE_KEYS } from '../utils/storage'
import { deserializeNotes, serializeNotes } from '../utils/notesSerialization'
import { createId } from '../utils/id'

function loadInitialNotes(): Note[] {
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

interface NotesContextType {
  notes: Note[]
  currentNote: Note | null
  isEditing: boolean
  createNote: (title: string, subject: string) => Note
  updateNote: (noteId: string, updates: Partial<Note>) => void
  deleteNote: (noteId: string) => void
  setCurrentNote: (noteId: string | null) => void
  setIsEditing: (isEditing: boolean) => void
  updateNoteContent: (noteId: string, content: RichTextContent[]) => void
  appendBlock: (noteId: string, block: RichTextContent) => void
  saveNote: (noteId: string) => void
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

const isSubjectType = (value: string): value is SubjectType =>
  value === 'math' || value === 'science' || value === 'history' || value === 'literature' || value === 'other'

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>(loadInitialNotes)
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const isFirstRender = useRef(true)

  const currentNote = currentNoteId ? notes.find((n) => n.id === currentNoteId) || null : null

  // Persist to localStorage whenever notes change (skip the very first mount
  // so we don't immediately re-write what we just loaded).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    window.localStorage.setItem(STORAGE_KEYS.notes, serializeNotes(notes))
  }, [notes])

  const createNote = useCallback(
    (title: string, subject: string): Note => {
      const newNote: Note = {
        id: createId('note'),
        title: title || 'Untitled Note',
        subject: isSubjectType(subject) ? subject : 'other',
        color: 'blue',
        content: [
          {
            type: 'paragraph',
            content: '',
          },
        ],
        drawings: new Map(),
        createdAt: new Date(),
        updatedAt: new Date(),
        hasDrawings: false,
        tags: [subject],
      }

      setNotes((prev) => [newNote, ...prev])
      setCurrentNoteId(newNote.id)
      setIsEditing(true)
      return newNote
    },
    [],
  )

  const updateNote = useCallback((noteId: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId
          ? {
              ...note,
              ...updates,
              updatedAt: new Date(),
            }
          : note,
      ),
    )
  }, [])

  const updateNoteContent = useCallback(
    (noteId: string, content: RichTextContent[]) => {
      updateNote(noteId, { content })
    },
    [updateNote],
  )

  const appendBlock = useCallback((noteId: string, block: RichTextContent) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId
          ? { ...note, content: [...note.content, block], updatedAt: new Date() }
          : note,
      ),
    )
  }, [])

  const deleteNote = useCallback((noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId))
    if (currentNoteId === noteId) {
      setCurrentNoteId(null)
      setIsEditing(false)
    }
  }, [currentNoteId])

  const saveNote = useCallback(
    (noteId: string) => {
      updateNote(noteId, { updatedAt: new Date() })
      setIsEditing(false)
    },
    [updateNote],
  )

  const value: NotesContextType = {
    notes,
    currentNote,
    isEditing,
    createNote,
    updateNote,
    deleteNote,
    setCurrentNote: setCurrentNoteId,
    setIsEditing,
    updateNoteContent,
    appendBlock,
    saveNote,
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
