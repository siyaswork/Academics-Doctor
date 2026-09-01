let counter = 0

/** Small collision-resistant id generator (no external deps). */
export function createId(prefix = 'id'): string {
  counter += 1
  return `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}
