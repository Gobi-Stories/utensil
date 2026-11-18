import type { InjectionKey, Ref } from 'vue'
import type { UtensilUIVariation } from '../../theme/utensil-theme'

export type ToolbarOrientation = 'horizontal' | 'vertical'
export type ToolbarVariation = Extract<UtensilUIVariation, 'surface' | 'soft' | 'outline' | 'unstyled'>

export interface UtensilToolbarContext {
  /** The direction the toolbar's controls run in */
  orientation: Ref<ToolbarOrientation>
}

export const UtensilToolbarContextKey: InjectionKey<UtensilToolbarContext> = Symbol('UtensilToolbarContext')

export const TOOLBAR_DEFAULTS = {
  orientation: 'horizontal',
} as const satisfies { orientation: ToolbarOrientation }

/**
 * The controls the arrow keys move between. Fields that use the arrow keys themselves (text entry, selects, sliders)
 * aren't among them: they keep their own place in the tab order. A select's trigger is a button, so it is left out by
 * its combobox role.
 */
const ITEM_SELECTOR = [
  'button',
  'a[href]',
  'input[type="checkbox"]',
  '[role="button"]',
  '[role="checkbox"]',
  '[role="switch"]',
  '[data-focusable]',
].join(', ')

// Controls matched above that use the arrow keys themselves
const OWN_KEYS_SELECTOR = '[role="combobox"], [role="slider"], [role="spinbutton"], [role="tab"]'

// Content inside these belongs to another widget, even when it's rendered inside the toolbar
const FOREIGN_SELECTOR =
  '[popover], [role="dialog"], [role="menu"], [role="listbox"], [role="toolbar"], [role="tablist"]'

/**
 * A radio group is one stop of the toolbar: the arrow keys along the toolbar move past it, and those across it move
 * between its radios
 */
export const TOOLBAR_GROUP_SELECTOR = '[role="radiogroup"]'

/**
 * The enabled, visible controls a toolbar's arrow keys move between, in order. An aria-disabled control is among
 * them: it stays focusable, so it can be found and its reason read. A radio group is one of them: its
 * checked radio, or its first while none is checked, as the group's own tab stop is.
 */
export function toolbarItems(toolbar: HTMLElement): HTMLElement[] {
  const controls = Array.from(toolbar.querySelectorAll<HTMLElement>(ITEM_SELECTOR)).filter(
    (item) =>
      !item.matches(':disabled') &&
      !item.matches(OWN_KEYS_SELECTOR) &&
      item.checkVisibility() &&
      ownedBy(toolbar, item),
  )
  const items: HTMLElement[] = []
  const groups = new Set<Element>()
  for (const control of controls) {
    const group = toolbarGroupOf(toolbar, control)
    if (!group) {
      items.push(control)
    } else if (!groups.has(group)) {
      groups.add(group)
      const members = controls.filter((member) => group.contains(member))
      items.push(members.find((member) => member.getAttribute('aria-checked') === 'true') ?? members[0])
    }
  }
  return items
}

/** The radio group in the toolbar that an element sits in, if any */
export function toolbarGroupOf(toolbar: HTMLElement, element: Element): Element | null {
  const group = element.closest(TOOLBAR_GROUP_SELECTOR)
  return group && group !== toolbar && toolbar.contains(group) ? group : null
}

// An item belongs to the toolbar unless it sits inside another item or another widget's content
function ownedBy(toolbar: HTMLElement, item: HTMLElement): boolean {
  const boundary = item.parentElement?.closest(`${ITEM_SELECTOR}, ${FOREIGN_SELECTOR}`)
  return !boundary || boundary === toolbar || !toolbar.contains(boundary)
}
