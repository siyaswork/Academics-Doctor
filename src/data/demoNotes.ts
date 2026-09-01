import type { Note, RichTextContent, NoteColor, SubjectType } from '../types/notes'

const createDemoContent = (): RichTextContent[] => [
  {
    type: 'heading',
    level: 1,
    content: 'Newton\'s Laws of Motion',
  },
  {
    type: 'paragraph',
    content: 'The three laws of motion form the foundation of classical mechanics.',
  },
  {
    type: 'heading',
    level: 2,
    content: 'First Law: Inertia',
  },
  {
    type: 'paragraph',
    format: 'italic',
    content: 'An object in motion stays in motion, and an object at rest stays at rest, unless acted upon by an external force.',
  },
  {
    type: 'list',
    listType: 'bullet',
    content: 'Also called the Law of Inertia',
  },
  {
    type: 'list',
    listType: 'bullet',
    content: 'Explains why seatbelts are important in cars',
  },
  {
    type: 'heading',
    level: 2,
    content: 'Second Law: F = ma',
  },
  {
    type: 'paragraph',
    content: 'The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.',
  },
  {
    type: 'list',
    listType: 'numbered',
    content: 'Force equals mass times acceleration',
  },
  {
    type: 'list',
    listType: 'numbered',
    content: 'Heavier objects need more force to accelerate at the same rate',
  },
]

const createNote = (
  id: string,
  title: string,
  subject: SubjectType,
  color: NoteColor,
  daysAgo: number = 0,
  content?: RichTextContent[],
  hasDrawings: boolean = false,
): Note => {
  const now = new Date()
  const updatedAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
  const createdAt = new Date(updatedAt.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000)

  return {
    id,
    title,
    subject,
    color,
    content: content || createDemoContent(),
    drawings: new Map(),
    createdAt,
    updatedAt,
    hasDrawings,
    tags: [subject],
  }
}

export const demoDemoNotes: Note[] = [
  createNote(
    'note-1',
    "Newton's Laws of Motion",
    'science',
    'blue',
    1,
    createDemoContent(),
    true,
  ),
  createNote(
    'note-2',
    'Climate Change: Key Facts',
    'science',
    'green',
    3,
    [
      { type: 'heading', level: 1, content: 'Climate Change' },
      { type: 'paragraph', content: 'Rising global temperatures due to greenhouse gas emissions.' },
      {
        type: 'list',
        listType: 'bullet',
        content: 'Average temperature increased by 1.1°C since pre-industrial times',
      },
      {
        type: 'list',
        listType: 'bullet',
        content: 'Primary cause: human activities (burning fossil fuels)',
      },
      { type: 'paragraph', content: 'Solutions include renewable energy and carbon reduction.' },
    ],
  ),
  createNote(
    'note-3',
    'Shakespeare Analysis: Hamlet',
    'literature',
    'purple',
    5,
    [
      { type: 'heading', level: 1, content: 'Hamlet Character Study' },
      { type: 'paragraph', content: 'Hamlet is the Prince of Denmark, contemplating revenge for his father\'s murder.' },
      { type: 'heading', level: 2, content: 'Key Themes' },
      { type: 'list', listType: 'bullet', content: 'Madness (real vs. feigned)' },
      { type: 'list', listType: 'bullet', content: 'Betrayal within family' },
      { type: 'list', listType: 'bullet', content: 'Mortality and the human condition' },
    ],
  ),
  createNote(
    'note-4',
    'Photosynthesis Equation',
    'science',
    'green',
    2,
    [
      { type: 'heading', level: 1, content: 'Photosynthesis' },
      { type: 'paragraph', format: 'bold', content: '6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂' },
      { type: 'heading', level: 2, content: 'Process' },
      {
        type: 'list',
        listType: 'numbered',
        content: 'Light-dependent reactions in thylakoids',
      },
      {
        type: 'list',
        listType: 'numbered',
        content: 'Light-independent reactions (Calvin cycle)',
      },
    ],
    true,
  ),
  createNote(
    'note-5',
    'American Revolution Timeline',
    'history',
    'orange',
    7,
    [
      { type: 'heading', level: 1, content: 'American Revolution' },
      { type: 'heading', level: 2, content: 'Key Dates' },
      { type: 'list', listType: 'numbered', content: '1775: First Continental Congress' },
      { type: 'list', listType: 'numbered', content: '1776: Declaration of Independence' },
      { type: 'list', listType: 'numbered', content: '1781: Surrender at Yorktown' },
      { type: 'list', listType: 'numbered', content: '1783: Treaty of Paris' },
    ],
  ),
  createNote(
    'note-6',
    'Calculus: Derivatives',
    'math',
    'blue',
    4,
    [
      { type: 'heading', level: 1, content: 'Derivatives' },
      { type: 'paragraph', content: 'The derivative measures the rate of change of a function.' },
      { type: 'paragraph', format: 'code', content: "f'(x) = lim (f(x+h) - f(x)) / h as h → 0" },
      { type: 'heading', level: 2, content: 'Common Derivatives' },
      { type: 'list', listType: 'bullet', content: 'd/dx(x^n) = nx^(n-1)' },
      { type: 'list', listType: 'bullet', content: 'd/dx(sin x) = cos x' },
      { type: 'list', listType: 'bullet', content: 'd/dx(e^x) = e^x' },
    ],
    true,
  ),
  createNote(
    'note-7',
    'World Capitals Study Guide',
    'history',
    'yellow',
    10,
    [
      { type: 'heading', level: 1, content: 'World Capitals' },
      { type: 'heading', level: 2, content: 'Europe' },
      { type: 'list', listType: 'bullet', content: 'France: Paris' },
      { type: 'list', listType: 'bullet', content: 'Germany: Berlin' },
      { type: 'list', listType: 'bullet', content: 'UK: London' },
      { type: 'heading', level: 2, content: 'Asia' },
      { type: 'list', listType: 'bullet', content: 'Japan: Tokyo' },
      { type: 'list', listType: 'bullet', content: 'China: Beijing' },
      { type: 'list', listType: 'bullet', content: 'India: New Delhi' },
    ],
  ),
  createNote(
    'note-8',
    'Biology: Cell Structure',
    'science',
    'pink',
    6,
    [
      { type: 'heading', level: 1, content: 'Cell Structure' },
      { type: 'heading', level: 2, content: 'Nucleus' },
      {
        type: 'paragraph',
        content: 'Contains genetic material (DNA). Controls cell activities.',
      },
      { type: 'heading', level: 2, content: 'Mitochondria' },
      { type: 'paragraph', content: 'Powerhouse of the cell. Produces ATP energy.' },
      { type: 'heading', level: 2, content: 'Endoplasmic Reticulum' },
      {
        type: 'paragraph',
        content: 'Rough ER: protein synthesis. Smooth ER: lipid synthesis.',
      },
    ],
  ),
]

export const demoNotesState = {
  notes: demoDemoNotes,
  currentNoteId: null,
  isEditing: false,
  undoStack: [],
  redoStack: [],
}
