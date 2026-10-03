import { ref, watch } from 'vue'
import { isRoundness, type RadiusScaleProp } from 'utensil-vue/theme/utensil-theme'
import { useUserThemePreferences } from 'utensil-vue/theme/useUserThemePreferences'
import { defaultPaperOptions, type PaperOptions } from 'utensil-vue/colors/generate-colors'
import { DEFAULT_PEN_COLOR, DEFAULT_PENCIL_COLOR, DEFAULT_PAPER_COLOR } from '@/theme/reference-color-presets'
import { router } from '../router'

// Shared theme editor state, owned at the app level so the shell topbar and bare
// pages hosting their own ThemeEditor read and write the same theme, with the
// URL query kept in sync.

function parseThemeFromUrl() {
  const params = new URLSearchParams(window.location.search)
  return {
    pen: params.get('pen'),
    pencil: params.get('pencil'),
    paper: params.get('paper'),
    radius: params.get('radius'),
    mode: params.get('mode'),
    tint: params.get('tint'),
    step: params.get('step'),
  }
}

const urlTheme = parseThemeFromUrl()
const hasUrlTheme = !!(
  urlTheme.pen ||
  urlTheme.pencil ||
  urlTheme.paper ||
  urlTheme.radius ||
  urlTheme.mode ||
  urlTheme.tint ||
  urlTheme.step
)

const { mode: themeMode, setMode, contrast, reducedMotion } = useUserThemePreferences()

if (urlTheme.mode === 'dark' || urlTheme.mode === 'light') setMode(urlTheme.mode)

export { themeMode, contrast, reducedMotion }

export const penColor = ref(urlTheme.pen ? `#${urlTheme.pen}` : DEFAULT_PEN_COLOR)
export const pencilColor = ref(urlTheme.pencil ? `#${urlTheme.pencil}` : DEFAULT_PENCIL_COLOR)
export const paperColor = ref(urlTheme.paper ? `#${urlTheme.paper}` : DEFAULT_PAPER_COLOR)

let radius: RadiusScaleProp = 1
if (typeof urlTheme.radius === 'string') {
  if (isRoundness(urlTheme.radius)) {
    radius = urlTheme.radius
  } else {
    const float = parseFloat(urlTheme.radius)
    if (!isNaN(float)) {
      radius = float
    }
  }
}
export const radiusScale = ref<RadiusScaleProp>(radius)

// Paper generation knobs travel with the theme: tint is a strength number or an
// intent mode ('auto'/'direct'), step is the stepContrast tone rung.
const initialPaperOptions: Required<PaperOptions> = { ...defaultPaperOptions }
if (urlTheme.tint === 'auto' || urlTheme.tint === 'direct') {
  initialPaperOptions.tint = urlTheme.tint
} else if (urlTheme.tint) {
  const tint = parseFloat(urlTheme.tint)
  if (!isNaN(tint)) initialPaperOptions.tint = tint
}
if (urlTheme.step) {
  const step = parseFloat(urlTheme.step)
  if (!isNaN(step)) initialPaperOptions.stepContrast = step
}
export const paperOptions = ref<Required<PaperOptions>>(initialPaperOptions)

// Skip persistence when loading from URL params so localStorage doesn't override.
// Re-enabled when the user interacts with theme controls.
export const themePersist = ref(!hasUrlTheme)

function syncThemeToUrl() {
  router.replace({
    query: {
      pen: penColor.value.replace('#', ''),
      pencil: pencilColor.value.replace('#', ''),
      paper: paperColor.value.replace('#', ''),
      radius: String(radiusScale.value),
      mode: themeMode.value,
      tint: String(paperOptions.value.tint),
      step: String(paperOptions.value.stepContrast),
    },
    hash: router.currentRoute.value.hash,
  })
}

// Sync theme controls to the URL when any value changes
watch([penColor, pencilColor, paperColor, radiusScale, themeMode, paperOptions], () => {
  themePersist.value = true
  syncThemeToUrl()
})
