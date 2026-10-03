<template generic="Theme extends ThemeConfig">
  <div
    class="utensil-range-slider"
    :class="{
      'label-inline': (label || $slots.label) && labelPlacement === 'inline',
      vertical,
      interacting,
      'visible-while-interacting': visibleWhileInteracting,
    }"
  >
    <label
      v-if="label || $slots.label"
      :for="inputId"
      class="utensil-range-slider-label"
      :class="{ 'show-values': showValuesInLabel, 'active-label': showValuesInLabel && interacting }"
    >
      <slot name="label" :value="modelValue" :formatted-value="formattedValue">
        <template v-if="showValuesInLabel">
          <span v-for="text in labelSizerTexts" :key="text" class="label-sizer" aria-hidden="true">{{ text }}</span>
          <span>{{ displayLabel }}</span>
        </template>
        <template v-else>
          {{ label }}
        </template>
      </slot>
    </label>
    <div class="utensil-range-slider-control" :class="[...themeClasses, { disabled }]" :style="themeStyle">
      <div class="slider-container">
        <div class="track" :class="{ rounded }" ref="trackRef">
          <div class="fill" :class="{ rounded }" :style="fillStyle"></div>
        </div>
        <input
          ref="inputRef"
          :id="inputId"
          type="range"
          class="slider-input"
          :value="inputValue"
          :min="inputMin"
          :max="inputMax"
          :step="inputStep"
          :disabled="disabled"
          :aria-label="ariaLabel"
          :aria-orientation="vertical ? 'vertical' : undefined"
          :aria-valuemin="effectiveMin"
          :aria-valuemax="effectiveMax"
          :aria-valuenow="modelValue"
          :aria-valuetext="formattedValue"
          @input="handleInput"
          @change="handleChange"
          @pointerdown="onPointerDown"
        />
      </div>
      <div v-if="showValue || valueBadge || $slots.value" class="slider-value">
        <slot name="value" :value="modelValue">
          <UtensilBadge v-if="valueBadge" variation="soft">{{ formattedValue }}</UtensilBadge>
          <template v-else>{{ formattedValue }}</template>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed, ref, useId, onBeforeUnmount } from 'vue'
import type { ColorProp, ThemeConfig, ScaleProp } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'
import UtensilBadge from '../badge/UtensilBadge.vue'

export interface Props<Theme extends ThemeConfig> {
  modelValue: number
  min?: number
  max?: number
  step?: number
  steps?: number[]
  disabled?: boolean
  id?: string
  label?: string
  labelPlacement?: 'block' | 'inline'
  showValue?: boolean
  // Renders the value in a soft badge beside the slider (implies showing the value).
  valueBadge?: boolean
  // Appended to the displayed value (e.g. 'px'); ignored when formatValue is given.
  unit?: string
  formatValue?: (value: number) => string
  showValuesInLabel?: boolean
  color?: ColorProp<Theme>
  scale?: ScaleProp
  ariaLabel?: string
  rounded?: boolean
  // Stands the slider upright — values increase upward. Height comes from the
  // container (or --range-slider-control-height).
  vertical?: boolean
  // Keeps the track and thumb visible while the slider is adjusted, punching
  // through a hidden ancestor — for surfaces that get out of the way during
  // the interaction (via the root's .interacting class) so the content behind
  // shows the change live. The label and value stay hidden with the surface.
  visibleWhileInteracting?: boolean
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  labelPlacement: 'block',
  showValue: false,
  color: 'pen',
})

const generatedId = `utensil-range-slider-${useId()}`
const inputId = computed(() => props.id || generatedId)

const emit = defineEmits<{
  'update:modelValue': [value: number]
  // The committed value — fires on release for pointer drags, once per keyboard step
  change: [value: number]
}>()

const penColor = computed<ColorProp<Theme>>(() => props.color || 'pen')

const { classes: themeClasses, style: themeStyle } = useTheme({
  pen: penColor,
  relativeScale: () => props.scale,
})

const hasSteps = computed(() => props.steps && props.steps.length >= 2)

const effectiveMin = computed(() => (hasSteps.value ? props.steps![0] : props.min))
const effectiveMax = computed(() => (hasSteps.value ? props.steps![props.steps!.length - 1] : props.max))

// When using steps, the native input operates on indices (0..length-1)
const inputMin = computed(() => (hasSteps.value ? 0 : props.min))
const inputMax = computed(() => (hasSteps.value ? props.steps!.length - 1 : props.max))
const inputStep = computed(() => (hasSteps.value ? 1 : props.step))

function nearestStepIndex(value: number): number {
  const steps = props.steps!
  let closest = 0
  let minDiff = Math.abs(value - steps[0])
  for (let i = 1; i < steps.length; i++) {
    const diff = Math.abs(value - steps[i])
    if (diff < minDiff) {
      minDiff = diff
      closest = i
    }
  }
  return closest
}

const inputValue = computed(() => (hasSteps.value ? nearestStepIndex(props.modelValue) : props.modelValue))

const fillPercentage = computed(() => {
  if (hasSteps.value) {
    const index = nearestStepIndex(props.modelValue)
    const maxIndex = props.steps!.length - 1
    return maxIndex === 0 ? 0 : (index / maxIndex) * 100
  }
  const range = props.max - props.min
  if (range === 0) return 0
  return ((props.modelValue - props.min) / range) * 100
})

const fillStyle = computed(() =>
  props.vertical ? { height: fillPercentage.value + '%' } : { width: fillPercentage.value + '%' },
)

const formattedValue = computed(() => {
  if (props.formatValue) {
    return props.formatValue(props.modelValue)
  }
  return `${props.modelValue}${props.unit ?? ''}`
})

const interacting = ref(false)

const displayLabel = computed(() => (interacting.value && props.showValuesInLabel ? formattedValue.value : props.label))

const labelSizerTexts = computed(() => {
  const texts: string[] = []
  if (props.label) texts.push(props.label)
  if (props.showValuesInLabel && props.steps) {
    texts.push(...props.steps.map((v) => (props.formatValue ? props.formatValue(v) : String(v))))
  }
  return texts
})

// A press interacts until its release or cancel — :active drops mid-slide on
// touch, so the class must come from pointer tracking
function onPointerDown() {
  interacting.value = true
  window.addEventListener('pointerup', endInteraction, { once: true })
  window.addEventListener('pointercancel', endInteraction, { once: true })
}

function endInteraction() {
  interacting.value = false
  window.removeEventListener('pointerup', endInteraction)
  window.removeEventListener('pointercancel', endInteraction)
}

onBeforeUnmount(endInteraction)

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const raw = Number(target.value)
  emit('update:modelValue', hasSteps.value ? props.steps![raw] : raw)
}

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  const raw = Number(target.value)
  emit('change', hasSteps.value ? props.steps![raw] : raw)
}
</script>

<style scoped>
@layer utensil {
  .utensil-range-slider {
    /* Cvars */
    --label-display: var(--utensil-range-slider-label-display, block);
    --control-width: var(--range-slider-control-width, 100%);
    --control-height: var(--range-slider-control-height, 100%);
    --label-width: var(--range-slider-label-width);
    --value-width: var(--range-slider-value-width, var(--space-6));

    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    line-height: normal;
  }

  .utensil-range-slider.label-inline {
    flex-direction: row;
    align-items: center;
    gap: var(--space-3);
  }

  .utensil-range-slider.label-inline .utensil-range-slider-control {
    flex: 1;
  }

  .utensil-range-slider-label {
    display: var(--label-display);
    font-size: var(--font-size-2);
    font-weight: 500;
    color: var(--pencil-11);
    transition: color 0.3s ease;
    width: var(--label-width);

    span {
      display: var(--label-display);
    }
  }

  .utensil-range-slider-label.show-values {
    display: inline-grid;
  }

  .utensil-range-slider-label.show-values > span {
    grid-area: 1 / 1;
    justify-self: end;
  }

  .utensil-range-slider-label.active-label {
    color: var(--pen-11);
  }

  .label-sizer {
    visibility: hidden;
  }

  .utensil-range-slider-control {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    width: var(--control-width);
    max-width: var(--control-width);
  }

  .slider-container {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    height: calc(var(--space-4) + 4px);
  }

  .track {
    position: absolute;
    width: 100%;
    height: 4px;
    background-color: var(--pencil-a3);
    overflow: hidden;
    pointer-events: none;

    &.rounded {
      border-radius: var(--radius-2);
    }
  }

  .fill {
    height: 100%;
    background-color: var(--pen-9);

    &.rounded {
      border-radius: var(--radius-2);
    }
  }

  .slider-input {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
    appearance: none;
    -webkit-appearance: none;
    background: transparent;
    cursor: pointer;
    outline: none;
  }

  /* Vertical orientation — the writing mode turns the native input upright and
     rtl direction makes values increase upward */
  .utensil-range-slider.vertical {
    height: 100%;
  }

  .utensil-range-slider.vertical .utensil-range-slider-control {
    flex-direction: column;
    width: auto;
    max-width: none;
    height: var(--control-height);
    max-height: var(--control-height);
  }

  .utensil-range-slider.vertical .slider-container {
    flex: 1;
    justify-content: center;
    width: calc(var(--space-4) + 4px);
    height: auto;
    /* The upright input's intrinsic height must not size the container */
    min-height: 0;
  }

  .utensil-range-slider.vertical .track {
    inset-inline-start: calc(50% - 2px);
    width: 4px;
    height: 100%;
  }

  .utensil-range-slider.vertical .fill {
    position: absolute;
    bottom: 0;
    width: 100%;
  }

  .utensil-range-slider.vertical .slider-input {
    writing-mode: vertical-lr;
    direction: rtl;
  }

  .utensil-range-slider.vertical .slider-value {
    text-align: center;
  }

  /* Webkit thumb */
  .slider-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: calc(var(--space-3) + 2px);
    height: calc(var(--space-3) + 2px);
    border-radius: 50%;
    border: 2px solid var(--background);
    background-color: var(--pen-indicator);
    cursor: pointer;
    transition: transform 0.15s ease;
  }

  .slider-input:hover::-webkit-slider-thumb {
    transform: scale(1.15);
  }

  .slider-input:active::-webkit-slider-thumb {
    transform: scale(1.05);
  }

  .slider-input:focus-visible::-webkit-slider-thumb {
    border: 3px solid var(--pen-contrast);
    width: calc(var(--space-3) + 4px);
    height: calc(var(--space-3) + 4px);
    outline: 3px solid var(--pen-8);
    outline-offset: 0;
  }

  /* Firefox thumb */
  .slider-input::-moz-range-thumb {
    width: calc(var(--space-3) + 2px);
    height: calc(var(--space-3) + 2px);
    border-radius: 50%;
    border: 2px solid var(--background);
    background-color: var(--pen-indicator);
    cursor: pointer;
    transition: transform 0.15s ease;
  }

  .slider-input:hover::-moz-range-thumb {
    transform: scale(1.15);
  }

  .slider-input:active::-moz-range-thumb {
    transform: scale(1.05);
  }

  .slider-input:focus-visible::-moz-range-thumb {
    border: 3px solid var(--pen-contrast);
    width: calc(var(--space-3) + 4px);
    height: calc(var(--space-3) + 4px);
    outline: 3px solid var(--pen-8);
    outline-offset: 0;
  }

  /* Firefox track (must be transparent since we use our own) */
  .slider-input::-moz-range-track {
    background: transparent;
    height: 4px;
  }

  /* The adjusted track punches through a hidden ancestor — visibility, unlike
     opacity, re-enables on descendants. The label and value stay hidden. */
  .utensil-range-slider.visible-while-interacting.interacting .slider-container {
    visibility: visible;
  }

  /* Disabled state */
  .utensil-range-slider-control.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .utensil-range-slider-control.disabled .slider-input {
    cursor: default;
  }

  /* Value display */
  .slider-value {
    font-size: var(--font-size-2);
    font-weight: 500;
    color: var(--pen-11);
    white-space: nowrap;
    min-width: var(--value-width);
    text-align: end;
  }
}
</style>
