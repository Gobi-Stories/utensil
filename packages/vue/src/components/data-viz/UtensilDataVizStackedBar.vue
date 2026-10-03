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

    <defs>
      <clipPath
        v-for="(column, columnIndex) in stackedColumns"
        :id="'stack-clip-' + columnIndex"
        :key="'clip-' + columnIndex"
      >
        <path :d="column.clipPath" />
      </clipPath>
    </defs>

    <g class="stacked-bars">
      <g
        v-for="(column, columnIndex) in stackedColumns"
        :key="'column-' + columnIndex"
        :class="{ animated: animate }"
        :clip-path="`url(#stack-clip-${columnIndex})`"
        :style="{
          ...(animate ? { animationDelay: `${columnIndex * 50}ms` } : undefined),
          transformOrigin: `${column.centerX}px ${baseline}px`,
        }"
      >
        <rect
          v-for="(rect, rectIndex) in column.rects"
          :key="'stacked-' + rectIndex"
          :x="rect.x"
          :y="rect.y"
          :width="rect.width"
          :height="rect.height"
          :fill="rect.color"
        />
      </g>
    </g>

    <g v-if="showValues" class="value-labels">
      <text
        v-for="(label, labelIndex) in valueLabels"
        :key="'val-' + labelIndex"
        :x="label.x"
        :y="label.y"
        text-anchor="middle"
      >
        {{ label.label }}
      </text>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  type DataSeries,
  getSeriesColor,
  formatValue,
  PADDING,
  CHART_WIDTH,
  CHART_HEIGHT,
  VIEW_BOX,
} from './utensil-data-viz'
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

const pointCount = computed(() => {
  if (props.series.length === 0) return 0
  return Math.max(...props.series.map((s) => s.values.length))
})

const stackMax = computed(() => {
  let max = 0
  for (let i = 0; i < pointCount.value; i++) {
    let sum = 0
    for (const s of props.series) {
      sum += s.values[i] ?? 0
    }
    max = Math.max(max, sum)
  }
  if (max === 0) return 100
  const magnitude = Math.pow(10, Math.floor(Math.log10(max)))
  const normalized = max / magnitude
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10
  return nice * magnitude
})

function scaleY(value: number): number {
  return PADDING.top + CHART_HEIGHT - (value / stackMax.value) * CHART_HEIGHT
}

const baseline = scaleY(0)

const stackedColumns = computed(() => {
  const columns: {
    centerX: number
    clipPath: string
    rects: { x: number; y: number; width: number; height: number; color: string }[]
  }[] = []
  const groupWidth = CHART_WIDTH / pointCount.value
  const barWidth = groupWidth * 0.6
  const r = 2

  for (let i = 0; i < pointCount.value; i++) {
    let cumulative = 0
    const groupX = PADDING.left + i * groupWidth + (groupWidth - barWidth) / 2
    const rects: { x: number; y: number; width: number; height: number; color: string }[] = []

    for (let seriesIndex = 0; seriesIndex < props.series.length; seriesIndex++) {
      const value = props.series[seriesIndex].values[i] ?? 0
      const bottom = scaleY(cumulative)
      const top = scaleY(cumulative + value)
      rects.push({
        x: groupX,
        y: top,
        width: barWidth,
        height: Math.max(bottom - top, 0),
        color: getSeriesColor(seriesIndex),
      })
      cumulative += value
    }

    // Clip path: rounded top corners, sharp bottom
    const topY = rects.length > 0 ? Math.min(...rects.map((rect) => rect.y)) : baseline
    const clipPath = `M ${groupX + r} ${topY} Q ${groupX} ${topY} ${groupX} ${topY + r} L ${groupX} ${baseline} L ${groupX + barWidth} ${baseline} L ${groupX + barWidth} ${topY + r} Q ${groupX + barWidth} ${topY} ${groupX + barWidth - r} ${topY} Z`

    columns.push({ centerX: groupX + barWidth / 2, clipPath, rects })
  }
  return columns
})

const valueLabels = computed(() => {
  const labels: { x: number; y: number; label: string }[] = []
  const groupWidth = CHART_WIDTH / pointCount.value

  for (let i = 0; i < pointCount.value; i++) {
    let total = 0
    for (const s of props.series) {
      total += s.values[i] ?? 0
    }
    const groupX = PADDING.left + i * groupWidth + groupWidth / 2
    labels.push({ x: groupX, y: scaleY(total) - 6, label: formatValue(total) })
  }
  return labels
})

const gridLines = computed(() => {
  const count = 4
  return Array.from({ length: count + 1 }, (_, i) => PADDING.top + (i / count) * CHART_HEIGHT)
})

const yAxisTicks = computed(() => {
  const count = 4
  return Array.from({ length: count + 1 }, (_, i) => {
    const value = stackMax.value * (1 - i / count)
    return { y: PADDING.top + (i / count) * CHART_HEIGHT, label: formatValue(value) }
  })
})

const xAxisLabels = computed(() => {
  if (!props.labels) return []
  const groupWidth = CHART_WIDTH / pointCount.value
  return props.labels.map((text, i) => ({
    x: PADDING.left + i * groupWidth + groupWidth / 2,
    text,
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

  .stacked-bars g.animated {
    animation: utensil-data-viz-bar-grow 0.5s ease-out both;
  }

  .value-labels text {
    font-size: 9px;
    fill: var(--pencil-a11);
    font-weight: 500;
  }

  @keyframes utensil-data-viz-bar-grow {
    from {
      transform: scaleY(0);
    }
    to {
      transform: scaleY(1);
    }
  }

  .utensil-reduced-motion .stacked-bars g.animated {
    animation: none;
    transform: none;
  }
}
</style>
