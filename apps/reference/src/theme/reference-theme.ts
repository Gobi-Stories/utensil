import {
  type UtensilColors,
  type ThemeConfig,
  type UtensilVariants,
  type UtensilTextThemes,
  type VariantMap,
  type Variant,
  type ColorProp,
  type TextThemeClasses,
} from 'utensil-vue/theme/utensil-theme'
import { type ReferenceIcons } from './reference-icons'

interface ReferenceVariants extends UtensilVariants {
  primary: true
  brand: true
  favorite: true
}

export type ReferenceVariant = Variant<ReferenceThemeConfig>

interface ReferenceColors extends UtensilColors {
  blue: true
  red: true
  orange: true
  green: true
  grey: true
  pink: true
  'custom-pen': true
  'custom-pencil': true
  'custom-paper': true
}

export type ReferenceColor = keyof ReferenceColors

interface ReferenceTextThemes extends UtensilTextThemes {
  article: true
  code: true
}

export interface ReferenceThemeConfig extends ThemeConfig {
  name: 'utensil-reference'
  color: ReferenceColors
  variant: ReferenceVariants
  text: ReferenceTextThemes
  icon: ReferenceIcons
}

export const referenceVariantMap: VariantMap<ReferenceThemeConfig> = {
  primary: 'blue',
  brand: 'blue',
  success: 'green',
  favorite: 'pink',
  warning: 'orange',
  error: 'red',
  disabled: 'gray',
} as const

export const referenceTextThemeClasses: TextThemeClasses<ReferenceThemeConfig> = {
  ui: 'text-reference text-ui',
  content: 'text-reference text-content',
  article: 'text-reference text-content text-article',
  code: 'text-reference text-ui text-code',
}

export const referenceVariants = Object.keys(referenceVariantMap) as Variant<ReferenceThemeConfig>[]
export const referenceDefaultPen = 'custom-pen'
export const referenceDefaultPencil = 'custom-pencil'
export const referenceDefaultPaper = 'custom-paper'

export type ReferenceColorProp = ColorProp<ReferenceThemeConfig>
