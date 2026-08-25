import React from 'react';
import { useStudySession } from '../../contexts/StudySessionContext';
import { useSubjects } from '../../contexts/SubjectContext';
import { StudyTimer } from '../../components/StudySession/StudyTimer';
import { StudyStats } from '../../components/StudySession/StudyStats';
import styles from './StudyPage.module.css';

export const StudyPage: React.FC = () => {
  const { currentSession, startSession, endSession, getStatistics, isSessionActive } = useStudySession();
  const { subjects } = useSubjects();
  const [selectedSubjectId, setSelectedSubjectId] = React.useState<string>('');
  const stats = getStatistics();

  const handleStartSession = () => {
    if (selectedSubjectId) {
      const subject = subjects.find(s => s.id === selectedSubjectId);
      if (subject) {
        startSession(selectedSubjectId, subject.name);
      }
    }
  };

  return (
    <div className={styles.studyPage}>
      <div className={styles.container}>
        <h1>📚 Study Sessions</h1>

        {isSessionActive && currentSession ? (
          <div className={styles.activeSession}>
            <div className={styles.sessionInfo}>
              <h2>Active Study Session</h2>
              <p className={styles.sessionSubject}>{currentSession.subjectName}</p>
            </div>
            <StudyTimer isActive={true} onEnd={endSession} />
          </div>
        ) : (
          <div className={styles.startSessionCard}>
            <h2>Start a New Study Session</h2>
            <div className={styles.formGroup}>
              <label htmlFor="subject">Select Subject</label>
              <select
                id="subject"
                value={selectedSubjectId}
                onChange={e => setSelectedSubjectId(e.target.value)}
              >
                <option value="">Choose a subject...</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              className={styles.startButton}
              onClick={handleStartSession}
              disabled={!selectedSubjectId}
            >
              ▶️ Start Session
            </button>
          </div>
        )}

        <div className={styles.statisticsSection}>
          <h2>Study Statistics</h2>
          <StudyStats stats={stats} />
        </div>
      </div>
    </div>
  );
};
