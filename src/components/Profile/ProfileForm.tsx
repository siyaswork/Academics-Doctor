import React, { useState } from 'react';
import { ProfileSettings } from '../../types/profile';
import { EDUCATION_LEVELS } from '../../utils/constants';
import styles from './Profile.module.css';

interface ProfileFormProps {
  initialSettings?: ProfileSettings;
  onSubmit: (settings: ProfileSettings) => void;
  onCancel?: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ initialSettings, onSubmit, onCancel }) => {
  const [displayName, setDisplayName] = useState(initialSettings?.displayName || '');
  const [educationLevel, setEducationLevel] = useState(initialSettings?.educationLevel || '');
  const [description, setDescription] = useState(initialSettings?.description || '');
  const [avatar, setAvatar] = useState(initialSettings?.avatar || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      displayName,
      educationLevel,
      description,
      avatar,
    });
  };

  return (
    <form className={styles.profileForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="displayName">Display Name</label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          placeholder="Your name"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="avatar">Avatar URL</label>
        <input
          id="avatar"
          type="url"
          value={avatar}
          onChange={e => setAvatar(e.target.value)}
          placeholder="https://example.com/avatar.jpg"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="educationLevel">Education Level</label>
        <select value={educationLevel} onChange={e => setEducationLevel(e.target.value)}>
          <option value="">Select education level</option>
          {EDUCATION_LEVELS.map(level => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Tell us about yourself..."
          rows={4}
        />
      </div>

      <div className={styles.formActions}>
        <button type="submit" className={styles.submitButton}>
          Save Changes
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
