// Demo data types for dashboard

export type WorkItemType = 'note' | 'research' | 'assignment' | 'saved'
export type SubjectType = 'math' | 'science' | 'history' | 'literature' | 'other'

export interface WorkItem {
  id: string
  type: WorkItemType
  title: string
  subject: SubjectType
  lastEdited: Date
  icon?: string
  preview?: string
  metadata?: {
    sources?: number
    progress?: number
    status?: string
  }
}

export interface ContinueItem {
  id: string
  title: string
  subject: SubjectType
  lastOpened: Date
  progress: number
  timeSpent?: string
}

export interface DashboardUser {
  name: string
  grade?: string
  avatar?: string
}
