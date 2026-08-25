import React, { useState } from 'react';
import { useReminders } from '../../contexts/ReminderContext';
import { ReminderForm } from '../../components/Reminder/ReminderForm';
import { ReminderList } from '../../components/Reminder/ReminderList';
import styles from './RemindersPage.module.css';

export const RemindersPage: React.FC = () => {
  const { reminders, addReminder, deleteReminder, completeReminder } = useReminders();
  const [isCreating, setIsCreating] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');

  const filteredReminders = reminders.filter(r => {
    if (filter === 'active') return r.isActive && !r.isCompleted;
    if (filter === 'completed') return r.isCompleted;
    return true;
  });

  const handleAddReminder = (data: any) => {
    addReminder({
      targetType: data.targetType,
      targetId: data.targetId,
      targetTitle: data.targetTitle,
      message: data.message,
      date: data.date,
      time: data.time,
      isCompleted: false,
      isActive: true,
    });
    setIsCreating(false);
  };

  return (
    <div className={styles.remindersPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>🔔 Reminders</h1>
          <button
            className={styles.createButton}
            onClick={() => setIsCreating(true)}
            disabled={isCreating}
          >
            + New Reminder
          </button>
        </div>

        {isCreating && (
          <div className={styles.formSection}>
            <ReminderForm
              onSubmit={handleAddReminder}
              onCancel={() => setIsCreating(false)}
            />
          </div>
        )}

        <div className={styles.filterTabs}>
          <button
            className={`${styles.tab} ${filter === 'active' ? styles.active : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`${styles.tab} ${filter === 'completed' ? styles.active : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button
            className={`${styles.tab} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
        </div>

        <ReminderList
          reminders={filteredReminders}
          onComplete={completeReminder}
          onDelete={deleteReminder}
        />
      </div>
    </div>
  );
};
