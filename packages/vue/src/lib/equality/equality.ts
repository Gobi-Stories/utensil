// Deep compare of objects
export function equals(a: unknown, b: unknown): boolean {
  // Check for strict equality (handles primitives and same reference)
  if (a === b) return true

  // Check for null/undefined cases
  if (a == null || b == null) return a === b

  // Check if types are different
  if (typeof a !== typeof b) return false

  // Handle Date objects
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime()
  }

  // Handle Arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (!equals(a[i], b[i])) return false
    }
    return true
  }

  // Handle one being array, other not
  if (Array.isArray(a) || Array.isArray(b)) return false

  // Handle objects
  if (typeof a === 'object' && typeof b === 'object') {
    const objectA = a as Record<string, unknown>
    const objectB = b as Record<string, unknown>

    const keysA = Object.keys(objectA)
    const keysB = Object.keys(objectB)

    if (keysA.length !== keysB.length) return false

    for (const key of keysA) {
      if (!keysB.includes(key)) return false
      if (!equals(objectA[key], objectB[key])) return false
    }

    return true
  }

  // All other cases (primitives that aren't equal)
  return false
}

export function differs(a: unknown, b: unknown): boolean {
  return !equals(a, b)
}
