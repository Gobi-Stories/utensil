<template generic="Theme extends ThemeConfig">
  <div
    class="utensil-audio-equalizer"
    :class="[...themeClasses, { disabled }]"
    :style="themeStyle"
    role="group"
    :aria-label="ariaLabel"
    :aria-describedby="descriptionId"
  >
    <span :id="descriptionId" class="screen-reader">
      Audio equalizer with vertical sliders. Use Tab to move between bands. Use Up and Down arrow keys to adjust values.
    </span>
    <div class="equalizer-bands">
      <div v-for="(band, index) in bands" :key="band.label" class="equalizer-band">
        <div class="band-value">{{ formatBandValue(bandValues[index]) }}</div>
        <div class="slider-track-container">
          <div class="slider-track">
            <div class="slider-fill" :style="{ height: fillHeight(bandValues[index]) }"></div>
          </div>
          <input
            type="range"
            class="vertical-slider"
            :min="min"
            :max="max"
            :step="step"
            :value="bandValues[index]"
            :disabled="disabled"
            :aria-label="band.label"
            :aria-valuemin="min"
            :aria-valuemax="max"
            :aria-valuenow="bandValues[index]"
            :aria-valuetext="`${band.label}: ${formatBandValue(bandValues[index])}`"
            @input="handleBandInput(index, $event)"
          />
        </div>
        <div class="band-label">{{ band.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed, useId } from 'vue'
import type { ColorProp, ThemeConfig, ScaleProp } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'
import type { AudioBand } from './audio-equalizer'

export interface Props<Theme extends ThemeConfig> {
  modelValue: number[]
  bands?: AudioBand[]
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  color?: ColorProp<Theme>
  scale?: ScaleProp
  ariaLabel?: string
  formatValue?: (value: number) => string
}

const {
  modelValue,
  bands = [{ label: 'Bass' }, { label: 'Low' }, { label: 'Mid' }, { label: 'High' }, { label: 'Treble' }],
  min = -12,
  max = 12,
  step = 1,
  disabled = false,
  color = 'pen',
  ariaLabel = 'Audio equalizer',
  formatValue,
  scale,
} = defineProps<Props<Theme>>()

const emit = defineEmits<{
  'update:modelValue': [value: number[]]
}>()

const descriptionId = `utensil-audio-equalizer-desc-${useId()}`

const penColor = computed<ColorProp<Theme>>(() => color || 'pen')

const { classes: themeClasses, style: themeStyle } = useTheme({
  pen: penColor,
  relativeScale: () => scale,
})

const bandValues = computed(() => {
  return bands.map((_, index) => modelValue[index] ?? 0)
})

function fillHeight(value: number): string {
  const range = max - min
  if (range === 0) return '50%'
  const percentage = ((value - min) / range) * 100
  return `${percentage}%`
}

function formatBandValue(value: number): string {
  if (formatValue) return formatValue(value)
  const sign = value > 0 ? '+' : ''
  return `${sign}${value}`
}

function handleBandInput(index: number, event: Event) {
  const target = event.target as HTMLInputElement
  const newValue = Number(target.value)
  const newValues = [...bandValues.value]
  newValues[index] = newValue
  emit('update:modelValue', newValues)
}
</script>

<style scoped>
@layer utensil {
  .utensil-audio-equalizer {
    --slider-height: var(--utensil-audio-equalizer-slider-height, 140px);
    --track-width: 4px;
    --thumb-size: calc(var(--space-3) + 2px);

    position: relative;
    display: inline-flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .equalizer-bands {
    display: flex;
    gap: var(--space-4);
    align-items: flex-end;
  }

  .equalizer-band {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
  }

  .band-value {
    font-size: var(--font-size-1);
    font-weight: 600;
    color: var(--pen-a11);
    min-width: var(--space-6);
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  .slider-track-container {
    position: relative;
    width: var(--thumb-size);
    height: var(--slider-height);
  }

  .slider-track {
    position: absolute;
    inset-inline-start: 50%;
    transform: translateX(-50%);
    width: var(--track-width);
    height: 100%;
    background-color: var(--pencil-a3);
    border-radius: var(--radius-2);
    overflow: hidden;
    pointer-events: none;
  }

  .slider-fill {
    position: absolute;
    inset-block-end: 0;
    width: 100%;
    background-color: var(--pen-9);
    border-radius: var(--radius-2);
    transition: height 0.1s ease;
  }

  .vertical-slider {
    position: absolute;
    width: var(--slider-height);
    height: var(--thumb-size);
    inset-block-start: 50%;
    inset-inline-start: 50%;
    margin: 0;
    transform: translate(-50%, -50%) rotate(-90deg);
    appearance: none;
    -webkit-appearance: none;
    background: transparent;
    cursor: pointer;
    outline: none;
  }

  /* Webkit thumb */
  .vertical-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: var(--thumb-size);
    height: var(--thumb-size);
    border-radius: 50%;
    border: 2px solid var(--background);
    background-color: var(--pen-indicator);
    cursor: pointer;
    transition: transform 0.15s ease;
  }

  .vertical-slider:hover::-webkit-slider-thumb {
    transform: scale(1.15);
    background-color: var(--pen-10);
  }

  .vertical-slider:active::-webkit-slider-thumb {
    transform: scale(1.05);
  }

  .vertical-slider:focus-visible::-webkit-slider-thumb {
    border: 3px solid var(--pen-contrast);
    width: calc(var(--thumb-size) + 2px);
    height: calc(var(--thumb-size) + 2px);
    outline: 3px solid var(--pen-8);
    outline-offset: 0;
  }

  /* Firefox thumb */
  .vertical-slider::-moz-range-thumb {
    width: var(--thumb-size);
    height: var(--thumb-size);
    border-radius: 50%;
    border: 2px solid var(--background);
    background-color: var(--pen-indicator);
    cursor: pointer;
    transition: transform 0.15s ease;
  }

  .vertical-slider:hover::-moz-range-thumb {
    transform: scale(1.15);
    background-color: var(--pen-10);
  }

  .vertical-slider:active::-moz-range-thumb {
    transform: scale(1.05);
  }

  .vertical-slider:focus-visible::-moz-range-thumb {
    border: 3px solid var(--pen-contrast);
    width: calc(var(--thumb-size) + 2px);
    height: calc(var(--thumb-size) + 2px);
    outline: 3px solid var(--pen-8);
    outline-offset: 0;
  }

  /* Firefox track */
  .vertical-slider::-moz-range-track {
    background: transparent;
    height: var(--track-width);
  }

  /* Band label */
  .band-label {
    font-size: var(--font-size-1);
    font-weight: 500;
    color: var(--pencil-a11);
    text-align: center;
    white-space: nowrap;
  }

  /* Disabled state */
  .utensil-audio-equalizer.disabled {
    opacity: 0.5;
    cursor: default;
    pointer-events: none;
  }

  .utensil-audio-equalizer.disabled .vertical-slider {
    cursor: default;
  }

  /* High contrast */
  .utensil-high-contrast .slider-track {
    background-color: var(--pencil-a5);
  }

  /* Reduced motion */
  .utensil-reduced-motion .slider-fill {
    transition: none;
  }

  .utensil-reduced-motion .vertical-slider::-webkit-slider-thumb {
    transition: none;
  }

  .utensil-reduced-motion .vertical-slider::-moz-range-thumb {
    transition: none;
  }
}
</style>
