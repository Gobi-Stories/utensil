<template generic="Theme extends ThemeConfig">
  <div
    class="utensil-select-option"
    :class="{ selected, disabled }"
    :data-focusable="!disabled || undefined"
    :data-value="value"
    :data-focused="focused || undefined"
    role="option"
    :aria-selected="selected"
    :aria-disabled="disabled"
    @click="handleClick"
  >
    <UtensilIcon v-if="icon" :icon="icon" class="option-icon" />
    <span class="option-label">
      <slot>{{ label }}</slot>
    </span>
    <UtensilIcon v-if="selected" icon="check" class="option-check" />
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import type { ThemeConfig, IconProp } from '../../theme/utensil-theme'
import UtensilIcon from '../icon/UtensilIcon.vue'

export interface Props<Theme extends ThemeConfig> {
  /** Display label for the option */
  label?: string
  /** Value for this option (used for keyboard navigation) */
  value?: string
  /** Optional icon to display before the label */
  icon?: IconProp<Theme>
  /** Whether this option is currently selected */
  selected?: boolean
  /** Whether this option is currently focused (keyboard navigation) */
  focused?: boolean
  /** Whether this option is disabled */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  selected: false,
  focused: false,
  disabled: false,
})

const emit = defineEmits<{
  click: []
}>()

function handleClick(event: MouseEvent) {
  // Cancel the click's default action so a wrapping <label> doesn't forward a
  // synthetic activation click to its labeled control (the trigger), which
  // would reopen the popover the moment an option is selected.
  event.preventDefault()
  if (props.disabled) return
  emit('click')
}
</script>

<style scoped>
@layer utensil {
  .utensil-select-option {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    border: none;
    background: none;
    text-align: left;
    font-family: inherit;
    font-size: var(--font-size-2);
    line-height: normal;
    color: var(--pencil-a11);
    cursor: pointer;
    transition: background-color 0.1s ease;
  }

  .utensil-select-option[data-focused]:not(.disabled) {
    background-color: var(--pencil-a3);
  }

  .utensil-select-option.selected {
    background-color: var(--pen-a3);
    color: var(--pen-a11);
  }

  .utensil-select-option.selected:hover,
  .utensil-select-option.selected[data-focused] {
    background-color: var(--pen-a4);
  }

  .utensil-select-option.disabled {
    opacity: 0.5;
    cursor: default;
  }

  .option-icon {
    flex-shrink: 0;
    color: inherit;
  }

  .option-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .option-check {
    flex-shrink: 0;
    font-size: 0.75rem;
    color: var(--pen-9);
  }
}
</style>
