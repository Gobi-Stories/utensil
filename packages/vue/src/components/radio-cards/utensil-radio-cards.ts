import type { InjectionKey, Ref } from 'vue'
import type { IconProp, UtensilUIVariation, ThemeConfig } from '../../theme/utensil-theme'

export type RadioIndicatorPosition = 'start' | 'end' | 'start-start' | 'start-end' | 'end-start' | 'end-end'

export interface UtensilRadioCardsContext<Theme extends ThemeConfig = ThemeConfig> {
  /** Card variation */
  variation: Ref<Exclude<UtensilUIVariation, 'solid'>>
  /** Radio indicator position */
  indicatorPosition: Ref<RadioIndicatorPosition>
  /** Whether to show the radio indicator */
  indicator: Ref<boolean>
  /** Icon name to display instead of the radio dot SVG */
  indicatorIcon: Ref<IconProp<Theme> | undefined>
  /** Don't change outline background on interactions */
  wireframe: Ref<boolean>
  /** Use thick borders */
  thick: Ref<boolean>
}

let utensilRadioCardsContextKey: InjectionKey<UtensilRadioCardsContext<ThemeConfig>>

export function UtensilRadioCardsContextKey<Theme extends ThemeConfig = ThemeConfig>(): InjectionKey<
  UtensilRadioCardsContext<Theme>
> {
  if (!utensilRadioCardsContextKey) {
    utensilRadioCardsContextKey = Symbol('UtensilRadioCardsContext')
  }

  return utensilRadioCardsContextKey
}
