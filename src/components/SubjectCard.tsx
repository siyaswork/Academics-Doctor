import type { Subject } from '../types/subjects'
import styles from './SubjectCard.module.css'

interface SubjectCardProps { subject: Subject; onOpen: (subjectId: string) => void }

export const SubjectCard = ({ subject, onOpen }: SubjectCardProps) => <button type="button" className={styles.card} onClick={() => onOpen(subject.id)}><span className={styles.accent} style={{ background: subject.accent }} aria-hidden="true" /><strong>{subject.name}</strong><p>{subject.description || 'Study resources and linked work.'}</p><div className={styles.meta}><span>{subject.noteIds.length} notes</span><span>{subject.workIds.length} work items</span></div></button>
