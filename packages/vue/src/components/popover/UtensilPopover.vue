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
      :popover="mode"
      class="utensil-popover-content"
      :class="[themeClasses, { 'anchor-width': width === 'anchor' }]"
      :style="[themeStyle, popoverStyle]"
      @beforetoggle="handleBeforeToggle"
      @toggle="handleToggle"
      @transitionend="releaseClosingPlacement"
      @transitioncancel="releaseClosingPlacement"
    >
      <slot :close="close" :actualPlacement="actualPlacement" />
    </div>
  </span>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, useId, type CSSProperties } from 'vue'
import { useTheme } from '../../theme/useTheme'
import { type PopoverPlacement, placementToInsetArea, flipPlacement, isBlockPlacement } from './utensil-popover'

export interface Props {
  modelValue?: boolean
  placement?: PopoverPlacement
  offset?: number
  width?: 'auto' | 'anchor'
  /** `auto` closes other auto popovers and light-dismisses; `manual` leaves both to its host, as a tooltip does */
  mode?: 'auto' | 'manual'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  placement: 'bottom-start',
  offset: 8,
  width: 'auto',
  mode: 'auto',
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

// The placement a closing popover keeps while it fades out: closed, it has no flip fallback (see the styles), so it
// takes the side it was showing on as its own rather than jumping back to the intended one
const closingPlacement = ref<PopoverPlacement | null>(null)

const popoverStyle = computed(() => {
  const placement = closingPlacement.value ?? props.placement
  const flipped = flipPlacement[placement]
  const isBlock = isBlockPlacement(placement)

  const style: Record<string, string> = {
    'position-anchor': anchorName,
    'position-area': placementToInsetArea[placement],
  }

  // The offset is on the side facing the trigger. Placements are physical sides (position-area places them so in
  // either writing direction), so a left or right one takes a physical margin: an inline margin would land on the
  // far side in a right-to-left layout.
  // Above or below, the popover is inset from the trigger's sides by --popover-inset, so a popover as wide as its
  // trigger meets the trigger's edge. A margin rather than a transform, which would put it on a layer of its own (see
  // the styles).
  const inset = 'var(--popover-inset)'
  if (isBlock) {
    if (placement.startsWith('bottom')) {
      style['margin-block-start'] = `${props.offset}px`
    } else {
      style['margin-block-end'] = `${props.offset}px`
    }
    style['margin-left'] = inset
    style['margin-right'] = inset
  } else {
    if (placement.startsWith('right')) {
      style['margin-left'] = `${props.offset}px`
    } else {
      style['margin-right'] = `${props.offset}px`
    }
  }

  // Set CSS custom property for flip fallback
  style['--flip-position-area'] = placementToInsetArea[flipped]
  style['--flip-margin-block-start'] = isBlock && flipped.startsWith('bottom') ? `${props.offset}px` : '0'
  style['--flip-margin-block-end'] = isBlock && flipped.startsWith('top') ? `${props.offset}px` : '0'
  style['--flip-margin-left'] = isBlock ? inset : flipped.startsWith('right') ? `${props.offset}px` : '0'
  style['--flip-margin-right'] = isBlock ? inset : flipped.startsWith('left') ? `${props.offset}px` : '0'

  return style
})

// Shows the popover and finds the side it opened on at once, before its first frame, so what follows the placement,
// such as a select's corners, is right from the start
function show() {
  popoverRef.value?.showPopover()
  detectActualPlacement()
}

function open() {
  if (isControlled.value) {
    emit('update:modelValue', true)
  } else {
    internalOpen.value = true
    show()
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

function handleBeforeToggle(event: Event) {
  if ((event as ToggleEvent).newState === 'open') {
    closingPlacement.value = null
  } else {
    detectActualPlacement()
    closingPlacement.value = actualPlacement.value
  }
}

// Once faded out, the popover takes its own placement back, so it's in place before it next opens, where the side it
// opens on is found at once
function releaseClosingPlacement(event: TransitionEvent) {
  if (
    event.target === event.currentTarget &&
    event.propertyName === 'opacity' &&
    !popoverRef.value?.matches(':popover-open')
  ) {
    closingPlacement.value = null
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
    // actualPlacement stays the side it was shown on, so what follows it, such as a select's corners, holds while it
    // fades out; opening on another side is a change, and detected as one
    stopPlacementObservers()
  }
}

// Sync controlled state with native popover
watch(
  () => props.modelValue,
  (value) => {
    if (!isControlled.value || !popoverRef.value) return

    const isCurrentlyOpen = popoverRef.value.matches(':popover-open')
    if (value && !isCurrentlyOpen) {
      show()
    } else if (!value && isCurrentlyOpen) {
      popoverRef.value.hidePopover()
    }
  },
)

// Match anchor width if requested
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  // A v-model that starts open: the watcher only follows changes after this
  if (isControlled.value && props.modelValue && popoverRef.value?.isConnected) show()

  if (props.width === 'anchor' && anchorRef.value && popoverRef.value) {
    // The border box's width unrounded, as offsetWidth isn't, so a trigger with a fractional width doesn't get a list a
    // pixel wider or narrower than itself
    resizeObserver = new ResizeObserver(([entry]) => {
      const width = entry?.borderBoxSize?.[0]?.inlineSize ?? anchorRef.value?.getBoundingClientRect().width
      if (width !== undefined) popoverRef.value?.style.setProperty('--popover-anchor-width', `${width}px`)
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
    /* Set inline, by script, on a popover as wide as its trigger; reset here so a popover nested in one doesn't
       inherit that width */
    --popover-anchor-width: initial;

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

    /* Anchor width mode: --popover-anchor-width is set by JS ResizeObserver. The inset on each side (a margin, set with
       the placement) compensates for the trigger's inset shadow and the popover's outset one. */
    width: calc(var(--popover-anchor-width, auto) - var(--popover-inset) * 2);

    /* Animation */
    opacity: 0;
    transform: scale(0.95);
    transition:
      opacity 150ms ease,
      transform 150ms ease,
      overlay 150ms ease allow-discrete,
      display 150ms ease allow-discrete;
  }

  .utensil-popover-content:popover-open {
    opacity: 1;
    transform: none;
  }

  @starting-style {
    .utensil-popover-content:popover-open {
      opacity: 0;
      transform: scale(0.95);
    }
  }

  /* A popover as wide as its trigger fades without scaling. Once its transform has animated, Chrome keeps it on a layer
     of its own, snapped to the pixel, so from a trigger at a half pixel it would sit a pixel off the trigger's edge;
     and scaled, it would be narrower than the trigger. */
  .utensil-popover-content.anchor-width,
  .utensil-popover-content.anchor-width:popover-open {
    transform: none;
  }

  @starting-style {
    .utensil-popover-content.anchor-width:popover-open {
      transform: none;
    }
  }

  /* Reduced motion: the panel fades without scaling */
  .utensil-reduced-motion .utensil-popover-content,
  .utensil-reduced-motion .utensil-popover-content:popover-open {
    transform: none;
  }

  @starting-style {
    .utensil-reduced-motion .utensil-popover-content:popover-open {
      transform: none;
    }
  }

  /* Workaround: Safari 27.0.1 - a closed popover that keeps its position-try fallbacks hangs the page in
     endless style resolution when a stylesheet is added later, such as a lazy route's CSS (as WebKit bug
     299742). The fallbacks apply only while the popover is open; a closing one fades out on the side it was showing on,
     which the script makes its own placement. */
  .utensil-popover-content:not(:popover-open) {
    position-try-fallbacks: none;
  }

  /* Flip fallback for viewport boundaries */
  @position-try --flip {
    position-area: var(--flip-position-area);
    margin-block-start: var(--flip-margin-block-start);
    margin-block-end: var(--flip-margin-block-end);
    margin-left: var(--flip-margin-left);
    margin-right: var(--flip-margin-right);
  }
}
</style>
