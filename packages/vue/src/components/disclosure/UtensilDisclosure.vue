<template>
  <div class="utensil-disclosure" :class="{ open: isOpen }">
    <button type="button" class="disclosure-toggle" :aria-expanded="isOpen" :aria-controls="contentId" @click="toggle">
      <UtensilIcon icon="chevron-right" class="disclosure-chevron" />
      <span class="disclosure-label">
        <slot name="label">{{ label }}</slot>
      </span>
    </button>
    <div v-if="isOpen" :id="contentId" class="disclosure-content">
      <slot :close="toggle"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import UtensilIcon from '../icon/UtensilIcon.vue'

// An inline expand/collapse toggle: a borderless labelled row revealing its
// content below. Content unmounts while closed.
interface Props {
  label?: string
  // Initial state when the open model is not bound
  defaultOpen?: boolean
}

const { label, defaultOpen = false } = defineProps<Props>()

const open = defineModel<boolean>('open', { default: undefined })

const localOpen = ref(defaultOpen)
const isOpen = computed(() => open.value ?? localOpen.value)

const contentId = useId()

function toggle() {
  if (open.value === undefined) {
    localOpen.value = !localOpen.value
  } else {
    open.value = !open.value
  }
}
</script>

<style scoped>
@layer utensil {
  .utensil-disclosure {
    /* Parents can indent the revealed content to nest it under the label */
    --content-indent: var(--utensil-disclosure-content-indent, 0px);

    display: flex;
    flex-direction: column;
  }

  .disclosure-toggle {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) 0;
    border: none;
    background: none;
    color: var(--pencil-12);
    font: inherit;
    font-size: var(--font-size-2);
    font-weight: 600;
    cursor: pointer;

    outline: 2px solid transparent;
    outline-offset: -2px;
    border-radius: var(--radius-3);
    transition: outline-color 0.1s ease;
  }

  .disclosure-toggle:focus-visible {
    outline-color: var(--pen-8);
  }

  .disclosure-toggle:hover {
    color: var(--pen-11);
  }

  .disclosure-chevron {
    color: var(--pencil-a11);
    transition: transform 0.15s ease;
  }

  .utensil-disclosure.open .disclosure-chevron {
    transform: rotate(90deg);
  }

  .utensil-reduced-motion .disclosure-chevron {
    transition: none;
  }

  .disclosure-content {
    padding-inline-start: var(--content-indent);
  }
}
</style>
