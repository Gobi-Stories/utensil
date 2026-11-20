<template>
  <UtensilPopover
    ref="popoverRef"
    :placement="placement"
    :offset="offset"
    mode="manual"
    class="utensil-tooltip"
    @mouseenter="onPointerEnter"
    @mouseleave="onPointerLeave"
    @focusin="onFocusin"
    @focusout="onFocusout"
  >
    <template #trigger>
      <!-- The trigger points its aria-describedby at tooltipId, so the text is read with it; a disabled or empty
           tooltip passes none, so it doesn't describe its trigger -->
      <slot :tooltip-id="enabled ? tooltipId : undefined"></slot>
    </template>
    <div
      :id="tooltipId"
      class="utensil-tooltip-content"
      :class="[variation, { 'ui-overlay': variation === 'overlay', multiline }]"
      role="tooltip"
    >
      {{ text }}
    </div>
  </UtensilPopover>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, useId } from 'vue'
import UtensilPopover from '../popover/UtensilPopover.vue'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'
export type TooltipVariation = 'inverted' | 'overlay'

export interface Props {
  text: string
  placement?: TooltipPlacement
  delay?: number
  offset?: number
  disabled?: boolean
  /** `inverted` contrasts with the page in both modes; `overlay` is the translucent dark look of labels over media. */
  variation?: TooltipVariation
  /** Wraps long text at a readable measure instead of a single line. */
  multiline?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'right',
  delay: 200,
  offset: 8,
  disabled: false,
  variation: 'inverted',
  multiline: false,
})

// Long enough for the pointer to cross the offset from the trigger onto the tooltip
const HIDE_GRACE = 100

const tooltipId = `utensil-tooltip-${useId()}`

const popoverRef = ref<InstanceType<typeof UtensilPopover>>()

// Hover, focus and show() each hold the tooltip open on their own, so leaving one doesn't hide it while another holds
const hovered = ref(false)
const focused = ref(false)
const pinned = ref(false)
// Escape hides it until the pointer or focus comes back
const dismissed = ref(false)

const enabled = computed(() => !!props.text && !props.disabled)
const wanted = computed(() => enabled.value && !dismissed.value && (hovered.value || focused.value || pinned.value))

let showTimeout: ReturnType<typeof setTimeout> | null = null
let hideTimeout: ReturnType<typeof setTimeout> | null = null

function clearTimers() {
  if (showTimeout) clearTimeout(showTimeout)
  if (hideTimeout) clearTimeout(hideTimeout)
  showTimeout = hideTimeout = null
}

function isOpen() {
  return popoverRef.value?.isOpen ?? false
}

function openNow() {
  clearTimers()
  if (!wanted.value || isOpen()) return
  popoverRef.value?.open()
  document.addEventListener('keydown', onDocumentKeydown, true)
  document.addEventListener('pointerdown', onDocumentPointerdown, true)
}

function closeNow() {
  clearTimers()
  document.removeEventListener('keydown', onDocumentKeydown, true)
  document.removeEventListener('pointerdown', onDocumentPointerdown, true)
  if (isOpen()) popoverRef.value?.close()
}

// Shows after the delay, and hides after a grace period, as what holds it open comes and goes
watch(wanted, (want) => {
  clearTimers()
  if (want) {
    if (isOpen()) return
    if (props.delay > 0) showTimeout = setTimeout(openNow, props.delay)
    else openNow()
  } else if (!enabled.value || dismissed.value) {
    closeNow()
  } else {
    hideTimeout = setTimeout(closeNow, HIDE_GRACE)
  }
})

function onPointerEnter() {
  dismissed.value = false
  hovered.value = true
}

function onPointerLeave() {
  hovered.value = false
}

function onFocusin() {
  dismissed.value = false
  focused.value = true
}

function onFocusout(event: FocusEvent) {
  const root = popoverRef.value?.$el as HTMLElement | undefined
  if (root?.contains(event.relatedTarget as Node | null)) return
  focused.value = false
  pinned.value = false
}

// Escape hides the tooltip without moving the pointer or focus, and goes no further, so a dialog behind stays open
function onDocumentKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !isOpen()) return
  event.preventDefault()
  event.stopPropagation()
  dismissed.value = true
}

// A press elsewhere lets go of a tooltip shown by touch or show(), where no pointer leaves
function onDocumentPointerdown(event: PointerEvent) {
  const root = popoverRef.value?.$el as HTMLElement | undefined
  if (root?.contains(event.target as Node | null)) return
  pinned.value = false
  if (event.pointerType !== 'mouse') hovered.value = false
}

function show() {
  dismissed.value = false
  pinned.value = true
  openNow()
}

function hide() {
  hovered.value = focused.value = pinned.value = false
  closeNow()
}

onBeforeUnmount(closeNow)

defineExpose({
  show,
  hide,
})
</script>

<style scoped>
@layer utensil {
  .utensil-tooltip-content {
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-2);
    font-size: var(--font-size-1);
    line-height: normal;
    white-space: nowrap;
    /* Tooltips render inside their trigger's subtree — reset inherited display typography
       so a styled trigger (uppercase table headers, bold labels) can't restyle the tooltip. */
    font-weight: 500;
    text-transform: none;
    letter-spacing: normal;
    text-align: start;
  }

  /* Opaque and inverted for contrast in both modes; content under it must not show through. */
  .utensil-tooltip-content.inverted {
    background-color: var(--pencil-12);
    color: var(--background);
  }

  /* Dark in both modes (ui-overlay), matching labels that sit over media, so it reads as the label it expands. */
  .utensil-tooltip-content.overlay {
    font-weight: normal;
  }

  /* High contrast: the overlay tooltip is opaque, and edged so it stands apart from a dark page */
  .utensil-high-contrast .utensil-tooltip-content.overlay {
    background-color: var(--black-a12);
    box-shadow: 0 0 0 1px var(--white-a7);
  }

  .utensil-tooltip-content.multiline {
    white-space: normal;
    /* width: max-content escapes the anchor-derived containing block before max-width wraps the text. */
    width: max-content;
    max-width: var(--utensil-tooltip-max-width, 280px);
    line-height: var(--line-height-1);
  }
}
</style>
