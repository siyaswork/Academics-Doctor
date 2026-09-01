import type { DrawingBlock, Note } from '../types/notes'

/**
 * Notes contain a `Map<string, DrawingBlock>` and `Date` fields, neither of
 * which round-trip through `JSON.stringify`/`JSON.parse` on their own. These
 * helpers convert to/from a plain-object shape suitable for localStorage
 * (`academ_notes`) and recover gracefully from malformed/partial data.
 */

interface SerializedNote extends Omit<Note, 'drawings' | 'createdAt' | 'updatedAt'> {
  drawings: Array<[string, DrawingBlock]>
  createdAt: string
  updatedAt: string
}

export function serializeNotes(notes: Note[]): string {
  const serializable: SerializedNote[] = notes.map((note) => ({
    ...note,
    drawings: Array.from(note.drawings instanceof Map ? note.drawings.entries() : []),
    createdAt: note.createdAt instanceof Date ? note.createdAt.toISOString() : String(note.createdAt),
    updatedAt: note.updatedAt instanceof Date ? note.updatedAt.toISOString() : String(note.updatedAt),
  }))
  return JSON.stringify(serializable)
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function safeDate(value: unknown): Date {
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value)
    if (!Number.isNaN(date.getTime())) return date
  }
  return new Date()
}

/** Parses persisted notes JSON, recovering from malformed entries field-by-field. */
export function deserializeNotes(raw: string): Note[] | null {
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    const notes: Note[] = []
    for (const item of parsed) {
      if (!isPlainObject(item) || typeof item.id !== 'string') continue
      let drawings = new Map<string, DrawingBlock>()
      try {
        if (Array.isArray(item.drawings)) drawings = new Map(item.drawings as Array<[string, DrawingBlock]>)
      } catch {
        drawings = new Map()
      }
      notes.push({
        id: item.id,
        title: typeof item.title === 'string' ? item.title : 'Untitled Note',
        subject: (item.subject as Note['subject']) || 'other',
        color: (item.color as Note['color']) || 'blue',
        content: Array.isArray(item.content) ? (item.content as Note['content']) : [],
        drawings,
        createdAt: safeDate(item.createdAt),
        updatedAt: safeDate(item.updatedAt),
        lastEditedBy: typeof item.lastEditedBy === 'string' ? item.lastEditedBy : undefined,
        tags: Array.isArray(item.tags) ? (item.tags as string[]) : undefined,
        isPinned: Boolean(item.isPinned),
        hasDrawings: Boolean(item.hasDrawings),
      })
    }
    return notes
  } catch {
    return null
  }
}
