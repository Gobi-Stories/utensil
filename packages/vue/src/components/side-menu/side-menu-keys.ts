import type { InjectionKey, Ref } from 'vue'

export type SideMenuMode = 'open' | 'closed' | 'responsive'

export interface SideMenuContext {
  mode: Ref<SideMenuMode>
  collapsed: Ref<boolean>
  // The menu-level default for items closing the menu when clicked.
  closeOnClick: Ref<boolean>
  // Closes the menu when it floats over content; inline menus stay put.
  close: () => void
}

/**
 * Injection key for side menu context.
 * Provides the current drawer mode so children can adapt their behavior and styling.
 */
export const sideMenuContextKey: InjectionKey<SideMenuContext> = Symbol('sideMenuContext')
