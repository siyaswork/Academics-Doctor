import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getCurrentProfile, upsertProfile } from '../services/profiles'
import { supabase } from '../lib/supabase/client'
import { STORAGE_KEYS } from '../utils/storage'
import styles from './AccountPage.module.css'

export default function AccountPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [educationLevel, setEducationLevel] = useState('Undergraduate')
  const [bio, setBio] = useState('')
  const [avatarPath, setAvatarPath] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null)

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email)
    }
    if (user?.displayName) {
      setDisplayName(user.displayName)
    }

    async function loadProfile() {
      setLoading(true)
      const { data, error } = await getCurrentProfile()
      if (!error && data) {
        if (data.full_name) setFullName(data.full_name)
        if (data.display_name) setDisplayName(data.display_name)
        if (data.email) setEmail(data.email)
        if (data.education_level) setEducationLevel(data.education_level)
        if (data.bio) setBio(data.bio)
        if (data.avatar_path) setAvatarPath(data.avatar_path)
      }
      setLoading(false)
    }

    void loadProfile()
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const { error } = await upsertProfile({
      full_name: fullName,
      display_name: displayName,
      email,
      education_level: educationLevel,
      bio,
      avatar_path: avatarPath,
    })

    // Keep the auth session's cached name in sync so the display name shows
    // up immediately elsewhere in the app (e.g. the Dashboard greeting),
    // instead of only living in the profiles table.
    if (!error) {
      await supabase.auth.updateUser({ data: { full_name: displayName } })
    }

    setSaving(false)
    if (error) {
      setMessage({ text: 'Failed to save profile. Please try again.', isError: true })
    } else {
      setMessage({ text: 'Profile saved successfully!', isError: false })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(STORAGE_KEYS.notes)
      }
      await signOut()
      navigate('/login', { replace: true })
    } catch {
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className={styles.page}>
      <header>
        <span className={styles.eyebrow}>Student Account</span>
        <h1 className={styles.title}>Account Profile</h1>
        <p className={styles.subtitle}>Manage your student information and preferences.</p>
      </header>

      <nav className={styles.navTabs} aria-label="Account Navigation">
        <NavLink
          to="/account"
          className={({ isActive }) => (isActive ? `${styles.tabLink} ${styles.tabLinkActive}` : styles.tabLink)}
        >
          Profile
        </NavLink>
        <NavLink
          to="/billing"
          className={({ isActive }) => (isActive ? `${styles.tabLink} ${styles.tabLinkActive}` : styles.tabLink)}
        >
          Billing & Payments
        </NavLink>
      </nav>

      <div className={styles.card}>
        {loading ? (
          <div>Loading profile information...</div>
        ) : (
          <form className={styles.formGrid} onSubmit={handleSave}>
            <div className={styles.fieldGroup}>
              <label htmlFor="full_name" className={styles.label}>
                Full Name
              </label>
              <input
                id="full_name"
                type="text"
                className={styles.input}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your legal/full name"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="display_name" className={styles.label}>
                Display Name
              </label>
              <input
                id="display_name"
                type="text"
                className={styles.input}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="What shows on your dashboard"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="education_level" className={styles.label}>
                Education Level
              </label>
              <select
                id="education_level"
                className={styles.select}
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
              >
                <option value="High School">High School</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Other">Other / Self-Learner</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="bio" className={styles.label}>
                Bio / Academic Summary
              </label>
              <textarea
                id="bio"
                className={styles.textarea}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about your studies, major, or goals..."
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="avatar_path" className={styles.label}>
                Avatar URL or Path
              </label>
              <input
                id="avatar_path"
                type="text"
                className={styles.input}
                value={avatarPath}
                onChange={(e) => setAvatarPath(e.target.value)}
                placeholder="avatars/default.png"
              />
            </div>

            <div className={styles.actions}>
              <button type="submit" className={styles.saveButton} disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
              {message && (
                <span className={`${styles.message} ${message.isError ? styles.errorMessage : styles.successMessage}`}>
                  {message.text}
                </span>
              )}
            </div>
          </form>
        )}
      </div>

      <div className={styles.logoutSection}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Session</h2>
          <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Signed in as {user?.email || 'Student'}
          </p>
        </div>
        <button type="button" className={styles.logoutButton} onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </div>
  )
}
