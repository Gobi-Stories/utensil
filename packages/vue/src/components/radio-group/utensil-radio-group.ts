import type { InjectionKey, Ref } from 'vue'
import type { ColorProp, UtensilUIVariation, ScaleProp, ThemeConfig } from '../../theme/utensil-theme'

export type UtensilRadioGroupFrame = 'plain' | 'segmented'

export interface UtensilRadioGroupContext<Theme extends ThemeConfig = ThemeConfig> {
  /** Currently selected value (single-select mode) */
  value: Ref<string | undefined>
  /** Whether the group selects multiple values */
  multiple: Ref<boolean>
  /** Whether a value is currently selected */
  isSelected: (value: string) => boolean
  /** Set (or, in multiple mode, toggle) a value */
  setValue: (value: string) => void
  /** Shared variation for all children */
  variation: Ref<Exclude<UtensilUIVariation, 'solid'>>
  /** Variation for selected children, taking precedence over `variation` */
  onVariation: Ref<UtensilUIVariation | undefined>
  /** Variation for unselected children, taking precedence over `variation` */
  offVariation: Ref<UtensilUIVariation | undefined>
  /** Color for selected children */
  onColor: Ref<ColorProp<Theme> | undefined>
  /** Color for unselected children */
  offColor: Ref<ColorProp<Theme> | undefined>
  /** Shared scale for all children */
  scale: Ref<ScaleProp>
  /** Whether the entire group is disabled */
  disabled: Ref<boolean>
  /** Check if a child should be tabbable */
  isTabbable: (value: string) => boolean
}

let utensilRadioGroupContextKey: InjectionKey<UtensilRadioGroupContext<ThemeConfig>>

// One shared Symbol, typed per call so the context can carry the caller's Theme.
export function UtensilRadioGroupContextKey<Theme extends ThemeConfig = ThemeConfig>(): InjectionKey<
  UtensilRadioGroupContext<Theme>
> {
  if (!utensilRadioGroupContextKey) {
    utensilRadioGroupContextKey = Symbol('UtensilRadioGroupContext')
  }

  return utensilRadioGroupContextKey
}
