<template>
  <nav
    ref="navRef"
    class="utensil-navigation-menu"
    :data-orientation="orientation"
    aria-label="Main navigation"
    @keydown="onKeydown"
    @mouseleave="onMouseLeave"
  >
    <div ref="listRef" class="navigation-menu-list" role="list">
      <slot
        :active-value="activeValue"
        :open="openItem"
        :close="closeItem"
        :toggle="toggle"
        :focus-item="focusItem"
        :cancel-pending-open="cancelPendingOpen"
        :cancel-close="cancelClose"
        :set-focused="setFocused"
        :is-active="isActive"
      />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, reactive, provide, watch, onBeforeUnmount } from 'vue'
import { useFocusNavigation } from '../../composables/useFocusNavigation'
import { UtensilNavigationMenuContextKey } from './utensil-navigation-menu'

interface Props {
  /** Active item value (controlled mode) */
  modelValue?: string
  /** Initial active item value (uncontrolled mode) */
  defaultValue?: string
  /** Delay in ms before showing content on hover (default: 200) */
  delayDuration?: number
  /** Duration in ms to skip delay after recent interaction (default: 300) */
  skipDelayDuration?: number
  /** Menu orientation (default: horizontal) */
  orientation?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  defaultValue: undefined,
  delayDuration: 200,
  skipDelayDuration: 300,
  orientation: 'horizontal',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
}>()

const navRef = ref<HTMLElement>()
const listRef = ref<HTMLElement>()

// Track registered items
const registeredItems = ref<Map<string, { hasContent: boolean }>>(new Map())

// Controlled vs uncontrolled state
const internalValue = ref<string | undefined>(props.defaultValue)
const isControlled = computed(() => props.modelValue !== undefined)
const activeValue = computed(() => (isControlled.value ? props.modelValue : internalValue.value))

// Track recent interaction for skip delay
const hasRecentInteraction = ref(false)
// Track whether current open was triggered by hover
const openedByHover = ref(false)
let recentInteractionTimeout: ReturnType<typeof setTimeout> | undefined
let closeTimeout: ReturnType<typeof setTimeout> | undefined

// Per-item hover timeouts
const hoverTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

// Per-item motion direction (reactive for template binding)
const motionDirections = reactive(new Map<string, 'from-start' | 'from-end' | 'to-start' | 'to-end'>())

// Items that were recently active (for exit animation)
const wasActiveItems = reactive(new Set<string>())

// Focus navigation
const {
  setFocused,
  clearFocus,
  handleKeydown: handleFocusKeydown,
} = useFocusNavigation(listRef, {
  orientation: props.orientation,
})

function setActiveValue(value: string | undefined) {
  // Cancel any pending close
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = undefined
  }

  if (isControlled.value) {
    emit('update:modelValue', value)
  } else {
    internalValue.value = value
  }

  // Mark recent interaction
  hasRecentInteraction.value = true
  if (recentInteractionTimeout) {
    clearTimeout(recentInteractionTimeout)
  }
  recentInteractionTimeout = setTimeout(() => {
    hasRecentInteraction.value = false
  }, props.skipDelayDuration)
}

function openItem(value: string) {
  const item = registeredItems.value.get(value)
  if (!item?.hasContent) return
  setActiveValue(value)
}

function closeItem(value?: string) {
  if (value === undefined) {
    openedByHover.value = false
    setActiveValue(undefined)
  } else if (activeValue.value === value) {
    openedByHover.value = false
    setActiveValue(undefined)
  }
}

function toggle(value: string) {
  if (activeValue.value === value) {
    // If opened by hover, consume click without closing
    if (openedByHover.value) {
      openedByHover.value = false
      return
    }
    setActiveValue(undefined)
  } else {
    openedByHover.value = false
    setActiveValue(value)
  }
}

function focusItem(value: string, el?: HTMLElement) {
  // Cancel any pending close
  cancelClose()

  // Set focus for keyboard navigation
  if (el) {
    const focusable = el.querySelector<HTMLElement>('[data-focusable]')
    if (focusable) {
      setFocused(focusable)
    }
  }

  const item = registeredItems.value.get(value)
  if (!item?.hasContent) {
    // For links without content, close any open menu
    setActiveValue(undefined)
    return
  }

  // Cancel any existing hover timeout for this item
  clearHoverTimeout(value)

  // Determine delay
  const delay = hasRecentInteraction.value ? 0 : props.delayDuration

  if (delay === 0) {
    openItem(value)
    openedByHover.value = true
  } else {
    hoverTimeouts.set(
      value,
      setTimeout(() => {
        hoverTimeouts.delete(value)
        openItem(value)
        openedByHover.value = true
      }, delay),
    )
  }
}

function cancelPendingOpen(value: string) {
  clearHoverTimeout(value)
}

function clearHoverTimeout(value: string) {
  const timeout = hoverTimeouts.get(value)
  if (timeout) {
    clearTimeout(timeout)
    hoverTimeouts.delete(value)
  }
}

function scheduleClose() {
  closeTimeout = setTimeout(() => {
    closeItem()
    clearFocus()
  }, 150)
}

function cancelClose() {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = undefined
  }
}

function isActive(value: string): boolean {
  return activeValue.value === value
}

function getMotionDirection(value: string): 'from-start' | 'from-end' | 'to-start' | 'to-end' | undefined {
  return motionDirections.get(value)
}

function shouldRender(value: string): boolean {
  return activeValue.value === value || wasActiveItems.has(value)
}

function onMouseLeave() {
  scheduleClose()
}

function registerItem(value: string, hasContent: boolean) {
  registeredItems.value.set(value, { hasContent })
}

function unregisterItem(value: string) {
  registeredItems.value.delete(value)
  motionDirections.delete(value)
  wasActiveItems.delete(value)
}

function getItemValues(): string[] {
  if (!listRef.value) return []
  const items = listRef.value.querySelectorAll<HTMLElement>('[data-navigation-menu-item]')
  return Array.from(items)
    .map((el) => el.dataset.value)
    .filter((v): v is string => v !== undefined)
}

function onKeydown(event: KeyboardEvent) {
  const isOpen = activeValue.value && registeredItems.value.get(activeValue.value)?.hasContent

  if (event.key === 'Escape' && isOpen) {
    event.preventDefault()
    closeItem()
    clearFocus()
    return
  }

  handleFocusKeydown(event)
}

// Track motion direction when activeValue changes
watch(
  () => activeValue.value,
  (newValue, oldValue) => {
    if (!newValue && !oldValue) {
      motionDirections.clear()
      return
    }

    const items = getItemValues()
    const newIndex = newValue ? items.indexOf(newValue) : -1
    const oldIndex = oldValue ? items.indexOf(oldValue) : -1

    // Set direction for newly active item
    if (newValue) {
      if (oldIndex === -1) {
        motionDirections.set(newValue, 'from-start')
      } else {
        motionDirections.set(newValue, newIndex > oldIndex ? 'from-end' : 'from-start')
      }
    }

    // Set exit direction for previously active item
    if (oldValue) {
      if (newIndex === -1) {
        motionDirections.set(oldValue, 'to-start')
      } else {
        motionDirections.set(oldValue, newIndex > oldIndex ? 'to-start' : 'to-end')
      }

      // Keep rendered briefly for exit animation
      wasActiveItems.add(oldValue)
      setTimeout(() => {
        if (activeValue.value !== oldValue) {
          wasActiveItems.delete(oldValue)
        }
      }, 200)
    }
  },
)

// Provide context to children
provide(UtensilNavigationMenuContextKey, {
  activeValue: computed(() => activeValue.value),
  orientation: computed(() => props.orientation),
  open: openItem,
  close: closeItem,
  toggle,
  focusItem,
  cancelPendingOpen,
  cancelClose,
  setFocused,
  registerItem,
  unregisterItem,
  getItemValues,
  getMotionDirection,
  shouldRender,
  isActive,
})

// Clean up timeouts on unmount
onBeforeUnmount(() => {
  if (recentInteractionTimeout) {
    clearTimeout(recentInteractionTimeout)
  }
  if (closeTimeout) {
    clearTimeout(closeTimeout)
  }
  for (const timeout of hoverTimeouts.values()) {
    clearTimeout(timeout)
  }
  hoverTimeouts.clear()
})

// Watch for external changes to clear internal state
watch(
  () => props.modelValue,
  (value) => {
    if (isControlled.value && value === undefined) {
      clearFocus()
    }
  },
)

defineExpose({
  close: closeItem,
})
</script>

<style scoped>
@layer utensil {
  .utensil-navigation-menu {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .navigation-menu-list {
    display: flex;
    gap: var(--space-1);
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .utensil-navigation-menu[data-orientation='horizontal'] .navigation-menu-list {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }

  .utensil-navigation-menu[data-orientation='vertical'] .navigation-menu-list {
    flex-direction: column;
  }

  /* Small viewports: stack items vertically */
  @container size-container (max-width: 576px) {
    .utensil-navigation-menu[data-orientation='horizontal'] .navigation-menu-list {
      flex-direction: column;
      align-items: stretch;
    }
  }
}
</style>
