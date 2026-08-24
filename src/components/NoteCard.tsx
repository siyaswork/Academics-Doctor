import type { Note } from '../types/notes'
import { formatShortDate } from '../utils/date'
import { FavoriteButton } from './FavoriteButton'
import styles from './NoteCard.module.css'

interface NoteCardProps { note: Note; subjectName?: string; onOpen: (noteId: string) => void; onToggleFavorite: () => void }

const colorClass: Record<Note['color'], string> = { blue: styles.blue, green: styles.green, purple: styles.purple, orange: styles.orange, pink: styles.pink, yellow: styles.yellow, red: styles.red, neutral: styles.neutral }

export const NoteCard = ({ note, subjectName, onOpen, onToggleFavorite }: NoteCardProps) => {
  const preview = note.content.find((block) => block.content.trim())?.content || 'Start writing your study notes…'
  return <button type="button" className={`${styles.card} ${colorClass[note.color]}`} onClick={() => onOpen(note.id)}><span className={styles.accent} aria-hidden="true" /><div className={styles.header}><div><span className={styles.subject}>{subjectName ?? 'General note'}</span><strong>{note.title}</strong></div><FavoriteButton isFavorited={note.isFavorited} onToggle={onToggleFavorite} label={`Toggle favorite for ${note.title}`} /></div><span className={styles.preview}>{preview}</span><span className={styles.footer}><span>Edited {formatShortDate(note.updatedAt)}</span><span>{note.hasDrawings ? '✏️ Drawings' : '📝 Text note'}</span></span></button>
}
