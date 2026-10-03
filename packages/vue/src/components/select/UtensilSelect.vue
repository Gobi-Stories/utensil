<template generic="Theme extends ThemeConfig">
  <div class="utensil-select-field">
    <label v-if="label" class="utensil-select-label" :for="triggerId">{{ label }}</label>
    <UtensilSelectBase
      ref="selectBaseRef"
      class="utensil-select"
      v-model="model"
      :values="navigableValues"
      :variation="variation"
      :disabled="disabled"
      :multiple="multiple"
      :aria-label="ariaLabel"
      @change="handleChange"
    >
      <template #trigger="{ value, isOpen, placement, toggle, handleKeydown }">
        <button
          :id="triggerId"
          type="button"
          class="utensil-select-trigger"
          :class="[
            ...themeClasses,
            variation,
            `placement-${placement}`,
            { open: isOpen, disabled, 'has-value': !!value },
          ]"
          :style="themeStyle"
          :disabled="disabled"
          :aria-label="ariaLabel"
          :aria-expanded="isOpen"
          :aria-haspopup="'listbox'"
          @click="toggle"
          @keydown="handleKeydown"
        >
          <UtensilIcon v-if="selectedOption?.icon" :icon="selectedOption.icon" class="select-icon" />
          <!-- Custom trigger value content; without it the trigger renders the label text -->
          <span class="select-value">
            <slot name="value" :option="selectedOption" :display="displayValue">{{ displayValue }}</slot>
          </span>
          <UtensilIcon icon="chevron-down" class="select-chevron" />
        </button>
      </template>
      <template #default="{ value, select, focusedValue, setFocusedValue, close }">
        <slot
          name="prepend"
          :value="value"
          :select="select"
          :focused-value="focusedValue"
          :set-focused-value="setFocusedValue"
          :close="close"
        />
        <UtensilSelectOption
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :label="option.label"
          :icon="option.icon"
          :selected="multiple ? selection.includes(option.value) : value === option.value"
          :focused="focusedValue === option.value"
          :disabled="option.disabled"
          @click="option.disabled ? undefined : select(option.value)"
          @mouseenter="setFocusedValue(option.value)"
        >
          <!-- Custom option content; without it the option renders its label -->
          <template v-if="$slots.option" #default>
            <slot name="option" :option="option" />
          </template>
        </UtensilSelectOption>
        <slot
          name="append"
          :value="value"
          :select="select"
          :focused-value="focusedValue"
          :set-focused-value="setFocusedValue"
          :close="close"
        />
      </template>
    </UtensilSelectBase>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { ref, computed, useId } from 'vue'
import type { ThemeConfig, IconProp } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'
import UtensilIcon from '../icon/UtensilIcon.vue'
import UtensilSelectBase from './UtensilSelectBase.vue'
import UtensilSelectOption from './UtensilSelectOption.vue'
import type { SelectOption } from './utensil-select'

export interface Props<Theme extends ThemeConfig> {
  /** The list of options to display */
  options: SelectOption<Theme>[]
  /** Visible label rendered above the trigger */
  label?: string
  /** Placeholder text when no value is selected */
  placeholder?: string
  /** Visual style variation */
  variation?: 'surface' | 'soft'
  /** Whether the select is disabled */
  disabled?: boolean
  /** Selects multiple values via the selection model instead of a single value */
  multiple?: boolean
  /** Accessible label for screen readers */
  ariaLabel?: string
  /** Icon to display when an option is selected (overrides option icon) */
  icon?: IconProp<Theme>
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  placeholder: 'Select an option...',
  variation: 'surface',
  disabled: false,
  multiple: false,
})

const emit = defineEmits<{
  change: [value: string]
}>()

const model = defineModel<string | null>({ default: null })
// The selected values in multiple mode.
const selection = defineModel<string[]>('selection', { default: () => [] })

function handleChange(value: string) {
  if (props.multiple) {
    selection.value = selection.value.includes(value)
      ? selection.value.filter((candidate) => candidate !== value)
      : [...selection.value, value]
  }

  emit('change', value)
}

const selectBaseRef = ref<{ open: () => void; close: () => void; toggle: () => void; isOpen: boolean }>()

const triggerId = `utensil-select-${useId()}`

const { classes: themeClasses, style: themeStyle } = useTheme({})

const navigableValues = computed(() => props.options.filter((opt) => !opt.disabled).map((opt) => opt.value))

const selectedOption = computed(() => {
  if (!model.value) return null
  return props.options.find((opt) => opt.value === model.value) ?? null
})

const displayValue = computed(() => {
  if (props.multiple) {
    const labels = props.options
      .filter((option) => selection.value.includes(option.value))
      .map((option) => option.label)
    return labels.length ? labels.join(', ') : props.placeholder
  }

  return selectedOption.value?.label ?? props.placeholder
})

defineExpose({
  open: () => selectBaseRef.value?.open(),
  close: () => selectBaseRef.value?.close(),
  toggle: () => selectBaseRef.value?.toggle(),
  isOpen: computed(() => selectBaseRef.value?.isOpen ?? false),
})
</script>

<style scoped>
@layer utensil {
  .utensil-select-field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    min-width: 0;
  }

  .utensil-select-field > .utensil-select {
    width: 100%;
  }

  .utensil-select-label {
    font-size: var(--font-size-2);
    font-weight: 500;
    color: var(--pencil-11);
  }

  /* Trigger button */
  .utensil-select-trigger {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    width: 100%;
    padding: var(--space-2) var(--space-3);
    border: none;
    border-radius: var(--radius-3);
    font-family: inherit;
    font-size: var(--font-size-2);
    line-height: normal;
    color: var(--pencil-12);
    cursor: pointer;
    transition:
      box-shadow 0.15s ease,
      background-color 0.15s ease,
      border-radius 0.15s ease;
    outline: none;
    text-align: left;
  }

  /* Surface variation */
  .utensil-select-trigger.surface {
    background-color: var(--pencil-surface);
    box-shadow: inset 0 0 0 1px var(--pencil-a7);
  }

  .utensil-select-trigger.surface:hover:not(.disabled):not(:focus) {
    box-shadow: inset 0 0 0 1px var(--pencil-a8);
  }

  .utensil-select-trigger.surface:focus {
    box-shadow: inset 0 0 0 2px var(--pen-8);
    background-color: var(--pencil-1);
  }

  .utensil-select-trigger.surface.open.placement-bottom {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .utensil-select-trigger.surface.open.placement-top {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  /* Soft variation */
  .utensil-select-trigger.soft {
    background-color: var(--pen-a3);
    box-shadow: none;
  }

  .utensil-select-trigger.soft:hover:not(.disabled):not(:focus) {
    background-color: var(--pen-a4);
  }

  .utensil-select-trigger.soft:focus {
    background-color: var(--pen-a4);
    box-shadow: inset 0 0 0 2px var(--pen-8);
  }

  .utensil-select-trigger.soft.open.placement-bottom {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .utensil-select-trigger.soft.open.placement-top {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  /* Disabled state */
  .utensil-select-trigger.disabled {
    opacity: 0.5;
    cursor: default;
  }

  /* Placeholder styling */
  .utensil-select-trigger:not(.has-value) .select-value {
    color: var(--pencil-a9);
  }

  /* Value and icon layout */
  .select-icon {
    flex-shrink: 0;
    color: var(--pencil-11);
  }

  .select-value {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .select-chevron {
    flex-shrink: 0;
    font-size: 0.75rem;
    color: var(--pencil-9);
    transition: transform 0.15s ease;
  }

  .utensil-select-trigger.open .select-chevron {
    transform: rotate(180deg);
  }
}
</style>
