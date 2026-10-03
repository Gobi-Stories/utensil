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
      <slot></slot>
    </template>
    <div class="utensil-tooltip-content">
      {{ text }}
    </div>
  </UtensilPopover>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import UtensilPopover from '../popover/UtensilPopover.vue'

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

interface Props {
  text: string
  placement?: TooltipPlacement
  delay?: number
  offset?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'right',
  delay: 200,
  offset: 8,
  disabled: false,
})

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
    background-color: var(--black-a9);
    border-radius: var(--radius-2);
    font-size: var(--font-size-1);
    line-height: normal;
    white-space: nowrap;
    color: white;
    pointer-events: none;
  }
}
</style>
