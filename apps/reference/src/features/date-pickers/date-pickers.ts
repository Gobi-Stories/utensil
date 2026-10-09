import type { DateRange } from '@gobistories/utensil-vue/components/date-picker/utensil-date-picker'
import { formatDate, formatDateRange } from '@gobistories/utensil-vue/components/date-picker/utensil-date-picker'

const locale = navigator?.language || 'en-US'

export function formatDisplayDate(date: Date): string {
  return formatDate(date, locale)
}

export function formatRangeDisplay(range: DateRange | null): string {
  if (!range) return 'No range selected'
  if (!range.start && !range.end) return 'No range selected'
  return formatDateRange(range, locale)
}

export const today = new Date()
export const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)
export const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate())
