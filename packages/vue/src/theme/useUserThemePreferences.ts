import { ref, watch } from 'vue'
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

// Global state - initialized once
const storedMode = getStoredMode()
const mode = ref<ThemeMode>(resolveMode(storedMode))
const userHasSetMode = ref(storedMode !== undefined)

const storedContrast = getStoredContrast()
const contrast = ref<ThemeContrast>(storedContrast ?? 'normal')
const userHasSetContrast = ref(storedContrast !== undefined)

const storedReducedMotion = getStoredReducedMotion()
const reducedMotion = ref<ThemeReducedMotion>(storedReducedMotion ?? 'normal')
const userHasSetReducedMotion = ref(storedReducedMotion !== undefined)

// Persist mode changes to localStorage
watch(mode, (value) => {
  if (userHasSetMode.value) {
    storeMode(value)
  }
})

// Persist contrast changes to localStorage
watch(contrast, (value) => {
  if (userHasSetContrast.value) {
    storeContrast(value)
  }
})

// Persist reduced motion changes to localStorage
watch(reducedMotion, (value) => {
  if (userHasSetReducedMotion.value) {
    storeReducedMotion(value)
  }
})

export function useUserThemePreferences() {
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
