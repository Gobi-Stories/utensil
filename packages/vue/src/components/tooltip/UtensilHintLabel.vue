<template>
  <UtensilTooltip class="utensil-hint-label" :class="{ wrap }" :text="hint" :placement="placement" multiline>
    <template #default="{ tooltipId }">
      <!-- Focusable, so the hint shows from the keyboard; described by it, so it is read with the label -->
      <span class="hint-text" tabindex="0" :aria-describedby="tooltipId">
        <span class="hint-text-clip">{{ text }}</span>
      </span>
    </template>
  </UtensilTooltip>
</template>

<script setup lang="ts">
import UtensilTooltip, { type TooltipPlacement } from './UtensilTooltip.vue'

export interface Props {
  /** The label */
  text: string
  /** The plain-language explanation shown in the tooltip */
  hint: string
  /** Preferred placement of the tooltip */
  placement?: TooltipPlacement
  /** Wraps the label onto more lines where it has too little room, instead of truncating it */
  wrap?: boolean
}

withDefaults(defineProps<Props>(), {
  placement: 'top',
  wrap: false,
})
</script>

<style scoped>
@layer utensil {
  .utensil-hint-label {
    display: inline-flex;
    max-width: 100%;
  }

  /* min-width: 0 lets the label shrink so the inner text can ellipsize */
  .hint-text {
    min-width: 0;
    text-decoration: underline dotted var(--pencil-a8);
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
    cursor: help;
    outline: 2px solid transparent;
    outline-offset: 2px;
    border-radius: var(--radius-1);
    transition: outline-color 0.1s ease;
  }

  /* The ellipsis clips here, on a box without the focus ring's radius: overflow on a rounded box clips to its
     corners, shaving the tops of capitals such as T, B and S */
  .hint-text-clip {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .utensil-hint-label.wrap .hint-text-clip {
    overflow: visible;
    white-space: normal;
  }

  .hint-text:focus-visible {
    outline-color: var(--pen-8);
  }

  .utensil-high-contrast .hint-text {
    text-decoration-color: var(--pencil-a11);
  }
}
</style>
