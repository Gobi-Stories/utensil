import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { mount } from '@vue/test-utils'

// Each test imports a fresh copy of the module, as an app loading it for the first time would
async function importPreferences() {
  vi.resetModules()
  return import('./useUserThemePreferences')
}

// The system's settings, as media queries that match, which a test can change as the operating system would
const systemQueries = new Set<string>()
const queryLists = new Map<string, { list: MediaQueryList; listeners: Set<(event: MediaQueryListEvent) => void> }>()

function fakeMatchMedia(query: string): MediaQueryList {
  let entry = queryLists.get(query)
  if (!entry) {
    const listeners = new Set<(event: MediaQueryListEvent) => void>()
    const list = {
      media: query,
      get matches() {
        return systemQueries.has(query)
      },
      addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
      removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) =>
        listeners.delete(listener),
    } as unknown as MediaQueryList
    entry = { list, listeners }
    queryLists.set(query, entry)
  }
  return entry.list
}

function setSystem(query: string, matches: boolean) {
  if (matches) systemQueries.add(query)
  else systemQueries.delete(query)
  for (const listener of queryLists.get(query)?.listeners ?? []) {
    listener({ matches, media: query } as MediaQueryListEvent)
  }
}

const DARK = '(prefers-color-scheme: dark)'
const MORE_CONTRAST = '(prefers-contrast: more)'
const REDUCE_MOTION = '(prefers-reduced-motion: reduce)'

describe('useUserThemePreferences', () => {
  beforeEach(() => {
    localStorage.clear()
    systemQueries.clear()
    queryLists.clear()
    vi.stubGlobal('matchMedia', fakeMatchMedia)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('reads nothing when the module is imported', async () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem')

    await importPreferences()

    expect(getItem).not.toHaveBeenCalled()
  })

  it('reads the stored preferences on the first call', async () => {
    localStorage.setItem('utensil-theme-mode', 'dark')
    localStorage.setItem('utensil-theme-contrast', 'high')
    localStorage.setItem('utensil-theme-reduced-motion', 'reduced')
    const { useUserThemePreferences } = await importPreferences()

    const { mode, contrast, reducedMotion } = useUserThemePreferences()

    expect(mode.value).toBe('dark')
    expect(contrast.value).toBe('high')
    expect(reducedMotion.value).toBe('reduced')
  })

  it('shares one state across calls', async () => {
    const { useUserThemePreferences } = await importPreferences()
    const first = useUserThemePreferences()
    const second = useUserThemePreferences()

    first.setContrast('high')

    expect(second.contrast.value).toBe('high')
  })

  it('persists a preference once the user sets it', async () => {
    const { useUserThemePreferences } = await importPreferences()
    const { setMode, toggleReducedMotion } = useUserThemePreferences()

    setMode('dark')
    toggleReducedMotion()
    await nextTick()

    expect(localStorage.getItem('utensil-theme-mode')).toBe('dark')
    expect(localStorage.getItem('utensil-theme-reduced-motion')).toBe('reduced')
    expect(localStorage.getItem('utensil-theme-contrast')).toBeNull()
  })

  it('keeps persisting after the component that first called it unmounts', async () => {
    const { useUserThemePreferences } = await importPreferences()
    const FirstCaller = defineComponent({
      setup() {
        useUserThemePreferences()
        return () => null
      },
    })
    mount(FirstCaller).unmount()

    useUserThemePreferences().setMode('dark')
    await nextTick()

    expect(localStorage.getItem('utensil-theme-mode')).toBe('dark')
  })

  it('follows the system with nothing stored', async () => {
    setSystem(DARK, true)
    setSystem(MORE_CONTRAST, true)
    setSystem(REDUCE_MOTION, true)
    const { useUserThemePreferences } = await importPreferences()

    const { mode, modeChoice, contrast, contrastChoice, reducedMotion, reducedMotionChoice } = useUserThemePreferences()

    expect([mode.value, contrast.value, reducedMotion.value]).toEqual(['dark', 'high', 'reduced'])
    expect([modeChoice.value, contrastChoice.value, reducedMotionChoice.value]).toEqual(['system', 'system', 'system'])
  })

  it('follows a change to the system while on system', async () => {
    const { useUserThemePreferences } = await importPreferences()
    const { mode, contrast, reducedMotion } = useUserThemePreferences()
    expect([mode.value, contrast.value, reducedMotion.value]).toEqual(['light', 'normal', 'normal'])

    setSystem(DARK, true)
    setSystem(MORE_CONTRAST, true)
    setSystem(REDUCE_MOTION, true)

    expect([mode.value, contrast.value, reducedMotion.value]).toEqual(['dark', 'high', 'reduced'])
    await nextTick()
    expect(localStorage.length).toBe(0)
  })

  it('ignores a change to the system once the user has chosen', async () => {
    const { useUserThemePreferences } = await importPreferences()
    const { mode, setMode, contrast, setContrast } = useUserThemePreferences()

    setMode('light')
    setContrast('normal')
    setSystem(DARK, true)
    setSystem(MORE_CONTRAST, true)

    expect(mode.value).toBe('light')
    expect(contrast.value).toBe('normal')
  })

  it('returns to the system on system, forgetting the stored choice', async () => {
    localStorage.setItem('utensil-theme-reduced-motion', 'reduced')
    const { useUserThemePreferences } = await importPreferences()
    const { reducedMotion, reducedMotionChoice, setReducedMotion } = useUserThemePreferences()
    expect(reducedMotion.value).toBe('reduced')

    setReducedMotion('system')
    await nextTick()

    expect(reducedMotionChoice.value).toBe('system')
    expect(reducedMotion.value).toBe('normal')
    expect(localStorage.getItem('utensil-theme-reduced-motion')).toBeNull()

    setSystem(REDUCE_MOTION, true)
    expect(reducedMotion.value).toBe('reduced')
  })

  it('takes a write to the applied value as the user choosing it', async () => {
    const { useUserThemePreferences } = await importPreferences()
    const { mode, modeChoice } = useUserThemePreferences()

    mode.value = 'dark'
    await nextTick()

    expect(modeChoice.value).toBe('dark')
    expect(localStorage.getItem('utensil-theme-mode')).toBe('dark')
    setSystem(DARK, false)
    expect(mode.value).toBe('dark')
  })

  it('ignores a stored value it does not know', async () => {
    localStorage.setItem('utensil-theme-contrast', 'extreme')
    setSystem(MORE_CONTRAST, true)
    const { useUserThemePreferences } = await importPreferences()

    const { contrast, contrastChoice } = useUserThemePreferences()

    expect(contrastChoice.value).toBe('system')
    expect(contrast.value).toBe('high')
  })

  it('follows the system without throwing when storage is blocked', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError')
    })
    setSystem(DARK, true)
    const { useUserThemePreferences } = await importPreferences()

    const { mode, setMode } = useUserThemePreferences()
    expect(mode.value).toBe('dark')

    setMode('light')
    await nextTick()
    expect(mode.value).toBe('light')
  })

  it('follows nothing and applies the defaults where matchMedia is missing', async () => {
    vi.stubGlobal('matchMedia', undefined)
    const { useUserThemePreferences } = await importPreferences()

    const { mode, contrast, reducedMotion } = useUserThemePreferences()

    expect([mode.value, contrast.value, reducedMotion.value]).toEqual(['light', 'normal', 'normal'])
  })
})
