<template>
  <UtensilPopover
    ref="popoverRef"
    :placement="placement"
    :offset="offset"
    class="utensil-tooltip"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focusin="handleMouseEnter"
    @focusout="handleMouseLeave"
  >
    <template #trigger>
      <!-- The trigger points its aria-describedby at tooltipId, so the text is read with it -->
      <slot :tooltip-id="tooltipId"></slot>
    </template>
    <div :id="tooltipId" class="utensil-tooltip-content" :class="[variation, { multiline }]" role="tooltip">
      {{ text }}
    </div>
  </UtensilPopover>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, useId } from 'vue'
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

const tooltipId = `utensil-tooltip-${useId()}`

const popoverRef = ref<InstanceType<typeof UtensilPopover>>()
let showTimeout: ReturnType<typeof setTimeout> | null = null

function show() {
  popoverRef.value?.open()
}

function hide() {
  popoverRef.value?.close()
}

function handleMouseEnter() {
  if (!props.text || props.disabled) return

  if (showTimeout) {
    clearTimeout(showTimeout)
  }

  if (props.delay > 0) {
    showTimeout = setTimeout(show, props.delay)
  } else {
    show()
  }
}

function handleMouseLeave() {
  if (showTimeout) {
    clearTimeout(showTimeout)
    showTimeout = null
  }
  hide()
}

onBeforeUnmount(() => {
  if (showTimeout) {
    clearTimeout(showTimeout)
  }
})

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
    pointer-events: none;
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

  /* Dark in both modes, matching labels that sit over media, so it reads as the label it expands. */
  .utensil-tooltip-content.overlay {
    background-color: var(--black-a9);
    color: var(--white-a12);
    font-weight: normal;
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
