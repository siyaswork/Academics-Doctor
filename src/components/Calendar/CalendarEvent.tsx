import React from 'react';
import { CalendarEvent as CalendarEventType } from '../../types/calendar';
import { formatDate, formatTime } from '../../utils/date';
import { EVENT_TYPES } from '../../utils/constants';
import styles from './Calendar.module.css';

interface CalendarEventProps {
  event: CalendarEventType;
  onClick?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

const getEventIcon = (type: string): string => {
  const typeConfig = EVENT_TYPES.find(t => t.value === type);
  return typeConfig?.icon || '📌';
};

export const CalendarEventComponent: React.FC<CalendarEventProps> = ({
  event,
  onClick,
  onDelete,
  onEdit,
}) => {
  return (
    <div className={styles.eventCard} onClick={onClick}>
      <div className={styles.eventHeader}>
        <span className={styles.eventIcon}>{getEventIcon(event.type)}</span>
        <h4>{event.title}</h4>
        <div className={styles.eventActions}>
          {onEdit && (
            <button
              className={styles.actionButton}
              onClick={e => {
                e.stopPropagation();
                onEdit();
              }}
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              className={styles.actionButton}
              onClick={e => {
                e.stopPropagation();
                onDelete();
              }}
            >
              🗑️
            </button>
          )}
        </div>
      </div>
      <div className={styles.eventDetails}>
        <span>{formatDate(event.date)}</span>
        {event.time && <span>{event.time}</span>}
        {event.subjectName && <span className={styles.subject}>{event.subjectName}</span>}
      </div>
      {event.description && <p className={styles.description}>{event.description}</p>}
    </div>
  );
};
