import React from 'react';
import { Activity } from '../../types/activity';
import { getRelativeTime } from '../../utils/date';
import styles from './Activity.module.css';

interface ActivityFeedProps {
  activities: Activity[];
  maxItems?: number;
}

const getActivityIcon = (type: string): string => {
  const icons: Record<string, string> = {
    note: '📝',
    research: '🔍',
    work: '📋',
    formula: '∑',
    subject: '📚',
    'study-session': '⏱️',
    calendar: '📅',
  };
  return icons[type] || '•';
};

const getActivityText = (activity: Activity): string => {
  const actions: Record<string, string> = {
    created: 'Created',
    edited: 'Edited',
    deleted: 'Deleted',
    favorited: 'Favorited',
    unfavorited: 'Unfavorited',
  };

  const types: Record<string, string> = {
    note: 'note',
    research: 'research',
    work: 'work',
    formula: 'formula',
    subject: 'subject',
    'study-session': 'study session',
    calendar: 'calendar event',
  };

  return `${actions[activity.action]} ${types[activity.type] || activity.type}`;
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, maxItems = 10 }) => {
  const displayActivities = activities.slice(0, maxItems);

  if (displayActivities.length === 0) {
    return (
      <div className={styles.activityFeed}>
        <div className={styles.emptyState}>
          <p>No recent activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.activityFeed}>
      {displayActivities.map((activity, index) => (
        <div key={activity.id} className={styles.activityItem}>
          <div className={styles.activityIcon}>{getActivityIcon(activity.type)}</div>
          <div className={styles.activityContent}>
            <div className={styles.activityAction}>
              <strong>{getActivityText(activity)}</strong>
              <span className={styles.activityTitle}>{activity.title}</span>
            </div>
            <div className={styles.activityTime}>{getRelativeTime(activity.timestamp)}</div>
          </div>
          {index < displayActivities.length - 1 && <div className={styles.activityDivider} />}
        </div>
      ))}
    </div>
  );
};
