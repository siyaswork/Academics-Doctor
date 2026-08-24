import { useState } from 'react'
import { useAppContext } from '../contexts/AppContext'
import styles from './DataReset.module.css'

export const DataReset = () => {
  const [value, setValue] = useState('')
  const { resetAllData } = useAppContext()
  return <div className={styles.wrapper}><label className="fieldLabel">Type DELETE to confirm<input value={value} onChange={(event) => setValue(event.target.value)} placeholder="DELETE" /></label><button type="button" className="buttonGhost" disabled={value !== 'DELETE'} onClick={resetAllData}>Clear all local data</button></div>
}
