export type NoteColor = 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'yellow' | 'red' | 'neutral'

export type SubjectType = 'math' | 'science' | 'history' | 'literature' | 'other'

export type DrawingTool = 'pen' | 'eraser' | 'line' | 'arrow' | 'rectangle' | 'circle' | 'triangle'

export type TextAlignment = 'left' | 'center' | 'right' | 'justify'

export interface DrawingAction {
  id: string
  type: DrawingTool
  points: Array<{ x: number; y: number }>
  color: string
  strokeWidth: number
  opacity: number
  timestamp: number
}

export interface DrawingBlock {
  id: string
  width: number
  height: number
  actions: DrawingAction[]
  imageData?: string
}

export interface RichTextContent {
  type: 'paragraph' | 'heading' | 'list' | 'image' | 'drawing'
  level?: number
  alignment?: TextAlignment
  listType?: 'bullet' | 'numbered'
  content: string
  drawingBlockId?: string
  imageUrl?: string
}

export interface Note {
  id: string
  title: string
  subject: SubjectType
  color: NoteColor
  content: RichTextContent[]
  drawings: Map<string, DrawingBlock>
  createdAt: Date
  updatedAt: Date
  lastEditedBy?: string
  tags?: string[]
  isPinned?: boolean
  hasDrawings: boolean
}

export interface NotesState {
  notes: Note[]
  currentNoteId: string | null
  isEditing: boolean
  lastSavedAt: Date | null
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
