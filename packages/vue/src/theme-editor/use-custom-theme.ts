import { watch, computed, ref } from 'vue'
import { useColorGenerator } from '../colors/use-color-generator'
import {
  applyHsl,
  getPaperPageColors,
  defaultPaperOptions,
  defaultTextContrast,
  resolveTextContrast,
  type PaperOptions,
  type TextContrast,
} from 'utensil-css/colors/generate-colors'
import type { ColorBackgrounds } from 'utensil-css/colors/generate-css'
import { DebouncerEnd } from '../lib/debouncer/debouncer-end'
import type { RadiusScaleProp } from '../theme/utensil-theme'

export type PrimaryColorMap = Record<string, string>

export interface CustomThemeScaleNames {
  pen: string
  pencil: string
  paper: string
}

/**
 * The default scale names generate standalone scales the consumer opts into by
 * pointing its theme at them. Naming a scale after one of the theme's existing
 * colors instead overrides that static scale in place — the generated CSS is
 * injected after it in the same cascade layer — re-theming the app live.
 */
export const defaultScaleNames: CustomThemeScaleNames = {
  pen: 'custom-pen',
  pencil: 'custom-pencil',
  paper: 'custom-paper',
}

export interface CustomThemeOptions {
  primaryColors?: PrimaryColorMap
  persist?: boolean
  paperOptions?: Required<PaperOptions>
  textContrast?: TextContrast
  scaleNames?: CustomThemeScaleNames
}

/** A single-ratio text contrast expanded to the per-mode pair the editor's sliders drive. */
export function textContrastPair(value: TextContrast): { light: number; dark: number } {
  return { light: resolveTextContrast('light', value), dark: resolveTextContrast('dark', value) }
}

function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function store<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* noop */
  }
}

/**
 * Composable for managing custom theme settings with CSS generation and persistence.
 *
 * Manages pen/pencil/paper colors and radius scale. Creates color generators that inject
 * `<style>` elements into the document head, making the generated color scales
 * available as CSS custom properties.
 *
 * The paper color is the page background. Its page colors (paper step 1 per mode) are
 * passed to the pen, pencil, and variant generators as the backgrounds their scales are
 * anchored to and composited against, so every scale adapts when the paper changes.
 * The paper generation knobs are managed and persisted alongside it.
 *
 * All settings are persisted to localStorage and restored on next use.
 *
 * @param defaultPen - Default pen color in hex format (e.g., '#0093ee')
 * @param defaultPencil - Default pencil color in hex format (e.g., '#6b7280')
 * @param defaultPaper - Default paper color in hex format (e.g., '#ffffff')
 * @param defaultRadiusScale - Default radius scale value
 * @param options - Optional configuration (primaryColors)
 */
const STORAGE_KEY_PEN = 'utensil-custom-theme:pen'
const STORAGE_KEY_PENCIL = 'utensil-custom-theme:pencil'
const STORAGE_KEY_PAPER = 'utensil-custom-theme:paper'
const STORAGE_KEY_PAPER_OPTIONS = 'utensil-custom-theme:paperOptions'
const STORAGE_KEY_TEXT_CONTRAST = 'utensil-custom-theme:textContrast'
const STORAGE_KEY_RADIUS_SCALE = 'utensil-custom-theme:radiusScale'

export function useCustomTheme(
  defaultPen: string,
  defaultPencil: string,
  defaultPaper: string,
  defaultRadiusScale: RadiusScaleProp,
  options?: CustomThemeOptions,
) {
  const {
    primaryColors,
    persist: initialPersist = true,
    paperOptions: paperDefaults = defaultPaperOptions,
    textContrast: textContrastDefault = defaultTextContrast,
    scaleNames = defaultScaleNames,
  } = options ?? {}
  const persist = ref(initialPersist)

  const initialPen = persist.value ? getStored(STORAGE_KEY_PEN, defaultPen) : defaultPen
  const initialPencil = persist.value ? getStored(STORAGE_KEY_PENCIL, defaultPencil) : defaultPencil
  const initialPaper = persist.value ? getStored(STORAGE_KEY_PAPER, defaultPaper) : defaultPaper
  // The editor drives the numeric tint and the auto/direct modes; the anchor stays on
  // the mode default ('picked' and 'matched' remain generator API options)
  const storedPaperOptions = persist.value ? getStored<PaperOptions>(STORAGE_KEY_PAPER_OPTIONS, {}) : {}
  const storedTint = storedPaperOptions.tint
  const initialPaperOptions: Required<PaperOptions> = {
    ...paperDefaults,
    tint:
      typeof storedTint === 'number' || storedTint === 'auto' || storedTint === 'direct'
        ? storedTint
        : paperDefaults.tint,
    stepContrast:
      typeof storedPaperOptions.stepContrast === 'number'
        ? storedPaperOptions.stepContrast
        : paperDefaults.stepContrast,
  }
  const initialTextContrast = textContrastPair(
    persist.value ? getStored(STORAGE_KEY_TEXT_CONTRAST, textContrastDefault) : textContrastDefault,
  )
  const initialRadiusScale = persist.value
    ? getStored(STORAGE_KEY_RADIUS_SCALE, defaultRadiusScale)
    : defaultRadiusScale

  // Debounce pen/pencil/paper CSS generation separately (short delay for responsiveness)
  const penDebouncer = new DebouncerEnd(30)
  const pencilDebouncer = new DebouncerEnd(30)
  const paperDebouncer = new DebouncerEnd(30)

  // Track the latest desired colors so the debounced action uses fresh values
  const pendingPen = ref(initialPen)
  const pendingPencil = ref(initialPencil)
  const pendingPaper = ref(initialPaper)
  const paperOptions = ref<Required<PaperOptions>>(initialPaperOptions)
  const textContrast = ref<TextContrast | undefined>(initialTextContrast)
  const radiusScale = ref<RadiusScaleProp>(initialRadiusScale)

  // The page colors the pen/pencil/variant scales are generated against
  const scaleBackgrounds = ref<ColorBackgrounds | undefined>(getPaperPageColors(initialPaper, initialPaperOptions))

  const penGenerator = useColorGenerator(scaleNames.pen, initialPen, { backgrounds: scaleBackgrounds, textContrast })
  const pencilGenerator = useColorGenerator(scaleNames.pencil, initialPencil, {
    backgrounds: scaleBackgrounds,
    textContrast,
  })
  const paperGenerator = useColorGenerator(scaleNames.paper, initialPaper, { paper: paperOptions, textContrast })

  // Debounce pen/pencil/paper CSS updates
  watch(pendingPen, () => {
    penDebouncer.run(async () => {
      penGenerator.baseColor.value = pendingPen.value
    })
  })
  watch(pendingPencil, () => {
    pencilDebouncer.run(async () => {
      pencilGenerator.baseColor.value = pendingPencil.value
    })
  })
  watch(pendingPaper, () => {
    paperDebouncer.run(async () => {
      paperGenerator.baseColor.value = pendingPaper.value
      // Re-anchor every other scale to the new page colors
      scaleBackgrounds.value = getPaperPageColors(pendingPaper.value, paperOptions.value)
    })
  })

  // Knob changes are discrete clicks; the paper generator watches the options itself,
  // so only the other scales' page anchoring needs recomputing.
  watch(paperOptions, () => {
    scaleBackgrounds.value = getPaperPageColors(pendingPaper.value, paperOptions.value)
  })

  // Create generators for variant colors that adapt to the pen color
  const variantGenerators = new Map<string, ReturnType<typeof useColorGenerator>>()

  if (primaryColors) {
    // Debounce variant CSS generation (longer delay, 5 scales are expensive)
    const variantDebouncer = new DebouncerEnd(150)

    for (const [name, baseColor] of Object.entries(primaryColors)) {
      const adapted = applyHsl(baseColor, initialPen, { saturation: 0.5, lightness: 0.75 })
      variantGenerators.set(name, useColorGenerator(name, adapted, { backgrounds: scaleBackgrounds, textContrast }))
    }

    // When pen color changes, debounce variant color adaptation
    watch(pendingPen, () => {
      variantDebouncer.run(async () => {
        const penColor = pendingPen.value
        for (const [name, baseColor] of Object.entries(primaryColors)) {
          const generator = variantGenerators.get(name)
          if (generator) {
            generator.baseColor.value = applyHsl(baseColor, penColor, { saturation: 0.5, lightness: 0.75 })
          }
        }
      })
    })
  }

  // Collect all generated CSS (pen + pencil + paper + variants) for copy
  const allCss = computed(() => {
    const parts = [
      penGenerator.generatedCss.value,
      pencilGenerator.generatedCss.value,
      paperGenerator.generatedCss.value,
    ]
    for (const [, generator] of variantGenerators) {
      parts.push(generator.generatedCss.value)
    }
    return parts.filter(Boolean).join('\n\n')
  })

  // Remember pre-swap colors so we can restore exactly (avoiding hex rounding drift).
  // Cleared when colors are modified externally (picker, preset, etc.).
  let preSwap: { pen: string; pencil: string } | null = null
  let swapping = false

  // Sync watchers fire immediately on assignment, letting us distinguish
  // swap-originated changes (swapping=true) from external changes.
  watch(
    pendingPen,
    () => {
      if (!swapping) preSwap = null
    },
    { flush: 'sync' },
  )
  watch(
    pendingPencil,
    () => {
      if (!swapping) preSwap = null
    },
    { flush: 'sync' },
  )

  function swap() {
    swapping = true
    try {
      if (preSwap) {
        const restored = { pen: preSwap.pen, pencil: preSwap.pencil }
        preSwap = null
        pendingPen.value = restored.pen
        pendingPencil.value = restored.pencil
        return restored
      }

      const currentPen = pendingPen.value
      const currentPencil = pendingPencil.value
      preSwap = { pen: currentPen, pencil: currentPencil }

      const newPen = applyHsl(currentPen, currentPencil, { hue: 1 })
      const newPencil = applyHsl(currentPencil, currentPen, { hue: 1 })
      pendingPen.value = newPen
      pendingPencil.value = newPencil
      return { pen: newPen, pencil: newPencil }
    } finally {
      swapping = false
    }
  }

  // Persist changes to localStorage (guarded by persist flag)
  watch(pendingPen, (color) => {
    if (persist.value) store(STORAGE_KEY_PEN, color)
  })
  watch(pendingPencil, (color) => {
    if (persist.value) store(STORAGE_KEY_PENCIL, color)
  })
  watch(pendingPaper, (color) => {
    if (persist.value) store(STORAGE_KEY_PAPER, color)
  })
  watch(paperOptions, (value) => {
    if (persist.value) store(STORAGE_KEY_PAPER_OPTIONS, value)
  })
  watch(textContrast, (value) => {
    if (persist.value) store(STORAGE_KEY_TEXT_CONTRAST, value)
  })
  watch(radiusScale, (value) => {
    if (persist.value) store(STORAGE_KEY_RADIUS_SCALE, value)
  })

  // When persistence is re-enabled, store current values immediately
  watch(persist, (enabled) => {
    if (enabled) {
      store(STORAGE_KEY_PEN, pendingPen.value)
      store(STORAGE_KEY_PENCIL, pendingPencil.value)
      store(STORAGE_KEY_PAPER, pendingPaper.value)
      store(STORAGE_KEY_PAPER_OPTIONS, paperOptions.value)
      store(STORAGE_KEY_TEXT_CONTRAST, textContrast.value)
      store(STORAGE_KEY_RADIUS_SCALE, radiusScale.value)
    }
  })

  return {
    pen: pendingPen,
    pencil: pendingPencil,
    paper: pendingPaper,
    paperOptions,
    textContrast,
    radiusScale,
    persist,
    penCss: penGenerator.generatedCss,
    pencilCss: pencilGenerator.generatedCss,
    paperCss: paperGenerator.generatedCss,
    allCss,
    swap,
  }
}
