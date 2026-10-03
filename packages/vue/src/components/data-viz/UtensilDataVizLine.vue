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

    <g class="lines">
      <path
        v-for="(s, seriesIndex) in series"
        :key="'line-' + seriesIndex"
        :d="getLinePath(seriesIndex)"
        :stroke="getSeriesColor(seriesIndex)"
        fill="none"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        :class="{ animated: animate }"
      />
      <circle
        v-for="(point, pointIndex) in allPoints"
        :key="'point-' + pointIndex"
        :cx="point.x"
        :cy="point.y"
        r="3.5"
        :fill="point.color"
        :class="{ animated: animate }"
        :style="animate ? { animationDelay: `${pointIndex * 60}ms` } : undefined"
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

const allPoints = computed(() => {
  const points: { x: number; y: number; color: string }[] = []
  props.series.forEach((s, seriesIndex) => {
    s.values.forEach((v, i) => {
      points.push({ x: getX(i), y: getY(v), color: getSeriesColor(seriesIndex) })
    })
  })
  return points
})

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

  .lines path.animated {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: utensil-data-viz-line-draw 1s ease-out forwards;
  }

  .lines circle.animated {
    opacity: 0;
    animation: utensil-data-viz-fade-in 0.3s ease-out forwards;
  }

  .value-labels text {
    font-size: 9px;
    fill: var(--pencil-a11);
    font-weight: 500;
  }

  @keyframes utensil-data-viz-line-draw {
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes utensil-data-viz-fade-in {
    to {
      opacity: 1;
    }
  }

  .utensil-reduced-motion .lines path.animated,
  .utensil-reduced-motion .lines circle.animated {
    animation: none;
    opacity: 1;
    stroke-dashoffset: 0;
  }
}
</style>
