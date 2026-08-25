import React from 'react';
import { StudentProfile } from '../../types/profile';
import styles from './Profile.module.css';

interface ProfileCardProps {
  profile: StudentProfile;
  onEdit?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onEdit }) => {
  return (
    <div className={styles.profileCard}>
      <div className={styles.avatar}>
        {profile.avatar ? (
          <img src={profile.avatar} alt={profile.displayName} />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {profile.displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className={styles.info}>
        <h2>{profile.displayName}</h2>
        {profile.educationLevel && <p className={styles.educationLevel}>{profile.educationLevel}</p>}
        {profile.description && <p className={styles.description}>{profile.description}</p>}
        {profile.preferredSubjects.length > 0 && (
          <div className={styles.subjects}>
            {profile.preferredSubjects.map(subject => (
              <span key={subject} className={styles.subjectTag}>
                {subject}
              </span>
            ))}
          </div>
        )}
      </div>
      {onEdit && (
        <button className={styles.editButton} onClick={onEdit}>
          Edit Profile
        </button>
      )}
    </div>
  );
};
