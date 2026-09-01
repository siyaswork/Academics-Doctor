import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { DrawingAction, DrawingTool } from '../types/notes'
import {
  distance,
  getBoundingBox,
  getHandlePosition,
  hitTestAction,
  snapToGrid,
  CORNER_HANDLES,
  type CornerHandle,
  type Point,
} from '../utils/canvasGeometry'
import { createId } from '../utils/id'
import { DrawingGrid } from './DrawingGrid'
import styles from './DrawingCanvas.module.css'

interface DrawingCanvasProps {
  initialActions?: DrawingAction[]
  onChange?: (actions: DrawingAction[]) => void
  onClose?: () => void
  /** When omitted, grid/snap are managed with local state (standalone usage). */
  gridEnabled?: boolean
  onToggleGrid?: () => void
  snapEnabled?: boolean
  onToggleSnap?: () => void
}

const GRID_SIZE = 20

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
  select: 'Select',
  pen: 'Pen',
  highlighter: 'Highlighter',
  eraser: 'Eraser',
  line: 'Line',
  arrow: 'Arrow',
  'double-arrow': 'Double arrow',
  'dashed-line': 'Dashed',
  connector: 'Connector',
  rectangle: 'Rectangle',
  'rounded-rectangle': 'Rounded rect',
  circle: 'Circle',
  ellipse: 'Ellipse',
  triangle: 'Triangle',
  polygon: 'Polygon',
  'text-box': 'Text box',
  'sticky-note': 'Sticky note',
}

const TOOL_ORDER: DrawingTool[] = [
  'select', 'pen', 'highlighter', 'eraser',
  'line', 'arrow', 'double-arrow', 'dashed-line', 'connector',
  'rectangle', 'rounded-rectangle', 'circle', 'ellipse', 'triangle', 'polygon',
  'text-box', 'sticky-note',
]

const STROKE_LIKE = new Set<DrawingTool>(['pen', 'highlighter', 'eraser'])
const TWO_POINT_LIKE = new Set<DrawingTool>([
  'line', 'arrow', 'double-arrow', 'dashed-line', 'connector',
  'rectangle', 'rounded-rectangle', 'circle', 'ellipse', 'triangle',
])

function drawArrowhead(context: CanvasRenderingContext2D, from: Point, to: Point, size: number) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x)
  context.beginPath()
  context.moveTo(to.x, to.y)
  context.lineTo(to.x - size * Math.cos(angle - Math.PI / 6), to.y - size * Math.sin(angle - Math.PI / 6))
  context.moveTo(to.x, to.y)
  context.lineTo(to.x - size * Math.cos(angle + Math.PI / 6), to.y - size * Math.sin(angle + Math.PI / 6))
  context.stroke()
}

function drawAction(context: CanvasRenderingContext2D, action: DrawingAction) {
  const points = action.points
  if (!points.length) return
  context.save()
  context.globalAlpha = action.type === 'highlighter' ? Math.min(action.opacity, 0.45) : action.opacity
  context.lineWidth = action.strokeWidth
  context.lineCap = 'round'
  context.lineJoin = 'round'
  context.strokeStyle = action.color
  context.fillStyle = action.color
  if (action.type === 'dashed-line') context.setLineDash([action.strokeWidth * 2, action.strokeWidth * 1.5])
  if (action.type === 'eraser') context.globalCompositeOperation = 'destination-out'

  const start = points[0]
  const end = points[points.length - 1]

  if (STROKE_LIKE.has(action.type)) {
    context.beginPath()
    context.moveTo(start.x, start.y)
    points.slice(1).forEach((point) => context.lineTo(point.x, point.y))
    context.stroke()
  } else if (action.type === 'line' || action.type === 'dashed-line') {
    context.beginPath()
    context.moveTo(start.x, start.y)
    context.lineTo(end.x, end.y)
    context.stroke()
  } else if (action.type === 'arrow' || action.type === 'double-arrow') {
    context.beginPath()
    context.moveTo(start.x, start.y)
    context.lineTo(end.x, end.y)
    context.stroke()
    const head = Math.max(10, action.strokeWidth * 3)
    drawArrowhead(context, start, end, head)
    if (action.type === 'double-arrow') drawArrowhead(context, end, start, head)
  } else if (action.type === 'connector') {
    const midX = (start.x + end.x) / 2
    context.beginPath()
    context.moveTo(start.x, start.y)
    context.lineTo(midX, start.y)
    context.lineTo(midX, end.y)
    context.lineTo(end.x, end.y)
    context.stroke()
    drawArrowhead(context, { x: midX, y: end.y }, end, Math.max(10, action.strokeWidth * 3))
  } else if (action.type === 'rectangle' || action.type === 'rounded-rectangle') {
    const width = end.x - start.x
    const height = end.y - start.y
    const radius = action.type === 'rounded-rectangle' ? Math.min(16, Math.abs(width), Math.abs(height)) / 2 : 0
    context.beginPath()
    if (radius > 0 && 'roundRect' in context) {
      ;(context as CanvasRenderingContext2D & { roundRect: (x: number, y: number, w: number, h: number, r: number) => void }).roundRect(
        Math.min(start.x, end.x), Math.min(start.y, end.y), Math.abs(width), Math.abs(height), radius,
      )
    } else {
      context.rect(Math.min(start.x, end.x), Math.min(start.y, end.y), Math.abs(width), Math.abs(height))
    }
    context.stroke()
  } else if (action.type === 'circle' || action.type === 'ellipse') {
    const width = end.x - start.x
    const height = end.y - start.y
    const cx = start.x + width / 2
    const cy = start.y + height / 2
    const rx = action.type === 'circle' ? Math.min(Math.abs(width), Math.abs(height)) / 2 : Math.abs(width) / 2
    const ry = action.type === 'circle' ? Math.min(Math.abs(width), Math.abs(height)) / 2 : Math.abs(height) / 2
    context.beginPath()
    context.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
    context.stroke()
  } else if (action.type === 'triangle') {
    const width = end.x - start.x
    context.beginPath()
    context.moveTo(start.x + width / 2, start.y)
    context.lineTo(end.x, end.y)
    context.lineTo(start.x, end.y)
    context.closePath()
    context.stroke()
  } else if (action.type === 'polygon') {
    context.beginPath()
    context.moveTo(points[0].x, points[0].y)
    points.slice(1).forEach((point) => context.lineTo(point.x, point.y))
    if (action.closed) context.closePath()
    context.stroke()
    points.forEach((point) => {
      context.beginPath()
      context.arc(point.x, point.y, 2.5, 0, Math.PI * 2)
      context.fill()
    })
  } else if (action.type === 'text-box' || action.type === 'sticky-note') {
    const padding = 10
    const fontSize = 16
    context.font = `${fontSize}px Inter, system-ui, sans-serif`
    const text = action.text || (action.type === 'sticky-note' ? 'Sticky note' : 'Text')
    const width = Math.max(120, context.measureText(text).width + padding * 2)
    const height = action.type === 'sticky-note' ? 100 : fontSize + padding * 2
    if (action.type === 'sticky-note') {
      context.globalAlpha = Math.min(action.opacity, 0.9)
      context.fillStyle = action.color
      context.fillRect(start.x, start.y, width, height)
      context.globalAlpha = action.opacity
      context.fillStyle = '#1f2937'
    } else {
      context.fillStyle = action.color
    }
    context.textBaseline = 'top'
    wrapText(context, text, start.x + padding, start.y + padding, width - padding * 2, fontSize + 4)
  }
  context.restore()
}

function wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ')
  let line = ''
  let cursorY = y
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word
    if (context.measureText(testLine).width > maxWidth && line) {
      context.fillText(line, x, cursorY)
      line = word
      cursorY += lineHeight
    } else {
      line = testLine
    }
  }
  if (line) context.fillText(line, x, cursorY)
}

function drawSelectionOverlay(context: CanvasRenderingContext2D, action: DrawingAction) {
  const box = getBoundingBox(action)
  context.save()
  context.globalAlpha = 1
  context.globalCompositeOperation = 'source-over'
  context.strokeStyle = '#5b6cf0'
  context.lineWidth = 1.5
  context.setLineDash([6, 4])
  context.strokeRect(box.x, box.y, box.width, box.height)
  context.setLineDash([])
  context.fillStyle = '#ffffff'
  CORNER_HANDLES.forEach((handle) => {
    const point = getHandlePosition(box, handle)
    context.beginPath()
    context.rect(point.x - 5, point.y - 5, 10, 10)
    context.fill()
    context.stroke()
  })
  context.restore()
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  initialActions = [],
  onChange,
  onClose,
  gridEnabled,
  onToggleGrid,
  snapEnabled,
  onToggleSnap,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [actions, setActions] = useState<DrawingAction[]>(initialActions)
  const [redoStack, setRedoStack] = useState<DrawingAction[]>([])
  const [tool, setTool] = useState<DrawingTool>('pen')
  const [color, setColor] = useState(colors[0].value)
  const [strokeWidth, setStrokeWidth] = useState(3)
  const [opacity, setOpacity] = useState(1)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [localGrid, setLocalGrid] = useState(true)
  const [localSnap, setLocalSnap] = useState(false)
  const [, forceRender] = useState(0)

  const actionsRef = useRef(actions)
  actionsRef.current = actions
  const draftRef = useRef<DrawingAction | null>(null)
  const polygonDraftRef = useRef<DrawingAction | null>(null)
  const dragRef = useRef<
    | { kind: 'move'; id: string; last: Point }
    | { kind: 'resize'; id: string; pointIndex: number }
    | null
  >(null)

  const grid = gridEnabled ?? localGrid
  const snap = snapEnabled ?? localSnap
  const toggleGrid = onToggleGrid ?? (() => setLocalGrid((v) => !v))
  const toggleSnap = onToggleSnap ?? (() => setLocalSnap((v) => !v))

  const commitActions = useCallback((next: DrawingAction[]) => {
    setActions(next)
    onChange?.(next)
  }, [onChange])

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const bounds = canvas.getBoundingClientRect()
    context.clearRect(0, 0, bounds.width, bounds.height)
    actionsRef.current.forEach((action) => drawAction(context, action))
    if (draftRef.current) drawAction(context, draftRef.current)
    if (polygonDraftRef.current) drawAction(context, polygonDraftRef.current)
    const selected = actionsRef.current.find((action) => action.id === selectedId)
    if (selected) drawSelectionOverlay(context, selected)
  }, [selectedId])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const ratio = window.devicePixelRatio || 1
      canvas.width = Math.max(1, bounds.width * ratio)
      canvas.height = Math.max(1, bounds.height * ratio)
      const context = canvas.getContext('2d')
      context?.setTransform(ratio, 0, 0, ratio, 0, 0)
      redraw()
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [redraw])

  useEffect(() => { redraw() }, [redraw, actions])

  const getPoint = (event: React.PointerEvent<HTMLCanvasElement>): Point => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const raw = { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
    return snap ? snapToGrid(raw, GRID_SIZE) : raw
  }

  const findTopmostHit = (point: Point): DrawingAction | undefined => {
    for (let i = actionsRef.current.length - 1; i >= 0; i -= 1) {
      if (hitTestAction(actionsRef.current[i], point)) return actionsRef.current[i]
    }
    return undefined
  }

  const findHandleHit = (point: Point): { action: DrawingAction; handle: CornerHandle } | undefined => {
    const selected = actionsRef.current.find((action) => action.id === selectedId)
    if (!selected) return undefined
    const box = getBoundingBox(selected)
    for (const handle of CORNER_HANDLES) {
      const handlePoint = getHandlePosition(box, handle)
      if (distance(point, handlePoint) <= 10) return { action: selected, handle }
    }
    return undefined
  }

  const begin = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    const point = getPoint(event)

    if (tool === 'select') {
      const handleHit = findHandleHit(point)
      if (handleHit) {
        // Resize by dragging whichever stored point sits nearest the grabbed handle.
        let pointIndex = 0
        let bestDistance = Infinity
        handleHit.action.points.forEach((candidate, index) => {
          const d = distance(candidate, point)
          if (d < bestDistance) {
            bestDistance = d
            pointIndex = index
          }
        })
        dragRef.current = { kind: 'resize', id: handleHit.action.id, pointIndex }
        return
      }
      const hit = findTopmostHit(point)
      setSelectedId(hit ? hit.id : null)
      if (hit) dragRef.current = { kind: 'move', id: hit.id, last: point }
      redraw()
      return
    }

    if (tool === 'text-box' || tool === 'sticky-note') {
      const action: DrawingAction = {
        id: createId('draw'),
        type: tool,
        points: [point],
        color,
        strokeWidth,
        opacity,
        timestamp: Date.now(),
        text: tool === 'sticky-note' ? 'Sticky note' : 'Text',
      }
      commitActions([...actionsRef.current, action])
      setSelectedId(action.id)
      setTool('select')
      return
    }

    if (tool === 'polygon') {
      if (!polygonDraftRef.current) {
        polygonDraftRef.current = { id: createId('draw'), type: 'polygon', points: [point], color, strokeWidth, opacity, timestamp: Date.now() }
      } else {
        polygonDraftRef.current.points.push(point)
      }
      redraw()
      return
    }

    draftRef.current = { id: createId('draw'), type: tool, points: [point], color, strokeWidth, opacity, timestamp: Date.now() }
  }

  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const point = getPoint(event)

    if (dragRef.current?.kind === 'move') {
      const { id, last } = dragRef.current
      const dx = point.x - last.x
      const dy = point.y - last.y
      const action = actionsRef.current.find((item) => item.id === id)
      if (action) {
        action.points = action.points.map((p) => ({ x: p.x + dx, y: p.y + dy }))
        dragRef.current = { kind: 'move', id, last: point }
        redraw()
      }
      return
    }

    if (dragRef.current?.kind === 'resize') {
      const { id, pointIndex } = dragRef.current
      const action = actionsRef.current.find((item) => item.id === id)
      if (action && action.points[pointIndex]) {
        action.points[pointIndex] = point
        redraw()
      }
      return
    }

    if (!draftRef.current) return
    const points = draftRef.current.points
    if (TWO_POINT_LIKE.has(draftRef.current.type)) {
      points[points.length - 1] = point
      if (points.length === 1) points.push(point)
    } else if (!points.length || distance(points[points.length - 1], point) > 1) {
      points.push(point)
    }
    redraw()
  }

  const end = () => {
    if (dragRef.current) {
      dragRef.current = null
      commitActions([...actionsRef.current])
      return
    }
    if (!draftRef.current) return
    const finished = draftRef.current
    draftRef.current = null
    if (finished.points.length > 1 || STROKE_LIKE.has(finished.type)) {
      commitActions([...actionsRef.current, finished])
      setRedoStack([])
    } else {
      redraw()
    }
  }

  const handleDoubleClick = () => {
    if (tool === 'polygon' && polygonDraftRef.current && polygonDraftRef.current.points.length >= 3) {
      const finished = { ...polygonDraftRef.current, closed: true }
      polygonDraftRef.current = null
      commitActions([...actionsRef.current, finished])
      setRedoStack([])
    }
  }

  const undo = () => {
    if (!actions.length) return
    const next = actions.slice(0, -1)
    setRedoStack((previous) => [...previous, actions[actions.length - 1]])
    commitActions(next)
    setSelectedId(null)
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
      setSelectedId(null)
    }
  }

  const selectedAction = actions.find((action) => action.id === selectedId) || null

  const reorderSelected = (mode: 'forward' | 'backward' | 'front' | 'back') => {
    if (!selectedId) return
    const index = actions.findIndex((action) => action.id === selectedId)
    if (index === -1) return
    const next = [...actions]
    const [item] = next.splice(index, 1)
    if (mode === 'forward') next.splice(Math.min(index + 1, next.length), 0, item)
    else if (mode === 'backward') next.splice(Math.max(index - 1, 0), 0, item)
    else if (mode === 'front') next.push(item)
    else next.unshift(item)
    commitActions(next)
  }

  const deleteSelected = () => {
    if (!selectedId) return
    commitActions(actions.filter((action) => action.id !== selectedId))
    setSelectedId(null)
  }

  const updateSelectedStyle = (updates: Partial<Pick<DrawingAction, 'color' | 'strokeWidth' | 'opacity' | 'text'>>) => {
    if (!selectedId) return
    commitActions(actions.map((action) => (action.id === selectedId ? { ...action, ...updates } : action)))
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if ((event.key === 'Delete' || event.key === 'Backspace') && selectedId) {
      event.preventDefault()
      deleteSelected()
    } else if (event.key === 'Escape') {
      setSelectedId(null)
      polygonDraftRef.current = null
      redraw()
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
      <div className={styles.controls} role="toolbar" aria-label="Drawing tools">
        {TOOL_ORDER.map((item) => (
          <button
            key={item}
            type="button"
            className={tool === item ? styles.selected : ''}
            onClick={() => { setTool(item); polygonDraftRef.current = null }}
            aria-pressed={tool === item}
          >
            {toolLabels[item]}
          </button>
        ))}
        <label>Color <select value={color} onChange={(event) => { setColor(event.target.value); updateSelectedStyle({ color: event.target.value }) }}>{colors.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}<option value="custom">Custom…</option></select></label>
        <input className={styles.colorInput} type="color" value={color === 'custom' ? '#2563eb' : color} onChange={(event) => { setColor(event.target.value); updateSelectedStyle({ color: event.target.value }) }} aria-label="Custom drawing color" />
        <label>Thickness <input type="range" min="1" max="24" value={strokeWidth} onChange={(event) => { setStrokeWidth(Number(event.target.value)); updateSelectedStyle({ strokeWidth: Number(event.target.value) }) }} /></label>
        <label>Opacity <input type="range" min="0.2" max="1" step="0.1" value={opacity} onChange={(event) => { setOpacity(Number(event.target.value)); updateSelectedStyle({ opacity: Number(event.target.value) }) }} /></label>
        <label className={styles.toggle}><input type="checkbox" checked={grid} onChange={toggleGrid} /> Grid</label>
        <label className={styles.toggle}><input type="checkbox" checked={snap} onChange={toggleSnap} /> Snap</label>
      </div>
      {selectedAction && (
        <div className={styles.selectionBar} role="toolbar" aria-label="Selected object actions">
          {(selectedAction.type === 'text-box' || selectedAction.type === 'sticky-note') && (
            <input
              className={styles.textEdit}
              value={selectedAction.text || ''}
              onChange={(event) => { updateSelectedStyle({ text: event.target.value }); forceRender((n) => n + 1) }}
              aria-label="Edit text content"
              placeholder="Type here…"
            />
          )}
          <button type="button" onClick={() => reorderSelected('backward')}>Send backward</button>
          <button type="button" onClick={() => reorderSelected('forward')}>Bring forward</button>
          <button type="button" onClick={() => reorderSelected('back')}>Send to back</button>
          <button type="button" onClick={() => reorderSelected('front')}>Bring to front</button>
          <button type="button" className={styles.deleteButton} onClick={deleteSelected}>Delete</button>
        </div>
      )}
      <div
        className={styles.canvasFrame}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="group"
        aria-label="Drawing canvas area, press Delete to remove the selected object"
      >
        <DrawingGrid visible={grid} cellSize={GRID_SIZE} />
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onPointerDown={begin}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          onPointerLeave={end}
          onDoubleClick={handleDoubleClick}
          aria-label="Drawing canvas"
        />
      </div>
      <p className={styles.hint}>
        Use a pen, mouse, or touch input. For polygons, click to add each vertex and double-click to close the shape.
        Use the Select tool to move, resize, recolor, reorder, or delete a shape.
      </p>
    </section>
  )
}
