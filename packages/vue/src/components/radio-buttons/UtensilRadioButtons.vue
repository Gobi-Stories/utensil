<template generic="Theme extends ThemeConfig">
  <UtensilRadioGroup
    v-model="model"
    class="utensil-radio-buttons"
    :class="{ 'with-labels': showLabels }"
    :aria-label="ariaLabel"
    :variation="variation"
    :color="color"
    :scale="scale"
    :disabled="disabled"
    :loop="loop"
  >
    <template #default="scope">
      <slot v-bind="scope" />
    </template>
  </UtensilRadioGroup>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed, provide } from 'vue'
import type { ColorProp, ThemeConfig, UtensilUIVariation, ScaleProp } from '../../theme/utensil-theme'
import UtensilRadioGroup from '../radio-group/UtensilRadioGroup.vue'
import { UtensilRadioButtonsContextKey } from './utensil-radio-buttons'

export interface Props<Theme extends ThemeConfig> {
  /** Accessible label for the radio group */
  ariaLabel?: string
  /** Visual variation for all buttons */
  variation?: Exclude<UtensilUIVariation, 'solid'>
  /** Accent color */
  color?: ColorProp<Theme>
  /** Scale for all buttons */
  scale?: ScaleProp
  /** Whether all buttons are disabled */
  disabled?: boolean
  /** Whether buttons are round */
  round?: boolean
  /** Whether keyboard navigation wraps around */
  loop?: boolean
  /** Whether to show labels */
  showLabels?: boolean
}

const {
  variation = 'soft',
  color = 'pen',
  disabled = false,
  round = false,
  scale = 1,
  loop = true,
  showLabels = false,
  ariaLabel,
} = defineProps<Props<Theme>>()

const model = defineModel<string>()

provide(UtensilRadioButtonsContextKey, {
  round: computed(() => round),
})
</script>

<style scoped>
@layer utensil {
  .utensil-radio-buttons {
    --utensil-radio-button-label-display: none;

    display: inline-flex;
    flex-wrap: nowrap;
    gap: var(--space-1);

    &.with-labels {
      --utensil-radio-button-label-display: block;
      gap: var(--space-3);
    }
  }
}
</style>
