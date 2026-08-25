import React from 'react';
import { Reminder } from '../../types/reminder';
import { formatDate, formatTime } from '../../utils/date';
import styles from './Reminder.module.css';

interface ReminderListProps {
  reminders: Reminder[];
  onComplete?: (reminderId: string) => void;
  onDelete?: (reminderId: string) => void;
  onEdit?: (reminder: Reminder) => void;
}

const getReminderIcon = (targetType: string): string => {
  const icons: Record<string, string> = {
    note: '📝',
    research: '🔍',
    work: '📋',
    subject: '📚',
    'calendar-event': '📅',
  };
  return icons[targetType] || '🔔';
};

export const ReminderList: React.FC<ReminderListProps> = ({
  reminders,
  onComplete,
  onDelete,
  onEdit,
}) => {
  if (reminders.length === 0) {
    return (
      <div className={styles.reminderList}>
        <div className={styles.emptyState}>No active reminders</div>
      </div>
    );
  }

  return (
    <div className={styles.reminderList}>
      {reminders.map(reminder => (
        <div
          key={reminder.id}
          className={`${styles.reminderItem} ${reminder.isCompleted ? styles.completed : ''}`}
        >
          <div className={styles.reminderContent}>
            <span className={styles.reminderIcon}>{getReminderIcon(reminder.targetType)}</span>
            <div className={styles.reminderDetails}>
              <div className={styles.reminderTitle}>{reminder.targetTitle}</div>
              <div className={styles.reminderMessage}>{reminder.message}</div>
              <div className={styles.reminderDateTime}>
                {formatDate(reminder.date)}
                {reminder.time && ` at ${reminder.time}`}
              </div>
            </div>
          </div>
          <div className={styles.reminderActions}>
            {onComplete && (
              <button
                className={styles.actionButton}
                onClick={() => onComplete(reminder.id)}
                title="Mark as complete"
              >
                ✓
              </button>
            )}
            {onEdit && (
              <button
                className={styles.actionButton}
                onClick={() => onEdit(reminder)}
                title="Edit reminder"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                className={styles.actionButton}
                onClick={() => onDelete(reminder.id)}
                title="Delete reminder"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
