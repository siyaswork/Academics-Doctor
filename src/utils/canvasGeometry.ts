import type { DrawingAction } from '../types/notes'

export interface Point {
  x: number
  y: number
}

export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

export const distance = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y)

/** Rounds a point to the nearest grid intersection. */
export function snapToGrid(point: Point, cellSize: number): Point {
  return { x: Math.round(point.x / cellSize) * cellSize, y: Math.round(point.y / cellSize) * cellSize }
}

/** Computes the axis-aligned bounding box for any drawing action's points. */
export function getBoundingBox(action: DrawingAction): BoundingBox {
  const points = action.points
  if (!points.length) return { x: 0, y: 0, width: 0, height: 0 }
  let minX = points[0].x
  let minY = points[0].y
  let maxX = points[0].x
  let maxY = points[0].y
  for (const point of points) {
    if (point.x < minX) minX = point.x
    if (point.y < minY) minY = point.y
    if (point.x > maxX) maxX = point.x
    if (point.y > maxY) maxY = point.y
  }
  // Text/sticky notes only store an anchor point — give them a sensible footprint.
  if (action.type === 'text-box' || action.type === 'sticky-note') {
    const width = Math.max(140, (action.text?.length ?? 4) * (action.type === 'sticky-note' ? 9 : 8))
    return { x: minX, y: minY, width, height: action.type === 'sticky-note' ? 110 : 32 }
  }
  const padding = Math.max(6, action.strokeWidth)
  return {
    x: minX - padding,
    y: minY - padding,
    width: Math.max(maxX - minX, 1) + padding * 2,
    height: Math.max(maxY - minY, 1) + padding * 2,
  }
}

/** Point-in-box test with a small tolerance, used for hit-testing shapes/strokes. */
export function isPointInBox(point: Point, box: BoundingBox, tolerance = 0): boolean {
  return (
    point.x >= box.x - tolerance &&
    point.x <= box.x + box.width + tolerance &&
    point.y >= box.y - tolerance &&
    point.y <= box.y + box.height + tolerance
  )
}

/** Distance from a point to a line segment — used to hit-test thin strokes/lines. */
export function distanceToSegment(point: Point, a: Point, b: Point): number {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const lengthSquared = dx * dx + dy * dy
  if (lengthSquared === 0) return distance(point, a)
  let t = ((point.x - a.x) * dx + (point.y - a.y) * dy) / lengthSquared
  t = Math.max(0, Math.min(1, t))
  const projection = { x: a.x + t * dx, y: a.y + t * dy }
  return distance(point, projection)
}

/** Hit-tests a drawing action against a point, using shape-appropriate logic. */
export function hitTestAction(action: DrawingAction, point: Point): boolean {
  const box = getBoundingBox(action)
  const strokeLike: string[] = ['pen', 'highlighter', 'eraser', 'line', 'arrow', 'double-arrow', 'dashed-line', 'connector']
  if (strokeLike.includes(action.type)) {
    const tolerance = Math.max(8, action.strokeWidth)
    for (let i = 0; i < action.points.length - 1; i += 1) {
      if (distanceToSegment(point, action.points[i], action.points[i + 1]) <= tolerance) return true
    }
    return action.points.length === 1 && distance(point, action.points[0]) <= tolerance
  }
  if (action.type === 'polygon') {
    return isPointInBox(point, box, 4)
  }
  return isPointInBox(point, box, 4)
}

export const CORNER_HANDLES = ['nw', 'ne', 'sw', 'se'] as const
export type CornerHandle = (typeof CORNER_HANDLES)[number]

export function getHandlePosition(box: BoundingBox, handle: CornerHandle): Point {
  switch (handle) {
    case 'nw': return { x: box.x, y: box.y }
    case 'ne': return { x: box.x + box.width, y: box.y }
    case 'sw': return { x: box.x, y: box.y + box.height }
    case 'se': return { x: box.x + box.width, y: box.y + box.height }
    default: return { x: box.x, y: box.y }
  }
}
