import { useState } from 'react'
import type { Reminder } from '../types/reminders'
import styles from './ReminderList.module.css'

interface ReminderListProps { reminders: Reminder[]; onCreate: (text: string) => void; onToggle: (id: string) => void; onDelete: (id: string) => void }

export const ReminderList = ({ reminders, onCreate, onToggle, onDelete }: ReminderListProps) => {
  const [text, setText] = useState('')
  return <section className={`panel ${styles.wrapper}`}><div className={styles.header}><h3>Reminders</h3><p>Keep quick prompts attached to your work.</p></div><div className={styles.compose}><input value={text} onChange={(event) => setText(event.target.value)} placeholder="Add a reminder" /><button type="button" className="buttonPrimary" onClick={() => { if (!text.trim()) return; onCreate(text.trim()); setText('') }}>Add</button></div><div className={styles.list}>{reminders.length ? reminders.map((reminder) => <label key={reminder.id} className={styles.item}><input type="checkbox" checked={reminder.isCompleted} onChange={() => onToggle(reminder.id)} /><span className={reminder.isCompleted ? styles.completed : ''}>{reminder.text}</span><button type="button" className="buttonGhost" onClick={() => onDelete(reminder.id)}>Remove</button></label>) : <div className="emptyState">No reminders yet.</div>}</div></section>
}
