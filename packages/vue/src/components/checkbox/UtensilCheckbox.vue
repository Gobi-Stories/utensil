<template generic="Theme extends ThemeConfig">
  <label
    class="utensil-checkbox"
    :class="[
      ...themeClasses,
      {
        checked: model,
        indeterminate,
        disabled,
        'label-start': label && labelPosition === 'start',
      },
    ]"
    :style="style"
  >
    <input
      type="checkbox"
      :checked="model"
      :indeterminate="indeterminate"
      :disabled="disabled"
      @change="toggle"
      @keydown.enter="toggle"
    />
    <svg class="checkbox-svg" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect class="box" x="1" y="1" width="14" height="14" rx="3" />
      <path v-if="indeterminate" class="indicator" d="M4 8h8" />
      <path v-else class="indicator" d="M4 8l3 3 5-6" />
    </svg>
    <span v-if="label" class="utensil-checkbox-label">{{ label }}</span>
    <slot v-else />
  </label>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed } from 'vue'
import type { ColorProp, ScaleProp, ThemeConfig } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'

export interface Props<Theme extends ThemeConfig> {
  color?: ColorProp<Theme>
  scale?: ScaleProp
  label?: string
  labelPosition?: 'start' | 'end'
  disabled?: boolean
  indeterminate?: boolean
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  color: 'pen',
  scale: 1,
  labelPosition: 'end',
  disabled: false,
  indeterminate: false,
})

const model = defineModel<boolean>({ default: false })

const penColor = computed<ColorProp<Theme>>(() => props.color || 'pen')

const { classes: themeClasses, style } = useTheme({
  pen: penColor,
  relativeScale: () => props.scale,
})

function toggle() {
  if (!props.disabled) {
    model.value = !model.value
  }
}
</script>

<style scoped>
@layer utensil {
  .utensil-checkbox {
    position: relative;
    display: inline-flex;
    align-items: flex-start;
    gap: var(--space-2);
    cursor: pointer;
    margin: 0;
  }

  .utensil-checkbox.disabled {
    cursor: default;
    opacity: 0.5;
  }

  .utensil-checkbox.label-start .utensil-checkbox-label {
    order: -1;
  }

  .utensil-checkbox input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  .checkbox-svg {
    display: block;
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  .box {
    fill: transparent;
    stroke: var(--pencil-8);
    stroke-width: 1.5;
    transition:
      fill 0.15s ease,
      stroke 0.15s ease;
  }

  .indicator {
    fill: none;
    stroke: var(--pen-contrast);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  /* Hover */
  .utensil-checkbox:hover:not(.disabled) .box {
    stroke: var(--pen-8);
  }

  /* Checked / Indeterminate */
  .utensil-checkbox.checked .box,
  .utensil-checkbox.indeterminate .box {
    fill: var(--pen-9);
    stroke: var(--pen-9);
  }

  .utensil-checkbox.checked .indicator,
  .utensil-checkbox.indeterminate .indicator {
    opacity: 1;
  }

  .utensil-checkbox.checked:hover:not(.disabled) .box,
  .utensil-checkbox.indeterminate:hover:not(.disabled) .box {
    fill: var(--pen-10);
    stroke: var(--pen-10);
  }

  /* Focus ring */
  input:focus-visible + .checkbox-svg {
    outline: 2px solid var(--pen-8);
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* Label */
  .utensil-checkbox-label {
    font-size: var(--font-size-2);
    font-weight: 500;
    color: var(--pencil-11);
  }

  .utensil-checkbox.disabled .utensil-checkbox-label {
    pointer-events: none;
  }

  /* Reduced motion */
  .utensil-reduced-motion .box,
  .utensil-reduced-motion .indicator {
    transition: none;
  }

  /* High contrast */
  .utensil-high-contrast .box {
    stroke: var(--pencil-12);
  }

  .utensil-high-contrast .utensil-checkbox.checked .box,
  .utensil-high-contrast .utensil-checkbox.indeterminate .box {
    stroke: var(--pen-9);
  }
}
</style>
