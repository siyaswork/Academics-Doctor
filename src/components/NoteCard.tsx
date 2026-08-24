import React from 'react'
import { Note, SubjectType } from '../types/notes'
import styles from './NoteCard.module.css'

interface NoteCardProps {
  note: Note
  onOpen: (noteId: string) => void
}

const subjectLabels: Record<SubjectType, string> = {
  math: 'Mathematics',
  science: 'Science',
  history: 'History',
  literature: 'Literature',
  other: 'Other',
}

const colorClass: Record<Note['color'], string> = {
  blue: styles.blue,
  green: styles.green,
  purple: styles.purple,
  orange: styles.orange,
  pink: styles.pink,
  yellow: styles.yellow,
  red: styles.red,
  neutral: styles.neutral,
}

const formatDate = (date: Date) => new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date)
const stripHtml = (value: string) => value.replace(/<[^>]+>/g, ' ')

export const NoteCard: React.FC<NoteCardProps> = ({ note, onOpen }) => {
  const preview = stripHtml(note.content.find((block) => block.type !== 'drawing' && block.content.trim())?.content || 'Start writing your study notes…')

  return (
    <button type="button" className={`${styles.card} ${colorClass[note.color]}`} onClick={() => onOpen(note.id)}>
      <span className={styles.accent} aria-hidden="true" />
      <span className={styles.topLine}>
        <span className={styles.subject}>{subjectLabels[note.subject]}</span>
        {note.hasDrawings && <span className={styles.drawingBadge} title="Contains drawings" aria-label="Contains drawings">✎</span>}
      </span>
      <span className={styles.title}>{note.title}</span>
      <span className={styles.preview}>{preview}</span>
      <span className={styles.footer}>
        <span>Edited {formatDate(note.updatedAt)}</span>
        {note.isPinned && <span aria-label="Pinned note">📌</span>}
      </span>
    </button>
  )
}
