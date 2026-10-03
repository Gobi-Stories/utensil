import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import type { UtensilIcons } from './utensil-icons'

export const ThemeStateKey = Symbol.for('utensil-theme')

export type ThemeMode = 'light' | 'dark'
export type Instrument = 'pen' | 'pencil' | 'paper'
export type ThemeContrast = 'high' | 'normal'
export type ThemeReducedMotion = 'reduced' | 'normal'
export type UtensilUIVariation = 'solid' | 'outline' | 'surface' | 'soft' | 'text' | 'overlay' | 'unstyled'

// These defaults are no good for UtensilTheme
export const defaultUtensilPen = 'gray'
export const defaultUtensilPencil = 'gray'
export const defaultUtensilPaper = 'gray'
export const defaultUtensilVariants: VariantMap<ThemeConfig> = {
  success: 'gray',
  warning: 'gray',
  error: 'gray',
  disabled: 'gray',
}

export const defaultUtensilTextThemeClasses: TextThemeClasses<ThemeConfig> = {
  ui: 'text-ui',
  content: 'text-content',
}

export { utensilIconMap as defaultUtensilIcons } from './utensil-icons'

export interface UtensilColors {
  gray: true
}

export interface UtensilVariants {
  success: true
  warning: true
  error: true
  disabled: true
}

export interface UtensilTextThemes {
  ui: true
  content: true
}

export interface ThemeConfig {
  name: string
  color: UtensilColors
  variant: UtensilVariants
  text: UtensilTextThemes
  icon: UtensilIcons
}

export type ThemeName<Theme extends ThemeConfig = ThemeConfig> = Theme['name']
export type Color<Theme extends ThemeConfig = ThemeConfig> = keyof Theme['color']
export type Variant<Theme extends ThemeConfig = ThemeConfig> = keyof Theme['variant']
export type ColorProp<Theme extends ThemeConfig = ThemeConfig> = Color<Theme> | Variant<Theme> | Instrument
export type VariantMap<Theme extends ThemeConfig = ThemeConfig> = Record<Variant<Theme>, ColorProp<Theme>>
export type TextTheme<Theme extends ThemeConfig = ThemeConfig> = keyof Theme['text']
export type TextThemeClasses<Theme extends ThemeConfig = ThemeConfig> = Record<TextTheme<Theme>, string>
export type TextThemeProp<Theme extends ThemeConfig = ThemeConfig> = TextTheme<Theme>
export type Icon<Theme extends ThemeConfig = ThemeConfig> = keyof Theme['icon']
export type IconMap<Theme extends ThemeConfig = ThemeConfig> = Record<Icon<Theme>, IconDefinition>
export type IconProp<Theme extends ThemeConfig = ThemeConfig> = Icon<Theme>

export type UtensilSize = 'micro' | 'tiny' | 'small' | 'normal' | 'large' | 'giant' | 'super'
export type ScaleProp = number | UtensilSize
export const scaleMap: Record<ScaleProp, number> = {
  micro: 0.5,
  tiny: 0.75,
  small: 0.875,
  normal: 1,
  large: 1.125,
  giant: 1.375,
  super: 1.5,
}

export type UtensilRoundness = 'square' | 'sharp' | 'subtle' | 'normal' | 'round' | 'bubble' | 'pill' | 'circle'
export type RadiusScaleProp = number | UtensilRoundness
export const radiusScaleMap: Record<UtensilRoundness, number> = {
  square: 0,
  sharp: 0.25,
  subtle: 0.5,
  normal: 1,
  round: 1.5,
  bubble: 2,
  pill: 3,
  circle: 4,
}

export function isRoundness(value: unknown): value is UtensilRoundness {
  if (typeof value !== 'string') {
    return false
  }

  return value in radiusScaleMap
}

const numberToRoundnessMap = new Map(
  Object.entries(radiusScaleMap).map(([key, value]) => [value, key as UtensilRoundness]),
)

export function roundnessToNumber(value: RadiusScaleProp): number {
  if (typeof value === 'number') return value
  return radiusScaleMap[value]
}

export function numberToRoundness(value: RadiusScaleProp): UtensilRoundness | number {
  if (typeof value === 'string') return value
  return numberToRoundnessMap.get(value) ?? value
}

export type ThemeState<Theme extends ThemeConfig = ThemeConfig> = {
  mode: ThemeMode
  name?: Theme['name']
  pen: Color<Theme>
  pencil: Color<Theme>
  paper: Color<Theme>
  contrast: ThemeContrast
  reducedMotion: ThemeReducedMotion
  text: TextTheme<Theme>
  textThemeClasses: TextThemeClasses<Theme>
  variants: VariantMap<Theme>
  icons: IconMap<Theme>
  scale: number
  radiusScale: number
}

export function resolveMode(mode?: ThemeMode): ThemeMode {
  let _mode = mode
  if (!_mode) {
    _mode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  return _mode
}
