<template>
  <span ref="anchorRef" class="utensil-popover utensil-popover-anchor" :style="anchorStyle">
    <slot
      class="utensil-popover-trigger"
      name="trigger"
      :isOpen="isOpen"
      :actualPlacement="actualPlacement"
      :toggle="toggle"
      :open="open"
      :close="close"
    />
    <div
      ref="popoverRef"
      popover="auto"
      class="utensil-popover-content"
      :class="themeClasses"
      :style="[themeStyle, popoverStyle]"
      @toggle="handleToggle"
    >
      <slot :close="close" :actualPlacement="actualPlacement" />
    </div>
  </span>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, useId, type CSSProperties } from 'vue'
import { useTheme } from '../../theme/useTheme'
import { type PopoverPlacement, placementToInsetArea, flipPlacement, isBlockPlacement } from './utensil-popover'

interface Props {
  modelValue?: boolean
  placement?: PopoverPlacement
  offset?: number
  width?: 'auto' | 'anchor'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  placement: 'bottom-start',
  offset: 8,
  width: 'auto',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'placement-change': [placement: PopoverPlacement]
}>()

// Generate unique anchor name for this instance
const anchorName = `--popover-anchor-${useId()}`

const anchorRef = ref<HTMLElement>()
const popoverRef = ref<HTMLElement>()
const internalOpen = ref(false)
const actualPlacement = ref<PopoverPlacement>(props.placement)

// Use modelValue if provided (controlled), otherwise use internal state (uncontrolled)
const isControlled = computed(() => props.modelValue !== undefined)
const isOpen = computed(() => (isControlled.value ? props.modelValue : internalOpen.value))

/**
 * Detects the actual placement of the popover by comparing positions.
 * Called after the popover is shown to determine if CSS flipped the placement.
 */
function detectActualPlacement() {
  if (!anchorRef.value || !popoverRef.value) return

  const anchorRect = anchorRef.value.getBoundingClientRect()
  const popoverRect = popoverRef.value.getBoundingClientRect()
  const placement = props.placement
  let detected: PopoverPlacement = placement

  // Use 1px tolerance to account for sub-pixel floating point differences
  const tolerance = 1

  if (placement.startsWith('bottom')) {
    // Expected: popover below anchor (popover top >= anchor bottom)
    // Flipped: popover above anchor (popover bottom <= anchor top)
    detected = popoverRect.bottom <= anchorRect.top + tolerance ? flipPlacement[placement] : placement
  } else if (placement.startsWith('top')) {
    // Expected: popover above anchor (popover bottom <= anchor top)
    // Flipped: popover below anchor (popover top >= anchor bottom)
    detected = popoverRect.top >= anchorRect.bottom - tolerance ? flipPlacement[placement] : placement
  } else if (placement.startsWith('left')) {
    // Expected: popover left of anchor (popover right <= anchor left)
    // Flipped: popover right of anchor (popover left >= anchor right)
    detected = popoverRect.left >= anchorRect.right - tolerance ? flipPlacement[placement] : placement
  } else if (placement.startsWith('right')) {
    // Expected: popover right of anchor (popover left >= anchor right)
    // Flipped: popover left of anchor (popover right <= anchor left)
    detected = popoverRect.right <= anchorRect.left + tolerance ? flipPlacement[placement] : placement
  }

  // Only emit if placement changed
  if (actualPlacement.value !== detected) {
    actualPlacement.value = detected
    emit('placement-change', detected)
  }
}

// Placement detection observers - active only while popover is open
function startPlacementObservers() {
  window.addEventListener('scroll', detectActualPlacement, { capture: true, passive: true })
  window.addEventListener('resize', detectActualPlacement, { passive: true })
}

function stopPlacementObservers() {
  window.removeEventListener('scroll', detectActualPlacement, { capture: true })
  window.removeEventListener('resize', detectActualPlacement)
}

// Apply theme classes directly to popover (top layer breaks CSS inheritance)
const { classes: themeClasses, style: themeStyle } = useTheme()

const anchorStyle = computed<CSSProperties>(() => ({
  'anchor-name': anchorName,
}))

const popoverStyle = computed(() => {
  const placement = props.placement
  const flipped = flipPlacement[placement]
  const isBlock = isBlockPlacement(placement)

  const style: Record<string, string> = {
    'position-anchor': anchorName,
    'position-area': placementToInsetArea[placement],
  }

  // Apply offset based on placement direction
  if (isBlock) {
    if (placement.startsWith('bottom')) {
      style['margin-block-start'] = `${props.offset}px`
    } else {
      style['margin-block-end'] = `${props.offset}px`
    }
  } else {
    if (placement.startsWith('right')) {
      style['margin-inline-start'] = `${props.offset}px`
    } else {
      style['margin-inline-end'] = `${props.offset}px`
    }
  }

  // Set CSS custom property for flip fallback
  style['--flip-position-area'] = placementToInsetArea[flipped]
  style['--flip-margin-block-start'] = isBlock && flipped.startsWith('bottom') ? `${props.offset}px` : '0'
  style['--flip-margin-block-end'] = isBlock && flipped.startsWith('top') ? `${props.offset}px` : '0'
  style['--flip-margin-inline-start'] = !isBlock && flipped.startsWith('right') ? `${props.offset}px` : '0'
  style['--flip-margin-inline-end'] = !isBlock && flipped.startsWith('left') ? `${props.offset}px` : '0'

  return style
})

function open() {
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
  if (isOpen.value) {
    close()
  } else {
    open()
  }
}

function handleToggle(event: Event) {
  const toggleEvent = event as ToggleEvent
  const newState = toggleEvent.newState === 'open'

  if (isControlled.value) {
    // Sync controlled state with native popover state
    if (newState !== props.modelValue) {
      emit('update:modelValue', newState)
    }
  } else {
    internalOpen.value = newState
  }

  // Detect actual placement after popover renders in new position
  if (newState) {
    requestAnimationFrame(() => {
      detectActualPlacement()
      startPlacementObservers()
    })
  } else {
    stopPlacementObservers()
    // Reset to intended placement when closed
    actualPlacement.value = props.placement
  }
}

// Sync controlled state with native popover
watch(
  () => props.modelValue,
  (value) => {
    if (!isControlled.value || !popoverRef.value) return

    const isCurrentlyOpen = popoverRef.value.matches(':popover-open')
    if (value && !isCurrentlyOpen) {
      popoverRef.value.showPopover()
    } else if (!value && isCurrentlyOpen) {
      popoverRef.value.hidePopover()
    }
  },
)

// Match anchor width if requested
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (props.width === 'anchor' && anchorRef.value && popoverRef.value) {
    resizeObserver = new ResizeObserver(() => {
      if (anchorRef.value && popoverRef.value) {
        popoverRef.value.style.setProperty('--popover-anchor-width', `${anchorRef.value.offsetWidth}px`)
      }
    })
    resizeObserver.observe(anchorRef.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  stopPlacementObservers()
})

defineExpose({
  open,
  close,
  toggle,
  isOpen,
  actualPlacement,
})
</script>

<style scoped>
@layer utensil {
  .utensil-popover {
    display: inline-block;
  }

  .utensil-popover-anchor {
    display: inline-block;
  }

  .utensil-popover-content {
    /* Cvars with fallbacks to external cvars (defaults to chromeless) */
    --popover-background: var(--utensil-popover-background, transparent);
    --popover-border: var(--utensil-popover-border, none);
    --popover-radius: var(--utensil-popover-radius, 0);
    --popover-shadow: var(--utensil-popover-shadow, none);
    --popover-padding: var(--utensil-popover-padding, 0);
    --popover-color: var(--utensil-popover-color, inherit);
    --popover-inset: var(--utensil-popover-inset, 1px);

    /* Positioning - fixed is required for top layer elements with anchor positioning */
    position: fixed;
    position-try-fallbacks: --flip;

    margin: 0;

    /* Apply configurable styles */
    padding: var(--popover-padding);
    background: var(--popover-background);
    border: var(--popover-border);
    border-radius: var(--popover-radius);
    box-shadow: var(--popover-shadow);
    color: var(--popover-color);

    /* Anchor width mode: --popover-anchor-width is set by JS ResizeObserver
       Inset compensates for trigger's inset shadow + popover's outset shadow */
    width: calc(var(--popover-anchor-width, auto) - var(--popover-inset) * 2);

    /* Animation - translate compensates for shadow border alignment */
    opacity: 0;
    transform: scale(0.95) translateX(calc(var(--popover-inset)));
    transition:
      opacity 150ms ease,
      transform 150ms ease,
      overlay 150ms ease allow-discrete,
      display 150ms ease allow-discrete;
  }

  .utensil-popover-content:popover-open {
    opacity: 1;
    transform: scale(1) translateX(calc(var(--popover-inset)));
    will-change: transform;
  }

  @starting-style {
    .utensil-popover-content:popover-open {
      opacity: 0;
      transform: scale(0.95) translateX(calc(var(--popover-inset)));
    }
  }

  /* Flip fallback for viewport boundaries */
  @position-try --flip {
    position-area: var(--flip-position-area);
    margin-block-start: var(--flip-margin-block-start);
    margin-block-end: var(--flip-margin-block-end);
    margin-inline-start: var(--flip-margin-inline-start);
    margin-inline-end: var(--flip-margin-inline-end);
  }
}
</style>
