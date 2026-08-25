import React, { useState } from 'react';
import { useProfile } from '../../contexts/ProfileContext';
import { useSubjects } from '../../contexts/SubjectContext';
import { ProfileCard } from '../../components/Profile/ProfileCard';
import { ProfileForm } from '../../components/Profile/ProfileForm';
import styles from './ProfilePage.module.css';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile } = useProfile();
  const { subjects } = useSubjects();
  const [isEditing, setIsEditing] = useState(false);

  if (!profile) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  const preferredSubjectNames = profile.preferredSubjects
    .map(id => subjects.find(s => s.id === id)?.name)
    .filter(Boolean) as string[];

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        <h1>My Profile</h1>

        {isEditing ? (
          <ProfileForm
            initialSettings={{
              displayName: profile.displayName,
              avatar: profile.avatar,
              educationLevel: profile.educationLevel,
              description: profile.description,
            }}
            onSubmit={settings => {
              updateProfile(settings);
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <ProfileCard profile={{ ...profile, preferredSubjects: preferredSubjectNames }} onEdit={() => setIsEditing(true)} />
        )}

        <div className={styles.section}>
          <h2>About</h2>
          {profile.description ? (
            <p>{profile.description}</p>
          ) : (
            <p className={styles.placeholder}>No description yet. Edit your profile to add one.</p>
          )}
        </div>

        {preferredSubjectNames.length > 0 && (
          <div className={styles.section}>
            <h2>Preferred Subjects</h2>
            <div className={styles.subjectsList}>
              {preferredSubjectNames.map(name => (
                <span key={name} className={styles.subjectTag}>
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
