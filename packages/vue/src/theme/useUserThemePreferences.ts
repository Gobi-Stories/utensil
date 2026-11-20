import { computed, effectScope, onScopeDispose, ref, watch, type Ref, type WritableComputedRef } from 'vue'
import type {
  ThemeContrast,
  ThemeContrastChoice,
  ThemeMode,
  ThemeModeChoice,
  ThemePreferenceChoice,
  ThemeReducedMotion,
  ThemeReducedMotionChoice,
} from './utensil-theme'

const MODE_STORAGE_KEY = 'utensil-theme-mode'
const CONTRAST_STORAGE_KEY = 'utensil-theme-contrast'
const REDUCED_MOTION_STORAGE_KEY = 'utensil-theme-reduced-motion'

// Storage throws where it's blocked (some private windows, cookies disabled, sandboxed iframes): a choice is then
// applied but not remembered, and nothing stored is read
function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string | null) {
  try {
    if (value === null) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, value)
    }
  } catch {
    // Blocked: the choice lasts until the page is closed
  }
}

function queryMedia(query: string): MediaQueryList | undefined {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia(query) : undefined
}

interface PreferenceOptions<Value extends string> {
  key: string
  /** The media query that asks for `matched`; the other value applies when it doesn't match */
  query: string
  matched: Value
  unmatched: Value
}

interface Preference<Value extends string> {
  choice: Ref<ThemePreferenceChoice<Value>>
  value: WritableComputedRef<Value>
  set: (choice: ThemePreferenceChoice<Value>) => void
}

function createPreference<Value extends string>({
  key,
  query,
  matched,
  unmatched,
}: PreferenceOptions<Value>): Preference<Value> {
  const stored = readStorage(key)
  const choice = ref(
    (stored === matched || stored === unmatched ? stored : 'system') as ThemePreferenceChoice<Value>,
  ) as Ref<ThemePreferenceChoice<Value>>

  // The system's setting, kept live: a preference left on 'system' follows a change to it while the app is open
  const media = queryMedia(query)
  const system = ref(media?.matches ? matched : unmatched) as Ref<Value>
  if (media && typeof media.addEventListener === 'function') {
    const onChange = (event: MediaQueryListEvent) => {
      system.value = event.matches ? matched : unmatched
    }
    media.addEventListener('change', onChange)
    onScopeDispose(() => media.removeEventListener('change', onChange))
  }

  // A choice is remembered, and 'system' forgets it
  watch(choice, (value) => writeStorage(key, value === 'system' ? null : value))

  function set(value: ThemePreferenceChoice<Value>) {
    choice.value = value
  }

  // Writing the applied value is a choice of it
  const value = computed<Value>({
    get: () => (choice.value === 'system' ? system.value : choice.value),
    set,
  })

  return { choice, value, set }
}

export interface UserThemePreferences {
  /** The mode that applies: the user's choice, or the system's under `'system'` */
  mode: Ref<ThemeMode>
  /** The user's choice of mode, `'system'` until they make one */
  modeChoice: Ref<ThemeModeChoice>
  /** Choose a mode, or `'system'` to follow the system's again */
  setMode: (value: ThemeModeChoice) => void
  toggleThemeMode: () => void
  contrast: Ref<ThemeContrast>
  contrastChoice: Ref<ThemeContrastChoice>
  setContrast: (value: ThemeContrastChoice) => void
  toggleContrast: () => void
  reducedMotion: Ref<ThemeReducedMotion>
  reducedMotionChoice: Ref<ThemeReducedMotionChoice>
  setReducedMotion: (value: ThemeReducedMotionChoice) => void
  toggleReducedMotion: () => void
}

// Shared by every caller, created by the first call: importing this module reads nothing
let preferences: UserThemePreferences | undefined

function createPreferences(): UserThemePreferences {
  const mode = createPreference<ThemeMode>({
    key: MODE_STORAGE_KEY,
    query: '(prefers-color-scheme: dark)',
    matched: 'dark',
    unmatched: 'light',
  })
  const contrast = createPreference<ThemeContrast>({
    key: CONTRAST_STORAGE_KEY,
    query: '(prefers-contrast: more)',
    matched: 'high',
    unmatched: 'normal',
  })
  const reducedMotion = createPreference<ThemeReducedMotion>({
    key: REDUCED_MOTION_STORAGE_KEY,
    query: '(prefers-reduced-motion: reduce)',
    matched: 'reduced',
    unmatched: 'normal',
  })

  return {
    mode: mode.value,
    modeChoice: mode.choice,
    setMode: mode.set,
    toggleThemeMode: () => mode.set(mode.value.value === 'light' ? 'dark' : 'light'),
    contrast: contrast.value,
    contrastChoice: contrast.choice,
    setContrast: contrast.set,
    toggleContrast: () => contrast.set(contrast.value.value === 'normal' ? 'high' : 'normal'),
    reducedMotion: reducedMotion.value,
    reducedMotionChoice: reducedMotion.choice,
    setReducedMotion: reducedMotion.set,
    toggleReducedMotion: () => reducedMotion.set(reducedMotion.value.value === 'normal' ? 'reduced' : 'normal'),
  }
}

/**
 * The user's mode, contrast and reduced motion preferences, shared across the app. Each follows the operating
 * system's setting (`prefers-color-scheme`, `prefers-contrast`, `prefers-reduced-motion`), live, until the user
 * chooses a value, which is remembered in localStorage until they choose `'system'` again. The first call reads
 * storage and the system's settings; later calls share that state.
 */
export function useUserThemePreferences(): UserThemePreferences {
  // A detached scope keeps the persisting watchers and media listeners alive beyond the component that first calls this
  preferences ??= effectScope(true).run(createPreferences)!
  return preferences
}
