import type { ReferenceColorProp } from '@/theme/reference-theme'
import type { RadiusScaleProp, ScaleProp, ThemeContrast, ThemeMode } from '@gobistories/utensil-vue/theme/utensil-theme'

// Every control includes Inherit (→ undefined prop) so the block falls back to
// its parent context — ultimately the app root theme from the topbar editor.
export const colorChoices: Record<string, ReferenceColorProp | undefined> = {
  inherit: undefined,
  blue: 'blue',
  green: 'green',
  red: 'red',
  orange: 'orange',
}
export const modeChoices: Record<string, ThemeMode | undefined> = { inherit: undefined, light: 'light', dark: 'dark' }
export const contrastChoices: Record<string, ThemeContrast | undefined> = {
  inherit: undefined,
  normal: 'normal',
  high: 'high',
}
export const scaleChoices: Record<string, ScaleProp | undefined> = {
  inherit: undefined,
  small: 'small',
  normal: 'normal',
  large: 'large',
}
export const radiusChoices: Record<string, RadiusScaleProp | undefined> = {
  inherit: undefined,
  square: 'square',
  normal: 'normal',
  pill: 'pill',
}

export const colorKeys = Object.keys(colorChoices)
export const modeKeys = Object.keys(modeChoices)
export const contrastKeys = Object.keys(contrastChoices)
export const scaleKeys = Object.keys(scaleChoices)
export const radiusKeys = Object.keys(radiusChoices)

export function choiceLabel(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1)
}
