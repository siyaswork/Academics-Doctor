export interface Reminder { id: string; text: string; linkedType?: 'note' | 'research' | 'work' | 'subject' | 'event'; linkedId?: string; dueDate?: string; isCompleted: boolean; createdAt: string }
