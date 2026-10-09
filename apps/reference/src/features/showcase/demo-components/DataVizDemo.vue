<template>
  <div class="data-viz-demo">
    <div class="chart-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.type"
        class="chart-tab"
        :class="{ active: activeType === tab.type }"
        @click="activeType = tab.type"
      >
        {{ tab.label }}
      </button>
    </div>

    <UtensilDataViz
      :type="activeType"
      :series="activeSeries"
      :labels="activeLabels"
      :show-values="activeType === 'bar' || activeType === 'stacked-bar' || activeType === 'horizontal-bar'"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import UtensilDataViz from '@gobistories/utensil-vue/components/data-viz/UtensilDataViz.vue'
import type { ChartType } from '@gobistories/utensil-vue/components/data-viz/utensil-data-viz'

const tabs: { type: ChartType; label: string }[] = [
  { type: 'line', label: 'Line' },
  { type: 'bar', label: 'Bar' },
  { type: 'area', label: 'Area' },
  { type: 'donut', label: 'Donut' },
  { type: 'radar', label: 'Radar' },
  { type: 'scatter', label: 'Scatter' },
  { type: 'stacked-bar', label: 'Stacked' },
  { type: 'horizontal-bar', label: 'H-Bar' },
]

const activeType = ref<ChartType>('line')

const lineBarSeries = [
  { label: 'Revenue', values: [12, 19, 14, 25, 22, 30] },
  { label: 'Expenses', values: [18, 11, 20, 10, 24, 14] },
]

const lineBarLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

const donutSeries = [
  { label: 'Direct', values: [42] },
  { label: 'Organic', values: [28] },
  { label: 'Referral', values: [18] },
  { label: 'Social', values: [12] },
]

const radarSeries = [
  { label: 'Product A', values: [85, 70, 90, 60, 75, 80] },
  { label: 'Product B', values: [65, 85, 70, 80, 90, 55] },
]

const radarLabels = ['Speed', 'Power', 'Range', 'Safety', 'Comfort', 'Price']

const scatterSeries = [
  { label: 'Group A', values: [15, 28, 42, 35, 50, 22, 38], xValues: [10, 25, 35, 40, 55, 60, 75] },
  { label: 'Group B', values: [30, 18, 45, 52, 28, 40, 35], xValues: [15, 30, 45, 50, 65, 70, 80] },
]

const stackedSeries = [
  { label: 'Direct', values: [18, 22, 20, 26, 24, 30] },
  { label: 'Organic', values: [10, 14, 16, 12, 18, 15] },
  { label: 'Referral', values: [6, 8, 7, 10, 9, 12] },
]

const activeSeries = computed(() => {
  switch (activeType.value) {
    case 'donut':
      return donutSeries
    case 'radar':
      return radarSeries
    case 'scatter':
      return scatterSeries
    case 'stacked-bar':
      return stackedSeries
    default:
      return lineBarSeries
  }
})

const activeLabels = computed(() => {
  switch (activeType.value) {
    case 'donut':
    case 'scatter':
      return undefined
    case 'radar':
      return radarLabels
    default:
      return lineBarLabels
  }
})
</script>

<style scoped>
.data-viz-demo {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 100%;
  max-width: 100%;
  min-height: 380px;
  width: 400px;
}

.chart-tabs {
  display: flex;
  gap: var(--space-1);
  justify-content: center;
  flex-wrap: wrap;
}

.chart-tab {
  padding: var(--space-1) var(--space-3);
  border: none;
  background: transparent;
  color: var(--pencil-a11);
  font-size: var(--font-size-1);
  font-weight: 500;
  cursor: pointer;
  border-radius: var(--radius-2);
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.chart-tab:hover {
  background: var(--pencil-a3);
}

.chart-tab.active {
  background: var(--pen-a3);
  color: var(--pen-a11);
}

.utensil-data-viz {
  flex-grow: 1;
}
</style>
