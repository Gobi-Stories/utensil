import { computed, ref, toValue, type CSSProperties, type MaybeRefOrGetter } from 'vue'
import { PADDING, CHART_HEIGHT, getSeriesColor, type DataSeries } from './utensil-data-viz'

export interface HoverColumn {
  index: number
  x: number
  width: number
}

export interface HoverPoint {
  x: number
  y: number
  color: string
}

/**
 * Pointer-hover state for line and area charts: a hover column per point, the crosshair and point markers of the
 * hovered one, and where its tooltip goes. The tooltip is HTML laid over the svg, so it's placed with `toBox`, where
 * the drawing sits in the svg's box, and is unaffected by the drawing's scale.
 */
export function useChartHover(
  series: MaybeRefOrGetter<DataSeries[]>,
  pointCount: MaybeRefOrGetter<number>,
  chartWidth: MaybeRefOrGetter<number>,
  getX: (index: number) => number,
  getY: (value: number) => number,
  toBox: (x: number, y: number) => { x: number; y: number },
) {
  const hoverIndex = ref<number | null>(null)

  function setHoverIndex(index: number | null) {
    hoverIndex.value = index
  }

  const hoverColumns = computed<HoverColumn[]>(() => {
    const count = toValue(pointCount)
    if (count === 0) {
      return []
    }

    const width = toValue(chartWidth)
    const columnWidth = count > 1 ? width / (count - 1) : width

    return Array.from({ length: count }, (_, index) => {
      const center = getX(index)
      const start = Math.max(PADDING.left, center - columnWidth / 2)
      const end = Math.min(PADDING.left + width, center + columnWidth / 2)

      return { index, x: start, width: end - start }
    })
  })

  const crosshair = computed(() => {
    if (hoverIndex.value === null) {
      return null
    }

    return { x: getX(hoverIndex.value), y1: PADDING.top, y2: PADDING.top + CHART_HEIGHT }
  })

  const hoverPoints = computed<HoverPoint[]>(() => {
    const index = hoverIndex.value
    if (index === null) {
      return []
    }

    return toValue(series).flatMap((s, seriesIndex) =>
      s.values.length > index
        ? [{ x: getX(index), y: getY(s.values[index]), color: getSeriesColor(seriesIndex, s) }]
        : [],
    )
  })

  // At the top of the plot, beside the crosshair on the side with more room, so it stays inside the chart's box
  const tooltipStyle = computed<CSSProperties | null>(() => {
    if (hoverIndex.value === null) {
      return null
    }

    const position = toBox(getX(hoverIndex.value), PADDING.top)
    const translateX = position.x > 50 ? 'calc(-100% - var(--space-2))' : 'var(--space-2)'

    return {
      left: `${position.x}%`,
      top: `${position.y}%`,
      transform: `translateX(${translateX})`,
    }
  })

  // Arrow keys step through the points, Home and End go to the first and last
  function moveHover(event: KeyboardEvent) {
    const last = toValue(pointCount) - 1
    if (last < 0) {
      return
    }

    const current = hoverIndex.value
    const next: Record<string, number> = {
      ArrowRight: current === null ? 0 : Math.min(current + 1, last),
      ArrowLeft: current === null ? last : Math.max(current - 1, 0),
      Home: 0,
      End: last,
    }
    if (event.key in next) {
      event.preventDefault()
      hoverIndex.value = next[event.key]
    }
  }

  return { hoverIndex, setHoverIndex, moveHover, hoverColumns, crosshair, hoverPoints, tooltipStyle }
}
