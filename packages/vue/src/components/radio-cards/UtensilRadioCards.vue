<template generic="Theme extends ThemeConfig">
  <UtensilRadioGroup
    v-model="model"
    class="utensil-radio-cards"
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
import type { ColorProp, IconProp, ThemeConfig, UtensilUIVariation, ScaleProp } from '../../theme/utensil-theme'
import UtensilRadioGroup from '../radio-group/UtensilRadioGroup.vue'
import { UtensilRadioCardsContextKey, type RadioIndicatorPosition } from './utensil-radio-cards'

export interface Props<Theme extends ThemeConfig> {
  /** Accessible label for the radio group */
  ariaLabel?: string
  /** Visual variation for all cards */
  variation?: Exclude<UtensilUIVariation, 'solid'>
  /** Accent color */
  color?: ColorProp<Theme>
  /** Scale for all cards */
  scale?: ScaleProp
  /** Whether all cards are disabled */
  disabled?: boolean
  /** Whether keyboard navigation wraps around */
  loop?: boolean
  /** Position of the radio indicator within cards */
  indicatorPosition?: RadioIndicatorPosition
  /** Whether to show the radio indicator in cards */
  indicator?: boolean
  /** Icon to display instead of the radio dot SVG in all cards */
  indicatorIcon?: IconProp<Theme>
  /** Don't change outline background on interactions */
  wireframe?: boolean
  /** Use thick borders */
  thick?: boolean
}

const {
  variation = 'outline',
  color = 'pen',
  disabled = false,
  scale = 1,
  loop = true,
  indicatorPosition = 'start',
  indicator = true,
  indicatorIcon,
  ariaLabel,
  wireframe,
  thick,
} = defineProps<Props<Theme>>()

const model = defineModel<string>()

provide(UtensilRadioCardsContextKey<Theme>(), {
  variation: computed(() => variation),
  indicatorPosition: computed(() => indicatorPosition),
  indicator: computed(() => indicator),
  indicatorIcon: computed(() => indicatorIcon),
  wireframe: computed(() => wireframe),
  thick: computed(() => thick),
})
</script>

<style scoped>
@layer utensil {
  .utensil-radio-cards {
    --utensil-radio-group-gap: var(--space-3);
  }
}
</style>
