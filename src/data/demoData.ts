import type { ActivityItem } from '../types/activity'
import type { CalendarEvent } from '../types/calendar'
import type { Formula } from '../types/formulas'
import type { Note, RichTextContent } from '../types/notes'
import type { AppPreferences } from '../types/preferences'
import type { UserProfile } from '../types/profile'
import type { ResearchProject } from '../types/research'
import type { Reminder } from '../types/reminders'
import type { StudySession } from '../types/studySessions'
import type { Subject } from '../types/subjects'
import type { WorkItem } from '../types/work'
import { DEFAULT_PREFERENCES } from '../utils/constants'

const now = new Date()
const toIso = (date: Date) => date.toISOString()
const daysFromNow = (days: number) => {
  const next = new Date(now)
  next.setDate(next.getDate() + days)
  return next
}
const daysAgo = (days: number) => {
  const previous = new Date(now)
  previous.setDate(previous.getDate() - days)
  return previous
}
const paragraph = (content: string): RichTextContent => ({ type: 'paragraph', content })
const heading = (content: string, level = 2): RichTextContent => ({ type: 'heading', content, level })
const bullet = (content: string): RichTextContent => ({ type: 'list', content, listType: 'bullet' })

export const demoSubjects: Subject[] = [
  { id: 'subject-math', name: 'Mathematics', accent: '#4f46e5', description: 'Problem solving, algebra, calculus, and revision drills.', createdAt: toIso(daysAgo(60)), noteIds: [], researchIds: [], workIds: [], formulaIds: [] },
  { id: 'subject-physics', name: 'Physics', accent: '#0ea5e9', description: 'Mechanics, waves, motion, and lab review notes.', createdAt: toIso(daysAgo(50)), noteIds: [], researchIds: [], workIds: [], formulaIds: [] },
  { id: 'subject-history', name: 'History', accent: '#f97316', description: 'Source analysis, essay ideas, and exam timelines.', createdAt: toIso(daysAgo(45)), noteIds: [], researchIds: [], workIds: [], formulaIds: [] },
  { id: 'subject-biology', name: 'Biology', accent: '#22c55e', description: 'Cell systems, photosynthesis, and recall practice.', createdAt: toIso(daysAgo(30)), noteIds: [], researchIds: [], workIds: [], formulaIds: [] },
]

export const demoNotes: Note[] = [
  { id: 'note-derivatives', title: 'Derivative rules cheat sheet', subject: 'math', subjectId: 'subject-math', color: 'blue', content: [heading('Derivative rules', 1), paragraph('Quick reminders for common derivative patterns before the quiz.'), bullet('Power rule: d/dx x^n = nx^(n-1)'), bullet('Product rule: (fg)’ = f’g + fg’'), bullet('Chain rule: (f(g(x)))’ = f’(g(x))g’(x)')], drawings: {}, createdAt: toIso(daysAgo(9)), updatedAt: toIso(daysAgo(1)), tags: ['calculus', 'revision'], hasDrawings: false, isFavorited: true },
  { id: 'note-newton', title: 'Newton’s laws summary', subject: 'science', subjectId: 'subject-physics', color: 'green', content: [heading('Newton’s Laws', 1), paragraph('The three laws of motion help describe why objects change speed or direction.'), bullet('Law 1: inertia keeps objects at rest or moving uniformly.'), bullet('Law 2: force equals mass times acceleration.'), bullet('Law 3: every action has an equal and opposite reaction.')], drawings: {}, createdAt: toIso(daysAgo(8)), updatedAt: toIso(daysAgo(2)), tags: ['mechanics', 'forces'], hasDrawings: true, isFavorited: true },
  { id: 'note-reformation', title: 'Reformation causes and effects', subject: 'history', subjectId: 'subject-history', color: 'orange', content: [heading('Reformation overview', 1), paragraph('Track the political, social, and religious changes around the Reformation.'), bullet('Causes included church corruption and humanist criticism.'), bullet('Spread accelerated because of print culture and political backing.'), bullet('Effects included new churches, conflicts, and social reforms.')], drawings: {}, createdAt: toIso(daysAgo(12)), updatedAt: toIso(daysAgo(5)), tags: ['essay', 'timeline'], hasDrawings: false },
  { id: 'note-photosynthesis', title: 'Photosynthesis process map', subject: 'science', subjectId: 'subject-biology', color: 'yellow', content: [heading('Photosynthesis', 1), paragraph('6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂'), bullet('Light-dependent reactions occur in the thylakoid membrane.'), bullet('The Calvin cycle stores energy in glucose.')], drawings: {}, createdAt: toIso(daysAgo(6)), updatedAt: toIso(daysAgo(3)), tags: ['cells', 'energy'], hasDrawings: true },
  { id: 'note-energy', title: 'Conservation of energy examples', subject: 'science', subjectId: 'subject-physics', color: 'purple', content: [heading('Conservation of energy', 1), paragraph('Potential energy transforms to kinetic energy and back again in many systems.'), bullet('Roller coasters swap gravitational potential and kinetic energy.'), bullet('Energy transfers still conserve total energy when heat and sound are counted.')], drawings: {}, createdAt: toIso(daysAgo(4)), updatedAt: toIso(daysAgo(1)), tags: ['revision', 'examples'], hasDrawings: false, isFavorited: true },
  { id: 'note-cell-cycle', title: 'Cell cycle checkpoints', subject: 'science', subjectId: 'subject-biology', color: 'pink', content: [heading('Cell cycle checkpoints', 1), paragraph('Review G1, G2, and spindle checkpoints before the lab practical.'), bullet('G1 confirms nutrients, size, and DNA integrity.'), bullet('G2 checks whether replication finished correctly.'), bullet('The spindle checkpoint prevents chromosome separation errors.')], drawings: {}, createdAt: toIso(daysAgo(3)), updatedAt: toIso(daysAgo(1)), tags: ['mitosis', 'checkpoints'], hasDrawings: false },
]

export const demoResearch: ResearchProject[] = [
  { id: 'research-renewables', title: 'Renewable storage for city transport', subjectId: 'subject-physics', description: 'Investigate energy storage methods that make electric public transport more reliable.', notes: 'Compare batteries, hydrogen, and supercapacitors. Focus on efficiency, charging speed, and public infrastructure.', sources: [{ id: 'source-renewables-1', title: 'Battery storage for transport systems', publication: 'Energy Review Journal', category: 'article', description: 'Overview of lithium-ion systems and grid support for buses and rail.', addedAt: toIso(daysAgo(15)) }, { id: 'source-renewables-2', title: 'Hydrogen fuel overview', publication: 'Clean Cities Lab', category: 'website', url: 'https://example.com/hydrogen-overview', description: 'Trade-offs between hydrogen storage and battery use for long routes.', addedAt: toIso(daysAgo(10)) }], createdAt: toIso(daysAgo(20)), updatedAt: toIso(daysAgo(2)), tags: ['energy', 'transport'], isFavorited: true },
  { id: 'research-black-death', title: 'Community responses to the Black Death', subjectId: 'subject-history', description: 'Gather evidence about social changes, labor shifts, and local policy responses.', notes: 'Need a stronger comparison between urban and rural responses. Add examples from English towns.', sources: [{ id: 'source-plague-1', title: 'The Black Death in Europe', publication: 'Cambridge Medieval Studies', category: 'book', addedAt: toIso(daysAgo(12)) }, { id: 'source-plague-2', title: 'Labor after plague mortality', publication: 'Historical Economics Review', category: 'paper', description: 'Useful for post-plague wage and labor evidence.', addedAt: toIso(daysAgo(6)) }], createdAt: toIso(daysAgo(16)), updatedAt: toIso(daysAgo(4)), tags: ['essay', 'medieval'] },
  { id: 'research-enzyme', title: 'Enzyme activity and temperature', subjectId: 'subject-biology', description: 'Organize observations for the practical write-up on catalase and temperature.', notes: 'Shape of the graph: increase to optimum, then rapid decline due to denaturation.', sources: [{ id: 'source-enzyme-1', title: 'Catalase practical guide', publication: 'School Lab Manual', category: 'website', url: 'https://example.com/catalase-practical', addedAt: toIso(daysAgo(7)) }, { id: 'source-enzyme-2', title: 'Protein denaturation basics', publication: 'Biology Hub', category: 'article', addedAt: toIso(daysAgo(5)) }], createdAt: toIso(daysAgo(14)), updatedAt: toIso(daysAgo(1)), tags: ['practical', 'enzymes'] },
]

export const demoWork: WorkItem[] = [
  { id: 'work-calculus-sheet', title: 'Complete calculus practice sheet', type: 'assignment', subjectId: 'subject-math', description: 'Finish derivative and tangent line questions 1-12 before Thursday.', status: 'in-progress', createdAt: toIso(daysAgo(5)), updatedAt: toIso(daysAgo(1)), tags: ['homework', 'calculus'], isFavorited: true },
  { id: 'work-lab-summary', title: 'Physics lab summary', type: 'project', subjectId: 'subject-physics', description: 'Summarize the motion sensor experiment and clean up the graph captions.', status: 'draft', createdAt: toIso(daysAgo(7)), updatedAt: toIso(daysAgo(2)), tags: ['lab', 'graphs'] },
  { id: 'work-history-outline', title: 'History essay outline', type: 'research', subjectId: 'subject-history', description: 'Create a thesis and paragraph plan for the Black Death response essay.', status: 'completed', createdAt: toIso(daysAgo(10)), updatedAt: toIso(daysAgo(3)), tags: ['essay', 'plan'] },
  { id: 'work-bio-flashcards', title: 'Biology flashcard refresh', type: 'note', subjectId: 'subject-biology', description: 'Rewrite weak flashcards for enzyme action and membrane transport.', status: 'in-progress', createdAt: toIso(daysAgo(3)), updatedAt: toIso(daysAgo(1)), tags: ['flashcards', 'revision'] },
]

export const demoFormulas: Formula[] = [
  { id: 'formula-quadratic', name: 'Quadratic formula', formula: 'x = (-b ± √(b² - 4ac)) / 2a', subjectId: 'subject-math', description: 'Solve quadratic equations in standard form.', createdAt: toIso(daysAgo(30)), isFavorited: true },
  { id: 'formula-distance', name: 'Distance-speed-time', formula: 'd = vt', subjectId: 'subject-physics', description: 'Distance equals velocity multiplied by time.', createdAt: toIso(daysAgo(22)) },
  { id: 'formula-kinetic', name: 'Kinetic energy', formula: 'KE = 1/2 mv²', subjectId: 'subject-physics', description: 'Energy of a moving object.', createdAt: toIso(daysAgo(18)) },
  { id: 'formula-photosynthesis', name: 'Photosynthesis equation', formula: '6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂', subjectId: 'subject-biology', description: 'Core biological equation for glucose production.', createdAt: toIso(daysAgo(12)) },
  { id: 'formula-density', name: 'Density', formula: 'ρ = m / V', subjectId: 'subject-physics', description: 'Mass divided by volume.', createdAt: toIso(daysAgo(8)), isFavorited: true },
]

export const demoCalendar: CalendarEvent[] = [
  { id: 'event-calc-quiz', title: 'Calculus derivatives quiz', date: toIso(daysFromNow(2)).slice(0, 10), time: '09:00', type: 'exam', subjectId: 'subject-math', description: 'Short in-class quiz on derivative rules and applications.' },
  { id: 'event-history-essay', title: 'History essay draft due', date: toIso(daysFromNow(3)).slice(0, 10), time: '17:00', type: 'assignment', subjectId: 'subject-history', description: 'Upload first draft with sources highlighted.' },
  { id: 'event-bio-study', title: 'Biology revision block', date: toIso(daysFromNow(1)).slice(0, 10), time: '19:30', type: 'study', subjectId: 'subject-biology', description: 'Focus on enzymes and photosynthesis flashcards.' },
  { id: 'event-break', title: 'Personal recharge evening', date: toIso(daysFromNow(5)).slice(0, 10), time: '18:30', type: 'personal', description: 'Take a light evening off after assessment week.' },
]

export const demoReminders: Reminder[] = [
  { id: 'reminder-1', text: 'Review quadratic formula before the quiz.', linkedType: 'note', linkedId: 'note-derivatives', dueDate: toIso(daysFromNow(1)).slice(0, 10), isCompleted: false, createdAt: toIso(daysAgo(1)) },
  { id: 'reminder-2', text: 'Add one more historian quote to the Black Death project.', linkedType: 'research', linkedId: 'research-black-death', dueDate: toIso(daysFromNow(2)).slice(0, 10), isCompleted: false, createdAt: toIso(daysAgo(2)) },
  { id: 'reminder-3', text: 'Submit calculus sheet before class starts.', linkedType: 'work', linkedId: 'work-calculus-sheet', dueDate: toIso(daysFromNow(2)).slice(0, 10), isCompleted: true, createdAt: toIso(daysAgo(5)) },
]

export const demoActivity: ActivityItem[] = [
  { id: 'activity-1', type: 'note_edited', linkedId: 'note-energy', linkedTitle: 'Conservation of energy examples', timestamp: toIso(daysAgo(1)), subjectId: 'subject-physics' },
  { id: 'activity-2', type: 'research_created', linkedId: 'research-enzyme', linkedTitle: 'Enzyme activity and temperature', timestamp: toIso(daysAgo(2)), subjectId: 'subject-biology' },
  { id: 'activity-3', type: 'work_updated', linkedId: 'work-calculus-sheet', linkedTitle: 'Complete calculus practice sheet', timestamp: toIso(daysAgo(1)), subjectId: 'subject-math' },
  { id: 'activity-4', type: 'formula_saved', linkedId: 'formula-density', linkedTitle: 'Density', timestamp: toIso(daysAgo(4)), subjectId: 'subject-physics' },
]

export const demoStudySessions: StudySession[] = [
  { id: 'session-1', subjectId: 'subject-math', subjectName: 'Mathematics', startTime: toIso(daysAgo(2)), endTime: toIso(daysAgo(2)), duration: 3600, date: toIso(daysAgo(2)).slice(0, 10), isCompleted: true },
  { id: 'session-2', subjectId: 'subject-physics', subjectName: 'Physics', startTime: toIso(daysAgo(1)), endTime: toIso(daysAgo(1)), duration: 2700, date: toIso(daysAgo(1)).slice(0, 10), isCompleted: true },
  { id: 'session-3', subjectId: 'subject-biology', subjectName: 'Biology', startTime: toIso(daysAgo(5)), endTime: toIso(daysAgo(5)), duration: 1800, date: toIso(daysAgo(5)).slice(0, 10), isCompleted: true },
]

export const demoProfile: UserProfile = { displayName: 'Alex', school: 'Northview Sixth Form', educationLevel: 'Upper secondary', bio: 'Studying for mixed science and humanities exams with a love of structured notes.', subjects: ['Mathematics', 'Physics', 'History'] }
export const demoPreferences: AppPreferences = DEFAULT_PREFERENCES
export const demoCalcHistory = [{ id: 'calc-1', expression: '12 / 3 + 4', result: '8' }, { id: 'calc-2', expression: 'sqrt(81)', result: '9' }]
