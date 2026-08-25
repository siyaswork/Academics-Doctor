import React, { useState, useEffect } from 'react';
import { useProfile } from '../../contexts/ProfileContext';
import { useSubjects } from '../../contexts/SubjectContext';
import { useActivity } from '../../contexts/ActivityContext';
import { useStudySession } from '../../contexts/StudySessionContext';
import { useCalendar } from '../../contexts/CalendarContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { ActivityFeed } from '../../components/Activity/ActivityFeed';
import { FavoriteList } from '../../components/Favorites/FavoriteList';
import { usePreferences } from '../../contexts/PreferencesContext';
import styles from './DashboardPage.module.css';

export const DashboardPage: React.FC = () => {
  const { profile } = useProfile();
  const { subjects } = useSubjects();
  const { getRecentActivities } = useActivity();
  const { getStatistics, isSessionActive } = useStudySession();
  const { getUpcomingEvents } = useCalendar();
  const { getFavorites } = useFavorites();
  const { preferences } = usePreferences();

  const recentActivities = getRecentActivities(5);
  const studyStats = getStatistics();
  const upcomingEvents = getUpcomingEvents(5);
  const favorites = getFavorites();

  const hiddenSections = preferences.workspace.hiddenDashboardSections;
  const shouldShow = (section: string) => !hiddenSections.includes(section);

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.container}>
        {/* Greeting */}
        {shouldShow('greeting') && (
          <div className={styles.greetingSection}>
            <h1>Welcome back, {profile?.displayName || 'Student'}! 👋</h1>
            <p>Let's make today a productive day</p>
          </div>
        )}

        {/* Study Status */}
        {isSessionActive && (
          <div className={styles.activeSessionBanner}>
            <span className={styles.pulseIcon}>📚</span>
            <span>Study session active! Keep going!</span>
          </div>
        )}

        {/* Upcoming Events */}
        {shouldShow('upcoming') && upcomingEvents.length > 0 && (
          <div className={styles.section}>
            <h2>Upcoming Events</h2>
            <div className={styles.upcomingList}>
              {upcomingEvents.map(({ event, displayDate }) => (
                <div key={event.id} className={styles.upcomingItem}>
                  <div className={styles.upcomingContent}>
                    <h4>{event.title}</h4>
                    <p>{event.subjectName || 'No subject'}</p>
                  </div>
                  <div className={styles.upcomingDate}>{displayDate}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Study Statistics */}
        {shouldShow('study-activity') && studyStats.totalSessions > 0 && (
          <div className={styles.section}>
            <h2>Study Activity</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Sessions</div>
                <div className={styles.statValue}>{studyStats.totalSessions}</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Most Studied</div>
                <div className={styles.statValue}>
                  {studyStats.mostStudiedSubject?.name || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subjects Overview */}
        {shouldShow('subjects') && subjects.length > 0 && (
          <div className={styles.section}>
            <h2>Your Subjects</h2>
            <div className={styles.subjectsGrid}>
              {subjects.slice(0, 4).map(subject => (
                <div key={subject.id} className={styles.subjectPreview}>
                  <div
                    className={styles.subjectColor}
                    style={{ backgroundColor: subject.accentColor }}
                  />
                  <h4>{subject.name}</h4>
                  <p className={styles.subjectStats}>
                    {subject.notesCount + subject.researchCount + subject.workCount + subject.formulasCount} items
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Favorites */}
        {shouldShow('favorites') && preferences.workspace.favoritesSectionEnabled && favorites.length > 0 && (
          <div className={styles.section}>
            <h2>Favorites</h2>
            <FavoriteList favorites={favorites.slice(0, 5)} />
          </div>
        )}

        {/* Recent Activity */}
        {shouldShow('continue-studying') && recentActivities.length > 0 && (
          <div className={styles.section}>
            <h2>Recent Activity</h2>
            <ActivityFeed activities={recentActivities} maxItems={5} />
          </div>
        )}
      </div>
    </div>
  );
};
