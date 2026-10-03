import type { ThemeConfig, IconProp } from '../../theme/utensil-theme'

/**
 * Represents an option in the UtensilSelect component.
 */
export interface SelectOption<Theme extends ThemeConfig = ThemeConfig> {
  /** The value that will be emitted when this option is selected */
  value: string
  /** The display label for this option */
  label: string
  /** Optional icon to display before the label */
  icon?: IconProp<Theme>
  /** Whether this option is disabled */
  disabled?: boolean
}

/**
 * Size options for the select component.
 */
export type SelectSize = 'small' | 'medium' | 'large'
