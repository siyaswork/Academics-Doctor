import React from 'react'

export const EmptyState: React.FC<{ title?: string; description?: string }> = ({ title = 'Nothing here', description }) => {
  return (
    <div className="empty-state">
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🗒️</div>
      <h3 style={{ margin: 0 }}>{title}</h3>
      {description && <p style={{ marginTop: '0.5rem' }}>{description}</p>}
    </div>
  )
}

export default EmptyState
