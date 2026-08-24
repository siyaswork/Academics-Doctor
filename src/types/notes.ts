export type NoteColor = 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'yellow' | 'red' | 'neutral'
export type SubjectType = 'math' | 'science' | 'history' | 'literature' | 'other'
export type DrawingTool = 'pen' | 'eraser' | 'line' | 'arrow' | 'rectangle' | 'circle' | 'triangle'
export interface DrawingAction { id: string; type: DrawingTool; points: Array<{ x: number; y: number }>; color: string; strokeWidth: number; opacity: number; timestamp: number }
export interface DrawingBlock { id: string; width: number; height: number; actions: DrawingAction[]; imageData?: string }
export interface RichTextContent { type: 'paragraph' | 'heading' | 'list' | 'image' | 'drawing'; level?: number; format?: 'bold' | 'italic' | 'underline' | 'code'; alignment?: 'left' | 'center' | 'right' | 'justify'; listType?: 'bullet' | 'numbered'; content: string; drawingBlockId?: string; imageUrl?: string }
export interface Note { id: string; title: string; subject: SubjectType; subjectId?: string; color: NoteColor; content: RichTextContent[]; drawings: Record<string, DrawingBlock>; createdAt: string; updatedAt: string; lastEditedBy?: string; tags?: string[]; isPinned?: boolean; hasDrawings: boolean; isFavorited?: boolean; reminders?: string[] }
export interface NotesState { notes: Note[]; currentNoteId: string | null; isEditing: boolean; undoStack: Note[]; redoStack: Note[] }
export interface DrawingState { isDrawing: boolean; currentTool: DrawingTool; currentColor: string; strokeWidth: number; opacity: number; actions: DrawingAction[]; undoStack: DrawingAction[]; redoStack: DrawingAction[] }
