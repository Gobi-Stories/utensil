<template>
  <svg
    ref="svg"
    class="utensil-data-viz-bar chart-svg"
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

    <g class="bars">
      <g v-for="(s, seriesIndex) in series" :key="'bar-series-' + seriesIndex">
        <rect
          v-for="(bar, barIndex) in barRects[seriesIndex]"
          :key="'bar-' + barIndex"
          :x="bar.x"
          :y="bar.y"
          :width="bar.width"
          :height="bar.height"
          :fill="getSeriesColor(seriesIndex, s)"
          :class="{ animated: animate, below: bar.below }"
          :style="animate ? { animationDelay: `${barIndex * 50}ms` } : undefined"
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
        text-anchor="middle"
      >
        {{ label.label }}
      </text>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { type DataSeries, getSeriesColor, formatValue, PADDING } from './utensil-data-viz'
import { useCartesianChart } from './use-cartesian-chart'
import DataVizGrid from './DataVizGrid.vue'

export interface Props {
  series: DataSeries[]
  labels?: string[]
  animate?: boolean
  showGrid?: boolean
  showValues?: boolean
  /** What the bars rise from, or hang below for lower values; the y-axis always includes it */
  baseline?: number
}

const props = withDefaults(defineProps<Props>(), {
  animate: true,
  showGrid: true,
  baseline: 0,
})

const { padding, viewBox, chartWidth, baselineY, getY, pointCount, gridLines, yAxisTicks, xAxisLabels } =
  useCartesianChart({
    series: () => props.series,
    svg: useTemplateRef<SVGSVGElement>('svg'),
    labels: () => props.labels,
    isBar: true,
    baseline: () => props.baseline,
  })

// Each series' bars, spread over the width the chart has, from the baseline to their values
const barRects = computed(() => {
  const seriesCount = props.series.length
  const groupWidth = chartWidth.value / pointCount.value
  const barGap = 2
  const totalBarWidth = groupWidth * 0.7
  const barWidth = (totalBarWidth - barGap * (seriesCount - 1)) / seriesCount
  const foot = getY(props.baseline)

  return props.series.map((s, seriesIndex) =>
    s.values.map((v, i) => {
      const groupX = PADDING.left + i * groupWidth + (groupWidth - totalBarWidth) / 2
      const top = getY(v)
      return {
        x: groupX + seriesIndex * (barWidth + barGap),
        y: Math.min(top, foot),
        width: Math.max(barWidth, 1),
        height: Math.abs(foot - top),
        below: v < props.baseline,
      }
    }),
  )
})

// Above a bar that rises, below one that hangs
const valueLabels = computed(() =>
  props.series.flatMap((s, seriesIndex) =>
    s.values.map((v, i) => {
      const bar = barRects.value[seriesIndex][i]
      return {
        x: bar.x + bar.width / 2,
        y: bar.below ? bar.y + bar.height + 12 : bar.y - 10,
        label: formatValue(v),
      }
    }),
  ),
)
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

  .bars rect.animated {
    animation: utensil-data-viz-bar-grow 0.5s ease-out both;
    transform-box: fill-box;
    transform-origin: center bottom;
  }

  /* A bar below the baseline grows down from it */
  .bars rect.animated.below {
    transform-origin: center top;
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

  .utensil-reduced-motion .bars rect.animated {
    animation: none;
    transform: none;
  }
}
</style>
