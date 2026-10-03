import { describe, it, expect } from 'vitest'
import {
  fromFullInsertion,
  insertionIndex,
  itemIndexAt,
  markerLine,
  rowReversedAt,
  stepInsertion,
  toFullInsertion,
  type Rect,
} from './reorderable-geometry'

function verticalList(count: number): Rect[] {
  return Array.from({ length: count }, (_, index) => ({ left: 0, top: index * 30, width: 100, height: 20 }))
}

function horizontalList(count: number): Rect[] {
  return Array.from({ length: count }, (_, index) => ({ left: index * 110, top: 0, width: 100, height: 20 }))
}

// columns × rows grid of 100×20 cells with 10px gaps
function grid(columns: number, count: number): Rect[] {
  return Array.from({ length: count }, (_, index) => ({
    left: (index % columns) * 110,
    top: Math.floor(index / columns) * 30,
    width: 100,
    height: 20,
  }))
}

describe('itemIndexAt', () => {
  it('returns -1 for an empty list', () => {
    expect(itemIndexAt([], { x: 10, y: 10 })).toBe(-1)
  })

  it('picks the item under the point wherever the point sits within it', () => {
    const rects = horizontalList(3)
    expect(itemIndexAt(rects, { x: 5, y: 10 })).toBe(0)
    expect(itemIndexAt(rects, { x: 95, y: 10 })).toBe(0)
    expect(itemIndexAt(rects, { x: 115, y: 10 })).toBe(1)
    expect(itemIndexAt(rects, { x: 205, y: 10 })).toBe(1)
  })

  it('falls to the nearest item in a gap or beyond the ends', () => {
    const rects = horizontalList(3)
    expect(itemIndexAt(rects, { x: 103, y: 10 })).toBe(0)
    expect(itemIndexAt(rects, { x: 108, y: 10 })).toBe(1)
    expect(itemIndexAt(rects, { x: -40, y: 10 })).toBe(0)
    expect(itemIndexAt(rects, { x: 400, y: 10 })).toBe(2)
  })

  it('picks the row by the vertical position in a grid', () => {
    const rects = grid(2, 4)
    expect(itemIndexAt(rects, { x: 150, y: 10 })).toBe(1)
    expect(itemIndexAt(rects, { x: 150, y: 40 })).toBe(3)
    expect(itemIndexAt(rects, { x: 50, y: 80 })).toBe(2)
  })
})

describe('insertionIndex', () => {
  it('returns 0 for an empty list', () => {
    expect(insertionIndex([], { x: 10, y: 10 })).toBe(0)
  })

  it('splits vertical items at their midpoint', () => {
    const rects = verticalList(3)
    expect(insertionIndex(rects, { x: 50, y: 5 })).toBe(0)
    expect(insertionIndex(rects, { x: 50, y: 15 })).toBe(1)
    expect(insertionIndex(rects, { x: 50, y: 45 })).toBe(2)
    expect(insertionIndex(rects, { x: 50, y: 75 })).toBe(3)
  })

  it('maps gaps between vertical items to the nearest item', () => {
    const rects = verticalList(3)
    expect(insertionIndex(rects, { x: 50, y: 27 })).toBe(1)
  })

  it('splits horizontal items at their midpoint', () => {
    const rects = horizontalList(3)
    expect(insertionIndex(rects, { x: 40, y: 10 })).toBe(0)
    expect(insertionIndex(rects, { x: 60, y: 10 })).toBe(1)
    expect(insertionIndex(rects, { x: 170, y: 10 })).toBe(2)
    expect(insertionIndex(rects, { x: 300, y: 10 })).toBe(3)
  })

  it('resolves grid points row-first, then by horizontal position', () => {
    const rects = grid(2, 4)
    expect(insertionIndex(rects, { x: 55, y: 10 })).toBe(1)
    expect(insertionIndex(rects, { x: 55, y: 35 })).toBe(3)
    expect(insertionIndex(rects, { x: 280, y: 35 })).toBe(4)
  })

  it('targets around a lone item by the dominant displacement axis', () => {
    const rects: Rect[] = [{ left: 0, top: 0, width: 100, height: 20 }]
    expect(insertionIndex(rects, { x: 50, y: 60 })).toBe(1)
    expect(insertionIndex(rects, { x: 50, y: -40 })).toBe(0)
    expect(insertionIndex(rects, { x: 250, y: 10 })).toBe(1)
    expect(insertionIndex(rects, { x: -150, y: 10 })).toBe(0)
  })

  it('respects reversed (RTL) rows', () => {
    const rects = [
      { left: 220, top: 0, width: 100, height: 20 },
      { left: 110, top: 0, width: 100, height: 20 },
      { left: 0, top: 0, width: 100, height: 20 },
    ]
    expect(insertionIndex(rects, { x: 280, y: 10 })).toBe(0)
    expect(insertionIndex(rects, { x: 200, y: 10 })).toBe(1)
    expect(insertionIndex(rects, { x: 10, y: 10 })).toBe(3)
  })
})

describe('markerLine', () => {
  it('returns null for an empty list', () => {
    expect(markerLine([], 0)).toBeNull()
  })

  it('draws horizontal lines at vertical list boundaries, centered in the gaps', () => {
    const rects = verticalList(3)
    expect(markerLine(rects, 0)).toEqual({ orientation: 'horizontal', left: 0, top: 0, length: 100 })
    expect(markerLine(rects, 1)).toEqual({ orientation: 'horizontal', left: 0, top: 25, length: 100 })
    expect(markerLine(rects, 3)).toEqual({ orientation: 'horizontal', left: 0, top: 80, length: 100 })
  })

  it('draws a vertical line centered between horizontal neighbors', () => {
    const rects = horizontalList(3)
    expect(markerLine(rects, 1)).toEqual({ orientation: 'vertical', left: 105, top: 0, length: 20 })
  })

  it('draws vertical edge lines at the ends of a horizontal row', () => {
    const rects = horizontalList(2)
    expect(markerLine(rects, 0)).toEqual({ orientation: 'vertical', left: 0, top: 0, length: 20 })
    expect(markerLine(rects, 2)).toEqual({ orientation: 'vertical', left: 210, top: 0, length: 20 })
  })
})

describe('insertion space conversion', () => {
  it('maps visible insertions back to full child space around the hidden item', () => {
    // Items [A, B, C] with B (index 1) collapsed: visible slots are before A, between A and C, after C
    expect(toFullInsertion(0, 1)).toBe(0)
    expect(toFullInsertion(1, 1)).toBe(1)
    expect(toFullInsertion(2, 1)).toBe(3)
  })

  it('maps full insertions to visible space, folding the two home slots together', () => {
    expect(fromFullInsertion(0, 1)).toBe(0)
    expect(fromFullInsertion(1, 1)).toBe(1)
    expect(fromFullInsertion(2, 1)).toBe(1)
    expect(fromFullInsertion(3, 1)).toBe(2)
  })
})

describe('rowReversedAt', () => {
  it('detects reversed rows and defaults to false', () => {
    const rtl: Rect[] = [
      { left: 110, top: 0, width: 100, height: 20 },
      { left: 0, top: 0, width: 100, height: 20 },
    ]
    expect(rowReversedAt(rtl, 1)).toBe(true)
    expect(rowReversedAt(horizontalList(2), 1)).toBe(false)
    expect(rowReversedAt(verticalList(2), 2)).toBe(false)
    expect(rowReversedAt([], 0)).toBe(false)
  })
})

describe('stepInsertion', () => {
  it('walks the flow order with previous/next and reports the bounds', () => {
    const rects = verticalList(3)
    expect(stepInsertion(rects, 1, 'next')).toBe(2)
    expect(stepInsertion(rects, 1, 'previous')).toBe(0)
    expect(stepInsertion(rects, 0, 'previous')).toBeNull()
    expect(stepInsertion(rects, 3, 'next')).toBeNull()
  })

  it('moves through a vertical list with up/down', () => {
    const rects = verticalList(3)
    expect(stepInsertion(rects, 0, 'down')).toBe(1)
    expect(stepInsertion(rects, 2, 'down')).toBe(3)
    expect(stepInsertion(rects, 3, 'down')).toBeNull()
    expect(stepInsertion(rects, 3, 'up')).toBe(2)
    expect(stepInsertion(rects, 0, 'up')).toBeNull()
  })

  it('keeps the horizontal position when stepping grid rows', () => {
    const rects = grid(3, 6)
    expect(stepInsertion(rects, 1, 'down')).toBe(4)
    expect(stepInsertion(rects, 4, 'up')).toBe(1)
    expect(stepInsertion(rects, 1, 'up')).toBeNull()
  })

  it('does not step vertically within a single horizontal row', () => {
    const rects = horizontalList(3)
    expect(stepInsertion(rects, 1, 'up')).toBeNull()
    expect(stepInsertion(rects, 1, 'down')).toBeNull()
  })
})
