import type { InjectionKey, Ref } from 'vue'
import type { SetFocusedOptions } from '../../composables/useFocusNavigation'

export interface UtensilNavigationMenuContext {
  /** Currently active item value */
  activeValue: Ref<string | undefined>
  /** Menu orientation */
  orientation: Ref<'horizontal' | 'vertical'>
  /** Open an item's content panel */
  open: (value: string) => void
  /** Close an item's content panel, or close all if no value given */
  close: (value?: string) => void
  /** Toggle an item's content panel (handles openedByHover click absorption) */
  toggle: (value: string) => void
  /** Focus an item and begin delayed open */
  focusItem: (value: string, el?: HTMLElement) => void
  /** Cancel a pending delayed open for an item */
  cancelPendingOpen: (value: string) => void
  /** Cancel pending close timeout */
  cancelClose: () => void
  /** Set focus on an element */
  setFocused: (el: HTMLElement | null, options?: SetFocusedOptions) => void
  /** Register a menu item */
  registerItem: (value: string, hasContent: boolean) => void
  /** Unregister a menu item */
  unregisterItem: (value: string) => void
  /** Get item values in DOM order */
  getItemValues: () => string[]
  /** Get motion direction for an item's content animation */
  getMotionDirection: (value: string) => 'from-start' | 'from-end' | 'to-start' | 'to-end' | undefined
  /** Whether an item should be rendered (active or was-active for exit animation) */
  shouldRender: (value: string) => boolean
  /** Whether an item is currently active */
  isActive: (value: string) => boolean
}

export const UtensilNavigationMenuContextKey: InjectionKey<UtensilNavigationMenuContext> =
  Symbol('UtensilNavigationMenuContext')
