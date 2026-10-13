<template>
  <svg
    ref="svg"
    class="utensil-data-viz-stacked-bar chart-svg"
    :viewBox="`0 0 ${viewBox.width} ${viewBox.height}`"
    preserveAspectRatio="xMidYMid meet"
  >
    <DataVizGrid
      :show-grid="showGrid"
      :grid-lines="gridLines"
      :y-axis-ticks="yAxisTicks"
      :x-axis-labels="xAxisLabels"
      :padding="padding"
      :view-box="viewBox"
      :baseline-y="baselineY"
    />

    <defs>
      <clipPath v-for="(column, columnIndex) in stackedColumns" :id="clipId(columnIndex)" :key="'clip-' + columnIndex">
        <path :d="column.clipPath" />
      </clipPath>
    </defs>

    <g class="stacked-bars">
      <g
        v-for="(column, columnIndex) in stackedColumns"
        :key="'column-' + columnIndex"
        :class="{ animated: animate }"
        :clip-path="`url(#${clipId(columnIndex)})`"
        :style="{
          ...(animate ? { animationDelay: `${columnIndex * 50}ms` } : undefined),
          transformOrigin: `${column.centerX}px ${zeroY}px`,
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
import { computed, useId, useTemplateRef } from 'vue'
import { type DataSeries, getSeriesColor, getValueAxis, formatValue, PADDING, CHART_HEIGHT } from './utensil-data-viz'
import { useFittedViewBox } from './use-fitted-view-box'
import DataVizGrid from './DataVizGrid.vue'

export interface Props {
  series: DataSeries[]
  labels?: string[]
  animate?: boolean
  showGrid?: boolean
  showValues?: boolean
  /** A value the y-axis always includes, dashed across the plot while values fall below it */
  baseline?: number
}

const props = withDefaults(defineProps<Props>(), {
  animate: true,
  showGrid: true,
  baseline: 0,
})

const id = useId()

function clipId(columnIndex: number): string {
  return `${id}-stack-clip-${columnIndex}`
}

const { viewBox } = useFittedViewBox(useTemplateRef<SVGSVGElement>('svg'))

const chartWidth = computed(() => viewBox.value.width - PADDING.left - PADDING.right)

const pointCount = computed(() => {
  if (props.series.length === 0) return 0
  return Math.max(...props.series.map((s) => s.values.length))
})

// Each column's positive values stack up from zero, its negative values down from it
const stackExtents = computed(() =>
  Array.from({ length: pointCount.value }, (_, i) => {
    const values = props.series.map((s) => s.values[i] ?? 0)
    return {
      top: values.filter((value) => value > 0).reduce((sum, value) => sum + value, 0),
      bottom: values.filter((value) => value < 0).reduce((sum, value) => sum + value, 0),
    }
  }),
)

const axis = computed(() =>
  getValueAxis(
    stackExtents.value.flatMap(({ top, bottom }) => [top, bottom]),
    props.baseline,
  ),
)

function scaleY(value: number): number {
  const { min, max } = axis.value
  return PADDING.top + CHART_HEIGHT - ((value - min) / (max - min)) * CHART_HEIGHT
}

const zeroY = computed(() => scaleY(0))

const baselineY = computed(() => (props.baseline > axis.value.min ? scaleY(props.baseline) : undefined))

const groupWidth = computed(() => chartWidth.value / pointCount.value)

const stackedColumns = computed(() => {
  const barWidth = groupWidth.value * 0.6
  const r = 2

  return stackExtents.value.map(({ top, bottom }, i) => {
    const groupX = PADDING.left + i * groupWidth.value + (groupWidth.value - barWidth) / 2
    let above = 0
    let below = 0

    const rects = props.series.map((s, seriesIndex) => {
      const value = s.values[i] ?? 0
      const start = value < 0 ? below : above
      const end = start + value
      if (value < 0) {
        below = end
      } else {
        above = end
      }
      return {
        x: groupX,
        y: Math.min(scaleY(start), scaleY(end)),
        width: barWidth,
        height: Math.abs(scaleY(start) - scaleY(end)),
        color: getSeriesColor(seriesIndex, s),
      }
    })

    // Rounded at the column's ends, square where it meets zero
    const topY = scaleY(top)
    const bottomY = scaleY(bottom)
    const left = groupX
    const right = groupX + barWidth
    const topCorner = top > 0 ? r : 0
    const bottomCorner = bottom < 0 ? r : 0
    const clipPath = [
      `M ${left + topCorner} ${topY}`,
      `Q ${left} ${topY} ${left} ${topY + topCorner}`,
      `L ${left} ${bottomY - bottomCorner}`,
      `Q ${left} ${bottomY} ${left + bottomCorner} ${bottomY}`,
      `L ${right - bottomCorner} ${bottomY}`,
      `Q ${right} ${bottomY} ${right} ${bottomY - bottomCorner}`,
      `L ${right} ${topY + topCorner}`,
      `Q ${right} ${topY} ${right - topCorner} ${topY}`,
      'Z',
    ].join(' ')

    return { centerX: groupX + barWidth / 2, clipPath, rects }
  })
})

// Each column's total, above it, or below it when the total is negative
const valueLabels = computed(() =>
  stackExtents.value.map(({ top, bottom }, i) => {
    const total = top + bottom
    return {
      x: PADDING.left + i * groupWidth.value + groupWidth.value / 2,
      y: total < 0 ? scaleY(bottom) + 12 : scaleY(top) - 6,
      label: formatValue(total),
    }
  }),
)

const gridLines = computed(() => {
  const count = axis.value.steps
  return Array.from({ length: count + 1 }, (_, i) => PADDING.top + (i / count) * CHART_HEIGHT)
})

const yAxisTicks = computed(() => {
  const { min, max, steps: count } = axis.value
  return Array.from({ length: count + 1 }, (_, i) => ({
    y: PADDING.top + (i / count) * CHART_HEIGHT,
    label: formatValue(max - (i / count) * (max - min)),
  }))
})

const xAxisLabels = computed(() => {
  if (!props.labels) return []
  return props.labels.map((text, i) => ({
    x: PADDING.left + i * groupWidth.value + groupWidth.value / 2,
    text,
  }))
})

const padding = PADDING
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
