<template generic="Theme extends ThemeConfig">
  <div
    ref="listRef"
    class="utensil-tabs-list"
    :class="[...themeClasses, `size-${size}`]"
    :style="style"
    role="tablist"
    :aria-orientation="orientation"
    @keydown="onKeydown"
  >
    <slot :value="currentValue" :set-value="setValue" :activation-mode="activationMode" />
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { ref, computed, provide, inject } from 'vue'
import type { ColorProp, ThemeConfig } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'
import { UtensilTabsContextKey, UtensilTabsListContextKey, type TabsSize } from './utensil-tabs'

export interface Props<Theme extends ThemeConfig> {
  /** Size of the tabs (default: 2) */
  size?: TabsSize
  /** Accent color for the active tab indicator */
  color?: ColorProp<Theme>
  /** Whether keyboard navigation wraps around (default: true) */
  loop?: boolean
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  size: '2',
  color: 'pen',
  loop: true,
})

const tabsContext = inject(UtensilTabsContextKey)
if (!tabsContext) {
  throw new Error('UtensilTabsList must be used within UtensilTabs')
}

const { value: currentValue, orientation, setValue, activationMode } = tabsContext

const listRef = ref<HTMLElement>()

const penColor = computed<ColorProp<Theme>>(() => props.color || 'pen')

const { classes: themeClasses, style } = useTheme({
  pen: penColor,
})

// Get all trigger elements in DOM order
function getTriggers(): HTMLElement[] {
  if (!listRef.value) return []
  return Array.from(listRef.value.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])'))
}

function onKeydown(event: KeyboardEvent) {
  const triggers = getTriggers()
  if (triggers.length === 0) return

  const currentTrigger = document.activeElement as HTMLElement
  const currentIndex = triggers.indexOf(currentTrigger)
  if (currentIndex === -1) return

  const isHorizontal = orientation.value === 'horizontal'
  const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp'
  const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown'

  let targetIndex: number | null = null

  switch (event.key) {
    case nextKey:
      event.preventDefault()
      if (currentIndex < triggers.length - 1) {
        targetIndex = currentIndex + 1
      } else if (props.loop) {
        targetIndex = 0
      }
      break
    case prevKey:
      event.preventDefault()
      if (currentIndex > 0) {
        targetIndex = currentIndex - 1
      } else if (props.loop) {
        targetIndex = triggers.length - 1
      }
      break
    case 'Home':
      event.preventDefault()
      targetIndex = 0
      break
    case 'End':
      event.preventDefault()
      targetIndex = triggers.length - 1
      break
  }

  if (targetIndex !== null) {
    const targetTrigger = triggers[targetIndex]
    targetTrigger.focus()

    // In automatic mode, also activate the tab on focus
    if (activationMode.value === 'automatic') {
      const value = targetTrigger.getAttribute('data-value')
      if (value) {
        setValue(value)
      }
    }
  }
}

// Provide list context to triggers
provide(UtensilTabsListContextKey, {
  size: computed(() => props.size),
  listRef,
})
</script>

<style scoped>
@layer utensil {
  .utensil-tabs-list {
    display: flex;
    justify-content: flex-start;
    overflow-x: auto;
    /* A swipe past the tabs' end must not become browser page navigation */
    overscroll-behavior-x: contain;
    white-space: nowrap;
    box-shadow: inset 0 -1px 0 0 var(--pencil-a5);

    /* Hide scrollbar */
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  /* Vertical orientation */
  .utensil-tabs[data-orientation='vertical'] .utensil-tabs-list {
    flex-direction: column;
    box-shadow: inset -1px 0 0 0 var(--pencil-a5);
    overflow-x: visible;
    overflow-y: auto;
  }

  /* Size 1 */
  .utensil-tabs-list.size-1 {
    font-size: var(--font-size-1);
    line-height: var(--line-height-1);
    --tab-height: var(--space-6);
    --tab-padding-x: var(--space-1);
    --tab-inner-padding-x: var(--space-1);
    --tab-inner-padding-y: calc(var(--space-1) * 0.5);
    --tab-inner-border-radius: var(--radius-1);
  }

  /* Size 2 */
  .utensil-tabs-list.size-2 {
    font-size: var(--font-size-2);
    line-height: var(--line-height-2);
    --tab-height: var(--space-7);
    --tab-padding-x: var(--space-2);
    --tab-inner-padding-x: var(--space-2);
    --tab-inner-padding-y: var(--space-1);
    --tab-inner-border-radius: var(--radius-2);
  }
}
</style>
