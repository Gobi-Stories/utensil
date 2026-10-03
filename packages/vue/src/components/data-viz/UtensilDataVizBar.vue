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

    <g class="bars">
      <g v-for="(s, seriesIndex) in series" :key="'bar-series-' + seriesIndex">
        <rect
          v-for="(bar, barIndex) in getBarRects(seriesIndex)"
          :key="'bar-' + barIndex"
          :x="bar.x"
          :y="bar.y"
          :width="bar.width"
          :height="bar.height"
          :fill="getSeriesColor(seriesIndex)"
          :class="{ animated: animate }"
          :style="animate ? { animationDelay: `${barIndex * 50}ms` } : undefined"
          rx="2"
        />
      </g>
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
import { type DataSeries, getSeriesColor, formatValue, PADDING, CHART_WIDTH } from './utensil-data-viz'
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

const { padding, viewBox, getY, pointCount, gridLines, yAxisTicks, xAxisLabels } = useCartesianChart({
  series: () => props.series,
  labels: () => props.labels,
  isBar: true,
})

function getBarRects(seriesIndex: number) {
  const values = props.series[seriesIndex].values
  const seriesCount = props.series.length
  const groupWidth = CHART_WIDTH / pointCount.value
  const barGap = 2
  const totalBarWidth = groupWidth * 0.7
  const barWidth = (totalBarWidth - barGap * (seriesCount - 1)) / seriesCount

  return values.map((v, i) => {
    const groupX = PADDING.left + i * groupWidth + (groupWidth - totalBarWidth) / 2
    const x = groupX + seriesIndex * (barWidth + barGap)
    const y = getY(v)
    const height = getY(0) - y
    return { x, y, width: Math.max(barWidth, 1), height: Math.max(height, 0) }
  })
}

const valueLabels = computed(() => {
  const labels: { x: number; y: number; label: string }[] = []
  props.series.forEach((s, seriesIndex) => {
    s.values.forEach((v, i) => {
      const bars = getBarRects(seriesIndex)
      const bar = bars[i]
      labels.push({ x: bar.x + bar.width / 2, y: getY(v), label: formatValue(v) })
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

  .bars rect.animated {
    animation: utensil-data-viz-bar-grow 0.5s ease-out both;
    transform-box: fill-box;
    transform-origin: center bottom;
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
