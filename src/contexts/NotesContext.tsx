import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { Note as FrontNote, RichTextContent } from '../types/notes'
import * as notesService from '../services/notes'
import { useDebouncedCallback } from '../lib/hooks/useDebouncedCallback'

type NotesContextType = {
  notes: FrontNote[]
  currentNote: FrontNote | null
  isEditing: boolean
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
  createNote: (title: string, subject: string) => Promise<FrontNote | null>
  updateNote: (noteId: string, updates: Partial<FrontNote>) => void
  deleteNote: (noteId: string) => Promise<void>
  setCurrentNote: (noteId: string | null) => void
  setIsEditing: (isEditing: boolean) => void
  updateNoteContent: (noteId: string, content: RichTextContent[]) => void
  appendBlock: (noteId: string, block: RichTextContent) => void
  saveNote: (noteId: string) => Promise<void>
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<FrontNote[]>([])
  const [currentNote, setCurrentNoteState] = useState<FrontNote | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  // Load notes on mount
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await notesService.listNotes()
      if (!mounted) return
      if (data) setNotes(data as FrontNote[])
    })()
    return () => { mounted = false }
  }, [])

  // Set current note (load content blocks if needed)
  const setCurrentNote = useCallback(async (noteId: string | null) => {
    if (!noteId) {
      setCurrentNoteState(null)
      return
    }
    const meta = notes.find(n => n.id === noteId)
    if (meta && meta.content && meta.content.length) {
      setCurrentNoteState(meta)
      return
    }
    const { note, blocks } = await notesService.getNoteWithBlocks(noteId)
    if (!note) {
      setCurrentNoteState(null)
      return
    }
    const content = (blocks ?? []).map(b => (b.content as RichTextContent) || { type: 'paragraph', content: '' })
    const front: FrontNote = {
      id: note.id,
      title: note.title ?? '',
      subject: 'other' as any,
      color: note.color ?? 'blue',
      content,
      drawings: new Map(),
      createdAt: note.created_at ? new Date(note.created_at) : new Date(),
      updatedAt: note.updated_at ? new Date(note.updated_at) : new Date(),
      hasDrawings: false,
    }
    setNotes(prev => [front, ...prev.filter(n => n.id !== front.id)])
    setCurrentNoteState(front)
  }, [notes])

  // Save logic: immediate save (metadata + replace blocks)
  const saveImmediate = useCallback(async (noteId: string) => {
    setSaveStatus('saving')
    try {
      const note = (noteId === currentNote?.id) ? currentNote : notes.find(n => n.id === noteId) ?? null
      if (!note) throw new Error('Note not found')
      await notesService.updateNote(noteId, {
        title: note.title,
        color: (note as any).color,
      })
      await notesService.replaceBlocksForNote(noteId, note.content)
      setSaveStatus('saved')
      return true
    } catch (err) {
      setSaveStatus('error')
      throw err
    }
  }, [currentNote, notes])

  // Debounced save (hook used inside component body)
  const { call: debouncedSave } = useDebouncedCallback((noteId: string) => {
    // run saveImmediate but do not await here
    void saveImmediate(noteId).catch(() => {})
  }, 1000)

  const createNote = useCallback(async (title: string, subject: string) => {
    const { data } = await notesService.createNote({ title, color: 'blue' })
    if (!data) return null
    const front: FrontNote = {
      id: data.id,
      title: data.title ?? title,
      subject: 'other' as any,
      color: data.color ?? 'blue',
      content: [{ type: 'paragraph', content: '' }],
      drawings: new Map(),
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
      updatedAt: data.updated_at ? new Date(data.updated_at) : new Date(),
      hasDrawings: false,
    }
    setNotes(prev => [front, ...prev])
    setCurrentNoteState(front)
    setIsEditing(true)
    return front
  }, [])

  const updateNote = useCallback((noteId: string, updates: Partial<FrontNote>) => {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, ...updates, updatedAt: new Date() } : n))
    if (currentNote && currentNote.id === noteId) {
      setCurrentNoteState({ ...currentNote, ...updates, updatedAt: new Date() })
    }
    debouncedSave(noteId)
  }, [currentNote, debouncedSave])

  const updateNoteContent = useCallback((noteId: string, content: RichTextContent[]) => {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, content, updatedAt: new Date() } : n))
    if (currentNote && currentNote.id === noteId) {
      setCurrentNoteState({ ...currentNote, content, updatedAt: new Date() })
    }
    debouncedSave(noteId)
  }, [currentNote, debouncedSave])

  const appendBlock = useCallback((noteId: string, block: RichTextContent) => {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, content: [...n.content, block], updatedAt: new Date() } : n))
    if (currentNote && currentNote.id === noteId) {
      setCurrentNoteState({ ...currentNote, content: [...currentNote.content, block], updatedAt: new Date() })
    }
    debouncedSave(noteId)
  }, [currentNote, debouncedSave])

  const deleteNote = useCallback(async (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId))
    if (currentNote?.id === noteId) setCurrentNoteState(null)
    await notesService.deleteNote(noteId)
  }, [currentNote])

  const saveNote = useCallback(async (noteId: string) => {
    setSaveStatus('saving')
    try {
      await saveImmediate(noteId)
    } catch {
      // saveImmediate already handles setting saveStatus
    }
  }, [saveImmediate])

  const value: NotesContextType = {
    notes,
    currentNote,
    isEditing,
    saveStatus,
    createNote,
    updateNote,
    deleteNote,
    setCurrentNote,
    setIsEditing,
    updateNoteContent,
    appendBlock,
    saveNote,
  }

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
}

export const useNotes = () => {
  const ctx = useContext(NotesContext)
  if (!ctx) throw new Error('useNotes must be used within NotesProvider')
  return ctx
}
