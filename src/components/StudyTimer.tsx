import { useEffect, useMemo, useState } from 'react'
import { useAppContext } from '../contexts/AppContext'
import { secondsToClock } from '../utils/date'
import styles from './StudyTimer.module.css'

export const StudyTimer = () => {
  const { activeTimer, subjects, startStudySession, pauseStudySession, resumeStudySession, endStudySession } = useAppContext()
  const [subjectId, setSubjectId] = useState('')
  const [tick, setTick] = useState(Date.now())
  useEffect(() => { if (!activeTimer || activeTimer.isPaused) return; const id = window.setInterval(() => setTick(Date.now()), 1000); return () => window.clearInterval(id) }, [activeTimer])
  const elapsedSeconds = useMemo(() => { if (!activeTimer) return 0; const elapsedMs = activeTimer.elapsedMs + (activeTimer.isPaused ? 0 : tick - activeTimer.startedAt); return Math.floor(elapsedMs / 1000) }, [activeTimer, tick])
  return <section className={`panel ${styles.timer}`}><div><p className={styles.eyebrow}>Study timer</p><h2>{activeTimer ? activeTimer.subjectName ?? 'General focus session' : 'Start a session'}</h2><p className={styles.clock}>{secondsToClock(elapsedSeconds)}</p></div>{!activeTimer ? <div className={styles.controls}><label className="fieldLabel">Subject<select value={subjectId} onChange={(event) => setSubjectId(event.target.value)}><option value="">General study</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select></label><button type="button" className="buttonPrimary" onClick={() => startStudySession(subjectId || undefined)}>▶ Start session</button></div> : <div className={styles.controls}>{activeTimer.isPaused ? <button type="button" className="buttonPrimary" onClick={resumeStudySession}>Resume</button> : <button type="button" className="buttonSecondary" onClick={pauseStudySession}>Pause</button>}<button type="button" className="buttonGhost" onClick={endStudySession}>End session</button></div>}</section>
}
