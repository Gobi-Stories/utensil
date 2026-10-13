<template>
  <div class="chart-tooltip">
    <slot>
      <div v-if="labels?.[index]" class="tooltip-title">{{ labels[index] }}</div>
      <template v-for="(s, seriesIndex) in series" :key="'tip-' + seriesIndex">
        <div v-if="index < s.values.length" class="tooltip-row">
          <span class="tooltip-swatch" :style="{ backgroundColor: getSeriesColor(seriesIndex, s) }"></span>
          <span>{{ s.label }}: {{ formatValue(s.values[index]) }}</span>
        </div>
      </template>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { type DataSeries, getSeriesColor, formatValue } from './utensil-data-viz'

export interface Props {
  series: DataSeries[]
  labels?: string[]
  /** The point the tooltip describes: its label, and each series' value there */
  index: number
}

defineProps<Props>()
</script>

<style scoped>
@layer utensil {
  .chart-tooltip {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    padding: var(--space-2) var(--space-3);
    background-color: var(--panel-solid);
    border-radius: var(--radius-3);
    box-shadow: var(--shadow-border-3);
    font-size: var(--font-size-1);
    color: var(--pencil-a11);
    white-space: nowrap;
    pointer-events: none;
  }

  .tooltip-title {
    font-weight: 600;
    color: var(--pencil-12);
  }

  .tooltip-row {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .tooltip-swatch {
    flex-shrink: 0;
    width: var(--space-2);
    height: var(--space-2);
    border-radius: var(--radius-1);
  }
}
</style>
