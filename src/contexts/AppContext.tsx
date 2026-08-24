import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { demoActivity, demoCalcHistory, demoCalendar, demoFormulas, demoNotes, demoPreferences, demoProfile, demoReminders, demoResearch, demoStudySessions, demoSubjects, demoWork } from '../data/demoData'
import type { ActivityItem } from '../types/activity'
import type { CalendarEvent } from '../types/calendar'
import type { Formula } from '../types/formulas'
import type { Note } from '../types/notes'
import type { AppPreferences } from '../types/preferences'
import type { UserProfile } from '../types/profile'
import type { ResearchProject, ResearchSource } from '../types/research'
import type { Reminder } from '../types/reminders'
import type { StudySession } from '../types/studySessions'
import type { Subject } from '../types/subjects'
import type { WorkItem } from '../types/work'
import { DEFAULT_PREFERENCES, STORAGE_KEYS, type SectionId } from '../utils/constants'
import { createId } from '../utils/ids'
import { clearStorageKeys, readStorage, writeStorage } from '../utils/storage'

interface CalculationHistoryItem { id: string; expression: string; result: string }
interface ActiveTimerState { sessionId: string; startedAt: number; elapsedMs: number; isPaused: boolean; subjectId?: string; subjectName?: string }
interface AppContextValue {
  activeSection: SectionId
  selectedSubjectId?: string
  selectedNoteId?: string
  selectedResearchId?: string
  selectedWorkId?: string
  selectedFormulaId?: string
  searchOpen: boolean
  commandMenuOpen: boolean
  notes: Note[]
  subjects: Subject[]
  research: ResearchProject[]
  work: WorkItem[]
  formulas: Formula[]
  calendarEvents: CalendarEvent[]
  reminders: Reminder[]
  activity: ActivityItem[]
  studySessions: StudySession[]
  profile: UserProfile
  preferences: AppPreferences
  tags: string[]
  calcHistory: CalculationHistoryItem[]
  activeTimer: ActiveTimerState | null
  navigate: (section: SectionId) => void
  openSubject: (subjectId: string) => void
  openSearch: () => void
  closeSearch: () => void
  openCommandMenu: () => void
  closeCommandMenu: () => void
  setSelectedNote: (noteId?: string) => void
  setSelectedResearch: (researchId?: string) => void
  setSelectedWork: (workId?: string) => void
  setSelectedFormula: (formulaId?: string) => void
  createNote: (partial?: Partial<Note>) => Note
  saveNote: (note: Note) => void
  deleteNote: (noteId: string) => void
  toggleNoteFavorite: (noteId: string) => void
  createResearch: (partial?: Partial<ResearchProject>) => ResearchProject
  saveResearch: (project: ResearchProject) => void
  deleteResearch: (researchId: string) => void
  toggleResearchFavorite: (researchId: string) => void
  addResearchSource: (researchId: string, source: Omit<ResearchSource, 'id' | 'addedAt'>) => void
  createWorkItem: (partial?: Partial<WorkItem>) => WorkItem
  saveWorkItem: (item: WorkItem) => void
  deleteWorkItem: (workId: string) => void
  toggleWorkFavorite: (workId: string) => void
  createSubject: (partial?: Partial<Subject>) => Subject
  saveSubject: (subject: Subject) => void
  createFormula: (partial?: Partial<Formula>) => Formula
  saveFormula: (formula: Formula) => void
  deleteFormula: (formulaId: string) => void
  toggleFormulaFavorite: (formulaId: string) => void
  createEvent: (partial?: Partial<CalendarEvent>) => CalendarEvent
  saveEvent: (event: CalendarEvent) => void
  deleteEvent: (eventId: string) => void
  createReminder: (partial?: Partial<Reminder>) => Reminder
  toggleReminder: (reminderId: string) => void
  deleteReminder: (reminderId: string) => void
  updateProfile: (updates: Partial<UserProfile>) => void
  updatePreferences: (updates: Partial<AppPreferences>) => void
  addCalculationHistory: (expression: string, result: string) => void
  startStudySession: (subjectId?: string) => void
  pauseStudySession: () => void
  resumeStudySession: () => void
  endStudySession: () => void
  resetAllData: () => void
}

const AppContext = createContext<AppContextValue | undefined>(undefined)
const normalizeNote = (note: Note): Note => ({ ...note, drawings: note.drawings ?? {}, content: Array.isArray(note.content) ? note.content : [], tags: note.tags ?? [], reminders: note.reminders ?? [], createdAt: note.createdAt ?? new Date().toISOString(), updatedAt: note.updatedAt ?? new Date().toISOString(), hasDrawings: Boolean(note.hasDrawings) })
const rebuildSubjects = (baseSubjects: Subject[], notes: Note[], research: ResearchProject[], work: WorkItem[], formulas: Formula[]) => baseSubjects.map((subject) => ({ ...subject, noteIds: notes.filter((item) => item.subjectId === subject.id).map((item) => item.id), researchIds: research.filter((item) => item.subjectId === subject.id).map((item) => item.id), workIds: work.filter((item) => item.subjectId === subject.id).map((item) => item.id), formulaIds: formulas.filter((item) => item.subjectId === subject.id).map((item) => item.id) }))
const sortByUpdated = <T extends { updatedAt?: string; createdAt?: string }>(items: T[]) => [...items].sort((a, b) => new Date(b.updatedAt ?? b.createdAt ?? 0).getTime() - new Date(a.updatedAt ?? a.createdAt ?? 0).getTime())
const mergePreferences = (value: Partial<AppPreferences> | null | undefined): AppPreferences => ({ ...DEFAULT_PREFERENCES, ...value, dashboardSections: { ...DEFAULT_PREFERENCES.dashboardSections, ...(value?.dashboardSections ?? {}) } })

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeSection, setActiveSection] = useState<SectionId>('dashboard')
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | undefined>()
  const [selectedNoteId, setSelectedNoteId] = useState<string | undefined>()
  const [selectedResearchId, setSelectedResearchId] = useState<string | undefined>()
  const [selectedWorkId, setSelectedWorkId] = useState<string | undefined>()
  const [selectedFormulaId, setSelectedFormulaId] = useState<string | undefined>()
  const [searchOpen, setSearchOpen] = useState(false)
  const [commandMenuOpen, setCommandMenuOpen] = useState(false)
  const [baseSubjects, setBaseSubjects] = useState<Subject[]>(() => readStorage(STORAGE_KEYS.subjects, demoSubjects))
  const [notes, setNotes] = useState<Note[]>(() => readStorage<Note[]>(STORAGE_KEYS.notes, demoNotes).map(normalizeNote))
  const [research, setResearch] = useState<ResearchProject[]>(() => readStorage(STORAGE_KEYS.research, demoResearch))
  const [work, setWork] = useState<WorkItem[]>(() => readStorage(STORAGE_KEYS.work, demoWork))
  const [formulas, setFormulas] = useState<Formula[]>(() => readStorage(STORAGE_KEYS.formulas, demoFormulas))
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => readStorage(STORAGE_KEYS.calendar, demoCalendar))
  const [reminders, setReminders] = useState<Reminder[]>(() => readStorage(STORAGE_KEYS.reminders, demoReminders))
  const [activity, setActivity] = useState<ActivityItem[]>(() => readStorage(STORAGE_KEYS.activity, demoActivity))
  const [studySessions, setStudySessions] = useState<StudySession[]>(() => readStorage(STORAGE_KEYS.studySessions, demoStudySessions))
  const [profile, setProfile] = useState<UserProfile>(() => readStorage(STORAGE_KEYS.profile, demoProfile))
  const [preferences, setPreferences] = useState<AppPreferences>(() => mergePreferences(readStorage<Partial<AppPreferences>>(STORAGE_KEYS.preferences, demoPreferences)))
  const [calcHistory, setCalcHistory] = useState<CalculationHistoryItem[]>(() => readStorage(STORAGE_KEYS.calcHistory, demoCalcHistory))
  const [activeTimer, setActiveTimer] = useState<ActiveTimerState | null>(null)

  const subjects = useMemo(() => rebuildSubjects(baseSubjects, notes, research, work, formulas), [baseSubjects, notes, research, work, formulas])
  const tags = useMemo(() => {
    const next = new Set<string>()
    notes.forEach((item) => item.tags?.forEach((tag) => next.add(tag)))
    research.forEach((item) => item.tags.forEach((tag) => next.add(tag)))
    work.forEach((item) => item.tags.forEach((tag) => next.add(tag)))
    return [...next].sort((a, b) => a.localeCompare(b))
  }, [notes, research, work])

  useEffect(() => writeStorage(STORAGE_KEYS.notes, notes), [notes])
  useEffect(() => writeStorage(STORAGE_KEYS.subjects, subjects), [subjects])
  useEffect(() => writeStorage(STORAGE_KEYS.research, research), [research])
  useEffect(() => writeStorage(STORAGE_KEYS.work, work), [work])
  useEffect(() => writeStorage(STORAGE_KEYS.formulas, formulas), [formulas])
  useEffect(() => writeStorage(STORAGE_KEYS.calendar, calendarEvents), [calendarEvents])
  useEffect(() => writeStorage(STORAGE_KEYS.reminders, reminders), [reminders])
  useEffect(() => writeStorage(STORAGE_KEYS.activity, activity.slice(0, 100)), [activity])
  useEffect(() => writeStorage(STORAGE_KEYS.studySessions, studySessions), [studySessions])
  useEffect(() => writeStorage(STORAGE_KEYS.profile, profile), [profile])
  useEffect(() => writeStorage(STORAGE_KEYS.preferences, preferences), [preferences])
  useEffect(() => writeStorage(STORAGE_KEYS.tags, tags), [tags])
  useEffect(() => writeStorage(STORAGE_KEYS.calcHistory, calcHistory.slice(0, 25)), [calcHistory])

  useEffect(() => {
    const root = document.documentElement
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const applyTheme = () => {
      const resolved = preferences.theme === 'system' ? (media.matches ? 'dark' : 'light') : preferences.theme
      root.setAttribute('data-theme', resolved)
    }
    applyTheme()
    media.addEventListener('change', applyTheme)
    return () => media.removeEventListener('change', applyTheme)
  }, [preferences.theme])

  const pushActivity = (entry: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    setActivity((previous) => [{ ...entry, id: createId('activity'), timestamp: new Date().toISOString() }, ...previous].slice(0, 100))
  }
  const navigate = (section: SectionId) => { setActiveSection(section); setSearchOpen(false); setCommandMenuOpen(false) }
  const openSubject = (subjectId: string) => { setSelectedSubjectId(subjectId); setActiveSection('subject-detail') }

  const createNote = (partial?: Partial<Note>) => {
    const note: Note = normalizeNote({ id: createId('note'), title: partial?.title ?? 'Untitled note', subject: partial?.subject ?? 'other', subjectId: partial?.subjectId, color: (partial?.color as Note['color']) ?? ((preferences.defaultNoteColor as Note['color']) || 'blue'), content: partial?.content ?? [{ type: 'paragraph', content: '' }], drawings: partial?.drawings ?? {}, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: partial?.tags ?? [], hasDrawings: Boolean(partial?.hasDrawings), isFavorited: partial?.isFavorited, reminders: partial?.reminders ?? [] })
    setNotes((previous) => sortByUpdated([note, ...previous]))
    setSelectedNoteId(note.id)
    setActiveSection('notes')
    pushActivity({ type: 'note_created', linkedId: note.id, linkedTitle: note.title, subjectId: note.subjectId })
    return note
  }
  const saveNote = (note: Note) => { const updated = normalizeNote({ ...note, updatedAt: new Date().toISOString() }); setNotes((previous) => sortByUpdated(previous.map((item) => (item.id === note.id ? updated : item)))); pushActivity({ type: 'note_edited', linkedId: note.id, linkedTitle: updated.title, subjectId: updated.subjectId }) }
  const deleteNote = (noteId: string) => { setNotes((previous) => previous.filter((item) => item.id !== noteId)); setSelectedNoteId((current) => (current === noteId ? undefined : current)) }
  const toggleNoteFavorite = (noteId: string) => setNotes((previous) => previous.map((item) => (item.id === noteId ? { ...item, isFavorited: !item.isFavorited } : item)))

  const createResearch = (partial?: Partial<ResearchProject>) => {
    const project: ResearchProject = { id: createId('research'), title: partial?.title ?? 'New research project', subjectId: partial?.subjectId, description: partial?.description ?? '', notes: partial?.notes ?? '', sources: partial?.sources ?? [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: partial?.tags ?? [], isFavorited: partial?.isFavorited }
    setResearch((previous) => sortByUpdated([project, ...previous]))
    setSelectedResearchId(project.id)
    setActiveSection('research')
    pushActivity({ type: 'research_created', linkedId: project.id, linkedTitle: project.title, subjectId: project.subjectId })
    return project
  }
  const saveResearch = (project: ResearchProject) => { const updated = { ...project, updatedAt: new Date().toISOString() }; setResearch((previous) => sortByUpdated(previous.map((item) => (item.id === project.id ? updated : item)))); pushActivity({ type: 'research_edited', linkedId: updated.id, linkedTitle: updated.title, subjectId: updated.subjectId }) }
  const deleteResearch = (researchId: string) => { setResearch((previous) => previous.filter((item) => item.id !== researchId)); setSelectedResearchId((current) => (current === researchId ? undefined : current)) }
  const toggleResearchFavorite = (researchId: string) => setResearch((previous) => previous.map((item) => (item.id === researchId ? { ...item, isFavorited: !item.isFavorited } : item)))
  const addResearchSource = (researchId: string, source: Omit<ResearchSource, 'id' | 'addedAt'>) => {
    setResearch((previous) => sortByUpdated(previous.map((item) => item.id === researchId ? { ...item, updatedAt: new Date().toISOString(), sources: [...item.sources, { ...source, id: createId('source'), addedAt: new Date().toISOString() }] } : item)))
    const project = research.find((item) => item.id === researchId)
    if (project) pushActivity({ type: 'source_added', linkedId: researchId, linkedTitle: project.title, subjectId: project.subjectId })
  }

  const createWorkItem = (partial?: Partial<WorkItem>) => {
    const item: WorkItem = { id: createId('work'), title: partial?.title ?? 'New work item', type: partial?.type ?? 'assignment', subjectId: partial?.subjectId, description: partial?.description ?? '', status: partial?.status ?? 'draft', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: partial?.tags ?? [], isFavorited: partial?.isFavorited }
    setWork((previous) => sortByUpdated([item, ...previous]))
    setSelectedWorkId(item.id)
    setActiveSection('work')
    pushActivity({ type: 'work_updated', linkedId: item.id, linkedTitle: item.title, subjectId: item.subjectId })
    return item
  }
  const saveWorkItem = (item: WorkItem) => { const updated = { ...item, updatedAt: new Date().toISOString() }; setWork((previous) => sortByUpdated(previous.map((entry) => (entry.id === item.id ? updated : entry)))); pushActivity({ type: 'work_updated', linkedId: updated.id, linkedTitle: updated.title, subjectId: updated.subjectId }) }
  const deleteWorkItem = (workId: string) => { setWork((previous) => previous.filter((item) => item.id !== workId)); setSelectedWorkId((current) => (current === workId ? undefined : current)) }
  const toggleWorkFavorite = (workId: string) => setWork((previous) => previous.map((item) => (item.id === workId ? { ...item, isFavorited: !item.isFavorited } : item)))

  const createSubject = (partial?: Partial<Subject>) => { const subject: Subject = { id: createId('subject'), name: partial?.name ?? 'New subject', accent: partial?.accent ?? '#4f46e5', description: partial?.description ?? '', createdAt: new Date().toISOString(), noteIds: [], researchIds: [], workIds: [], formulaIds: [] }; setBaseSubjects((previous) => [subject, ...previous]); pushActivity({ type: 'subject_created', linkedId: subject.id, linkedTitle: subject.name, subjectId: subject.id }); openSubject(subject.id); return subject }
  const saveSubject = (subject: Subject) => setBaseSubjects((previous) => previous.map((item) => (item.id === subject.id ? { ...item, ...subject } : item)))

  const createFormula = (partial?: Partial<Formula>) => {
    const formula: Formula = { id: createId('formula'), name: partial?.name ?? 'New formula', formula: partial?.formula ?? '', subjectId: partial?.subjectId, description: partial?.description ?? '', createdAt: new Date().toISOString(), isFavorited: partial?.isFavorited }
    setFormulas((previous) => [formula, ...previous])
    setSelectedFormulaId(formula.id)
    setActiveSection('formulas')
    pushActivity({ type: 'formula_saved', linkedId: formula.id, linkedTitle: formula.name, subjectId: formula.subjectId })
    return formula
  }
  const saveFormula = (formula: Formula) => { setFormulas((previous) => previous.map((item) => (item.id === formula.id ? formula : item))); pushActivity({ type: 'formula_saved', linkedId: formula.id, linkedTitle: formula.name, subjectId: formula.subjectId }) }
  const deleteFormula = (formulaId: string) => { setFormulas((previous) => previous.filter((item) => item.id !== formulaId)); setSelectedFormulaId((current) => (current === formulaId ? undefined : current)) }
  const toggleFormulaFavorite = (formulaId: string) => setFormulas((previous) => previous.map((item) => (item.id === formulaId ? { ...item, isFavorited: !item.isFavorited } : item)))

  const createEvent = (partial?: Partial<CalendarEvent>) => {
    const event: CalendarEvent = { id: createId('event'), title: partial?.title ?? 'New event', date: partial?.date ?? new Date().toISOString().slice(0, 10), time: partial?.time, type: partial?.type ?? 'study', subjectId: partial?.subjectId, description: partial?.description, reminderId: partial?.reminderId }
    setCalendarEvents((previous) => [...previous, event].sort((a, b) => `${a.date}${a.time ?? ''}`.localeCompare(`${b.date}${b.time ?? ''}`)))
    pushActivity({ type: 'event_created', linkedId: event.id, linkedTitle: event.title, subjectId: event.subjectId })
    return event
  }
  const saveEvent = (event: CalendarEvent) => setCalendarEvents((previous) => previous.map((item) => (item.id === event.id ? event : item)).sort((a, b) => `${a.date}${a.time ?? ''}`.localeCompare(`${b.date}${b.time ?? ''}`)))
  const deleteEvent = (eventId: string) => setCalendarEvents((previous) => previous.filter((item) => item.id !== eventId))

  const createReminder = (partial?: Partial<Reminder>) => {
    const reminder: Reminder = { id: createId('reminder'), text: partial?.text ?? 'New reminder', linkedType: partial?.linkedType, linkedId: partial?.linkedId, dueDate: partial?.dueDate, isCompleted: false, createdAt: new Date().toISOString() }
    setReminders((previous) => [reminder, ...previous])
    if (partial?.linkedType === 'note' && partial.linkedId) setNotes((previous) => previous.map((item) => (item.id === partial.linkedId ? { ...item, reminders: [...(item.reminders ?? []), reminder.id] } : item)))
    return reminder
  }
  const toggleReminder = (reminderId: string) => setReminders((previous) => previous.map((item) => (item.id === reminderId ? { ...item, isCompleted: !item.isCompleted } : item)))
  const deleteReminder = (reminderId: string) => { setReminders((previous) => previous.filter((item) => item.id !== reminderId)); setNotes((previous) => previous.map((item) => ({ ...item, reminders: (item.reminders ?? []).filter((entry) => entry !== reminderId) }))) }
  const updateProfile = (updates: Partial<UserProfile>) => setProfile((current) => ({ ...current, ...updates }))
  const updatePreferences = (updates: Partial<AppPreferences>) => setPreferences((current) => mergePreferences({ ...current, ...updates }))
  const addCalculationHistory = (expression: string, result: string) => setCalcHistory((previous) => [{ id: createId('calc'), expression, result }, ...previous].slice(0, 25))
  const startStudySession = (subjectId?: string) => { const subjectName = subjects.find((item) => item.id === subjectId)?.name; setActiveTimer({ sessionId: createId('session'), startedAt: Date.now(), elapsedMs: 0, isPaused: false, subjectId, subjectName }); setActiveSection('study-sessions') }
  const pauseStudySession = () => setActiveTimer((current) => (!current || current.isPaused ? current : { ...current, elapsedMs: current.elapsedMs + (Date.now() - current.startedAt), isPaused: true }))
  const resumeStudySession = () => setActiveTimer((current) => (!current || !current.isPaused ? current : { ...current, startedAt: Date.now(), isPaused: false }))
  const endStudySession = () => setActiveTimer((current) => {
    if (!current) return current
    const totalMs = current.elapsedMs + (current.isPaused ? 0 : Date.now() - current.startedAt)
    const startedAt = new Date(Date.now() - totalMs)
    const completed: StudySession = { id: current.sessionId, subjectId: current.subjectId, subjectName: current.subjectName, startTime: startedAt.toISOString(), endTime: new Date().toISOString(), duration: Math.max(1, Math.round(totalMs / 1000)), date: new Date().toISOString().slice(0, 10), isCompleted: true }
    setStudySessions((previous) => [completed, ...previous])
    pushActivity({ type: 'study_session_completed', linkedId: completed.id, linkedTitle: completed.subjectName ?? 'General study session', subjectId: completed.subjectId })
    return null
  })
  const resetAllData = () => { clearStorageKeys(Object.values(STORAGE_KEYS)); window.location.reload() }

  const value: AppContextValue = { activeSection, selectedSubjectId, selectedNoteId, selectedResearchId, selectedWorkId, selectedFormulaId, searchOpen, commandMenuOpen, notes, subjects, research, work, formulas, calendarEvents, reminders, activity, studySessions, profile, preferences, tags, calcHistory, activeTimer, navigate, openSubject, openSearch: () => setSearchOpen(true), closeSearch: () => setSearchOpen(false), openCommandMenu: () => setCommandMenuOpen(true), closeCommandMenu: () => setCommandMenuOpen(false), setSelectedNote: setSelectedNoteId, setSelectedResearch: setSelectedResearchId, setSelectedWork: setSelectedWorkId, setSelectedFormula: setSelectedFormulaId, createNote, saveNote, deleteNote, toggleNoteFavorite, createResearch, saveResearch, deleteResearch, toggleResearchFavorite, addResearchSource, createWorkItem, saveWorkItem, deleteWorkItem, toggleWorkFavorite, createSubject, saveSubject, createFormula, saveFormula, deleteFormula, toggleFormulaFavorite, createEvent, saveEvent, deleteEvent, createReminder, toggleReminder, deleteReminder, updateProfile, updatePreferences, addCalculationHistory, startStudySession, pauseStudySession, resumeStudySession, endStudySession, resetAllData }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used within AppProvider')
  return context
}
