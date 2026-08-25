import React, { useState } from 'react';
import { EventType, CalendarEvent } from '../../types/calendar';
import { EVENT_TYPES } from '../../utils/constants';
import styles from './Calendar.module.css';

interface CalendarEventFormProps {
  subjects: Array<{ id: string; name: string }>;
  onSubmit: (data: {
    title: string;
    type: EventType;
    date: number;
    time?: string;
    subjectId?: string;
    description?: string;
  }) => void;
  onCancel?: () => void;
  initialEvent?: CalendarEvent;
}

export const CalendarEventForm: React.FC<CalendarEventFormProps> = ({
  subjects,
  onSubmit,
  onCancel,
  initialEvent,
}) => {
  const [title, setTitle] = useState(initialEvent?.title || '');
  const [type, setType] = useState<EventType>(initialEvent?.type || 'exam');
  const [date, setDate] = useState(
    initialEvent ? new Date(initialEvent.date).toISOString().split('T')[0] : ''
  );
  const [time, setTime] = useState(initialEvent?.time || '');
  const [subjectId, setSubjectId] = useState(initialEvent?.subjectId || '');
  const [description, setDescription] = useState(initialEvent?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && date) {
      onSubmit({
        title: title.trim(),
        type,
        date: new Date(date).getTime(),
        time,
        subjectId,
        description,
      });
    }
  };

  return (
    <form className={styles.eventForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="title">Event Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g., Mathematics Exam"
          required
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="type">Type</label>
          <select value={type} onChange={e => setType(e.target.value as EventType)}>
            {EVENT_TYPES.map(t => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="time">Time (optional)</label>
          <input
            id="time"
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="subject">Subject (optional)</label>
          <select value={subjectId} onChange={e => setSubjectId(e.target.value)}>
            <option value="">None</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Description (optional)</label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Add details..."
          rows={3}
        />
      </div>

      <div className={styles.formActions}>
        <button type="submit" className={styles.submitButton}>
          {initialEvent ? 'Update Event' : 'Create Event'}
        </button>
        {onCancel && (
          <button type="button" className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
