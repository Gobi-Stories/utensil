<template>
  <UtensilTooltip
    ref="tooltipRef"
    class="utensil-hint-label"
    :class="{ wrap }"
    :text="hint"
    :placement="placement"
    multiline
  >
    <template #default="{ tooltipId }">
      <!-- A button, so the hint shows from the keyboard and on a press where there is no hover; described by the
           hint, so it is read with the label. Without a hint it is only the label. -->
      <button
        v-if="hint"
        type="button"
        class="utensil-hint-label-text"
        :aria-describedby="tooltipId"
        @click="tooltipRef?.show()"
      >
        <span class="utensil-hint-label-clip">{{ text }}</span>
      </button>
      <span v-else class="utensil-hint-label-plain">
        <span class="utensil-hint-label-clip">{{ text }}</span>
      </span>
    </template>
  </UtensilTooltip>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
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

const tooltipRef = useTemplateRef<InstanceType<typeof UtensilTooltip>>('tooltipRef')
</script>

<style scoped>
@layer utensil {
  /* Both classes, so it outranks the popover's own display however the stylesheets load */
  .utensil-hint-label.utensil-tooltip {
    display: inline-flex;
    max-width: 100%;
  }

  /* min-width: 0 lets the label shrink so the inner text can ellipsize */
  .utensil-hint-label-text,
  .utensil-hint-label-plain {
    min-width: 0;
  }

  /* A button drawn as text */
  .utensil-hint-label-text {
    padding: 0;
    border: none;
    background: none;
    color: inherit;
    /* Buttons reset these; the label reads as the text around it, such as an uppercase column header */
    font: inherit;
    text-transform: inherit;
    letter-spacing: inherit;
    text-align: start;
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
  .utensil-hint-label-clip {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .utensil-hint-label.wrap .utensil-hint-label-clip {
    overflow: visible;
    white-space: normal;
  }

  .utensil-hint-label-text:focus-visible {
    outline-color: var(--pen-8);
  }

  .utensil-high-contrast .utensil-hint-label-text {
    text-decoration-color: var(--pencil-a11);
  }
}
</style>
