import React from 'react';
import { Subject } from '../../types/subject';
import styles from './Subject.module.css';

interface SubjectCardProps {
  subject: Subject;
  onClick?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  onClick,
  onDelete,
  onEdit,
}) => {
  return (
    <div
      className={styles.subjectCard}
      style={{ borderLeftColor: subject.accentColor }}
      onClick={onClick}
    >
      <div className={styles.header}>
        <h3>{subject.name}</h3>
        <div className={styles.actions}>
          {onEdit && (
            <button
              className={styles.actionButton}
              onClick={e => {
                e.stopPropagation();
                onEdit();
              }}
              title="Edit subject"
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
              title="Delete subject"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
      {subject.description && <p className={styles.description}>{subject.description}</p>}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.number}>{subject.notesCount}</span>
          <span className={styles.label}>Notes</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.number}>{subject.researchCount}</span>
          <span className={styles.label}>Research</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.number}>{subject.workCount}</span>
          <span className={styles.label}>Work</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.number}>{subject.formulasCount}</span>
          <span className={styles.label}>Formulas</span>
        </div>
      </div>
    </div>
  );
};
