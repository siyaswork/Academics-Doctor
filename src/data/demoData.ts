import { WorkItem, ContinueItem, DashboardUser } from '../types/dashboard'

// Demo user
export const demoUser: DashboardUser = {
  name: 'Alex',
  grade: '12th Grade',
  avatar: 'A',
}

// Demo continue item
export const demoContinueItem: ContinueItem = {
  id: '1',
  title: 'Calculus Chapter 5 - Integration',
  subject: 'math',
  lastOpened: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  progress: 65,
  timeSpent: '2h 45m',
}

// Demo work items
export const demoWorkItems: WorkItem[] = [
  {
    id: '1',
    type: 'note',
    title: 'Newton\'s Laws of Motion',
    subject: 'science',
    lastEdited: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    icon: '📝',
    preview: 'First law: An object at rest stays at rest...',
    metadata: {
      status: 'In Progress',
    },
  },
  {
    id: '2',
    type: 'research',
    title: 'Climate Change Impact Study',
    subject: 'science',
    lastEdited: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    icon: '🔍',
    preview: '8 sources collected',
    metadata: {
      sources: 8,
    },
  },
  {
    id: '3',
    type: 'assignment',
    title: 'US History Essay - Civil War Era',
    subject: 'history',
    lastEdited: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    icon: '📄',
    preview: 'Draft completed - 2,400 words',
    metadata: {
      progress: 85,
      status: 'Draft',
    },
  },
  {
    id: '4',
    type: 'note',
    title: 'Shakespeare Analysis - Hamlet',
    subject: 'literature',
    lastEdited: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    icon: '📚',
    preview: 'Character development and themes...',
    metadata: {
      status: 'Review',
    },
  },
  {
    id: '5',
    type: 'assignment',
    title: 'Geometry Problem Set 7',
    subject: 'math',
    lastEdited: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    icon: '📐',
    preview: 'Problems 1-15 completed',
    metadata: {
      progress: 60,
      status: 'In Progress',
    },
  },
  {
    id: '6',
    type: 'research',
    title: 'Photography Techniques Compilation',
    subject: 'other',
    lastEdited: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    icon: '📸',
    preview: '5 resources bookmarked',
    metadata: {
      sources: 5,
    },
  },
  {
    id: '7',
    type: 'saved',
    title: 'Formula Reference Sheet',
    subject: 'math',
    lastEdited: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    icon: '📋',
    preview: 'Trigonometric formulas and identities',
  },
  {
    id: '8',
    type: 'note',
    title: 'Biology Vocabulary - Unit 3',
    subject: 'science',
    lastEdited: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    icon: '🔬',
    preview: 'Mitosis, meiosis, cell cycle...',
    metadata: {
      status: 'Complete',
    },
  },
]
