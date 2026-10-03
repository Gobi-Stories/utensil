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

    <g class="scatter-points">
      <circle
        v-for="(point, pointIndex) in allPoints"
        :key="'scatter-' + pointIndex"
        :cx="point.x"
        :cy="point.y"
        r="4"
        :fill="point.color"
        fill-opacity="0.7"
        :stroke="point.color"
        stroke-width="1"
        :class="{ animated: animate }"
        :style="animate ? { animationDelay: `${pointIndex * 30}ms` } : undefined"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  type DataSeries,
  getSeriesColor,
  PADDING,
  VIEW_BOX,
  CHART_WIDTH,
  CHART_HEIGHT,
  formatValue,
} from './utensil-data-viz'
import DataVizGrid from './DataVizGrid.vue'

interface Props {
  series: DataSeries[]
  labels?: string[]
  animate?: boolean
  showGrid?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  animate: true,
  showGrid: true,
})

const xMax = computed(() => {
  const allX = props.series.flatMap((s) => s.xValues ?? s.values.map((_, i) => i))
  const max = Math.max(...allX, 0)
  if (max === 0) return 100
  const magnitude = Math.pow(10, Math.floor(Math.log10(max)))
  const normalized = max / magnitude
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10
  return nice * magnitude
})

const yMax = computed(() => {
  const allY = props.series.flatMap((s) => s.values)
  const max = Math.max(...allY, 0)
  if (max === 0) return 100
  const magnitude = Math.pow(10, Math.floor(Math.log10(max)))
  const normalized = max / magnitude
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10
  return nice * magnitude
})

function scaleX(value: number): number {
  return PADDING.left + (value / xMax.value) * CHART_WIDTH
}

function scaleY(value: number): number {
  return PADDING.top + CHART_HEIGHT - (value / yMax.value) * CHART_HEIGHT
}

const allPoints = computed(() => {
  const points: { x: number; y: number; color: string }[] = []
  props.series.forEach((s, seriesIndex) => {
    const xVals = s.xValues ?? s.values.map((_, i) => i)
    s.values.forEach((yVal, i) => {
      points.push({
        x: scaleX(xVals[i] ?? i),
        y: scaleY(yVal),
        color: getSeriesColor(seriesIndex),
      })
    })
  })
  return points
})

const gridLines = computed(() => {
  const count = 4
  return Array.from({ length: count + 1 }, (_, i) => {
    return PADDING.top + (i / count) * CHART_HEIGHT
  })
})

const yAxisTicks = computed(() => {
  const count = 4
  return Array.from({ length: count + 1 }, (_, i) => {
    const value = yMax.value * (1 - i / count)
    return { y: PADDING.top + (i / count) * CHART_HEIGHT, label: formatValue(value) }
  })
})

const xAxisLabels = computed(() => {
  if (props.labels) {
    return props.labels.map((text, i) => ({
      x: PADDING.left + (i / Math.max(props.labels!.length - 1, 1)) * CHART_WIDTH,
      text,
    }))
  }
  const count = 4
  return Array.from({ length: count + 1 }, (_, i) => ({
    x: PADDING.left + (i / count) * CHART_WIDTH,
    text: formatValue((xMax.value * i) / count),
  }))
})

const padding = PADDING
const viewBox = VIEW_BOX
</script>

<style scoped>
@layer utensil {
  .chart-svg {
    align-self: center;
  }

  .scatter-points circle.animated {
    opacity: 0;
    animation: utensil-data-viz-scatter-pop 0.3s ease-out forwards;
  }

  @keyframes utensil-data-viz-scatter-pop {
    from {
      opacity: 0;
      r: 0;
    }
    to {
      opacity: 1;
      r: 4;
    }
  }

  .utensil-high-contrast .scatter-points circle {
    fill-opacity: 1;
    stroke-width: 2;
  }

  .utensil-reduced-motion .scatter-points circle.animated {
    animation: none;
    opacity: 1;
  }
}
</style>
