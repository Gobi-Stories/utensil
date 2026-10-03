import { afterEach, describe, expect, it, vi } from 'vitest'

// Importing a Utensil module must not do anything: no storage, listeners, media queries or timers.
// Work happens when a function is called (docs/STANDARDS.md → "Module Scope"). Dependencies that
// work on import (FontAwesome reads matchMedia) are outside the rule: only work called directly from
// Utensil's own source fails.
const modules = import.meta.glob(['./**/*.ts', './**/*.vue', '!./**/*.test.ts', '!./**/*.d.ts'])

const utensilSource = /\/packages\/(vue|css)\/src\//

// The first stack frame outside this file: the code that made the call
function caller(stack = ''): string {
  return stack.split('\n').find((frame) => frame.includes('/') && !frame.includes('no-import-side-effects')) ?? ''
}

describe('importing a module', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it.each(Object.keys(modules))('%s does no work', async (path) => {
    vi.resetModules()
    const calls: string[] = []

    function watch<Target extends object>(target: Target, method: keyof Target & string, label: string) {
      const original = target[method] as (...args: unknown[]) => unknown
      vi.spyOn(target, method as never).mockImplementation(function (this: unknown, ...args: unknown[]) {
        calls.push(`${label} from ${caller(new Error().stack).trim()}`)
        return original.apply(this, args)
      } as never)
    }

    watch(Storage.prototype, 'getItem', 'localStorage.getItem')
    watch(Storage.prototype, 'setItem', 'localStorage.setItem')
    watch(Storage.prototype, 'removeItem', 'localStorage.removeItem')
    watch(window, 'addEventListener', 'window.addEventListener')
    watch(document, 'addEventListener', 'document.addEventListener')
    watch(globalThis, 'setTimeout', 'setTimeout')
    watch(globalThis, 'setInterval', 'setInterval')
    vi.stubGlobal('matchMedia', (query: string) => {
      calls.push(`matchMedia from ${caller(new Error().stack).trim()}`)
      return { matches: false, media: query, addEventListener() {}, removeEventListener() {} }
    })

    await modules[path]()

    expect(calls.filter((call) => utensilSource.test(call))).toEqual([])
  })
})
