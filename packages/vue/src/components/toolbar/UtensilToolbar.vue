<template generic="Theme extends ThemeConfig">
  <div
    ref="toolbarRef"
    class="utensil-toolbar"
    :class="[...themeClasses, `ui-${variation}`, orientation]"
    :style="style"
    role="toolbar"
    :aria-label="ariaLabel"
    :aria-orientation="orientation"
    @keydown.capture="onGroupKeydown"
    @keydown="keys.onKeydown"
    @focusin="onFocusin"
  >
    <slot :orientation="orientation" :focus-item="focusItem" />
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed, onMounted, onUnmounted, provide, ref } from 'vue'
import type { ColorProp, ThemeConfig } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'
import { useKeys } from '../../composables/use-keys'
import {
  UtensilToolbarContextKey,
  toolbarGroupOf,
  toolbarItems,
  type ToolbarOrientation,
  type ToolbarVariation,
} from './utensil-toolbar'

/**
 * A bar of related controls, such as an editor's insert and formatting buttons. Its buttons and links are one stop in
 * the tab order: the arrow keys, Home and End move focus between them, and Tab returns to the one used last. A radio
 * group is one of its stops. Fields that use the arrow keys themselves, such as text inputs and selects, keep their
 * own place in the tab order.
 */
export interface Props<Theme extends ThemeConfig> {
  /** What the toolbar is for, read out by screen readers */
  ariaLabel?: string
  /** The direction the controls run in, and so which arrow keys move between them */
  orientation?: ToolbarOrientation
  /** Pen for the bar and the controls in it */
  color?: ColorProp<Theme>
  variation?: ToolbarVariation
  /** Whether the arrow keys wrap from the last control to the first, and back */
  loop?: boolean
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  ariaLabel: undefined,
  orientation: 'horizontal',
  color: 'pencil',
  variation: 'surface',
  loop: true,
})

const penColor = computed<ColorProp<Theme>>(() => props.color)

const { classes: themeClasses, style } = useTheme({
  pen: penColor,
})

provide(UtensilToolbarContextKey, {
  orientation: computed(() => props.orientation),
})

const toolbarRef = ref<HTMLElement>()

// The control Tab returns to
let current: HTMLElement | null = null
let observer: MutationObserver | null = null

function items(): HTMLElement[] {
  return toolbarRef.value ? toolbarItems(toolbarRef.value) : []
}

// The item an element is, or is inside; any radio of a group is the group's item
function itemOf(target: EventTarget | null, all = items()): HTMLElement | null {
  if (!(target instanceof Element) || !toolbarRef.value) {
    return null
  }
  const group = toolbarGroupOf(toolbarRef.value, target)
  return all.find((item) => item === target || item.contains(target) || (!!group && group.contains(item))) ?? null
}

// One control takes the toolbar's place in the tab order; the rest are reached with the arrow keys
function syncTabStops() {
  const all = items()
  if (!current || !all.includes(current)) {
    // A group's stop moves to the radio it checks
    current = (current && itemOf(current, all)) ?? all[0] ?? null
  }
  for (const item of all) {
    item.tabIndex = item === current ? 0 : -1
  }
}

/** Moves focus to one of the toolbar's controls, making it the one Tab returns to */
function focusItem(item: HTMLElement) {
  current = item
  syncTabStops()
  item.focus()
}

function onFocusin(event: FocusEvent) {
  const item = itemOf(event.target)
  if (item && item !== current) {
    current = item
    syncTabStops()
  }
}

// Moves focus from the control the key was pressed on; a key pressed anywhere else is left alone
function move(event: KeyboardEvent, to: (index: number, last: number) => number): boolean {
  const all = items()
  const item = itemOf(event.target)
  const index = item ? all.indexOf(item) : -1
  if (index === -1) {
    return false
  }
  focusItem(all[to(index, all.length - 1)])
  return true
}

function next(event: KeyboardEvent): boolean {
  return move(event, (index, last) => (index < last ? index + 1 : props.loop ? 0 : index))
}

function previous(event: KeyboardEvent): boolean {
  return move(event, (index, last) => (index > 0 ? index - 1 : props.loop ? last : index))
}

const horizontal = computed(() => props.orientation === 'horizontal')

// The keys a toolbar takes from a radio group in it, before the group sees them: those along the toolbar, Home and
// End. The keys across the toolbar are the group's, moving between its radios
function onGroupKeydown(event: KeyboardEvent) {
  if (!toolbarRef.value || !(event.target instanceof Element) || !toolbarGroupOf(toolbarRef.value, event.target)) {
    return
  }
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.isComposing) {
    return
  }
  const [forward, back] = horizontal.value ? ['ArrowRight', 'ArrowLeft'] : ['ArrowDown', 'ArrowUp']
  const moved =
    (event.key === forward && next(event)) ||
    (event.key === back && previous(event)) ||
    (event.key === 'Home' && move(event, () => 0)) ||
    (event.key === 'End' && move(event, (_, last) => last))
  if (moved) {
    event.preventDefault()
    event.stopPropagation()
  }
}

const keys = useKeys(
  {
    ArrowRight: (event) => horizontal.value && next(event),
    ArrowLeft: (event) => horizontal.value && previous(event),
    ArrowDown: (event) => !horizontal.value && next(event),
    ArrowUp: (event) => !horizontal.value && previous(event),
    Home: (event) => move(event, () => 0),
    End: (event) => move(event, (_, last) => last),
  },
  { ignore: 'none' },
)

onMounted(() => {
  syncTabStops()
  // Controls come and go, are enabled and disabled, and are shown and hidden while the toolbar stays
  observer = new MutationObserver(syncTabStops)
  if (toolbarRef.value) {
    observer.observe(toolbarRef.value, {
      subtree: true,
      childList: true,
      attributes: true,
      // aria-checked: a radio group's stop follows its checked radio
      attributeFilter: ['disabled', 'hidden', 'style', 'class', 'aria-checked'],
    })
  }
})

onUnmounted(() => {
  observer?.disconnect()
  observer = null
})

defineExpose({ focusItem })
</script>

<style scoped>
@layer utensil {
  .utensil-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--utensil-toolbar-gap, var(--space-1));
    width: 100%;
    padding: var(--utensil-toolbar-padding, var(--space-1));
    border-radius: var(--utensil-toolbar-radius, calc(var(--radius-3) + var(--space-1)));
  }

  .utensil-toolbar.vertical {
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: stretch;
    width: auto;
  }

  .utensil-toolbar.ui-unstyled {
    padding: var(--utensil-toolbar-padding, 0);
  }
}
</style>
