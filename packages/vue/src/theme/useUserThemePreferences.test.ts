import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { mount } from '@vue/test-utils'

// Each test imports a fresh copy of the module, as an app loading it for the first time would
async function importPreferences() {
  vi.resetModules()
  return import('./useUserThemePreferences')
}

describe('useUserThemePreferences', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
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
})
