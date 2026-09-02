import React from 'react'
import { useParams } from 'react-router-dom'

export default function SubjectPage() {
  const { subject } = useParams()
  return (
    <div>
      <h1>Subject: {subject}</h1>
      <p>Placeholder subject page for {subject}.</p>
    </div>
  )
}
