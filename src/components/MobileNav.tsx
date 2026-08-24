import { useAppContext } from '../contexts/AppContext'
import { MOBILE_NAV_ITEMS } from '../utils/constants'
import styles from './MobileNav.module.css'

export const MobileNav = () => {
  const { activeSection, navigate } = useAppContext()
  return <nav className={styles.nav} aria-label="Mobile navigation">{MOBILE_NAV_ITEMS.map((item) => <button key={item.id} type="button" className={`${styles.item} ${activeSection === item.id ? styles.active : ''}`} onClick={() => navigate(item.id)}><span aria-hidden="true">{item.icon}</span><span>{item.label}</span></button>)}</nav>
}
