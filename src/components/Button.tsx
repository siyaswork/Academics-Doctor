import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const base = `ad-btn ad-btn--${variant}`
  return (
    <button {...props} className={`${base} ${className}`}>
      {children}
    </button>
  )
}

export default Button
