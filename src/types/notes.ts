export type NoteColor = 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'yellow' | 'red' | 'neutral'

export type SubjectType = 'math' | 'science' | 'history' | 'literature' | 'other'

/** All tools supported by the advanced drawing canvas (Step 5). */
export type DrawingTool =
  | 'select'
  | 'pen'
  | 'highlighter'
  | 'eraser'
  | 'line'
  | 'arrow'
  | 'double-arrow'
  | 'dashed-line'
  | 'connector'
  | 'rectangle'
  | 'rounded-rectangle'
  | 'circle'
  | 'ellipse'
  | 'triangle'
  | 'polygon'
  | 'text-box'
  | 'sticky-note'

export interface DrawingAction {
  id: string
  type: DrawingTool
  /** Freehand points for pen/highlighter/eraser, bbox corners for shapes, or vertices for polygons. */
  points: Array<{ x: number; y: number }>
  color: string
  strokeWidth: number
  opacity: number
  timestamp: number
  /** Text content for text-box / sticky-note annotations. */
  text?: string
  /** Whether a polygon-in-progress has been closed (double-click). */
  closed?: boolean
  /** z-order among sibling actions; higher draws on top. Actions are kept sorted by this value. */
  order?: number
}

export interface DrawingBlock {
  id: string
  width: number
  height: number
  actions: DrawingAction[]
  imageData?: string // Base64 encoded canvas image
}

/**
 * Simple block model (Step 5, Feature 7). Existing note content only ever used
 * 'paragraph' | 'heading' | 'list' | 'image' | 'drawing', so all of those keep
 * working unchanged. 'formula' and 'divider' are new block kinds that can be
 * appended to a note's content array from the Formula Library or Calculator.
 */
export interface RichTextContent {
  type: 'paragraph' | 'heading' | 'list' | 'image' | 'drawing' | 'formula' | 'divider'
  level?: number // For headings: 1-6
  format?: 'bold' | 'italic' | 'underline' | 'code'
  alignment?: 'left' | 'center' | 'right' | 'justify'
  listType?: 'bullet' | 'numbered'
  content: string // For text blocks (and a plain-text fallback for formula blocks)
  drawingBlockId?: string // For drawing blocks
  imageUrl?: string // For image blocks
  // Formula block fields
  formulaId?: string
  formulaName?: string
  formulaText?: string
  formulaSubject?: string
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
  undoStack: Note[]
  redoStack: Note[]
}

export interface DrawingState {
  isDrawing: boolean
  currentTool: DrawingTool
  currentColor: string
  strokeWidth: number
  opacity: number
  actions: DrawingAction[]
  undoStack: DrawingAction[]
  redoStack: DrawingAction[]
}
