import React from 'react'
import { Link } from 'react-router-dom'

export default function Subjects() {
  return (
    <div>
      <h1>Subjects</h1>
      <ul>
        <li><Link to="/subjects/mathematics">Mathematics</Link></li>
        <li><Link to="/subjects/additional-mathematics">Additional Mathematics</Link></li>
        <li><Link to="/subjects/physics">Physics</Link></li>
        <li><Link to="/subjects/chemistry">Chemistry</Link></li>
        <li><Link to="/subjects/design-technology">Design &amp; Technology</Link></li>
      </ul>
    </div>
  )
}
