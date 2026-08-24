import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotes } from '../contexts/NotesContext'
import { NotesLibrary } from '../components/NotesLibrary'

export const NotesListPage: React.FC = () => {
  const { notes, createNote } = useNotes()
  const navigate = useNavigate()

  const handleCreate = () => {
    const note = createNote('Untitled Note', 'other')
    navigate(`/notes/${note.id}`)
  }

  return (
    <NotesLibrary
      notes={notes}
      onOpenNote={(noteId) => navigate(`/notes/${noteId}`)}
      onCreateNote={handleCreate}
    />
  )
}
