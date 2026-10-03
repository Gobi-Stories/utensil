/**
 * Position for positioned popovers (typically from mouse events)
 */
export interface Position {
  x: number
  y: number
}

/**
 * Legacy position format using { top, left } - supported for backward compatibility
 */
export interface LegacyPosition {
  top: number
  left: number
}

/**
 * Position that accepts both modern { x, y } and legacy { top, left } formats
 */
export type ContextMenuPosition = Position | LegacyPosition

/**
 * Convert any position format to the standard { x, y } format
 */
export function normalizePosition(position: ContextMenuPosition): Position {
  if ('x' in position && 'y' in position) {
    return position
  }
  return {
    x: position.left,
    y: position.top,
  }
}
