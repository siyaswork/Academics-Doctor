import React, { useCallback, useEffect, useRef, useState } from 'react'
import { DrawingAction, DrawingTool } from '../types/notes'
import styles from './DrawingCanvas.module.css'

interface DrawingCanvasProps {
  initialActions?: DrawingAction[]
  onChange?: (actions: DrawingAction[]) => void
  onClose?: () => void
}

const colors = [
  { label: 'Black', value: '#1f2937' },
  { label: 'Red', value: '#dc2626' },
  { label: 'Orange', value: '#ea580c' },
  { label: 'Yellow', value: '#ca8a04' },
  { label: 'Green', value: '#16a34a' },
  { label: 'Blue', value: '#2563eb' },
  { label: 'Purple', value: '#9333ea' },
  { label: 'Pink', value: '#db2777' },
]

const toolLabels: Record<DrawingTool, string> = {
  pen: 'Pen',
  eraser: 'Eraser',
  line: 'Line',
  arrow: 'Arrow',
  rectangle: 'Rectangle',
  circle: 'Circle',
  triangle: 'Triangle',
}

const distance = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(b.x - a.x, b.y - a.y)

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ initialActions = [], onChange, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [actions, setActions] = useState<DrawingAction[]>(initialActions)
  const [redoStack, setRedoStack] = useState<DrawingAction[]>([])
  const [tool, setTool] = useState<DrawingTool>('pen')
  const [color, setColor] = useState(colors[0].value)
  const [strokeWidth, setStrokeWidth] = useState(3)
  const [opacity, setOpacity] = useState(1)
  const [isDrawing, setIsDrawing] = useState(false)
  const currentAction = useRef<DrawingAction | null>(null)

  const commitActions = useCallback((next: DrawingAction[]) => {
    setActions(next)
    onChange?.(next)
  }, [onChange])

  const drawAction = useCallback((context: CanvasRenderingContext2D, action: DrawingAction) => {
    const points = action.points
    if (!points.length) return
    context.save()
    context.globalAlpha = action.opacity
    context.lineWidth = action.strokeWidth
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = action.type === 'eraser' ? '#ffffff' : action.color
    context.fillStyle = action.type === 'eraser' ? '#ffffff' : action.color
    const start = points[0]
    const end = points[points.length - 1]

    if (action.type === 'pen' || action.type === 'eraser') {
      context.beginPath()
      context.moveTo(start.x, start.y)
      points.slice(1).forEach((point) => context.lineTo(point.x, point.y))
      context.stroke()
    } else if (action.type === 'line' || action.type === 'arrow') {
      context.beginPath()
      context.moveTo(start.x, start.y)
      context.lineTo(end.x, end.y)
      context.stroke()
      if (action.type === 'arrow') {
        const angle = Math.atan2(end.y - start.y, end.x - start.x)
        const head = Math.max(10, action.strokeWidth * 3)
        context.beginPath()
        context.moveTo(end.x, end.y)
        context.lineTo(end.x - head * Math.cos(angle - Math.PI / 6), end.y - head * Math.sin(angle - Math.PI / 6))
        context.moveTo(end.x, end.y)
        context.lineTo(end.x - head * Math.cos(angle + Math.PI / 6), end.y - head * Math.sin(angle + Math.PI / 6))
        context.stroke()
      }
    } else {
      const width = end.x - start.x
      const height = end.y - start.y
      context.beginPath()
      if (action.type === 'rectangle') context.strokeRect(start.x, start.y, width, height)
      if (action.type === 'circle') context.ellipse(start.x + width / 2, start.y + height / 2, Math.abs(width / 2), Math.abs(height / 2), 0, 0, Math.PI * 2)
      if (action.type === 'triangle') {
        context.moveTo(start.x + width / 2, start.y)
        context.lineTo(end.x, end.y)
        context.lineTo(start.x, end.y)
        context.closePath()
      }
      context.stroke()
    }
    context.restore()
  }, [])

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    actions.forEach((action) => drawAction(context, action))
    if (currentAction.current) drawAction(context, currentAction.current)
  }, [actions, drawAction])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const ratio = window.devicePixelRatio || 1
      const previous = document.createElement('canvas')
      previous.width = canvas.width
      previous.height = canvas.height
      previous.getContext('2d')?.drawImage(canvas, 0, 0)
      canvas.width = Math.max(1, bounds.width * ratio)
      canvas.height = Math.max(1, bounds.height * ratio)
      canvas.getContext('2d')?.scale(ratio, ratio)
      redraw()
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [redraw])

  useEffect(() => { redraw() }, [redraw])

  const getPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
  }

  const begin = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    const point = getPoint(event)
    currentAction.current = {
      id: `drawing-${Date.now()}`,
      type: tool,
      points: [point],
      color,
      strokeWidth,
      opacity,
      timestamp: Date.now(),
    }
    setIsDrawing(true)
  }

  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentAction.current) return
    const point = getPoint(event)
    const points = currentAction.current.points
    if (tool !== 'pen' && points.length > 1) points[points.length - 1] = point
    else if (!points.length || distance(points[points.length - 1], point) > 1) points.push(point)
    redraw()
  }

  const end = () => {
    if (!isDrawing || !currentAction.current) return
    const finished = currentAction.current
    if (finished.points.length > 1 || ['pen', 'eraser'].includes(finished.type)) commitActions([...actions, finished])
    currentAction.current = null
    setRedoStack([])
    setIsDrawing(false)
  }

  const undo = () => {
    if (!actions.length) return
    const next = actions.slice(0, -1)
    setRedoStack((previous) => [...previous, actions[actions.length - 1]])
    commitActions(next)
  }

  const redo = () => {
    const action = redoStack[redoStack.length - 1]
    if (!action) return
    setRedoStack((previous) => previous.slice(0, -1))
    commitActions([...actions, action])
  }

  const clear = () => {
    if (actions.length && window.confirm('Clear this drawing?')) {
      setRedoStack(actions)
      commitActions([])
    }
  }

  return (
    <section className={styles.wrapper} aria-label="Drawing workspace">
      <div className={styles.header}>
        <div><p className={styles.eyebrow}>Note attachment</p><h2 className={styles.title}>Drawing space</h2></div>
        <div className={styles.headerActions}>
          <button type="button" onClick={undo} disabled={!actions.length} aria-label="Undo drawing action">↶</button>
          <button type="button" onClick={redo} disabled={!redoStack.length} aria-label="Redo drawing action">↷</button>
          <button type="button" onClick={clear} disabled={!actions.length}>Clear</button>
          {onClose && <button type="button" onClick={onClose} aria-label="Close drawing workspace">Done</button>}
        </div>
      </div>
      <div className={styles.controls} role="toolbar" aria-label="Drawing controls">
        {(Object.keys(toolLabels) as DrawingTool[]).map((item) => <button key={item} type="button" className={tool === item ? styles.selected : ''} onClick={() => setTool(item)}>{toolLabels[item]}</button>)}
        <label>Color <select value={color} onChange={(event) => setColor(event.target.value)}>{colors.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}<option value="custom">Custom…</option></select></label>
        <input className={styles.colorInput} type="color" value={color === 'custom' ? '#2563eb' : color} onChange={(event) => { setColor(event.target.value) }} aria-label="Custom drawing color" />
        <label>Thickness <input type="range" min="1" max="24" value={strokeWidth} onChange={(event) => setStrokeWidth(Number(event.target.value))} /></label>
        <label>Opacity <input type="range" min="0.2" max="1" step="0.1" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} /></label>
      </div>
      <div className={styles.canvasFrame}>
        <canvas ref={canvasRef} className={styles.canvas} onPointerDown={begin} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onPointerLeave={end} aria-label="Drawing canvas" />
      </div>
      <p className={styles.hint}>Use a pen, mouse, or touch input. Drawings stay attached to this note.</p>
    </section>
  )
}
