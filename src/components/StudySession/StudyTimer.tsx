import React, { useState, useEffect } from 'react';
import styles from './StudySession.module.css';

interface StudyTimerProps {
  isActive: boolean;
  onEnd?: () => void;
  initialSeconds?: number;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({ isActive, onEnd, initialSeconds = 0 }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const formatTime = (h: number, m: number, s: number) => {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className={styles.studyTimer}>
      <div className={styles.timerDisplay}>{formatTime(hours, minutes, secs)}</div>
      <div className={styles.timerControls}>
        <button
          className={styles.controlButton}
          onClick={() => setIsPaused(!isPaused)}
          disabled={!isActive}
        >
          {isPaused ? '▶️ Resume' : '⏸️ Pause'}
        </button>
        {onEnd && (
          <button className={styles.controlButton} onClick={onEnd}>
            ⏹️ End Session
          </button>
        )}
      </div>
    </div>
  );
};
