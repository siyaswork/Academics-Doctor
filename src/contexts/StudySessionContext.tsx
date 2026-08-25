import React, { useState, useEffect } from 'react';
import { StudySession, StudyStatistics } from '../types/studySession';
import { storage } from '../utils/storage';
import { generateId } from '../utils/id';

const StudySessionContext = React.createContext<{
  sessions: StudySession[];
  currentSession: StudySession | null;
  startSession: (subjectId: string, subjectName: string) => StudySession;
  endSession: () => void;
  getStatistics: () => StudyStatistics;
  isSessionActive: boolean;
} | null>(null);

export const StudySessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);

  useEffect(() => {
    const saved = storage.get<StudySession[]>('studySessions');
    if (saved) {
      setSessions(saved);
    }
  }, []);

  const startSession = (subjectId: string, subjectName: string): StudySession => {
    const newSession: StudySession = {
      id: generateId(),
      subjectId,
      subjectName,
      startTime: Date.now(),
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setCurrentSession(newSession);
    return newSession;
  };

  const endSession = () => {
    if (!currentSession) return;
    const endTime = Date.now();
    const session: StudySession = {
      ...currentSession,
      endTime,
      duration: endTime - currentSession.startTime,
      isActive: false,
      updatedAt: Date.now(),
    };
    const updated = [...sessions, session];
    storage.set('studySessions', updated);
    setSessions(updated);
    setCurrentSession(null);
  };

  const getStatistics = (): StudyStatistics => {
    const completedSessions = sessions.filter(s => !s.isActive);
    const totalDuration = completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const averageSessionDuration =
      completedSessions.length > 0 ? totalDuration / completedSessions.length : 0;

    const subjectStats = new Map<string, { sessions: number; duration: number }>();
    completedSessions.forEach(s => {
      const current = subjectStats.get(s.subjectId) || { sessions: 0, duration: 0 };
      subjectStats.set(s.subjectId, {
        sessions: current.sessions + 1,
        duration: current.duration + (s.duration || 0),
      });
    });

    let mostStudiedSubject = null;
    let maxSessions = 0;
    subjectStats.forEach((stats, subjectId) => {
      if (stats.sessions > maxSessions) {
        maxSessions = stats.sessions;
        const session = completedSessions.find(s => s.subjectId === subjectId);
        if (session) {
          mostStudiedSubject = {
            id: subjectId,
            name: session.subjectName,
            sessions: stats.sessions,
          };
        }
      }
    });

    return {
      totalSessions: completedSessions.length,
      totalDuration,
      averageSessionDuration,
      mostStudiedSubject,
      subjectBreakdown: Array.from(subjectStats.entries()).map(([subjectId, stats]) => {
        const session = completedSessions.find(s => s.subjectId === subjectId);
        return {
          id: subjectId,
          name: session?.subjectName || 'Unknown',
          sessions: stats.sessions,
          duration: stats.duration,
        };
      }),
      recentSessions: completedSessions.slice(-10),
    };
  };

  return (
    <StudySessionContext.Provider
      value={{
        sessions,
        currentSession,
        startSession,
        endSession,
        getStatistics,
        isSessionActive: currentSession !== null,
      }}
    >
      {children}
    </StudySessionContext.Provider>
  );
};

export const useStudySession = () => {
  const context = React.useContext(StudySessionContext);
  if (!context) {
    throw new Error('useStudySession must be used within StudySessionProvider');
  }
  return context;
};
