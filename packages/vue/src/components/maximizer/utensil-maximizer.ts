export interface MaximizerConstraints {
  minWidth: number
  maxWidth: number
  minHeight: number
  maxHeight: number
}

export const CONSTRAINT_DEFAULTS: MaximizerConstraints = {
  minWidth: 0,
  maxWidth: 7680,
  minHeight: 0,
  maxHeight: 4320,
}

export interface MaximizerLayout {
  childWidth: number
  childHeight: number
  left: number
  top: number
  scale: number
}

interface Rect {
  width: number
  height: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Find a child rect that respects the size constraints and matches
 * (or most closely matches) the given aspect ratio.
 */
export function calculateChildRect(spaceWidth: number, spaceHeight: number, constraints: MaximizerConstraints): Rect {
  const { minWidth, maxWidth, minHeight, maxHeight } = constraints
  const spaceAR = spaceWidth / spaceHeight

  // Find the valid width range where AR can be matched exactly.
  // For exact match: h = w / spaceAR, with minH <= h <= maxH
  // => minH * spaceAR <= w <= maxH * spaceAR, AND minW <= w <= maxW
  const wLow = Math.max(minWidth, minHeight * spaceAR)
  const wHigh = Math.min(maxWidth, maxHeight * spaceAR)

  if (wLow <= wHigh) {
    // AR can be matched exactly. Pick dimensions closest to the space rect
    // so scale stays close to 1, giving the child natural layout space.
    const w = clamp(spaceWidth, wLow, wHigh)
    const h = w / spaceAR
    return { width: Math.round(w), height: Math.round(h) }
  }

  // Can't match AR exactly due to constraints — find the closest match.
  const candidates: Rect[] = [
    { width: minWidth, height: clamp(minWidth / spaceAR, minHeight, maxHeight) },
    { width: maxWidth, height: clamp(maxWidth / spaceAR, minHeight, maxHeight) },
    { width: clamp(minHeight * spaceAR, minWidth, maxWidth), height: minHeight },
    { width: clamp(maxHeight * spaceAR, minWidth, maxWidth), height: maxHeight },
  ]

  let best = candidates[0]
  let bestDiff = Infinity

  for (const c of candidates) {
    if (c.width <= 0 || c.height <= 0) continue
    const diff = Math.abs(c.width / c.height - spaceAR)
    if (diff < bestDiff) {
      bestDiff = diff
      best = c
    }
  }

  return { width: Math.round(best.width), height: Math.round(best.height) }
}

/**
 * Calculate the full maximizer layout: child rect, scale, and position.
 * Returns null when the available space has zero width or height.
 */
export function calculateMaximizerLayout(
  containerWidth: number,
  containerHeight: number,
  constraints: MaximizerConstraints,
): MaximizerLayout | null {
  if (containerWidth <= 0 || containerHeight <= 0) return null

  // Child rect sized to constraints, matching container AR as closely as possible
  const childRect = calculateChildRect(containerWidth, containerHeight, constraints)

  // Scale to fit the child rect within the container (contain)
  const scaleX = containerWidth / childRect.width
  const scaleY = containerHeight / childRect.height
  const scale = Math.min(scaleX, scaleY)

  // Center the scaled child within the container
  const scaledWidth = childRect.width * scale
  const scaledHeight = childRect.height * scale
  const left = (containerWidth - scaledWidth) / 2
  const top = (containerHeight - scaledHeight) / 2

  return {
    childWidth: childRect.width,
    childHeight: childRect.height,
    left,
    top,
    scale,
  }
}
