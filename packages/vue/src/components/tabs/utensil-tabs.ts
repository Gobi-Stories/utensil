import type { InjectionKey, Ref } from 'vue'

export type TabsSize = '1' | '2'
export type TabsOrientation = 'horizontal' | 'vertical'
export type TabsActivationMode = 'automatic' | 'manual'

export interface UtensilTabsContext {
  /** Currently selected tab value */
  value: Ref<string>
  /** Set the selected tab */
  setValue: (value: string) => void
  /** Unique base ID for generating trigger/content IDs */
  baseId: string
  /** Tab orientation */
  orientation: Ref<TabsOrientation>
  /** Activation mode - automatic activates on focus, manual requires click/enter */
  activationMode: Ref<TabsActivationMode>
  /** Register a trigger */
  registerTrigger: (value: string, element: HTMLElement) => void
  /** Unregister a trigger */
  unregisterTrigger: (value: string) => void
  /** Get trigger element by value */
  getTriggerElement: (value: string) => HTMLElement | undefined
}

export const UtensilTabsContextKey: InjectionKey<UtensilTabsContext> = Symbol('UtensilTabsContext')

export interface UtensilTabsListContext {
  /** Size of the tabs */
  size: Ref<TabsSize>
  /** List element ref for keyboard navigation */
  listRef: Ref<HTMLElement | undefined>
}

export const UtensilTabsListContextKey: InjectionKey<UtensilTabsListContext> = Symbol('UtensilTabsListContext')

/** Generate trigger ID from base ID and value */
export function makeTriggerId(baseId: string, value: string): string {
  return `${baseId}-trigger-${value}`
}

/** Generate content ID from base ID and value */
export function makeContentId(baseId: string, value: string): string {
  return `${baseId}-content-${value}`
}
