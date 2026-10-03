import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { PADDING, VIEW_BOX, CHART_WIDTH, CHART_HEIGHT, formatValue } from './utensil-data-viz'
import type { DataSeries } from './utensil-data-viz'

interface CartesianChartOptions {
  series: MaybeRefOrGetter<DataSeries[]>
  labels?: MaybeRefOrGetter<string[] | undefined>
  isBar?: MaybeRefOrGetter<boolean>
}

export function useCartesianChart({ series, labels, isBar }: CartesianChartOptions) {
  const pointCount = computed(() => {
    const s = toValue(series)
    if (s.length === 0) return 0
    return Math.max(...s.map((d) => d.values.length))
  })

  const niceMax = computed(() => {
    const allValues = toValue(series).flatMap((s) => s.values)
    const max = Math.max(...allValues, 0)
    if (max === 0) return 100
    const magnitude = Math.pow(10, Math.floor(Math.log10(max)))
    const normalized = max / magnitude
    const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10
    return nice * magnitude
  })

  function getX(index: number): number {
    if (pointCount.value <= 1) return PADDING.left + CHART_WIDTH / 2
    return PADDING.left + (index / (pointCount.value - 1)) * CHART_WIDTH
  }

  function getY(value: number): number {
    return PADDING.top + CHART_HEIGHT - (value / niceMax.value) * CHART_HEIGHT
  }

  function getBarCenterX(index: number): number {
    if (toValue(isBar)) {
      const groupWidth = CHART_WIDTH / pointCount.value
      return PADDING.left + index * groupWidth + groupWidth / 2
    }
    return getX(index)
  }

  const gridLines = computed(() => {
    const count = 4
    return Array.from({ length: count + 1 }, (_, i) => {
      return PADDING.top + (i / count) * CHART_HEIGHT
    })
  })

  const yAxisTicks = computed(() => {
    const count = 4
    return Array.from({ length: count + 1 }, (_, i) => {
      const value = niceMax.value * (1 - i / count)
      return {
        y: PADDING.top + (i / count) * CHART_HEIGHT,
        label: formatValue(value),
      }
    })
  })

  const xAxisLabels = computed(() => {
    const l = toValue(labels)
    if (!l) return []
    return l.map((text, index) => ({
      x: getBarCenterX(index),
      text,
    }))
  })

  function getLinePath(seriesIndex: number): string {
    const values = toValue(series)[seriesIndex].values
    if (values.length === 0) return ''
    const xFn = toValue(isBar) ? getBarCenterX : getX
    return values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xFn(i)} ${getY(v)}`).join(' ')
  }

  return {
    padding: PADDING,
    viewBox: VIEW_BOX,
    pointCount,
    niceMax,
    getX,
    getY,
    getBarCenterX,
    gridLines,
    yAxisTicks,
    xAxisLabels,
    getLinePath,
  }
}
