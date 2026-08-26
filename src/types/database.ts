// Database types for Supabase tables

export interface Profile {
  id: string
  user_id: string
  display_name?: string
  email?: string
  avatar_path?: string
  education_level?: string
  bio?: string
  created_at?: string
  updated_at?: string
}

export interface UserPreference {
  id: string
  user_id: string
  theme?: 'light' | 'dark' | string
  default_note_color?: string
  default_subject_id?: string | null
  dashboard_preferences?: any
  study_preferences?: any
  created_at?: string
  updated_at?: string
}

export interface Subject {
  id: string
  user_id: string
  name: string
  description?: string
  accent?: string
  created_at?: string
  updated_at?: string
}

export interface Note {
  id: string
  user_id: string
  subject_id?: string | null
  title?: string
  color?: string
  created_at?: string
  updated_at?: string
}

export interface NoteBlock {
  id: string
  note_id: string
  user_id: string
  block_type: 'text' | 'heading' | 'drawing' | 'formula' | 'divider' | string
  content?: any
  position?: number
  created_at?: string
  updated_at?: string
}

export interface Research {
  id: string
  user_id: string
  subject_id?: string | null
  title: string
  description?: string
  content?: any
  created_at?: string
  updated_at?: string
}

export interface Source {
  id: string
  user_id: string
  research_id: string
  title?: string
  url?: string
  publication?: string
  description?: string
  created_at?: string
  updated_at?: string
}

export interface WorkProject {
  id: string
  user_id: string
  subject_id?: string | null
  title: string
  description?: string
  content?: any
  status?: string
  created_at?: string
  updated_at?: string
}

export interface Formula {
  id: string
  user_id: string
  subject_id?: string | null
  name: string
  formula: string
  description?: string
  created_at?: string
  updated_at?: string
}

export interface CalendarEvent {
  id: string
  user_id: string
  subject_id?: string | null
  title: string
  event_type?: string
  date?: string
  time?: string
  description?: string
  created_at?: string
  updated_at?: string
}

export interface Reminder {
  id: string
  user_id: string
  title: string
  description?: string
  due_at?: string
  completed?: boolean
  created_at?: string
  updated_at?: string
}

export interface StudySession {
  id: string
  user_id: string
  subject_id?: string | null
  started_at?: string
  ended_at?: string
  duration?: number
  created_at?: string
}

export interface Favorite {
  id: string
  user_id: string
  item_type: string
  item_id: string
  created_at?: string
}
