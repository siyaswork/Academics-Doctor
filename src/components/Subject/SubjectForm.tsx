import React, { useState } from 'react';
import { COLORS } from '../../utils/constants';
import styles from './Subject.module.css';

interface SubjectFormProps {
  initialName?: string;
  initialDescription?: string;
  initialColor?: string;
  onSubmit: (name: string, description: string, color: string) => void;
  onCancel?: () => void;
}

export const SubjectForm: React.FC<SubjectFormProps> = ({
  initialName = '',
  initialDescription = '',
  initialColor = COLORS.subjects[0],
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [color, setColor] = useState(initialColor);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), description.trim(), color);
    }
  };

  return (
    <form className={styles.subjectForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="subjectName">Subject Name</label>
        <input
          id="subjectName"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g., Mathematics"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="subjectDescription">Description (optional)</label>
        <textarea
          id="subjectDescription"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Add a description..."
          rows={3}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Accent Color</label>
        <div className={styles.colorGrid}>
          {COLORS.subjects.map(c => (
            <button
              key={c}
              type="button"
              className={`${styles.colorButton} ${color === c ? styles.selected : ''}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
              title={c}
            />
          ))}
        </div>
      </div>

      <div className={styles.formActions}>
        <button type="submit" className={styles.submitButton}>
          Save Subject
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
