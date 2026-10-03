import { effectScope, ref, watch, type Ref } from 'vue'
import { resolveMode, type ThemeContrast, type ThemeMode, type ThemeReducedMotion } from './utensil-theme'

const MODE_STORAGE_KEY = 'utensil-theme-mode'
const CONTRAST_STORAGE_KEY = 'utensil-theme-contrast'
const REDUCED_MOTION_STORAGE_KEY = 'utensil-theme-reduced-motion'

function getStoredMode(): ThemeMode | undefined {
  const stored = localStorage.getItem(MODE_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') {
    return stored
  }
  return undefined
}

function storeMode(mode: ThemeMode) {
  localStorage.setItem(MODE_STORAGE_KEY, mode)
}

function getStoredContrast(): ThemeContrast | undefined {
  const stored = localStorage.getItem(CONTRAST_STORAGE_KEY)
  if (stored === 'high' || stored === 'normal') {
    return stored
  }
  return undefined
}

function storeContrast(contrast: ThemeContrast) {
  localStorage.setItem(CONTRAST_STORAGE_KEY, contrast)
}

function getStoredReducedMotion(): ThemeReducedMotion | undefined {
  const stored = localStorage.getItem(REDUCED_MOTION_STORAGE_KEY)
  if (stored === 'reduced' || stored === 'normal') {
    return stored
  }
  return undefined
}

function storeReducedMotion(reducedMotion: ThemeReducedMotion) {
  localStorage.setItem(REDUCED_MOTION_STORAGE_KEY, reducedMotion)
}

export interface UserThemePreferences {
  mode: Ref<ThemeMode>
  setMode: (value: ThemeMode) => void
  toggleThemeMode: () => void
  contrast: Ref<ThemeContrast>
  setContrast: (value: ThemeContrast) => void
  toggleContrast: () => void
  reducedMotion: Ref<ThemeReducedMotion>
  setReducedMotion: (value: ThemeReducedMotion) => void
  toggleReducedMotion: () => void
}

// Shared by every caller, created by the first call: importing this module reads nothing
let preferences: UserThemePreferences | undefined

function createPreferences(): UserThemePreferences {
  const storedMode = getStoredMode()
  const mode = ref<ThemeMode>(resolveMode(storedMode))
  const userHasSetMode = ref(storedMode !== undefined)

  const storedContrast = getStoredContrast()
  const contrast = ref<ThemeContrast>(storedContrast ?? 'normal')
  const userHasSetContrast = ref(storedContrast !== undefined)

  const storedReducedMotion = getStoredReducedMotion()
  const reducedMotion = ref<ThemeReducedMotion>(storedReducedMotion ?? 'normal')
  const userHasSetReducedMotion = ref(storedReducedMotion !== undefined)

  // Persist changes to localStorage
  watch(mode, (value) => {
    if (userHasSetMode.value) {
      storeMode(value)
    }
  })

  watch(contrast, (value) => {
    if (userHasSetContrast.value) {
      storeContrast(value)
    }
  })

  watch(reducedMotion, (value) => {
    if (userHasSetReducedMotion.value) {
      storeReducedMotion(value)
    }
  })

  function setMode(value: ThemeMode) {
    userHasSetMode.value = true
    mode.value = value
  }

  function toggleThemeMode() {
    setMode(mode.value === 'light' ? 'dark' : 'light')
  }

  function setContrast(value: ThemeContrast) {
    userHasSetContrast.value = true
    contrast.value = value
  }

  function toggleContrast() {
    setContrast(contrast.value === 'normal' ? 'high' : 'normal')
  }

  function setReducedMotion(value: ThemeReducedMotion) {
    userHasSetReducedMotion.value = true
    reducedMotion.value = value
  }

  function toggleReducedMotion() {
    setReducedMotion(reducedMotion.value === 'normal' ? 'reduced' : 'normal')
  }

  return {
    mode,
    setMode,
    toggleThemeMode,
    contrast,
    setContrast,
    toggleContrast,
    reducedMotion,
    setReducedMotion,
    toggleReducedMotion,
  }
}

/**
 * The user's mode, contrast and reduced motion preferences, persisted to localStorage and shared
 * across the app. The first call reads storage and starts persisting; later calls share that state.
 */
export function useUserThemePreferences(): UserThemePreferences {
  // A detached scope keeps the persisting watchers alive beyond the component that first calls this
  preferences ??= effectScope(true).run(createPreferences)!
  return preferences
}
