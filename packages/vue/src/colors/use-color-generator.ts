import { ref, watch, readonly, type Ref } from 'vue'
import { generateColorCss, type ColorBackgrounds } from 'utensil-css/colors/generate-css'
import type { PaperOptions, TextContrast } from 'utensil-css/colors/generate-colors'

export interface ColorGeneratorOptions {
  /** Reactive page backgrounds the pen/pencil scales are anchored to per mode */
  backgrounds?: Ref<ColorBackgrounds | undefined>
  /** Reactive paper generation knobs */
  paper?: Ref<PaperOptions | undefined>
  /** Reactive WCAG contrast the text step (11) is solved to against the page, single or per-mode */
  textContrast?: Ref<TextContrast | undefined>
}

/**
 * Composable for generating and managing dynamic color scales.
 *
 * Creates a style element in the DOM that contains the generated CSS for a color scale.
 * The style element is identified by a data attribute with the color name.
 * When the base color, the page backgrounds, or the paper options change, new CSS is
 * generated and the style element is updated.
 *
 * @param name - The name of the color (e.g., 'custom-pen', 'custom-pencil')
 * @param initialColor - The initial base color in hex format (e.g., '#0093ee')
 * @param options - Optional reactive backgrounds and paper generation knobs
 * @returns An object containing the baseColor ref and the generated CSS string ref
 */
export function useColorGenerator(name: string, initialColor: string, options?: ColorGeneratorOptions) {
  const baseColor = ref(initialColor)
  const generatedCss = ref('')

  // Create and manage the style element
  let styleElement: HTMLStyleElement | null = null

  function getOrCreateStyleElement(): HTMLStyleElement {
    // Check if a style element with this name already exists
    const existing = document.querySelector<HTMLStyleElement>(`style[data-utensil-color="${name}"]`)

    if (existing) {
      return existing
    }

    // Create a new style element
    const element = document.createElement('style')
    element.setAttribute('data-utensil-color', name)
    document.head.appendChild(element)
    return element
  }

  function updateCss(color: string) {
    // Validate hex color format
    if (!isValidHexColor(color)) {
      return
    }

    const css = generateColorCss(name, color, {
      backgrounds: options?.backgrounds?.value,
      paper: options?.paper?.value,
      textContrast: options?.textContrast?.value,
    })
    generatedCss.value = css

    if (!styleElement) {
      styleElement = getOrCreateStyleElement()
    }

    styleElement.textContent = css
  }

  function isValidHexColor(color: string): boolean {
    // Match #RGB, #RRGGBB, #RGBA, #RRGGBBAA
    return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(color)
  }

  // Initial CSS generation
  updateCss(baseColor.value)

  // Watch for color changes
  watch(baseColor, (newColor) => {
    updateCss(newColor)
  })

  if (options?.backgrounds) {
    watch(options.backgrounds, () => {
      updateCss(baseColor.value)
    })
  }

  if (options?.paper) {
    watch(options.paper, () => {
      updateCss(baseColor.value)
    })
  }

  if (options?.textContrast) {
    watch(options.textContrast, () => {
      updateCss(baseColor.value)
    })
  }

  return {
    baseColor,
    generatedCss: readonly(generatedCss) as Ref<string>,
  }
}
