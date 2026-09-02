import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helper?: string
  error?: string | null
}

export const Input: React.FC<InputProps> = ({ label, helper, error, id, className = '', ...props }) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div style={{ marginTop: '0.75rem' }}>
      {label && (
        <label htmlFor={inputId} className="ad-label">
          {label}
        </label>
      )}
      <input id={inputId} {...props} className={`ad-input ${className}`} />
      {helper && <div className="ad-helper">{helper}</div>}
      {error && <div className="ad-error">{error}</div>}
    </div>
  )
}

export default Input
