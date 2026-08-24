import React from 'react'
import { useNotes } from '../contexts/NotesContext'
import { NoteEditor } from './NoteEditor'
import { NotesLibrary } from './NotesLibrary'

export const NotesWorkspace: React.FC = () => {
  const { notes, currentNote, openNote, closeNote, createNote } = useNotes()

  if (currentNote) {
    return <NoteEditor note={currentNote} onBack={closeNote} />
  }

  return (
    <NotesLibrary
      notes={notes}
      onOpenNote={openNote}
      onCreateNote={() => {
        createNote('Untitled Note', 'other')
      }}
    />
  )
}
