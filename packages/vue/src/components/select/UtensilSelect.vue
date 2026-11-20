<template generic="Theme extends ThemeConfig">
  <div class="utensil-select" :class="{ disabled }">
    <label v-if="label" :id="labelId" class="utensil-select-label" :for="triggerId">{{ label }}</label>
    <UtensilSelectBase
      ref="selectBaseRef"
      v-model="model"
      :values="navigableValues"
      :variation="variation"
      :disabled="disabled"
      :multiple="multiple"
      :aria-label="label ? undefined : ariaLabel"
      :aria-labelledby="label ? labelId : undefined"
      :full="full"
      @change="handleChange"
    >
      <!-- A select-only combobox: named by the label, with the chosen option's text as its value -->
      <template #trigger="{ value, isOpen, placement, listboxId, activeDescendant, toggle, navigate }">
        <button
          :id="triggerId"
          type="button"
          class="utensil-select-trigger"
          :class="[
            ...themeClasses,
            variation,
            `ui-${variation}`,
            `placement-${placement}`,
            { pencil: variation !== 'soft' },
            { open: isOpen, disabled, 'has-value': multiple ? selection.length > 0 : !!value },
          ]"
          :style="themeStyle"
          :disabled="disabled"
          role="combobox"
          :aria-label="label ? undefined : ariaLabel"
          :aria-labelledby="label ? labelId : undefined"
          :aria-expanded="isOpen"
          aria-haspopup="listbox"
          :aria-controls="listboxId"
          :aria-activedescendant="activeDescendant"
          :aria-describedby="hasDescription() ? descriptionId : undefined"
          @click="toggle"
          @keydown="navigate"
        >
          <UtensilIcon v-if="triggerIcon" :icon="triggerIcon" class="select-icon" />
          <!-- Custom trigger value content; without it the trigger renders the label text -->
          <span class="select-value">
            <span class="select-display">
              <slot name="value" :option="selectedOption" :display="displayValue">{{ displayValue }}</slot>
            </span>
            <!-- Every label, stacked unseen under the value, widens the trigger to the widest. Drawn as generated
                 content, so the trigger's text stays its value -->
            <span
              v-for="option in options"
              :key="option.value"
              class="select-sizer"
              :data-label="option.label"
              aria-hidden="true"
            />
          </span>
          <UtensilIcon icon="chevron-down" class="select-chevron" />
        </button>
      </template>
      <template #default="{ value, select, focusedValue, setFocusedValue, isOpen, close }">
        <slot
          name="prepend"
          :value="value"
          :selection="selection"
          :select="select"
          :focused-value="focusedValue"
          :set-focused-value="setFocusedValue"
          :is-open="isOpen"
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
          @mouseenter="option.disabled ? undefined : setFocusedValue(option.value)"
        >
          <!-- Custom option content; without it the option renders its label -->
          <template v-if="$slots.option" #default>
            <slot name="option" :option="option" />
          </template>
        </UtensilSelectOption>
        <slot
          name="append"
          :value="value"
          :selection="selection"
          :select="select"
          :focused-value="focusedValue"
          :set-focused-value="setFocusedValue"
          :is-open="isOpen"
          :close="close"
        />
      </template>
    </UtensilSelectBase>
    <p v-if="hasDescription() || reserveDescription" :id="descriptionId" class="utensil-select-description">
      <slot name="description">{{ description }}</slot>
    </p>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { ref, computed, useId, useSlots } from 'vue'
import type { ThemeConfig, IconProp, UtensilFieldVariation } from '../../theme/utensil-theme'
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
  /** Text under the select, such as a hint, that describes it */
  description?: string
  /** Holds the description's line while there is none, for a message that comes and goes */
  reserveDescription?: boolean
  /** Placeholder text when no value is selected */
  placeholder?: string
  /** Visual style variation */
  variation?: UtensilFieldVariation
  /** Whether the select is disabled */
  disabled?: boolean
  /** Selects multiple values via the selection model instead of a single value */
  multiple?: boolean
  /** Names the select where there is no visible label */
  ariaLabel?: string
  /** Icon at the start of the trigger, in place of the chosen option's own icon */
  icon?: IconProp<Theme>
  /** Shows every option, however many, rather than scrolling past the list's maximum height */
  full?: boolean
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  placeholder: 'Select an option...',
  variation: 'surface',
  disabled: false,
  multiple: false,
  reserveDescription: false,
  full: false,
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
const labelId = `${triggerId}-label`
const descriptionId = `${triggerId}-description`

// Called while rendering: slots aren't reactive, so a computed would miss a slot added later
const slots = useSlots()
function hasDescription() {
  return !!(slots.description || props.description)
}

const { classes: themeClasses, style: themeStyle } = useTheme()

const navigableValues = computed(() => props.options.filter((opt) => !opt.disabled).map((opt) => opt.value))

const selectedOption = computed(() => {
  if (!model.value) return null
  return props.options.find((opt) => opt.value === model.value) ?? null
})

// The select's own icon, or else the chosen option's
const triggerIcon = computed(() => props.icon ?? selectedOption.value?.icon)

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
  .utensil-select {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    min-width: 0;
  }

  .utensil-select > .utensil-select-base {
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
    text-align: start;
  }

  /* The variations are the shared ui-<variation> classes, drawn in pencil at rest (soft keeps its pen tint), and
     muted by their shared disabled modifier. Hover strengthens the edge or tint; focus draws the pen's 2px ring. */
  .utensil-select-trigger.surface:hover:not(.disabled, :focus) {
    box-shadow: inset 0 0 0 1px var(--pencil-a8);
  }

  .utensil-select-trigger.outline:hover:not(.disabled, :focus) {
    box-shadow: inset 0 0 0 1px var(--pencil-a9);
  }

  .utensil-select-trigger.soft:hover:not(.disabled, :focus) {
    background-color: var(--pen-a4);
  }

  .utensil-select-trigger:focus {
    box-shadow: inset 0 0 0 2px var(--pen-8);
  }

  /* Unstyled draws no field of its own, not even the browser's */
  .utensil-select-trigger.unstyled {
    background-color: transparent;
  }

  .utensil-select-trigger.soft:focus {
    background-color: var(--pen-a4);
  }

  /* Open, the trigger joins the list on the side it opens to */
  .utensil-select-trigger.open.placement-bottom {
    border-end-start-radius: 0;
    border-end-end-radius: 0;
  }

  .utensil-select-trigger.open.placement-top {
    border-start-start-radius: 0;
    border-start-end-radius: 0;
  }

  /* High contrast: the edges, placeholder and chevron are drawn strong enough to find the field by. The soft
     variation gains an edge. Focus and disabled keep their own. */
  .utensil-high-contrast .utensil-select-trigger.surface:not(:focus, .disabled),
  .utensil-high-contrast .utensil-select-trigger.outline:not(:focus, .disabled) {
    box-shadow: inset 0 0 0 1px var(--pencil-a9);
  }

  .utensil-high-contrast .utensil-select-trigger.surface:hover:not(.disabled, :focus),
  .utensil-high-contrast .utensil-select-trigger.outline:hover:not(.disabled, :focus) {
    box-shadow: inset 0 0 0 1px var(--pencil-a10);
  }

  .utensil-high-contrast .utensil-select-trigger.soft:not(:focus, .disabled) {
    box-shadow: inset 0 0 0 1px var(--pen-a9);
  }

  .utensil-high-contrast .utensil-select-trigger:not(.has-value, .disabled) .select-value {
    color: var(--pencil-a11);
  }

  .utensil-high-contrast .select-chevron {
    color: var(--pencil-11);
  }

  /* Disabled: the trigger is muted by its shared modifier; its text, icons, label and description go with it */
  .utensil-select-trigger.disabled {
    cursor: default;
  }

  .utensil-select-trigger.disabled,
  .utensil-select-trigger.disabled .select-value,
  .utensil-select-trigger.disabled .select-icon,
  .utensil-select-trigger.disabled .select-chevron,
  .utensil-select.disabled .utensil-select-label,
  .utensil-select.disabled .utensil-select-description {
    color: var(--pencil-a8);
  }

  /* Placeholder styling */
  .utensil-select-trigger:not(.has-value, .disabled) .select-value {
    color: var(--pencil-a9);
  }

  /* Value and icon layout */
  .select-icon {
    flex-shrink: 0;
    color: var(--pencil-11);
  }

  /* The value and the unseen labels share one cell, so the widest sizes the trigger */
  .select-value {
    display: grid;
    flex: 1;
    overflow: hidden;
  }

  .select-display,
  .select-sizer {
    grid-area: 1 / 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .select-sizer::before {
    content: attr(data-label);
  }

  .select-sizer {
    visibility: hidden;
    /* The list is inset from the trigger's edges by the popover's inset on each side */
    padding-inline-end: calc(var(--utensil-popover-inset, 1px) * 2);
  }

  .utensil-select-description {
    min-height: 1lh;
    margin: 0;
    font-size: var(--font-size-1);
    color: var(--pencil-a11);
  }

  .select-chevron {
    flex-shrink: 0;
    font-size: var(--font-size-1);
    color: var(--pencil-9);
    transition: transform 0.15s ease;
  }

  .utensil-select-trigger.open .select-chevron {
    transform: rotate(180deg);
  }

  /* Reduced motion: the chevron flips without turning */
  .utensil-reduced-motion .select-chevron {
    transition: none;
  }

  /* Forced colors drops the box-shadow edge and focus ring: outlines in system colors draw them, Highlight when
     focused */
  @media (forced-colors: active) {
    .utensil-select-trigger:not(.unstyled) {
      outline: 1px solid CanvasText;
      outline-offset: -1px;
    }

    .utensil-select-trigger:focus {
      outline: 2px solid Highlight;
      outline-offset: -2px;
    }

    .utensil-select-trigger.disabled {
      color: GrayText;
      outline-color: GrayText;
    }
  }
}
</style>
