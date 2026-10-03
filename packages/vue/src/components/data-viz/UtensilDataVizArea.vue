<template>
  <svg class="chart-svg" :viewBox="`0 0 ${viewBox.width} ${viewBox.height}`" preserveAspectRatio="xMidYMid meet">
    <DataVizGrid
      :show-grid="showGrid"
      :grid-lines="gridLines"
      :y-axis-ticks="yAxisTicks"
      :x-axis-labels="xAxisLabels"
      :padding="padding"
      :view-box="viewBox"
    />

    <g class="areas">
      <path
        v-for="(s, seriesIndex) in series"
        :key="'area-' + seriesIndex"
        :d="getAreaPath(seriesIndex)"
        :fill="getSeriesColor(seriesIndex)"
        fill-opacity="0.15"
        :class="{ animated: animate }"
      />
      <path
        v-for="(s, seriesIndex) in series"
        :key="'area-line-' + seriesIndex"
        :d="getLinePath(seriesIndex)"
        :stroke="getSeriesColor(seriesIndex)"
        fill="none"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        :class="{ animated: animate }"
      />
    </g>

    <g v-if="showValues" class="value-labels">
      <text
        v-for="(point, pointIndex) in valueLabels"
        :key="'val-' + pointIndex"
        :x="point.x"
        :y="point.y - 10"
        text-anchor="middle"
      >
        {{ point.label }}
      </text>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type DataSeries, getSeriesColor, formatValue } from './utensil-data-viz'
import { useCartesianChart } from './use-cartesian-chart'
import DataVizGrid from './DataVizGrid.vue'

interface Props {
  series: DataSeries[]
  labels?: string[]
  animate?: boolean
  showGrid?: boolean
  showValues?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  animate: true,
  showGrid: true,
})

const { padding, viewBox, getX, getY, gridLines, yAxisTicks, xAxisLabels, getLinePath } = useCartesianChart({
  series: () => props.series,
  labels: () => props.labels,
})

function getAreaPath(seriesIndex: number): string {
  const values = props.series[seriesIndex].values
  if (values.length === 0) return ''
  const baseline = getY(0)
  const linePart = values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(v)}`).join(' ')
  return `${linePart} L ${getX(values.length - 1)} ${baseline} L ${getX(0)} ${baseline} Z`
}

const valueLabels = computed(() => {
  const labels: { x: number; y: number; label: string }[] = []
  props.series.forEach((s) => {
    s.values.forEach((v, i) => {
      labels.push({ x: getX(i), y: getY(v), label: formatValue(v) })
    })
  })
  return labels
})
</script>

<style scoped>
@layer utensil {
  .chart-svg {
    align-self: center;
  }

  .areas path.animated {
    opacity: 0;
    animation: utensil-data-viz-fade-in 0.6s ease-out forwards;
  }

  .value-labels text {
    font-size: 9px;
    fill: var(--pencil-a11);
    font-weight: 500;
  }

  @keyframes utensil-data-viz-fade-in {
    to {
      opacity: 1;
    }
  }

  .utensil-reduced-motion .areas path.animated {
    animation: none;
    opacity: 1;
  }
}
</style>
