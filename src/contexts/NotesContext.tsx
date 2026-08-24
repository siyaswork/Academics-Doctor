import React, { createContext, useContext, useState, useCallback } from 'react'
import { Note, NotesState, RichTextContent } from '../types/notes'
import { demoDemoNotes } from '../data/demoNotes'

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
  saveNote: (noteId: string) => void
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>(demoDemoNotes)
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const currentNote = currentNoteId ? notes.find((n) => n.id === currentNoteId) || null : null

  const createNote = useCallback(
    (title: string, subject: string): Note => {
      const newNote: Note = {
        id: `note-${Date.now()}`,
        title: title || 'Untitled Note',
        subject: (subject as any) || 'other',
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
