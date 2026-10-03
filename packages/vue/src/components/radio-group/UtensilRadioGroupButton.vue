<template generic="Theme extends ThemeConfig">
  <UtensilButton
    :variation="effectiveVariation"
    :color="effectiveColor"
    :scale="effectiveScale"
    :disabled="isDisabled"
    :pressed="isSelected ? 'checked' : 'unchecked'"
    :role="context.multiple.value ? 'checkbox' : 'radio'"
    :data-value="value"
    :tabindex="isTabbable ? 0 : -1"
    @click="select"
  >
    <slot>{{ label || value }}</slot>
  </UtensilButton>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed, inject } from 'vue'
import type { ColorProp, ThemeConfig, UtensilUIVariation, ScaleProp } from '../../theme/utensil-theme'
import UtensilButton from '../button/UtensilButton.vue'
import { UtensilRadioGroupContextKey } from './utensil-radio-group'

export interface Props<Theme extends ThemeConfig> {
  /** The value this item represents */
  value: string
  /** Text label to display */
  label?: string
  /** Override the group variation */
  variation?: Exclude<UtensilUIVariation, 'solid'>
  /** Override the group color */
  color?: ColorProp<Theme>
  /** Override the group variation while selected */
  onVariation?: UtensilUIVariation
  /** Override the group variation while unselected */
  offVariation?: UtensilUIVariation
  /** Override the group color while selected */
  onColor?: ColorProp<Theme>
  /** Override the group color while unselected */
  offColor?: ColorProp<Theme>
  /** Override the group scale */
  scale?: ScaleProp
  /** Whether this specific item is disabled */
  disabled?: boolean
}

const {
  value,
  label,
  variation,
  color,
  onVariation,
  offVariation,
  onColor,
  offColor,
  scale,
  disabled = false,
} = defineProps<Props<Theme>>()

const context = inject(UtensilRadioGroupContextKey<Theme>())
if (!context) {
  throw new Error('UtensilRadioGroupButton must be used within UtensilRadioGroup')
}

const {
  isSelected: checkSelected,
  setValue,
  variation: groupVariation,
  onVariation: groupOnVariation,
  offVariation: groupOffVariation,
  onColor: groupOnColor,
  offColor: groupOffColor,
  scale: groupScale,
  disabled: groupDisabled,
  isTabbable: checkTabbable,
} = context

const isSelected = computed(() => checkSelected(value))
const isDisabled = computed(() => disabled || groupDisabled.value)
const effectiveVariation = computed<UtensilUIVariation>(() =>
  isSelected.value
    ? (onVariation ?? groupOnVariation.value ?? variation ?? groupVariation.value)
    : (offVariation ?? groupOffVariation.value ?? variation ?? groupVariation.value),
)
const effectiveColor = computed<ColorProp<Theme>>(() =>
  isSelected.value
    ? (onColor ?? groupOnColor.value ?? color ?? 'pen')
    : (offColor ?? groupOffColor.value ?? color ?? 'pen'),
)
const effectiveScale = computed(() => scale ?? groupScale.value)

const isTabbable = computed(() => checkTabbable(value))

function select() {
  if (!isDisabled.value) {
    setValue(value)
  }
}
</script>
