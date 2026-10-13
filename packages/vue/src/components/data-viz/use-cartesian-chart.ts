import { computed, type MaybeRefOrGetter, type Ref, toValue } from 'vue'
import { PADDING, CHART_HEIGHT, formatValue, getValueAxis } from './utensil-data-viz'
import { useFittedViewBox } from './use-fitted-view-box'
import type { DataSeries } from './utensil-data-viz'

// The most x-axis labels drawn before thinning starts skipping between them
const MAX_AXIS_LABELS = 12
// Horizontal room a label needs; narrower charts fit fewer before thinning
const AXIS_LABEL_SPACE = 45

interface CartesianChartOptions {
  series: MaybeRefOrGetter<DataSeries[]>
  /** The chart's svg, whose box the viewBox widens to fill */
  svg: Readonly<Ref<SVGSVGElement | null>>
  labels?: MaybeRefOrGetter<string[] | undefined>
  isBar?: MaybeRefOrGetter<boolean>
  /** Additional values (e.g. reference lines) included when scaling the y-axis */
  extraValues?: MaybeRefOrGetter<number[] | undefined>
  /** A value the y-axis always includes, as it does zero */
  baseline?: MaybeRefOrGetter<number | undefined>
}

export function useCartesianChart({ series, svg, labels, isBar, extraValues, baseline }: CartesianChartOptions) {
  const { viewBox, toBox } = useFittedViewBox(svg)

  const chartWidth = computed(() => viewBox.value.width - PADDING.left - PADDING.right)

  const pointCount = computed(() => {
    const s = toValue(series)
    if (s.length === 0) return 0
    return Math.max(...s.map((d) => d.values.length))
  })

  const axis = computed(() =>
    getValueAxis(
      [...toValue(series).flatMap((s) => s.values), ...(toValue(extraValues) ?? [])],
      toValue(baseline) ?? 0,
    ),
  )

  function getX(index: number): number {
    if (pointCount.value <= 1) return PADDING.left + chartWidth.value / 2
    return PADDING.left + (index / (pointCount.value - 1)) * chartWidth.value
  }

  function getY(value: number): number {
    const { min, max } = axis.value
    return PADDING.top + CHART_HEIGHT - ((value - min) / (max - min)) * CHART_HEIGHT
  }

  function getBarCenterX(index: number): number {
    if (toValue(isBar)) {
      const groupWidth = chartWidth.value / pointCount.value
      return PADDING.left + index * groupWidth + groupWidth / 2
    }
    return getX(index)
  }

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

  // Crowded axes thin to every Nth label so they stay legible; how many fit follows the drawable width
  const xAxisLabels = computed(() => {
    const l = toValue(labels)
    if (!l) return []
    const maxLabels = Math.max(3, Math.min(MAX_AXIS_LABELS, Math.floor(chartWidth.value / AXIS_LABEL_SPACE)))
    const step = Math.max(1, Math.ceil(l.length / maxLabels))
    return l.map((text, index) => ({ x: getBarCenterX(index), text })).filter((_, index) => index % step === 0)
  })

  // The y of the baseline, while the axis extends below it
  const baselineY = computed(() => {
    const value = toValue(baseline) ?? 0
    return value > axis.value.min ? getY(value) : undefined
  })

  function getLinePath(seriesIndex: number): string {
    const values = toValue(series)[seriesIndex].values
    if (values.length === 0) return ''
    const xFn = toValue(isBar) ? getBarCenterX : getX
    return values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xFn(i)} ${getY(v)}`).join(' ')
  }

  return {
    padding: PADDING,
    viewBox,
    toBox,
    chartWidth,
    pointCount,
    axis,
    baselineY,
    getX,
    getY,
    getBarCenterX,
    gridLines,
    yAxisTicks,
    xAxisLabels,
    getLinePath,
  }
}
