export type ChartType = 'line' | 'bar' | 'area' | 'donut' | 'radar' | 'scatter' | 'stacked-bar' | 'horizontal-bar'

export interface DataSeries {
  label: string
  values: number[]
  /** X-axis values for scatter charts. When provided, values become y-coordinates. */
  xValues?: number[]
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

export function getSeriesColor(index: number): string {
  return seriesColors[index % seriesColors.length]
}

export function formatValue(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  if (Number.isInteger(value)) return String(value)
  return value.toFixed(1)
}
