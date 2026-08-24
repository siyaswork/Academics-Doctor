import { useAppContext } from '../contexts/AppContext'
import { NAV_ITEMS } from '../utils/constants'
import styles from './Sidebar.module.css'

export const Sidebar = () => {
  const { activeSection, navigate, profile } = useAppContext()
  return (
    <aside className={styles.sidebar} aria-label="Primary navigation">
      <div className={styles.brand}><div className={styles.logo}>A</div><div><strong>Academics Doctor</strong><p>Student study workspace</p></div></div>
      <nav className={styles.nav}>{NAV_ITEMS.map((item) => <button key={item.id} type="button" className={`${styles.navItem} ${activeSection === item.id ? styles.active : ''}`} onClick={() => navigate(item.id)}><span aria-hidden="true">{item.icon}</span><span>{item.label}</span></button>)}</nav>
      <div className={styles.profileCard}><div className={styles.avatar}>{profile.displayName.slice(0, 1).toUpperCase()}</div><div><strong>{profile.displayName}</strong><p>{profile.school ?? 'Ready to study'}</p></div></div>
    </aside>
  )
}
