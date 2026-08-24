import { useEffect, useState } from 'react'
import { useAppContext } from '../contexts/AppContext'

export const Profile = () => {
  const { profile, updateProfile } = useAppContext()
  const [draft, setDraft] = useState(profile)
  useEffect(() => setDraft(profile), [profile])
  return (
    <section className="panel stack">
      <div><h2>Profile</h2><p>Personalize your workspace details.</p></div>
      <div className="inlineFields">
        <label className="fieldLabel">Display name<input value={draft.displayName} onChange={(event) => setDraft((current) => ({ ...current, displayName: event.target.value }))} /></label>
        <label className="fieldLabel">School<input value={draft.school ?? ''} onChange={(event) => setDraft((current) => ({ ...current, school: event.target.value }))} /></label>
        <label className="fieldLabel">Education level<input value={draft.educationLevel ?? ''} onChange={(event) => setDraft((current) => ({ ...current, educationLevel: event.target.value }))} /></label>
        <label className="fieldLabel">Preferred subjects (comma separated)<input value={draft.subjects.join(', ')} onChange={(event) => setDraft((current) => ({ ...current, subjects: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) }))} /></label>
      </div>
      <label className="fieldLabel">Bio<textarea value={draft.bio ?? ''} onChange={(event) => setDraft((current) => ({ ...current, bio: event.target.value }))} /></label>
      <button type="button" className="buttonPrimary" onClick={() => updateProfile(draft)}>Save profile</button>
    </section>
  )
}
