import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div style={{ marginTop: 12 }}>
      {label && (
        <label htmlFor={inputId} style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        {...props}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid var(--color-border, #ccc)',
          borderRadius: 6,
          fontSize: 14,
          boxSizing: 'border-box',
          ...props.style,
        }}
      />
    </div>
  )
}
