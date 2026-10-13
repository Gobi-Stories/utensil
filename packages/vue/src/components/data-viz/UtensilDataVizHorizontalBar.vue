<template>
  <svg
    ref="svg"
    class="utensil-data-viz-horizontal-bar chart-svg"
    :viewBox="`0 0 ${viewBox.width} ${viewBox.height}`"
    preserveAspectRatio="xMidYMid meet"
  >
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

    <!-- Dashed where values below the baseline fall short of it -->
    <line
      v-if="baselineX !== undefined"
      class="baseline"
      :x1="baselineX"
      :y1="hPadding.top"
      :x2="baselineX"
      :y2="viewBox.height - hPadding.bottom"
    />

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
          :class="{ animated: animate, below: bar.below }"
          :style="animate ? { animationDelay: `${groupIndex * 50}ms` } : undefined"
          rx="2"
        />
      </g>
    </g>

    <g v-if="showValues" class="value-labels">
      <template v-for="(group, groupIndex) in barGroups" :key="'val-' + groupIndex">
        <text
          v-for="(bar, barIndex) in group"
          :key="'val-' + barIndex"
          :x="bar.below ? bar.x - 6 : bar.x + bar.width + 6"
          :y="bar.y + bar.height / 2"
          :text-anchor="bar.below ? 'end' : 'start'"
          dominant-baseline="middle"
        >
          {{ bar.label }}
        </text>
      </template>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { type DataSeries, getSeriesColor, getValueAxis, formatValue, VIEW_BOX } from './utensil-data-viz'
import { useFittedViewBox } from './use-fitted-view-box'

export interface Props {
  series: DataSeries[]
  labels?: string[]
  animate?: boolean
  showGrid?: boolean
  showValues?: boolean
  /** What the bars run from, rightward for higher values and leftward for lower; the value axis always includes it */
  baseline?: number
}

const props = withDefaults(defineProps<Props>(), {
  animate: true,
  showGrid: true,
  baseline: 0,
})

// Horizontal bars need more left padding for category labels, less bottom
const hPadding = { top: 16, right: 16, bottom: 24, left: 72 }

const { viewBox } = useFittedViewBox(useTemplateRef<SVGSVGElement>('svg'))

const chartWidth = computed(() => viewBox.value.width - hPadding.left - hPadding.right)
const chartHeight = VIEW_BOX.height - hPadding.top - hPadding.bottom

const categoryCount = computed(() => {
  if (props.series.length === 0) return 0
  return Math.max(...props.series.map((s) => s.values.length))
})

const axis = computed(() =>
  getValueAxis(
    props.series.flatMap((s) => s.values),
    props.baseline,
  ),
)

function scaleX(value: number): number {
  const { min, max } = axis.value
  return hPadding.left + ((value - min) / (max - min)) * chartWidth.value
}

const baselineX = computed(() => (props.baseline > axis.value.min ? scaleX(props.baseline) : undefined))

const barGroups = computed(() => {
  const seriesCount = props.series.length
  const groupHeight = chartHeight / categoryCount.value
  const barGap = 2
  const totalBarHeight = groupHeight * 0.7
  const barHeight = (totalBarHeight - barGap * (seriesCount - 1)) / seriesCount
  const foot = scaleX(props.baseline)

  return Array.from({ length: categoryCount.value }, (_, i) => {
    const groupY = hPadding.top + i * groupHeight + (groupHeight - totalBarHeight) / 2

    return props.series.map((s, seriesIndex) => {
      const value = s.values[i] ?? 0
      const end = scaleX(value)
      return {
        x: Math.min(foot, end),
        y: groupY + seriesIndex * (barHeight + barGap),
        width: Math.abs(end - foot),
        height: Math.max(barHeight, 1),
        color: getSeriesColor(seriesIndex, s),
        below: value < props.baseline,
        label: formatValue(value),
      }
    })
  })
})

const verticalGridLines = computed(() => {
  const count = axis.value.steps
  return Array.from({ length: count + 1 }, (_, i) => hPadding.left + (i / count) * chartWidth.value)
})

const xAxisTicks = computed(() => {
  const { min, max, steps: count } = axis.value
  return Array.from({ length: count + 1 }, (_, i) => ({
    x: hPadding.left + (i / count) * chartWidth.value,
    label: formatValue(min + (i / count) * (max - min)),
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
</script>

<style scoped>
@layer utensil {
  /* Fills what the chart is given, or the drawing's natural height in a box without one. The svg's height never
     follows its viewBox, so the viewBox can follow the box. */
  .chart-svg {
    display: block;
    flex: 1 1 220px;
    width: 100%;
    min-height: 0;
  }

  .grid-lines line {
    stroke: var(--pencil-a3);
    stroke-width: 1;
  }

  .baseline {
    stroke: var(--pencil-a9);
    stroke-width: 1.5;
    stroke-dasharray: 6 4;
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

  /* A bar below the baseline grows leftward from it */
  .horizontal-bars rect.animated.below {
    transform-origin: right center;
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
