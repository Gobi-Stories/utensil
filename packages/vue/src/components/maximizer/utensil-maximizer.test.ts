import { describe, it, expect } from 'vitest'
import {
  calculateChildRect,
  calculateMaximizerLayout,
  CONSTRAINT_DEFAULTS,
  type MaximizerConstraints,
} from './utensil-maximizer'

const defaults = CONSTRAINT_DEFAULTS

describe('calculateChildRect', () => {
  it('matches the space aspect ratio when unconstrained', () => {
    const rect = calculateChildRect(1600, 900, defaults)
    const ar = rect.width / rect.height
    expect(ar).toBeCloseTo(1600 / 900, 1)
  })

  it('matches the space aspect ratio for portrait space', () => {
    const rect = calculateChildRect(600, 1200, defaults)
    const ar = rect.width / rect.height
    expect(ar).toBeCloseTo(600 / 1200, 1)
  })

  it('respects minimum width constraint', () => {
    const constraints = { ...defaults, minWidth: 1000 }
    const rect = calculateChildRect(400, 300, constraints)
    expect(rect.width).toBeGreaterThanOrEqual(1000)
  })

  it('respects maximum width constraint', () => {
    const constraints = { ...defaults, maxWidth: 500 }
    const rect = calculateChildRect(1600, 900, constraints)
    expect(rect.width).toBeLessThanOrEqual(500)
  })

  it('respects minimum height constraint', () => {
    const constraints = { ...defaults, minHeight: 800 }
    const rect = calculateChildRect(1600, 400, constraints)
    expect(rect.height).toBeGreaterThanOrEqual(800)
  })

  it('respects maximum height constraint', () => {
    const constraints = { ...defaults, maxHeight: 400 }
    const rect = calculateChildRect(1600, 900, constraints)
    expect(rect.height).toBeLessThanOrEqual(400)
  })

  it('finds closest AR when exact match is impossible', () => {
    // Force a mismatch: wide space but tall constraints
    const constraints: MaximizerConstraints = {
      minWidth: 400,
      maxWidth: 600,
      minHeight: 800,
      maxHeight: 1000,
    }
    const rect = calculateChildRect(1600, 900, constraints)
    expect(rect.width).toBeGreaterThanOrEqual(400)
    expect(rect.width).toBeLessThanOrEqual(600)
    expect(rect.height).toBeGreaterThanOrEqual(800)
    expect(rect.height).toBeLessThanOrEqual(1000)
  })

  it('picks dimensions close to space size when AR matches', () => {
    const rect = calculateChildRect(800, 600, defaults)
    // With no constraints, child should be close to the space dimensions
    expect(rect.width).toBe(800)
    expect(rect.height).toBe(600)
  })
})

describe('calculateMaximizerLayout', () => {
  it('returns null for zero container width', () => {
    expect(calculateMaximizerLayout(0, 600, defaults)).toBeNull()
  })

  it('returns null for zero container height', () => {
    expect(calculateMaximizerLayout(800, 0, defaults)).toBeNull()
  })

  it('centers the child in the container', () => {
    const layout = calculateMaximizerLayout(800, 600, defaults)!
    const scaledW = layout.childWidth * layout.scale
    const scaledH = layout.childHeight * layout.scale
    expect(layout.left).toBeCloseTo((800 - scaledW) / 2, 5)
    expect(layout.top).toBeCloseTo((600 - scaledH) / 2, 5)
  })

  it('produces scale 1 when child matches space and AR matches', () => {
    const layout = calculateMaximizerLayout(800, 600, defaults)!
    expect(layout.scale).toBeCloseTo(1, 5)
  })

  it('scales down when child is larger than space', () => {
    const constraints = { ...defaults, minWidth: 1600, minHeight: 900 }
    const layout = calculateMaximizerLayout(800, 450, constraints)!
    expect(layout.scale).toBeLessThan(1)
  })

  it('scales up when child is smaller than space', () => {
    const constraints = { ...defaults, maxWidth: 400, maxHeight: 300 }
    const layout = calculateMaximizerLayout(1600, 1200, constraints)!
    expect(layout.scale).toBeGreaterThan(1)
  })

  it('scaled child fits within the container', () => {
    const constraints: MaximizerConstraints = {
      minWidth: 500,
      maxWidth: 800,
      minHeight: 400,
      maxHeight: 600,
    }
    const layout = calculateMaximizerLayout(1000, 700, constraints)!
    const scaledW = layout.childWidth * layout.scale
    const scaledH = layout.childHeight * layout.scale
    expect(scaledW).toBeLessThanOrEqual(1000 + 0.01)
    expect(scaledH).toBeLessThanOrEqual(700 + 0.01)
  })
})
