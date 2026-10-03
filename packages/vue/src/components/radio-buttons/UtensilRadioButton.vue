<template generic="Theme extends ThemeConfig">
  <UtensilToggleButton
    :icon="icon"
    :label="label"
    :label-position="labelPosition"
    :variation="effectiveVariation"
    :color="color"
    :scale="effectiveScale"
    :disabled="isDisabled"
    :round="effectiveRound"
    :model-value="isSelected"
    role="radio"
    :data-value="value"
    :tabindex="isTabbable ? 0 : -1"
    @update:model-value="select"
  >
    <slot>{{ label || value }}</slot>
  </UtensilToggleButton>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed, inject } from 'vue'
import type { IconProp, ColorProp, ThemeConfig, UtensilUIVariation, ScaleProp } from '../../theme/utensil-theme'
import UtensilToggleButton from '../toggle-button/UtensilToggleButton.vue'
import { UtensilRadioGroupContextKey } from '../radio-group/utensil-radio-group'
import { UtensilRadioButtonsContextKey } from './utensil-radio-buttons'

export interface Props<Theme extends ThemeConfig> {
  /** The value this button represents */
  value: string
  /** Icon to display */
  icon: IconProp<Theme>
  /** Optional text label */
  label?: string
  /** Label position relative to button */
  labelPosition?: 'start' | 'end'
  /** Override the group variation */
  variation?: Exclude<UtensilUIVariation, 'solid'>
  /** Override the group color */
  color?: ColorProp<Theme>
  /** Override the group scale */
  scale?: ScaleProp
  /** Whether this specific button is disabled */
  disabled?: boolean
  /** Override the group round */
  round?: boolean
}

// `round` defaults to `undefined` (not destructured to a cast `false`) so it can fall through to the
// group context — see DEVELOPMENT.md, "Composite Children with Context".
const props = withDefaults(defineProps<Props<Theme>>(), {
  labelPosition: 'start',
  color: 'pen',
  disabled: false,
  round: undefined,
})

const gridContext = inject(UtensilRadioGroupContextKey<Theme>())
if (!gridContext) {
  throw new Error('UtensilRadioButton must be used within UtensilRadioButtons')
}

const buttonsContext = inject(UtensilRadioButtonsContextKey)

const {
  isSelected: checkSelected,
  setValue,
  variation: groupVariation,
  scale: groupScale,
  disabled: groupDisabled,
  isTabbable: checkTabbable,
} = gridContext

const isSelected = computed(() => checkSelected(props.value))
const isDisabled = computed(() => props.disabled || groupDisabled.value)
const effectiveVariation = computed(() => props.variation ?? groupVariation.value)
const effectiveScale = computed(() => props.scale ?? groupScale.value)
const effectiveRound = computed(() => props.round ?? buttonsContext?.round.value ?? false)

const isTabbable = computed(() => checkTabbable(props.value))

function select() {
  if (!isDisabled.value) {
    setValue(props.value)
  }
}
</script>
