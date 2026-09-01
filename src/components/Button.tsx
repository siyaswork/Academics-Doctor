import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, ...props }) => {
  return (
    <button
      {...props}
      style={{
        padding: '8px 20px',
        borderRadius: 6,
        border: 'none',
        cursor: 'pointer',
        fontSize: 14,
        fontWeight: 600,
        background: variant === 'primary' ? 'var(--color-primary, #4f46e5)' : 'transparent',
        color: variant === 'primary' ? '#fff' : 'var(--color-primary, #4f46e5)',
        ...props.style,
      }}
    >
      {children}
    </button>
  )
}
