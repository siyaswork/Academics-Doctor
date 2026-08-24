import React from 'react'
import styles from './Tabs.module.css'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTabId?: string
  onChange?: (tabId: string) => void
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTabId = tabs[0]?.id,
  onChange,
}) => {
  const [activeTabId, setActiveTabId] = React.useState(defaultTabId)

  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId)
    onChange?.(tabId)
  }

  return (
    <div className={styles.container}>
      <div className={styles.tabList} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTabId === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            className={`${styles.tab} ${activeTabId === tab.id ? styles.active : ''}`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`tabpanel-${tab.id}`}
          role="tabpanel"
          className={`${styles.tabPanel} ${activeTabId === tab.id ? styles.active : ''}`}
          aria-labelledby={tab.id}
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}
