<template>
  <div class="utensil-data-viz" role="figure" :aria-label="ariaLabel">
    <div v-if="title" class="chart-title">{{ title }}</div>

    <UtensilDataVizLine
      v-if="type === 'line'"
      :series="series"
      :labels="labels"
      :animate="animate"
      :show-grid="showGrid"
      :show-values="showValues"
      :interactive="interactive"
      :reference-lines="referenceLines"
      :baseline="baseline"
      @hover="emit('hover', $event)"
    >
      <template v-if="$slots.tooltip" #tooltip="{ index }">
        <slot name="tooltip" :index="index"></slot>
      </template>
    </UtensilDataVizLine>

    <UtensilDataVizBar
      v-else-if="type === 'bar'"
      :series="series"
      :labels="labels"
      :animate="animate"
      :show-grid="showGrid"
      :show-values="showValues"
      :baseline="baseline"
    />

    <UtensilDataVizArea
      v-else-if="type === 'area'"
      :series="series"
      :labels="labels"
      :animate="animate"
      :show-grid="showGrid"
      :show-values="showValues"
      :interactive="interactive"
      :reference-lines="referenceLines"
      :baseline="baseline"
      @hover="emit('hover', $event)"
    >
      <template v-if="$slots.tooltip" #tooltip="{ index }">
        <slot name="tooltip" :index="index"></slot>
      </template>
    </UtensilDataVizArea>

    <UtensilDataVizDonut v-else-if="type === 'donut'" :series="series" :animate="animate" />

    <UtensilDataVizRadar v-else-if="type === 'radar'" :series="series" :labels="labels" :animate="animate" />

    <UtensilDataVizScatter
      v-else-if="type === 'scatter'"
      :series="series"
      :labels="labels"
      :animate="animate"
      :show-grid="showGrid"
    />

    <UtensilDataVizStackedBar
      v-else-if="type === 'stacked-bar'"
      :series="series"
      :labels="labels"
      :animate="animate"
      :show-grid="showGrid"
      :show-values="showValues"
      :baseline="baseline"
    />

    <UtensilDataVizHorizontalBar
      v-else-if="type === 'horizontal-bar'"
      :series="series"
      :labels="labels"
      :animate="animate"
      :show-grid="showGrid"
      :show-values="showValues"
      :baseline="baseline"
    />

    <!-- Legend -->
    <div v-if="showLegend && series.length > 0" class="chart-legend">
      <div v-for="(s, index) in series" :key="'legend-' + index" class="legend-item">
        <span class="legend-swatch" :style="{ backgroundColor: getSeriesColor(index, s) }"></span>
        <span class="legend-label">{{ s.label }}</span>
      </div>
    </div>

    <!-- Screen reader description -->
    <span class="screen-reader">{{ screenReaderDescription }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type ChartType, type DataSeries, type ReferenceLine, getSeriesColor } from './utensil-data-viz'
import UtensilDataVizLine from './UtensilDataVizLine.vue'
import UtensilDataVizBar from './UtensilDataVizBar.vue'
import UtensilDataVizArea from './UtensilDataVizArea.vue'
import UtensilDataVizDonut from './UtensilDataVizDonut.vue'
import UtensilDataVizRadar from './UtensilDataVizRadar.vue'
import UtensilDataVizScatter from './UtensilDataVizScatter.vue'
import UtensilDataVizStackedBar from './UtensilDataVizStackedBar.vue'
import UtensilDataVizHorizontalBar from './UtensilDataVizHorizontalBar.vue'

export interface Props {
  type?: ChartType
  series: DataSeries[]
  labels?: string[]
  title?: string
  showLegend?: boolean
  showGrid?: boolean
  showValues?: boolean
  animate?: boolean
  ariaLabel?: string
  /** A hover crosshair, a tooltip per point and the `hover` event, on line and area charts */
  interactive?: boolean
  /** Horizontal lines across line and area charts, which the y-axis includes */
  referenceLines?: ReferenceLine[]
  /**
   * The value line, area and bar charts measure from, which their value axis always includes: values below it extend
   * the axis down, bars run from it, an area fills to it, and a dashed line marks it while values fall below it.
   * Stacked bars stack from zero, and their axis includes it.
   */
  baseline?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'line',
  showLegend: true,
  showGrid: true,
  animate: true,
  ariaLabel: 'Data visualization',
  interactive: false,
  baseline: 0,
})

const emit = defineEmits<{
  /** The hovered point's index on an interactive line or area chart, or null when the pointer leaves it */
  hover: [index: number | null]
}>()

defineSlots<{
  /** The hovered point's tooltip on an interactive line or area chart */
  tooltip?(props: { index: number }): unknown
}>()

const screenReaderDescription = computed(() => {
  const chartDesc = `${props.type} chart`
  const seriesDesc = props.series.map((s) => `${s.label}: ${s.values.join(', ')}`).join('. ')
  return `${chartDesc}. ${seriesDesc}`
})
</script>

<style scoped>
@layer utensil {
  .utensil-data-viz {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    gap: var(--space-3);
    width: 100%;
    height: 100%;
  }

  .chart-title {
    font-size: var(--font-size-3);
    font-weight: 600;
    color: var(--pencil-a11);
  }

  /* Legend */
  .chart-legend {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    justify-content: center;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .legend-swatch {
    width: 10px;
    height: 10px;
    border-radius: var(--radius-1);
    flex-shrink: 0;
  }

  .legend-label {
    font-size: var(--font-size-1);
    color: var(--pencil-a11);
  }

  /* Screen reader */
  .screen-reader {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
}
</style>
