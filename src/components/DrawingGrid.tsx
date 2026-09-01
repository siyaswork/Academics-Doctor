import React from 'react'
import styles from './DrawingGrid.module.css'

interface DrawingGridProps {
  visible: boolean
  cellSize?: number
}

/**
 * Subtle dotted grid rendered behind the drawing canvas (Step 5, Feature 4).
 * Pure CSS background — doesn't touch the canvas's pixel buffer, so toggling
 * it never triggers a redraw of existing strokes.
 */
export const DrawingGrid: React.FC<DrawingGridProps> = ({ visible, cellSize = 20 }) => {
  if (!visible) return null
  return (
    <div
      className={styles.grid}
      style={{ backgroundSize: `${cellSize}px ${cellSize}px` }}
      aria-hidden="true"
    />
  )
}
