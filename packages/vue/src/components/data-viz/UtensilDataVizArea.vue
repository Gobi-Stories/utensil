<template>
  <div class="utensil-data-viz-area chart-container">
    <svg
      ref="svg"
      class="chart-svg"
      :viewBox="`0 0 ${viewBox.width} ${viewBox.height}`"
      preserveAspectRatio="xMidYMid meet"
      :tabindex="interactive ? 0 : undefined"
      :aria-roledescription="interactive ? 'interactive chart' : undefined"
      :aria-describedby="interactive ? keysId : undefined"
      @pointerleave="setHoverIndex(null)"
      @keydown="interactive && moveHover($event)"
      @blur="setHoverIndex(null)"
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

      <DataVizReferenceLines
        :lines="referenceLines ?? []"
        :x1="padding.left"
        :x2="viewBox.width - padding.right"
        :get-y="getY"
      />

      <g class="areas">
        <path
          v-for="fill in fills"
          :key="'area-' + fill.seriesIndex"
          :d="getAreaPath(fill.seriesIndex)"
          :fill="getSeriesColor(fill.seriesIndex, fill.series)"
          fill-opacity="0.15"
          :class="{ animated: animate }"
        />
        <path
          v-for="(s, seriesIndex) in series"
          :key="'area-line-' + seriesIndex"
          :d="getLinePath(seriesIndex)"
          :stroke="getSeriesColor(seriesIndex, s)"
          fill="none"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          :stroke-dasharray="s.lineStyle === 'dashed' ? '6 5' : undefined"
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

      <DataVizHoverLayer
        v-if="interactive"
        :columns="hoverColumns"
        :crosshair="crosshair"
        :points="hoverPoints"
        :top="padding.top"
        :height="CHART_HEIGHT"
        @hover="setHoverIndex"
      />
    </svg>

    <template v-if="interactive">
      <span :id="keysId" class="screen-reader">Use the left and right arrow keys to move between points.</span>
      <span class="screen-reader" aria-live="polite">{{ hoverDescription }}</span>
    </template>

    <DataVizTooltip
      v-if="interactive && hoverIndex !== null && tooltipStyle"
      :series="series"
      :labels="labels"
      :index="hoverIndex"
      :style="tooltipStyle"
    >
      <template v-if="$slots.tooltip" #default>
        <slot name="tooltip" :index="hoverIndex"></slot>
      </template>
    </DataVizTooltip>
  </div>
</template>

<script setup lang="ts">
import { computed, useId, useTemplateRef, watch } from 'vue'
import { type DataSeries, type ReferenceLine, getSeriesColor, formatValue, CHART_HEIGHT } from './utensil-data-viz'
import { useCartesianChart } from './use-cartesian-chart'
import { useChartHover } from './use-chart-hover'
import DataVizGrid from './DataVizGrid.vue'
import DataVizReferenceLines from './DataVizReferenceLines.vue'
import DataVizHoverLayer from './DataVizHoverLayer.vue'
import DataVizTooltip from './DataVizTooltip.vue'

export interface Props {
  series: DataSeries[]
  labels?: string[]
  animate?: boolean
  showGrid?: boolean
  showValues?: boolean
  /** A hover crosshair and a tooltip per point */
  interactive?: boolean
  /** Horizontal lines across the plot, which the y-axis includes */
  referenceLines?: ReferenceLine[]
  /** What the areas fill to, which the y-axis always includes, dashed across the plot while values fall below it */
  baseline?: number
}

const props = withDefaults(defineProps<Props>(), {
  animate: true,
  showGrid: true,
  interactive: false,
  baseline: 0,
})

const emit = defineEmits<{
  /** The hovered point's index, or null when the pointer leaves the chart */
  hover: [index: number | null]
}>()

defineSlots<{
  /** The hovered point's tooltip */
  tooltip?(props: { index: number }): unknown
}>()

const {
  padding,
  viewBox,
  toBox,
  chartWidth,
  pointCount,
  baselineY,
  getX,
  getY,
  gridLines,
  yAxisTicks,
  xAxisLabels,
  getLinePath,
} = useCartesianChart({
  series: () => props.series,
  svg: useTemplateRef<SVGSVGElement>('svg'),
  labels: () => props.labels,
  extraValues: () => props.referenceLines?.map((line) => line.value),
  baseline: () => props.baseline,
})

const { hoverIndex, setHoverIndex, moveHover, hoverColumns, crosshair, hoverPoints, tooltipStyle } = useChartHover(
  () => props.series,
  pointCount,
  chartWidth,
  getX,
  getY,
  toBox,
)

watch(hoverIndex, (index) => emit('hover', index))

const keysId = useId()

// Read out as the arrow keys move through the points
const hoverDescription = computed(() => {
  const index = hoverIndex.value
  if (index === null) {
    return ''
  }

  const values = props.series
    .filter((s) => index < s.values.length)
    .map((s) => `${s.label}: ${formatValue(s.values[index])}`)
  return [props.labels?.[index], ...values].filter(Boolean).join(', ')
})

// A dashed series reads as a comparison laid over the others, so only solid series are filled
const fills = computed(() =>
  props.series
    .map((series, seriesIndex) => ({ series, seriesIndex }))
    .filter(({ series }) => series.lineStyle !== 'dashed'),
)

// Filled to the baseline, above and below it
function getAreaPath(seriesIndex: number): string {
  const values = props.series[seriesIndex].values
  if (values.length === 0) return ''
  const foot = getY(props.baseline)
  const linePart = values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(v)}`).join(' ')
  return `${linePart} L ${getX(values.length - 1)} ${foot} L ${getX(0)} ${foot} Z`
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
  .chart-svg:focus-visible {
    outline-color: var(--pen-8);
  }

  /* Fills what the chart is given, or the drawing's natural height in a box without one. The svg's height never
     follows its viewBox, so the viewBox can follow the box. */
  .chart-container {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-height: 0;
  }

  .chart-svg {
    display: block;
    outline: 2px solid transparent;
    outline-offset: 2px;
    transition: outline-color 0.1s ease;
    flex: 1 1 220px;
    width: 100%;
    min-height: 0;
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
