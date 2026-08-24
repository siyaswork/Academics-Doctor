import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createBlankNote } from '../data/demoNotes'
import { loadNotesState, saveNotesState } from '../lib/notesStorage'
import { DrawingBlock, Note, RichTextContent, SaveStatus, SubjectType } from '../types/notes'

interface NotesContextType {
  notes: Note[]
  currentNote: Note | null
  currentNoteId: string | null
  isEditing: boolean
  saveStatus: SaveStatus
  lastSavedAt: Date | null
  createNote: (title?: string, subject?: SubjectType) => Note
  updateNote: (noteId: string, updates: Partial<Note>) => void
  deleteNote: (noteId: string) => void
  openNote: (noteId: string) => void
  closeNote: () => void
  setCurrentNote: (noteId: string | null) => void
  setIsEditing: (isEditing: boolean) => void
  updateNoteContent: (noteId: string, content: RichTextContent[]) => void
  addDrawingBlock: (noteId: string) => DrawingBlock
  updateDrawingBlock: (noteId: string, drawingBlock: DrawingBlock) => void
  removeDrawingBlock: (noteId: string, drawingBlockId: string) => void
  saveNote: (noteId?: string) => void
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

const normalizeSubject = (subject?: SubjectType): SubjectType => subject ?? 'other'

const mergeNoteContent = (existingContent: RichTextContent[], nextTextContent: RichTextContent[]) => {
  const drawingBlocks = existingContent.filter((block) => block.type === 'drawing')
  return [...nextTextContent, ...drawingBlocks]
}

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState(loadNotesState)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const hasHydrated = useRef(false)
  const saveTimer = useRef<number | null>(null)

  const currentNote = useMemo(
    () => (state.currentNoteId ? state.notes.find((note) => note.id === state.currentNoteId) ?? null : null),
    [state.currentNoteId, state.notes],
  )

  const setCurrentNote = useCallback((noteId: string | null) => {
    setState((previous) => ({
      ...previous,
      currentNoteId: noteId,
      isEditing: Boolean(noteId),
    }))
  }, [])

  const setIsEditing = useCallback((isEditing: boolean) => {
    setState((previous) => ({ ...previous, isEditing }))
  }, [])

  const createNote = useCallback((title = 'Untitled Note', subject?: SubjectType) => {
    const newNote = createBlankNote(`note-${Date.now()}`, title, normalizeSubject(subject))

    setState((previous) => ({
      ...previous,
      notes: [newNote, ...previous.notes],
      currentNoteId: newNote.id,
      isEditing: true,
    }))

    return newNote
  }, [])

  const updateNote = useCallback((noteId: string, updates: Partial<Note>) => {
    setSaveStatus('saving')
    setState((previous) => ({
      ...previous,
      notes: previous.notes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              ...updates,
              tags: updates.subject ? [updates.subject] : note.tags,
              updatedAt: new Date(),
              hasDrawings: updates.drawings ? updates.drawings.size > 0 : note.hasDrawings,
            }
          : note,
      ),
    }))
  }, [])

  const updateNoteContent = useCallback((noteId: string, content: RichTextContent[]) => {
    setState((previous) => ({
      ...previous,
      notes: previous.notes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              content: mergeNoteContent(note.content, content),
              updatedAt: new Date(),
            }
          : note,
      ),
    }))
    setSaveStatus('saving')
  }, [])

  const addDrawingBlock = useCallback((noteId: string) => {
    const drawingBlock: DrawingBlock = {
      id: `drawing-${Date.now()}`,
      width: 900,
      height: 420,
      actions: [],
    }

    setState((previous) => ({
      ...previous,
      notes: previous.notes.map((note) => {
        if (note.id !== noteId) {
          return note
        }

        return {
          ...note,
          drawings: new Map(note.drawings).set(drawingBlock.id, drawingBlock),
          content: [...note.content, { type: 'drawing', content: '', drawingBlockId: drawingBlock.id }],
          updatedAt: new Date(),
          hasDrawings: true,
        }
      }),
    }))
    setSaveStatus('saving')

    return drawingBlock
  }, [])

  const updateDrawingBlock = useCallback((noteId: string, drawingBlock: DrawingBlock) => {
    setState((previous) => ({
      ...previous,
      notes: previous.notes.map((note) => {
        if (note.id !== noteId) {
          return note
        }

        const drawings = new Map(note.drawings)
        drawings.set(drawingBlock.id, drawingBlock)

        const hasDrawingContent = note.content.some(
          (block) => block.type === 'drawing' && block.drawingBlockId === drawingBlock.id,
        )

        return {
          ...note,
          drawings,
          content: hasDrawingContent
            ? note.content
            : [...note.content, { type: 'drawing', content: '', drawingBlockId: drawingBlock.id }],
          updatedAt: new Date(),
          hasDrawings: drawings.size > 0,
        }
      }),
    }))
    setSaveStatus('saving')
  }, [])

  const removeDrawingBlock = useCallback((noteId: string, drawingBlockId: string) => {
    setState((previous) => ({
      ...previous,
      notes: previous.notes.map((note) => {
        if (note.id !== noteId) {
          return note
        }

        const drawings = new Map(note.drawings)
        drawings.delete(drawingBlockId)

        return {
          ...note,
          drawings,
          content: note.content.filter(
            (block) => !(block.type === 'drawing' && block.drawingBlockId === drawingBlockId),
          ),
          updatedAt: new Date(),
          hasDrawings: drawings.size > 0,
        }
      }),
    }))
    setSaveStatus('saving')
  }, [])

  const deleteNote = useCallback((noteId: string) => {
    setState((previous) => ({
      ...previous,
      notes: previous.notes.filter((note) => note.id !== noteId),
      currentNoteId: previous.currentNoteId === noteId ? null : previous.currentNoteId,
      isEditing: previous.currentNoteId === noteId ? false : previous.isEditing,
    }))
    setSaveStatus('saving')
  }, [])

  const openNote = useCallback((noteId: string) => {
    setCurrentNote(noteId)
  }, [setCurrentNote])

  const closeNote = useCallback(() => {
    setCurrentNote(null)
  }, [setCurrentNote])

  const saveNote = useCallback((noteId?: string) => {
    setState((previous) => {
      const nextState = {
        ...previous,
        notes: previous.notes.map((note) =>
          !noteId || note.id === noteId ? { ...note, updatedAt: new Date() } : note,
        ),
      }
      const savedAt = saveNotesState(nextState)
      setSaveStatus('saved')
      return { ...nextState, lastSavedAt: savedAt }
    })
  }, [])

  useEffect(() => {
    if (!hasHydrated.current) {
      hasHydrated.current = true
      return
    }

    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current)
    }

    setSaveStatus('saving')

    saveTimer.current = window.setTimeout(() => {
      try {
        const savedAt = saveNotesState(state)
        setState((previous) => ({ ...previous, lastSavedAt: savedAt }))
        setSaveStatus('saved')
      } catch {
        setSaveStatus('error')
      }
    }, 350)

    return () => {
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current)
      }
    }
  }, [state.currentNoteId, state.isEditing, state.notes])

  const value: NotesContextType = {
    notes: state.notes,
    currentNote,
    currentNoteId: state.currentNoteId,
    isEditing: state.isEditing,
    saveStatus,
    lastSavedAt: state.lastSavedAt,
    createNote,
    updateNote,
    deleteNote,
    openNote,
    closeNote,
    setCurrentNote,
    setIsEditing,
    updateNoteContent,
    addDrawingBlock,
    updateDrawingBlock,
    removeDrawingBlock,
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
