import type { InjectionKey } from 'vue'
import type { SetFocusedOptions } from '../../composables/useFocusNavigation'

export interface UtensilMenuContext {
  /** Set focus on an element */
  setFocused: (el: HTMLElement | null, options?: SetFocusedOptions) => void
}

export const UtensilMenuContextKey: InjectionKey<UtensilMenuContext> = Symbol('UtensilMenuContext')
