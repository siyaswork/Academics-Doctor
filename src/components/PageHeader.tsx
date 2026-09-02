import React from 'react'

export const PageHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => {
  return (
    <header className="page-header">
      <h1 className="page-title">{title}</h1>
      {subtitle && <div className="section-subtitle">{subtitle}</div>}
    </header>
  )
}

export default PageHeader
