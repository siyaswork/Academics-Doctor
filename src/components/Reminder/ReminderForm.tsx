import React, { useState } from 'react';
import { Reminder, ReminderTarget } from '../../types/reminder';
import { REMINDER_TARGETS } from '../../utils/constants';
import styles from './Reminder.module.css';

interface ReminderFormProps {
  onSubmit: (data: {
    targetType: ReminderTarget;
    targetId: string;
    targetTitle: string;
    message: string;
    date: number;
    time?: string;
  }) => void;
  onCancel?: () => void;
  initialReminder?: Reminder;
}

export const ReminderForm: React.FC<ReminderFormProps> = ({ onSubmit, onCancel, initialReminder }) => {
  const [targetType, setTargetType] = useState<ReminderTarget>(initialReminder?.targetType || 'note');
  const [targetId, setTargetId] = useState(initialReminder?.targetId || '');
  const [targetTitle, setTargetTitle] = useState(initialReminder?.targetTitle || '');
  const [message, setMessage] = useState(initialReminder?.message || '');
  const [date, setDate] = useState(
    initialReminder ? new Date(initialReminder.date).toISOString().split('T')[0] : ''
  );
  const [time, setTime] = useState(initialReminder?.time || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && targetId.trim() && date) {
      onSubmit({
        targetType,
        targetId: targetId.trim(),
        targetTitle: targetTitle.trim(),
        message: message.trim(),
        date: new Date(date).getTime(),
        time,
      });
    }
  };

  return (
    <form className={styles.reminderForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="targetType">Reminder Type</label>
        <select value={targetType} onChange={e => setTargetType(e.target.value as ReminderTarget)}>
          {REMINDER_TARGETS.map(t => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="targetTitle">Item Title</label>
        <input
          id="targetTitle"
          type="text"
          value={targetTitle}
          onChange={e => setTargetTitle(e.target.value)}
          placeholder="What are you reminding yourself about?"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="message">Reminder Message</label>
        <textarea
          id="message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Add your reminder text..."
          rows={3}
          required
        />
      </div>

      <div className={styles.formRow}>
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

        <div className={styles.formGroup}>
          <label htmlFor="time">Time (optional)</label>
          <input
            id="time"
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.formActions}>
        <button type="submit" className={styles.submitButton}>
          {initialReminder ? 'Update Reminder' : 'Create Reminder'}
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
