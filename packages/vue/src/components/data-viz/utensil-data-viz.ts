export type ChartType = 'line' | 'bar' | 'area' | 'donut' | 'radar' | 'scatter' | 'stacked-bar' | 'horizontal-bar'

export interface DataSeries {
  label: string
  values: number[]
  /** X-axis values for scatter charts. When provided, values become y-coordinates. */
  xValues?: number[]
  /** Stroke style for line and area charts. Defaults to solid. */
  lineStyle?: 'solid' | 'dashed'
  /** CSS color overriding the default series color, e.g. 'var(--pencil-9)'. */
  color?: string
}

export interface ReferenceLine {
  value: number
  label?: string
  /** CSS color for the line. Defaults to a neutral pencil tone. */
  color?: string
}

/** A value axis: from `min` to `max` in `steps` equal steps. */
export interface ValueAxis {
  min: number
  max: number
  steps: number
}

export const seriesColors = [
  'var(--pen-9)',
  'var(--pencil-9)',
  'var(--pen-6)',
  'var(--pencil-6)',
  'var(--pen-11)',
  'var(--pencil-11)',
] as const

export const PADDING = { top: 16, right: 16, bottom: 28, left: 44 }
export const VIEW_BOX = { width: 400, height: 220 }
export const CHART_WIDTH = VIEW_BOX.width - PADDING.left - PADDING.right
export const CHART_HEIGHT = VIEW_BOX.height - PADDING.top - PADDING.bottom

export function getSeriesColor(index: number, series?: DataSeries): string {
  return series?.color ?? seriesColors[index % seriesColors.length]
}

export function formatValue(value: number): string {
  if (Math.abs(value) >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(1)}K`
  if (Number.isInteger(value)) return String(value)
  return value.toFixed(1)
}

// The first of `multiples` times a power of ten that's at least `value`
function roundUp(value: number, multiples: number[]): number {
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)))
  return (multiples.find((multiple) => value / magnitude <= multiple) ?? 10) * magnitude
}

/**
 * The axis that shows `values` and always includes `baseline` and zero: from zero to a round maximum in four steps, or,
 * when values fall below zero, in steps of 1, 2, 2.5 or 5 times a power of ten that keep zero on a gridline.
 */
export function getValueAxis(values: number[], baseline = 0): ValueAxis {
  const max = Math.max(...values, baseline, 0)
  const min = Math.min(...values, baseline, 0)
  if (min === 0) {
    return { min: 0, max: max === 0 ? 100 : roundUp(max, [1, 2, 5, 10]), steps: 4 }
  }

  const step = roundUp((max - min) / 4, [1, 2, 2.5, 5, 10])
  const low = Math.floor(min / step) * step
  const high = Math.ceil(max / step) * step
  return { min: low, max: high, steps: Math.round((high - low) / step) }
}
