import React from 'react'

export const SaveIndicator: React.FC<{ status: 'idle' | 'saving' | 'saved' | 'error' }> = ({ status }) => {
  let text = ''
  if (status === 'saving') text = 'Saving...'
  else if (status === 'saved') text = 'Saved'
  else if (status === 'error') text = 'Unable to save'
  else text = ''

  if (!text) return null
  return <div aria-live="polite" style={{ fontSize: 12, opacity: 0.9 }}>{text}</div>
  }
