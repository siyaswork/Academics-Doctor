import { Note, NotesState } from '../types/notes'
import { demoNotesState } from '../data/demoNotes'

const STORAGE_KEY = 'academics-doctor-notes'

type Serializable = null | boolean | number | string | Serializable[] | { [key: string]: Serializable }

const serializeValue = (value: unknown): Serializable => {
  if (value instanceof Date) {
    return { __type: 'Date', value: value.toISOString() }
  }

  if (value instanceof Map) {
    return {
      __type: 'Map',
      value: Array.from(value.entries()).map(([key, entryValue]) => [key, serializeValue(entryValue)]),
    }
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeValue(item))
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [key, serializeValue(entryValue)]),
    )
  }

  return value as Serializable
}

const deserializeValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => deserializeValue(item))
  }

  if (value && typeof value === 'object') {
    const typedValue = value as { __type?: string; value?: unknown; [key: string]: unknown }

    if (typedValue.__type === 'Date' && typeof typedValue.value === 'string') {
      const date = new Date(typedValue.value)
      return Number.isNaN(date.getTime()) ? null : date
    }

    if (typedValue.__type === 'Map' && Array.isArray(typedValue.value)) {
      return new Map(
        typedValue.value.map((entry) => {
          const [key, entryValue] = entry as [string, unknown]
          return [key, deserializeValue(entryValue)]
        }),
      )
    }

    return Object.fromEntries(
      Object.entries(typedValue)
        .filter(([key]) => key !== '__type')
        .map(([key, entryValue]) => [key, deserializeValue(entryValue)]),
    )
  }

  return value
}

const isValidNote = (value: unknown): value is Note => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const note = value as Partial<Note>
  return (
    typeof note.id === 'string' &&
    typeof note.title === 'string' &&
    Array.isArray(note.content) &&
    note.createdAt instanceof Date &&
    note.updatedAt instanceof Date &&
    note.drawings instanceof Map
  )
}

const cloneFallbackState = (): NotesState => ({
  ...demoNotesState,
  notes: demoNotesState.notes.map((note) => ({
    ...note,
    createdAt: new Date(note.createdAt),
    updatedAt: new Date(note.updatedAt),
    drawings: new Map(note.drawings),
    content: note.content.map((block) => ({ ...block })),
    tags: note.tags ? [...note.tags] : undefined,
  })),
  lastSavedAt: demoNotesState.lastSavedAt ? new Date(demoNotesState.lastSavedAt) : null,
})

export const loadNotesState = (): NotesState => {
  if (typeof window === 'undefined') {
    return cloneFallbackState()
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return cloneFallbackState()
  }

  try {
    const parsed = deserializeValue(JSON.parse(raw)) as Partial<NotesState>
    const notes = Array.isArray(parsed.notes) ? parsed.notes.filter(isValidNote) : []
    const fallback = cloneFallbackState()

    if (!notes.length) {
      return fallback
    }

    const currentNoteId =
      typeof parsed.currentNoteId === 'string' && notes.some((note) => note.id === parsed.currentNoteId)
        ? parsed.currentNoteId
        : null

    return {
      notes,
      currentNoteId,
      isEditing: Boolean(currentNoteId),
      lastSavedAt: parsed.lastSavedAt instanceof Date ? parsed.lastSavedAt : null,
    }
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return cloneFallbackState()
  }
}

export const saveNotesState = (state: NotesState): Date => {
  const savedAt = new Date()

  if (typeof window === 'undefined') {
    return savedAt
  }

  const payload: NotesState = {
    ...state,
    lastSavedAt: savedAt,
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeValue(payload)))
  return savedAt
}
