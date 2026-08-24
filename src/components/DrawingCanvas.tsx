import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DrawingAction, DrawingBlock, DrawingTool } from '../types/notes'
import styles from './DrawingCanvas.module.css'

interface DrawingCanvasProps {
  drawingBlock: DrawingBlock
  onChange: (drawingBlock: DrawingBlock) => void
  onRemove?: () => void
  title?: string
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

const serializeActions = (actions: DrawingAction[]) => JSON.stringify(actions)

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ drawingBlock, onChange, onRemove, title }) => {
  const frameRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const currentAction = useRef<DrawingAction | null>(null)
  const [actions, setActions] = useState<DrawingAction[]>(drawingBlock.actions)
  const [redoStack, setRedoStack] = useState<DrawingAction[]>([])
  const [tool, setTool] = useState<DrawingTool>('pen')
  const [color, setColor] = useState(colors[0].value)
  const [strokeWidth, setStrokeWidth] = useState(3)
  const [opacity, setOpacity] = useState(1)
  const [isDrawing, setIsDrawing] = useState(false)
  const [surfaceSize, setSurfaceSize] = useState({ width: drawingBlock.width, height: drawingBlock.height })
  const lastExternalValue = useMemo(() => serializeActions(drawingBlock.actions), [drawingBlock.actions])

  useEffect(() => {
    setActions(drawingBlock.actions)
    setSurfaceSize({ width: drawingBlock.width, height: drawingBlock.height })
  }, [drawingBlock.height, drawingBlock.width, lastExternalValue])

  const drawAction = useCallback((context: CanvasRenderingContext2D, action: DrawingAction) => {
    const points = action.points
    if (!points.length) {
      return
    }

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
      context.restore()
      return
    }

    if (action.type === 'line' || action.type === 'arrow') {
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

      context.restore()
      return
    }

    const width = end.x - start.x
    const height = end.y - start.y
    context.beginPath()

    if (action.type === 'rectangle') {
      context.strokeRect(start.x, start.y, width, height)
    }

    if (action.type === 'circle') {
      context.ellipse(
        start.x + width / 2,
        start.y + height / 2,
        Math.abs(width / 2),
        Math.abs(height / 2),
        0,
        0,
        Math.PI * 2,
      )
    }

    if (action.type === 'triangle') {
      context.moveTo(start.x + width / 2, start.y)
      context.lineTo(end.x, end.y)
      context.lineTo(start.x, end.y)
      context.closePath()
    }

    context.stroke()
    context.restore()
  }, [])

  const redraw = useCallback(
    (nextActions = actions, activeAction = currentAction.current) => {
      const canvas = canvasRef.current
      const frame = frameRef.current
      if (!canvas || !frame) {
        return
      }

      const context = canvas.getContext('2d')
      if (!context) {
        return
      }

      const ratio = window.devicePixelRatio || 1
      const width = frame.clientWidth
      const height = frame.clientHeight

      if (canvas.width !== Math.floor(width * ratio) || canvas.height !== Math.floor(height * ratio)) {
        canvas.width = Math.max(1, Math.floor(width * ratio))
        canvas.height = Math.max(1, Math.floor(height * ratio))
      }

      context.setTransform(1, 0, 0, 1, 0, 0)
      context.scale(ratio, ratio)
      context.clearRect(0, 0, width, height)
      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, width, height)
      nextActions.forEach((action) => drawAction(context, action))

      if (activeAction) {
        drawAction(context, activeAction)
      }
    },
    [actions, drawAction],
  )

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) {
      return
    }

    const resize = () => {
      const nextSize = { width: frame.clientWidth, height: frame.clientHeight }
      setSurfaceSize(nextSize)
      redraw(actions)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(frame)

    return () => observer.disconnect()
  }, [actions, redraw])

  useEffect(() => {
    redraw(actions)
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const block: DrawingBlock = {
      id: drawingBlock.id,
      width: surfaceSize.width,
      height: surfaceSize.height,
      actions,
      imageData: canvas.toDataURL('image/png'),
    }

    onChange(block)
  }, [actions, drawingBlock.id, onChange, redraw, surfaceSize.height, surfaceSize.width])

  const getPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
  }

  const begin = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.cancelable) {
      event.preventDefault()
    }

    event.currentTarget.setPointerCapture(event.pointerId)
    const point = getPoint(event)
    currentAction.current = {
      id: `drawing-action-${Date.now()}`,
      type: tool,
      points: [point],
      color,
      strokeWidth,
      opacity,
      timestamp: Date.now(),
    }
    setRedoStack([])
    setIsDrawing(true)
  }

  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentAction.current) {
      return
    }

    if (event.cancelable) {
      event.preventDefault()
    }

    const point = getPoint(event)
    const points = currentAction.current.points

    if (tool !== 'pen' && tool !== 'eraser') {
      if (points.length === 1) {
        points.push(point)
      } else {
        points[points.length - 1] = point
      }
    } else if (!points.length || distance(points[points.length - 1], point) > 1) {
      points.push(point)
    }

    redraw(actions, currentAction.current)
  }

  const finish = () => {
    if (!isDrawing || !currentAction.current) {
      return
    }

    const finished = currentAction.current
    currentAction.current = null
    setIsDrawing(false)

    if (finished.points.length > 1 || finished.type === 'pen' || finished.type === 'eraser') {
      setActions((previous) => [...previous, finished])
    } else {
      redraw(actions)
    }
  }

  const undo = () => {
    setActions((previous) => {
      if (!previous.length) {
        return previous
      }

      const next = previous.slice(0, -1)
      setRedoStack((stack) => [...stack, previous[previous.length - 1]])
      return next
    })
  }

  const redo = () => {
    setRedoStack((previous) => {
      const action = previous[previous.length - 1]
      if (!action) {
        return previous
      }

      setActions((current) => [...current, action])
      return previous.slice(0, -1)
    })
  }

  const clear = () => {
    if (!actions.length || !window.confirm('Clear this drawing?')) {
      return
    }

    setRedoStack(actions)
    setActions([])
  }

  return (
    <section className={styles.wrapper} aria-label={title ?? 'Drawing block'}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Attached to this note</p>
          <h2 className={styles.title}>{title ?? 'Drawing block'}</h2>
        </div>
        <div className={styles.headerActions}>
          <button type="button" onClick={undo} disabled={!actions.length} aria-label="Undo drawing action" title="Undo drawing action">
            ↶
          </button>
          <button type="button" onClick={redo} disabled={!redoStack.length} aria-label="Redo drawing action" title="Redo drawing action">
            ↷
          </button>
          <button type="button" onClick={clear} disabled={!actions.length} title="Clear drawing">
            Clear
          </button>
          {onRemove && (
            <button type="button" onClick={onRemove} title="Remove drawing block">
              Remove
            </button>
          )}
        </div>
      </div>
      <div className={styles.controls} role="toolbar" aria-label="Drawing controls">
        {(Object.keys(toolLabels) as DrawingTool[]).map((item) => (
          <button
            key={item}
            type="button"
            className={tool === item ? styles.selected : ''}
            onClick={() => setTool(item)}
            title={toolLabels[item]}
            aria-label={toolLabels[item]}
          >
            {toolLabels[item]}
          </button>
        ))}
        <label>
          Color
          <select value={color} onChange={(event) => setColor(event.target.value)}>
            {colors.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <input
          className={styles.colorInput}
          type="color"
          value={color}
          onChange={(event) => setColor(event.target.value)}
          aria-label="Custom drawing color"
          title="Custom drawing color"
        />
        <label>
          Thickness
          <input type="range" min="1" max="24" value={strokeWidth} onChange={(event) => setStrokeWidth(Number(event.target.value))} />
        </label>
        <label>
          Opacity
          <input type="range" min="0.2" max="1" step="0.1" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} />
        </label>
      </div>
      <div ref={frameRef} className={styles.canvasFrame}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onPointerDown={begin}
          onPointerMove={move}
          onPointerUp={finish}
          onPointerCancel={finish}
          onPointerLeave={finish}
          aria-label="Drawing canvas"
        />
      </div>
      <p className={styles.hint}>Draw with a mouse, touch, or stylus. Undo, redo, and clear affect this drawing only.</p>
    </section>
  )
}
