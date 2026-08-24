import type { AppPreferences } from '../types/preferences'

export type SectionId = 'dashboard' | 'notes' | 'research' | 'work' | 'subjects' | 'subject-detail' | 'formulas' | 'calculator' | 'study-sessions' | 'calendar' | 'favorites' | 'settings'

export const STORAGE_KEYS = {
  notes: 'academics_notes',
  subjects: 'academics_subjects',
  research: 'academics_research',
  work: 'academics_work',
  formulas: 'academics_formulas',
  calendar: 'academics_calendar',
  reminders: 'academics_reminders',
  activity: 'academics_activity',
  studySessions: 'academics_study_sessions',
  profile: 'academics_profile',
  preferences: 'academics_preferences',
  tags: 'academics_tags',
  calcHistory: 'academics_calc_history',
} as const

export const NAV_ITEMS: Array<{ id: SectionId; label: string; icon: string }> = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'notes', label: 'My Notes', icon: '🗒️' },
  { id: 'research', label: 'Research', icon: '🔎' },
  { id: 'work', label: 'My Work', icon: '✅' },
  { id: 'subjects', label: 'Subjects', icon: '📚' },
  { id: 'formulas', label: 'Formulas', icon: '∑' },
  { id: 'calculator', label: 'Calculator', icon: '🧮' },
  { id: 'study-sessions', label: 'Study Sessions', icon: '⏱️' },
  { id: 'calendar', label: 'Calendar', icon: '🗓️' },
  { id: 'favorites', label: 'Favorites', icon: '⭐' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

export const MOBILE_NAV_ITEMS = NAV_ITEMS.slice(0, 5)

export const DEFAULT_PREFERENCES: AppPreferences = {
  theme: 'system',
  reducedMotion: false,
  defaultNoteColor: 'blue',
  defaultDrawingColor: '#1f2937',
  defaultStudyDuration: 45,
  dashboardSections: {
    greeting: true,
    continuePlaying: true,
    upcoming: true,
    recentWork: true,
    subjects: true,
    studyActivity: true,
    favorites: true,
  },
}
