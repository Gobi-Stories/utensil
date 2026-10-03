// Layout-agnostic insertion geometry. Items are grouped into visual rows from their rects, so the
// same math serves vertical lists (one item per row), horizontal lists (one row), and wrapped grids.

export interface Point {
  x: number
  y: number
}

export interface Rect {
  left: number
  top: number
  width: number
  height: number
}

export interface MarkerLine {
  orientation: 'horizontal' | 'vertical'
  left: number
  top: number
  length: number
}

export type ReorderableStep = 'previous' | 'next' | 'up' | 'down'

interface Row {
  start: number
  end: number
  top: number
  bottom: number
}

function rowsOf(rects: Rect[]): Row[] {
  const rows: Row[] = []
  let row: Row | null = null
  rects.forEach((rect, index) => {
    const center = rect.top + rect.height / 2
    if (row && center < row.bottom) {
      row.end = index + 1
      row.top = Math.min(row.top, rect.top)
      row.bottom = Math.max(row.bottom, rect.top + rect.height)
    } else {
      row = { start: index, end: index + 1, top: rect.top, bottom: rect.top + rect.height }
      rows.push(row)
    }
  })
  return rows
}

function rowOf(rows: Row[], index: number): Row {
  return rows.find((row) => index >= row.start && index < row.end) as Row
}

/** The row a vertical coordinate falls in, or the nearest one. */
function rowAt(rows: Row[], y: number): Row {
  return (
    rows.find((row) => y >= row.top && y < row.bottom) ??
    rows.reduce((nearest, row) =>
      Math.abs(y - (row.top + row.bottom) / 2) < Math.abs(y - (nearest.top + nearest.bottom) / 2) ? row : nearest,
    )
  )
}

function isReversed(rects: Rect[], row: Row): boolean {
  const first = rects[row.start]
  const last = rects[row.end - 1]
  return row.end - row.start > 1 && last.left + last.width / 2 < first.left + first.width / 2
}

/** Insertion position within a row for a horizontal coordinate, as a flow index. */
function rowInsertion(rects: Rect[], row: Row, x: number): number {
  const reversed = isReversed(rects, row)
  for (let index = row.start; index < row.end; index++) {
    const center = rects[index].left + rects[index].width / 2
    if (reversed ? x > center : x < center) return index
  }
  return row.end
}

/** The insertion index (0..n) a point maps to, given item rects in flow order. */
export function insertionIndex(rects: Rect[], point: Point): number {
  if (!rects.length) return 0
  const rows = rowsOf(rects)
  const target = rowAt(rows, point.y)
  if (target.end - target.start === 1) {
    const rect = rects[target.start]
    // Single-column flow: before/after by the vertical midpoint
    if (rows.length > 1) return point.y < rect.top + rect.height / 2 ? target.start : target.end
    // A lone item gives no flow direction; use the axis of the greater relative displacement
    const dx = (point.x - (rect.left + rect.width / 2)) / Math.max(rect.width, 1)
    const dy = (point.y - (rect.top + rect.height / 2)) / Math.max(rect.height, 1)
    if (Math.abs(dy) >= Math.abs(dx)) return dy < 0 ? target.start : target.end
    return dx < 0 ? target.start : target.end
  }
  return rowInsertion(rects, target, point.x)
}

/** The item a point is over, else the nearest in its row; -1 for an empty list. */
export function itemIndexAt(rects: Rect[], point: Point): number {
  if (!rects.length) return -1
  const row = rowAt(rowsOf(rects), point.y)
  const distance = (index: number) => Math.abs(point.x - (rects[index].left + rects[index].width / 2))
  let nearest = row.start
  for (let index = row.start; index < row.end; index++) {
    const rect = rects[index]
    if (point.x >= rect.left && point.x < rect.left + rect.width) return index
    if (distance(index) < distance(nearest)) nearest = index
  }
  return nearest
}

/** The line to draw for an insertion index, in the same coordinate space as the rects. */
export function markerLine(rects: Rect[], index: number): MarkerLine | null {
  if (!rects.length) return null
  const rows = rowsOf(rects)
  const previous = index > 0 ? rects[index - 1] : null
  const next = index < rects.length ? rects[index] : null

  if (previous && next && rowOf(rows, index - 1) === rowOf(rows, index)) {
    // Between two items in the same row: a vertical line centered in the gap
    const row = rowOf(rows, index)
    const middle =
      (Math.max(previous.left, next.left) + Math.min(previous.left + previous.width, next.left + next.width)) / 2
    return { orientation: 'vertical', left: middle, top: row.top, length: row.bottom - row.top }
  }

  // At a flow boundary: attach to the adjacent item within its own row
  const anchorIndex = previous ? index - 1 : 0
  const anchor = (previous ?? next) as Rect
  const row = rowOf(rows, anchorIndex)
  if (row.end - row.start > 1) {
    const after = Boolean(previous) !== isReversed(rects, row)
    return {
      orientation: 'vertical',
      left: after ? anchor.left + anchor.width : anchor.left,
      top: row.top,
      length: row.bottom - row.top,
    }
  }
  // Between stacked items the line centers in the gap; at the ends it sits on the outer edge
  const top =
    previous && next
      ? (previous.top + previous.height + next.top) / 2
      : previous
        ? anchor.top + anchor.height
        : anchor.top
  return { orientation: 'horizontal', left: anchor.left, top, length: anchor.width }
}

/**
 * Insertion index conversions for a list whose in-flight item is collapsed out of the layout
 * (target-placeholder mode): geometry runs on the visible rects, events stay in full child space.
 * The two full-space slots around the hidden item are the same visible slot, so the mapping is
 * lossy exactly there — both mean "stays at home".
 */
export function toFullInsertion(visible: number, hidden: number): number {
  return visible <= hidden ? visible : visible + 1
}

export function fromFullInsertion(full: number, hidden: number): number {
  return full <= hidden ? full : full - 1
}

/** Whether the row the insertion index sits in runs right-to-left (for flipping arrow keys). */
export function rowReversedAt(rects: Rect[], insertion: number): boolean {
  if (!rects.length) return false
  const rows = rowsOf(rects)
  return isReversed(rects, rowOf(rows, Math.min(insertion, rects.length - 1)))
}

/**
 * The next insertion index for a keyboard step, or null when the step leaves the list (so a group
 * can hand over to a neighboring list). previous/next walk the flow order; up/down move between
 * rows, keeping the marker's horizontal position in grids.
 */
export function stepInsertion(rects: Rect[], current: number, direction: ReorderableStep): number | null {
  const count = rects.length
  if (direction === 'previous') return current > 0 ? current - 1 : null
  if (direction === 'next') return current < count ? current + 1 : null
  if (!count) return null

  const rows = rowsOf(rects)
  const columnFlow = rows.length === count
  const markerRow = current < count ? rows.indexOf(rowOf(rows, current)) : rows.length

  const enterRow = (row: Row): number => {
    if (row.end - row.start === 1) return row.start
    const line = markerLine(rects, current) as MarkerLine
    const x = line.orientation === 'vertical' ? line.left : line.left + line.length / 2
    return rowInsertion(rects, row, x)
  }

  if (direction === 'up') {
    if (markerRow <= 0) return null
    return enterRow(rows[markerRow - 1])
  }
  if (markerRow >= rows.length) return null
  if (markerRow === rows.length - 1) return columnFlow && current < count ? count : null
  return enterRow(rows[markerRow + 1])
}
