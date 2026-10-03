<template generic="Theme extends ThemeConfig">
  <UtensilCard
    class="utensil-radio-card"
    :class="[
      indicatorPositionClass,
      {
        selected: isSelected,
        disabled: isDisabled,
        wireframe: effectiveWireframe,
        thick: effectiveThick,
      },
    ]"
    :color="color"
    :scale="effectiveScale"
    :radiusScale="radiusScale"
    :variation="effectiveVariation"
    :highlighted="isSelected"
    interactive
    role="radio"
    :aria-checked="isSelected"
    :aria-disabled="isDisabled || undefined"
    :data-value="value"
    :tabindex="isTabbable ? 0 : -1"
    @click="select"
    @keydown.enter="select"
    @keydown.space.prevent="select"
  >
    <slot v-if="effectiveIndicator" name="indicator" :selected="isSelected" :disabled="isDisabled">
      <UtensilIcon v-if="effectiveIndicatorIcon" class="radio-icon" :icon="effectiveIndicatorIcon" />
      <svg v-else class="radio-indicator" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle class="radio-outer" cx="8" cy="8" r="7" />
        <circle class="radio-inner" cx="8" cy="8" r="4" />
      </svg>
    </slot>
    <div class="radio-card-content">
      <slot>{{ label || value }}</slot>
    </div>
  </UtensilCard>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed, inject } from 'vue'
import type {
  ColorProp,
  IconProp,
  ThemeConfig,
  UtensilUIVariation,
  ScaleProp,
  RadiusScaleProp,
} from '../../theme/utensil-theme'
import UtensilCard from '../card/UtensilCard.vue'
import UtensilIcon from '../icon/UtensilIcon.vue'
import { UtensilRadioGroupContextKey } from '../radio-group/utensil-radio-group'
import { UtensilRadioCardsContextKey, type RadioIndicatorPosition } from './utensil-radio-cards'

export interface Props<Theme extends ThemeConfig> {
  /** The value this card represents */
  value: string
  /** Text label to display */
  label?: string
  /** Override the group variation */
  variation?: Exclude<UtensilUIVariation, 'solid'>
  /** Override the group color */
  color?: ColorProp<Theme>
  /** Override the group scale */
  scale?: ScaleProp
  /** Override the radius  */
  radiusScale?: RadiusScaleProp
  /** Whether this specific card is disabled */
  disabled?: boolean
  /** Override the group indicator position */
  indicatorPosition?: RadioIndicatorPosition
  /** Whether to show the radio indicator. Falls back to group context, then true. */
  indicator?: boolean
  /** Icon to display instead of the radio dot SVG. Falls back to group context. Still overridable via the indicator slot. */
  indicatorIcon?: IconProp<Theme>
  /** Don't change outline background on interactions */
  wireframe?: boolean
  /** Use thick borders */
  thick?: boolean
}

const {
  value,
  label,
  variation,
  color = 'pen',
  scale,
  radiusScale,
  disabled = false,
  indicatorPosition,
  indicator = undefined as boolean | undefined,
  indicatorIcon,
  wireframe,
  thick,
} = defineProps<Props<Theme>>()

const groupContext = inject(UtensilRadioGroupContextKey<Theme>())
if (!groupContext) {
  throw new Error('UtensilRadioCard must be used within UtensilRadioCards')
}

const cardsContext = inject(UtensilRadioCardsContextKey())

const {
  isSelected: checkSelected,
  setValue,
  variation: groupVariation,
  scale: groupScale,
  disabled: groupDisabled,
  isTabbable: checkTabbable,
} = groupContext

const isSelected = computed(() => checkSelected(value))
const isDisabled = computed(() => disabled || groupDisabled.value)
const effectiveVariation = computed(() => variation ?? cardsContext?.variation.value ?? groupVariation.value)
const effectiveScale = computed(() => scale ?? groupScale.value)
const effectiveIndicator = computed(() => indicator ?? cardsContext?.indicator.value ?? true)
const effectiveIndicatorIcon = computed(() => indicatorIcon ?? cardsContext?.indicatorIcon.value)
const effectiveIndicatorPosition = computed(() => indicatorPosition ?? cardsContext?.indicatorPosition.value ?? 'start')
const effectiveWireframe = computed(() => (wireframe || cardsContext?.wireframe.value) ?? false)
const effectiveThick = computed(() => (thick || cardsContext?.thick.value) ?? false)

const indicatorPositionClass = computed(() => `indicator-${effectiveIndicatorPosition.value}`)

const isTabbable = computed(() => checkTabbable(value))

function select() {
  if (!isDisabled.value) {
    setValue(value)
  }
}
</script>

<style scoped>
@layer utensil {
  .utensil-radio-card {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  /* Indicator positions */
  .utensil-radio-card.indicator-end,
  .utensil-radio-card.indicator-end-start,
  .utensil-radio-card.indicator-end-end {
    flex-direction: row-reverse;
  }

  .utensil-radio-card.indicator-start-start,
  .utensil-radio-card.indicator-end-start {
    align-items: flex-start;
  }

  .utensil-radio-card.indicator-start-end,
  .utensil-radio-card.indicator-end-end {
    align-items: flex-end;
  }

  /* Disabled */
  .utensil-radio-card.disabled {
    opacity: 0.5;
    cursor: default;
    pointer-events: none;
  }

  /* Radio indicator */
  .radio-indicator,
  .radio-icon {
    display: block;
    width: 1.125rem;
    height: 1.125rem;
    flex-shrink: 0;
  }

  .radio-icon {
    color: var(--pencil-a11);
    transition: color 0.15s ease;
  }

  .utensil-radio-card.selected .radio-icon {
    color: var(--pen-9);
  }

  .utensil-radio-card.selected:hover:not(.disabled) .radio-icon {
    color: var(--pen-10);
  }

  .radio-outer {
    fill: transparent;
    stroke: var(--pencil-8);
    stroke-width: 1.5;
    transition:
      fill 0.15s ease,
      stroke 0.15s ease;
  }

  .radio-inner {
    fill: var(--pen-contrast);
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  /* Hover indicator */
  .utensil-radio-card:hover:not(.disabled) .radio-outer {
    stroke: var(--pen-8);
  }

  /* Selected indicator */
  .utensil-radio-card.selected .radio-outer {
    fill: var(--pen-9);
    stroke: var(--pen-9);
  }

  .utensil-radio-card.selected .radio-inner {
    opacity: 1;
  }

  .utensil-radio-card.selected:hover:not(.disabled) .radio-outer {
    fill: var(--pen-10);
    stroke: var(--pen-10);
  }

  /* Content */
  .radio-card-content {
    flex: 1;
    min-width: 0;
    align-self: stretch;
    display: flex;
    flex-direction: column;
  }

  /* Reduced motion */
  .utensil-reduced-motion .radio-outer,
  .utensil-reduced-motion .radio-inner,
  .utensil-reduced-motion .radio-icon {
    transition: none;
  }

  /* High contrast */
  .utensil-high-contrast .radio-outer {
    stroke: var(--pencil-12);
  }

  .utensil-high-contrast .utensil-radio-card.selected .radio-outer {
    stroke: var(--pen-9);
  }
}
</style>
