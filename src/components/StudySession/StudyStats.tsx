import React from 'react';
import { StudyStatistics } from '../../types/studySession';
import { formatDuration } from '../../utils/date';
import styles from './StudySession.module.css';

interface StudyStatsProps {
  stats: StudyStatistics;
}

export const StudyStats: React.FC<StudyStatsProps> = ({ stats }) => {
  if (stats.totalSessions === 0) {
    return (
      <div className={styles.studyStats}>
        <div className={styles.emptyState}>No study sessions yet. Start your first session!</div>
      </div>
    );
  }

  return (
    <div className={styles.studyStats}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Sessions</div>
          <div className={styles.statValue}>{stats.totalSessions}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Study Time</div>
          <div className={styles.statValue}>{formatDuration(stats.totalDuration)}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Average Session</div>
          <div className={styles.statValue}>{formatDuration(stats.averageSessionDuration)}</div>
        </div>
        {stats.mostStudiedSubject && (
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Most Studied</div>
            <div className={styles.statValue}>{stats.mostStudiedSubject.name}</div>
          </div>
        )}
      </div>

      {stats.subjectBreakdown.length > 0 && (
        <div className={styles.subjectBreakdown}>
          <h3>Study Breakdown by Subject</h3>
          {stats.subjectBreakdown.map(subject => (
            <div key={subject.id} className={styles.breakdownItem}>
              <div className={styles.breakdownName}>
                <strong>{subject.name}</strong>
                <span className={styles.breakdownSessionCount}>{subject.sessions} session{subject.sessions !== 1 ? 's' : ''}</span>
              </div>
              <div className={styles.breakdownDuration}>{formatDuration(subject.duration)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
