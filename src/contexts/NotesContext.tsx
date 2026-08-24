import { createContext, useContext } from 'react'
import type { Note, RichTextContent } from '../types/notes'
import { useAppContext } from './AppContext'

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

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const app = useAppContext()
  const currentNote = app.notes.find((item) => item.id === app.selectedNoteId) ?? null
  const value: NotesContextType = {
    notes: app.notes,
    currentNote,
    isEditing: true,
    createNote: (title, subject) => app.createNote({ title, subjectId: app.subjects.find((item) => item.name === subject)?.id }),
    updateNote: (noteId, updates) => { const existing = app.notes.find((item) => item.id === noteId); if (existing) app.saveNote({ ...existing, ...updates }) },
    deleteNote: app.deleteNote,
    setCurrentNote: (noteId) => app.setSelectedNote(noteId ?? undefined),
    setIsEditing: () => undefined,
    updateNoteContent: (noteId, content) => { const existing = app.notes.find((item) => item.id === noteId); if (existing) app.saveNote({ ...existing, content }) },
    saveNote: (noteId) => { const existing = app.notes.find((item) => item.id === noteId); if (existing) app.saveNote(existing) },
  }
  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
}

export const useNotes = () => {
  const context = useContext(NotesContext)
  if (!context) throw new Error('useNotes must be used within NotesProvider')
  return context
}
