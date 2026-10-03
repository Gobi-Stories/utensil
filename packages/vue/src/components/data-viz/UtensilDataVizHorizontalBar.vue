<template>
  <svg class="chart-svg" :viewBox="`0 0 ${viewBox.width} ${viewBox.height}`" preserveAspectRatio="xMidYMid meet">
    <!-- Vertical grid lines -->
    <g v-if="showGrid" class="grid-lines">
      <line
        v-for="(x, index) in verticalGridLines"
        :key="'grid-' + index"
        :x1="x"
        :y1="hPadding.top"
        :x2="x"
        :y2="viewBox.height - hPadding.bottom"
      />
    </g>

    <!-- X-axis tick labels (values along bottom) -->
    <g class="axis-labels">
      <text
        v-for="(tick, index) in xAxisTicks"
        :key="'x-' + index"
        :x="tick.x"
        :y="viewBox.height - hPadding.bottom + 16"
        text-anchor="middle"
      >
        {{ tick.label }}
      </text>
    </g>

    <!-- Category labels (along left side) -->
    <g class="axis-labels category-labels">
      <text
        v-for="(label, index) in categoryLabels"
        :key="'cat-' + index"
        :x="hPadding.left - 8"
        :y="label.y"
        text-anchor="end"
        dominant-baseline="middle"
      >
        {{ label.text }}
      </text>
    </g>

    <g class="horizontal-bars">
      <g v-for="(group, groupIndex) in barGroups" :key="'group-' + groupIndex">
        <rect
          v-for="(bar, barIndex) in group"
          :key="'bar-' + barIndex"
          :x="bar.x"
          :y="bar.y"
          :width="bar.width"
          :height="bar.height"
          :fill="bar.color"
          :class="{ animated: animate }"
          :style="animate ? { animationDelay: `${groupIndex * 50}ms` } : undefined"
          rx="2"
        />
      </g>
    </g>

    <g v-if="showValues" class="value-labels">
      <text
        v-for="(label, labelIndex) in valueLabels"
        :key="'val-' + labelIndex"
        :x="label.x"
        :y="label.y"
        dominant-baseline="middle"
      >
        {{ label.label }}
      </text>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type DataSeries, getSeriesColor, formatValue, VIEW_BOX } from './utensil-data-viz'

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

// Horizontal bars need more left padding for category labels, less bottom
const hPadding = { top: 16, right: 16, bottom: 24, left: 72 }
const chartWidth = VIEW_BOX.width - hPadding.left - hPadding.right
const chartHeight = VIEW_BOX.height - hPadding.top - hPadding.bottom

const categoryCount = computed(() => {
  if (props.series.length === 0) return 0
  return Math.max(...props.series.map((s) => s.values.length))
})

const valueMax = computed(() => {
  const all = props.series.flatMap((s) => s.values)
  const max = Math.max(...all, 0)
  if (max === 0) return 100
  const magnitude = Math.pow(10, Math.floor(Math.log10(max)))
  const normalized = max / magnitude
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10
  return nice * magnitude
})

function scaleValue(value: number): number {
  return (value / valueMax.value) * chartWidth
}

const barGroups = computed(() => {
  const seriesCount = props.series.length
  const groupHeight = chartHeight / categoryCount.value
  const barGap = 2
  const totalBarHeight = groupHeight * 0.7
  const barHeight = (totalBarHeight - barGap * (seriesCount - 1)) / seriesCount

  const groups: { x: number; y: number; width: number; height: number; color: string }[][] = []

  for (let i = 0; i < categoryCount.value; i++) {
    const groupY = hPadding.top + i * groupHeight + (groupHeight - totalBarHeight) / 2
    const bars: { x: number; y: number; width: number; height: number; color: string }[] = []

    for (let seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
      const value = props.series[seriesIndex].values[i] ?? 0
      bars.push({
        x: hPadding.left,
        y: groupY + seriesIndex * (barHeight + barGap),
        width: Math.max(scaleValue(value), 0),
        height: Math.max(barHeight, 1),
        color: getSeriesColor(seriesIndex),
      })
    }
    groups.push(bars)
  }
  return groups
})

const valueLabels = computed(() => {
  const labels: { x: number; y: number; label: string }[] = []
  const seriesCount = props.series.length
  const groupHeight = chartHeight / categoryCount.value
  const barGap = 2
  const totalBarHeight = groupHeight * 0.7
  const barHeight = (totalBarHeight - barGap * (seriesCount - 1)) / seriesCount

  for (let i = 0; i < categoryCount.value; i++) {
    const groupY = hPadding.top + i * groupHeight + (groupHeight - totalBarHeight) / 2

    for (let seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
      const value = props.series[seriesIndex].values[i] ?? 0
      labels.push({
        x: hPadding.left + scaleValue(value) + 6,
        y: groupY + seriesIndex * (barHeight + barGap) + barHeight / 2,
        label: formatValue(value),
      })
    }
  }
  return labels
})

const verticalGridLines = computed(() => {
  const count = 4
  return Array.from({ length: count + 1 }, (_, i) => hPadding.left + (i / count) * chartWidth)
})

const xAxisTicks = computed(() => {
  const count = 4
  return Array.from({ length: count + 1 }, (_, i) => ({
    x: hPadding.left + (i / count) * chartWidth,
    label: formatValue((valueMax.value * i) / count),
  }))
})

const categoryLabels = computed(() => {
  if (!props.labels) return []
  const groupHeight = chartHeight / categoryCount.value
  return props.labels.map((text, i) => ({
    y: hPadding.top + i * groupHeight + groupHeight / 2,
    text,
  }))
})

const viewBox = VIEW_BOX
</script>

<style scoped>
@layer utensil {
  .chart-svg {
    align-self: center;
  }

  .grid-lines line {
    stroke: var(--pencil-a3);
    stroke-width: 1;
  }

  .axis-labels text {
    font-size: 10px;
    fill: var(--pencil-a11);
  }

  .horizontal-bars rect.animated {
    animation: utensil-data-viz-hbar-grow 0.5s ease-out both;
    transform-box: fill-box;
    transform-origin: left center;
  }

  .value-labels text {
    font-size: 9px;
    fill: var(--pencil-a11);
    font-weight: 500;
  }

  @keyframes utensil-data-viz-hbar-grow {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }

  .utensil-high-contrast .grid-lines line {
    stroke: var(--pencil-a5);
  }

  .utensil-reduced-motion .horizontal-bars rect.animated {
    animation: none;
    transform: none;
  }
}
</style>
