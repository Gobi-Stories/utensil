<template generic="Theme extends ThemeConfig">
  <UtensilTheme class="utensil-color-scale" :pen="color" :pencil="color" :paper="color">
    <div class="scale-group">
      <div class="scale-label">{{ displayLabel }}</div>
      <div class="scale-row">
        <div
          v-for="step in 12"
          :key="step"
          class="scale-swatch"
          :style="{ backgroundColor: `var(--${instrument}-${step})` }"
        >
          <span class="swatch-number" :class="lightNumberFrom <= step ? 'swatch-number-light' : 'swatch-number-dark'">
            {{ step }}
          </span>
        </div>
      </div>
    </div>
  </UtensilTheme>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed } from 'vue'
import type { ColorProp, ThemeConfig, Instrument } from '../../theme/utensil-theme'
import UtensilTheme from '../../theme/UtensilTheme.vue'

const props = defineProps<{
  color: ColorProp<Theme>
  instrument: Instrument
  label?: string
}>()

const displayLabel = computed(() => {
  if (props.label) {
    return props.label
  }
  // Capitalize color name and instrument
  const colorName = String(props.color).charAt(0).toUpperCase() + String(props.color).slice(1)
  const instrumentName = props.instrument.charAt(0).toUpperCase() + props.instrument.slice(1)
  return `${colorName} ${instrumentName}`
})

// Paper stays a background across the whole scale, so dark numbers remain readable throughout
const lightNumberFrom = computed(() => (props.instrument === 'paper' ? Infinity : 8))
</script>

<style scoped>
@layer utensil {
  .scale-group {
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: var(--space-3);
    align-items: center;
    margin-bottom: 4px;
  }

  .scale-label {
    display: block;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--pencil-11);
    text-align: right;
    padding-right: var(--space-2);
  }

  .scale-row {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 4px;
  }

  .scale-swatch {
    aspect-ratio: 1;
    border-radius: var(--radius-2);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: var(--space-1);
    position: relative;
  }

  .swatch-number {
    font-size: 0.7rem;
    font-weight: 600;
  }

  .swatch-number-dark {
    color: var(--pencil-11);
  }

  .swatch-number-light {
    color: var(--pencil-2);
  }

  @container size-container (max-width: 551px) {
    .scale-group {
      grid-template-columns: 1fr;
    }

    .scale-label {
      display: none;
    }
  }
}
</style>
