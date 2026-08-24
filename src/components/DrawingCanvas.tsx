import { useCallback, useEffect, useRef, useState } from 'react'
import type { DrawingAction, DrawingTool } from '../types/notes'
import styles from './DrawingCanvas.module.css'

interface DrawingCanvasProps { initialActions?: DrawingAction[]; onChange?: (actions: DrawingAction[]) => void; onClose?: () => void }

const colors = ['#1f2937', '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#2563eb', '#9333ea', '#db2777']
const labels: Record<DrawingTool, string> = { pen: 'Pen', eraser: 'Eraser', line: 'Line', arrow: 'Arrow', rectangle: 'Rectangle', circle: 'Circle', triangle: 'Triangle' }

export const DrawingCanvas = ({ initialActions = [], onChange, onClose }: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [actions, setActions] = useState<DrawingAction[]>(initialActions)
  const [tool, setTool] = useState<DrawingTool>('pen')
  const [color, setColor] = useState(colors[0])
  const [strokeWidth, setStrokeWidth] = useState(3)
  const [isDrawing, setIsDrawing] = useState(false)
  const currentAction = useRef<DrawingAction | null>(null)
  const draw = useCallback(() => { const canvas = canvasRef.current; if (!canvas) return; const context = canvas.getContext('2d'); if (!context) return; context.clearRect(0, 0, canvas.width, canvas.height); context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, canvas.height); const renderAction = (action: DrawingAction) => { if (!action.points.length) return; context.save(); context.lineWidth = action.strokeWidth; context.strokeStyle = action.type === 'eraser' ? '#ffffff' : action.color; context.lineCap = 'round'; context.beginPath(); context.moveTo(action.points[0].x, action.points[0].y); action.points.slice(1).forEach((point) => context.lineTo(point.x, point.y)); context.stroke(); context.restore() }; actions.forEach(renderAction); if (currentAction.current) renderAction(currentAction.current) }, [actions])
  useEffect(() => { const canvas = canvasRef.current; if (!canvas) return; const resize = () => { const bounds = canvas.getBoundingClientRect(); canvas.width = Math.max(1, bounds.width); canvas.height = Math.max(1, bounds.height); draw() }; resize(); const observer = new ResizeObserver(resize); observer.observe(canvas); return () => observer.disconnect() }, [draw])
  useEffect(() => draw(), [draw])
  const getPoint = (event: React.PointerEvent<HTMLCanvasElement>) => { const bounds = event.currentTarget.getBoundingClientRect(); return { x: event.clientX - bounds.left, y: event.clientY - bounds.top } }
  const start = (event: React.PointerEvent<HTMLCanvasElement>) => { event.currentTarget.setPointerCapture(event.pointerId); currentAction.current = { id: `drawing-${Date.now()}`, type: tool, points: [getPoint(event)], color, strokeWidth, opacity: 1, timestamp: Date.now() }; setIsDrawing(true) }
  const move = (event: React.PointerEvent<HTMLCanvasElement>) => { if (!isDrawing || !currentAction.current) return; currentAction.current.points.push(getPoint(event)); draw() }
  const end = () => { if (!isDrawing || !currentAction.current) return; const next = [...actions, currentAction.current]; currentAction.current = null; setIsDrawing(false); setActions(next); onChange?.(next) }
  return <section className={`panel ${styles.wrapper}`} aria-label="Drawing workspace"><div className={styles.header}><div><h3>Drawing canvas</h3><p>Sketch diagrams directly into your note workflow.</p></div>{onClose && <button type="button" className="buttonGhost" onClick={onClose}>Done</button>}</div><div className={styles.controls}>{(Object.keys(labels) as DrawingTool[]).map((item) => <button key={item} type="button" className={tool === item ? styles.selected : 'buttonGhost'} onClick={() => setTool(item)}>{labels[item]}</button>)}<select value={color} onChange={(event) => setColor(event.target.value)}>{colors.map((item) => <option key={item} value={item}>{item}</option>)}</select><input type="range" min="1" max="16" value={strokeWidth} onChange={(event) => setStrokeWidth(Number(event.target.value))} aria-label="Stroke width" /></div><div className={styles.frame}><canvas ref={canvasRef} className={styles.canvas} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerLeave={end} onPointerCancel={end} /></div></section>
}
