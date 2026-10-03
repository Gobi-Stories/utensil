<template>
  <div
    ref="popoverRef"
    popover="auto"
    class="utensil-popover-positioned"
    :class="themeClasses"
    :style="[themeStyle, popoverStyle]"
    @toggle="handleToggle"
  >
    <slot :close="close" :is-open="isOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, type CSSProperties } from 'vue'
import { useTheme } from '../../theme/useTheme'
import type { Position } from './utensil-popover-positioned'

interface Props {
  /** Whether the popover is open (controlled mode) */
  modelValue?: boolean
  /** Position to show the popover at (typically from mouse event) */
  position?: Position
  /** Minimum distance from viewport edges */
  viewportPadding?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  position: () => ({ x: 0, y: 0 }),
  viewportPadding: 8,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const popoverRef = ref<HTMLElement>()
const internalOpen = ref(false)
// Tracks whether a light-dismiss just happened, to prevent toggle from
// immediately reopening after light-dismiss in the same event
let lightDismissedAt = 0

// Use modelValue if provided (controlled), otherwise use internal state (uncontrolled)
const isControlled = computed(() => props.modelValue !== undefined)
const isOpen = computed(() => (isControlled.value ? props.modelValue : internalOpen.value))

// Snapshot position when opening - prevents position jumps during close animations
// when the prop position changes while the popover is animating closed
const activePosition = ref<Position>({ x: 0, y: 0 })

watch(
  () => props.position,
  (position) => {
    if (isOpen.value) {
      activePosition.value = position
    }
  },
)

// Apply theme classes directly to popover (top layer breaks CSS inheritance)
const { classes: themeClasses, style: themeStyle } = useTheme()

const popoverStyle = computed<CSSProperties>(() => {
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080

  // Get actual dimensions if available, otherwise use estimates
  const menuWidth = popoverRef.value?.offsetWidth ?? 180
  const menuHeight = popoverRef.value?.offsetHeight ?? 200

  let top = activePosition.value.y
  let left = activePosition.value.x

  // Adjust if popover would overflow right side of viewport
  if (left + menuWidth > viewportWidth - props.viewportPadding) {
    left = Math.max(props.viewportPadding, viewportWidth - menuWidth - props.viewportPadding)
  }

  // Adjust if popover would overflow bottom of viewport
  if (top + menuHeight > viewportHeight - props.viewportPadding) {
    top = Math.max(props.viewportPadding, viewportHeight - menuHeight - props.viewportPadding)
  }

  return {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
  }
})

function open() {
  // Commit the latest prop position when opening
  activePosition.value = props.position
  if (isControlled.value) {
    emit('update:modelValue', true)
  } else {
    internalOpen.value = true
    popoverRef.value?.showPopover()
  }
}

function close() {
  if (isControlled.value) {
    emit('update:modelValue', false)
  } else {
    internalOpen.value = false
    popoverRef.value?.hidePopover()
  }
}

function toggle() {
  // If a light-dismiss just happened in the same event (e.g. clicking a trigger
  // button while the popover is open), treat this as "was open → close" rather
  // than "is closed → open". Without this, light-dismiss sets isOpen=false before
  // the click handler runs, making toggle think the popover was already closed.
  const wasLightDismissed = Date.now() - lightDismissedAt < 50
  if (isOpen.value && !wasLightDismissed) {
    close()
  } else if (!wasLightDismissed) {
    open()
  }
  // If wasLightDismissed, do nothing — the popover was just closed by light-dismiss
}

/**
 * Force-opens the popover, even if a light-dismiss just closed it in the same event.
 * Useful for context menus where right-clicking again should reposition and stay open,
 * bypassing Vue's watcher batching that would otherwise swallow the close→open transition.
 */
function forceOpen() {
  activePosition.value = props.position
  if (isControlled.value) {
    emit('update:modelValue', true)
  } else {
    internalOpen.value = true
  }
  // Directly show the native popover to handle the case where the modelValue
  // watcher is batched away (true → false → true in one tick)
  if (popoverRef.value && !popoverRef.value.matches(':popover-open')) {
    popoverRef.value.showPopover()
  }
}

function handleToggle(event: Event) {
  const toggleEvent = event as ToggleEvent
  const newState = toggleEvent.newState === 'open'

  // Track light-dismiss timing so toggle() can distinguish between
  // "user explicitly toggled" vs "light-dismiss then immediate interaction"
  if (!newState) {
    lightDismissedAt = Date.now()
  }

  if (isControlled.value) {
    if (newState !== props.modelValue) {
      emit('update:modelValue', newState)
    }
  } else {
    internalOpen.value = newState
  }
}

// Sync controlled state with native popover
watch(
  () => props.modelValue,
  (value) => {
    if (!isControlled.value || !popoverRef.value) return

    const isCurrentlyOpen = popoverRef.value.matches(':popover-open')
    if (value && !isCurrentlyOpen) {
      // Commit position before showing
      activePosition.value = props.position
      popoverRef.value.showPopover()
    } else if (!value && isCurrentlyOpen) {
      popoverRef.value.hidePopover()
    }
  },
)

defineExpose({
  open,
  close,
  toggle,
  forceOpen,
  isOpen,
})
</script>

<style scoped>
@layer utensil {
  .utensil-popover-positioned {
    /* Reset default popover styles */
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    overflow: visible;

    /* Animation */
    opacity: 0;
    transform: scale(0.95);
    transition:
      opacity 120ms ease,
      transform 120ms ease,
      overlay 120ms ease allow-discrete,
      display 120ms ease allow-discrete;
  }

  .utensil-popover-positioned:popover-open {
    opacity: 1;
    transform: scale(1);
    will-change: transform;
  }

  @starting-style {
    .utensil-popover-positioned:popover-open {
      opacity: 0;
      transform: scale(0.95);
    }
  }
}
</style>
