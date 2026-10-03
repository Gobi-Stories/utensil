import type { InjectionKey, Ref } from 'vue'

export interface UtensilRadioButtonsContext {
  /** Whether buttons are round */
  round: Ref<boolean>
}

export const UtensilRadioButtonsContextKey: InjectionKey<UtensilRadioButtonsContext> =
  Symbol('UtensilRadioButtonsContext')
