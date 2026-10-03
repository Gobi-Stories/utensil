import type { UtensilUIVariation } from '../../theme/utensil-theme'

// ── Types ──────────────────────────────────────────────────────────────────

export type DatePickerMode = 'single' | 'range'

export interface DateRange {
  start: Date | null
  end: Date | null
}

export type DatePickerVariation = Extract<UtensilUIVariation, 'outline' | 'surface' | 'soft'>

export interface CalendarMonth {
  year: number
  month: number // 0-based (0 = January)
}

// ── Date Comparison ────────────────────────────────────────────────────────

/** Compare two dates by year/month/day only (ignoring time) */
export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

export function isBefore(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime()
}

export function isAfter(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() > startOfDay(b).getTime()
}

export function isBetween(date: Date, start: Date, end: Date): boolean {
  const d = startOfDay(date).getTime()
  const s = startOfDay(start).getTime()
  const e = startOfDay(end).getTime()
  const min = Math.min(s, e)
  const max = Math.max(s, e)
  return d > min && d < max
}

// ── Date Manipulation ──────────────────────────────────────────────────────

export function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  const targetMonth = d.getMonth() + months
  d.setMonth(targetMonth)
  // Handle month overflow (e.g., Jan 31 + 1 month → Mar 3, should be Feb 28)
  if (d.getMonth() !== ((targetMonth % 12) + 12) % 12) {
    d.setDate(0) // Go back to last day of previous month
  }
  return d
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

// ── Calendar Grid ──────────────────────────────────────────────────────────

export interface CalendarDay {
  date: Date
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  isDisabled: boolean
}

/**
 * Build a 6-row x 7-column grid of days for a given month.
 * Fills leading/trailing days from adjacent months.
 */
export function buildCalendarGrid(
  year: number,
  month: number,
  weekStartsOn: number,
  isDateDisabled: (date: Date) => boolean,
): CalendarDay[] {
  const firstDay = new Date(year, month, 1)
  const firstDayOfWeek = firstDay.getDay()

  // Calculate offset: how many days from the previous month to show
  const offset = (firstDayOfWeek - weekStartsOn + 7) % 7

  const gridStart = addDays(firstDay, -offset)
  const days: CalendarDay[] = []

  for (let i = 0; i < 42; i++) {
    const date = addDays(gridStart, i)
    days.push({
      date,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month && date.getFullYear() === year,
      isToday: isToday(date),
      isDisabled: isDateDisabled(date),
    })
  }

  return days
}

// ── Internationalization ───────────────────────────────────────────────────

/**
 * Get localized weekday names.
 * @param locale BCP 47 locale string (e.g., 'en-US', 'de-DE')
 * @param weekStartsOn 0 = Sunday, 1 = Monday, etc.
 * @param format 'narrow' (M), 'short' (Mon), 'long' (Monday)
 */
export function getWeekdayNames(
  locale: string,
  weekStartsOn: number,
  format: 'narrow' | 'short' | 'long' = 'short',
): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: format })
  // Jan 4, 2024 is a Thursday. We use a known date and offset to get all weekdays.
  const baseDate = new Date(2024, 0, 7) // Sunday
  const names: string[] = []

  for (let i = 0; i < 7; i++) {
    const dayIndex = (weekStartsOn + i) % 7
    const date = addDays(baseDate, dayIndex)
    names.push(formatter.format(date))
  }

  return names
}

/**
 * Get localized month name.
 */
export function getMonthName(year: number, month: number, locale: string, format: 'long' | 'short' = 'long'): string {
  const date = new Date(year, month, 1)
  return new Intl.DateTimeFormat(locale, { month: format }).format(date)
}

/**
 * Format a date for display in the input trigger.
 */
export function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

/**
 * Format a date range for display.
 */
export function formatDateRange(range: DateRange, locale: string): string {
  if (!range.start && !range.end) return ''
  if (range.start && !range.end) return formatDate(range.start, locale)
  if (!range.start && range.end) return formatDate(range.end, locale)
  return `${formatDate(range.start!, locale)} – ${formatDate(range.end!, locale)}`
}

// ── Locale Date Input ─────────────────────────────────────────────────────

export interface LocaleDateFormat {
  /** Display pattern like "MM/DD/YYYY" or "DD.MM.YYYY" */
  placeholder: string
  /** Separator character(s) between date parts */
  separator: string
  /** Order of date parts as determined by the locale */
  parts: ('day' | 'month' | 'year')[]
  /** Total number of digits expected (always 8: DD + MM + YYYY) */
  maxDigits: number
}

/**
 * Detect the date format for a locale using Intl.DateTimeFormat.
 * Returns the order of parts, separator, and a placeholder string.
 */
export function getLocaleDateFormat(locale: string): LocaleDateFormat {
  const formatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const sampleParts = formatter.formatToParts(new Date(2000, 0, 15))

  const parts: ('day' | 'month' | 'year')[] = []
  let separator = '/'
  const placeholderSegments: string[] = []

  for (const part of sampleParts) {
    if (part.type === 'month') {
      parts.push('month')
      placeholderSegments.push('MM')
    } else if (part.type === 'day') {
      parts.push('day')
      placeholderSegments.push('DD')
    } else if (part.type === 'year') {
      parts.push('year')
      placeholderSegments.push('YYYY')
    } else if (part.type === 'literal' && parts.length > 0 && parts.length < 3) {
      separator = part.value
    }
  }

  return {
    placeholder: placeholderSegments.join(separator),
    separator,
    parts,
    maxDigits: 8,
  }
}

/**
 * Format raw digit input with locale-appropriate separators.
 * E.g., digits "02142026" with US locale → "02/14/2026"
 */
export function formatDateInputDigits(digits: string, format: LocaleDateFormat): string {
  let result = ''
  let position = 0

  for (let i = 0; i < format.parts.length; i++) {
    const length = format.parts[i] === 'year' ? 4 : 2
    if (position >= digits.length) break

    if (i > 0) result += format.separator
    result += digits.slice(position, position + length)
    position += length
  }

  return result
}

/**
 * Strict parse: extracts exactly 8 digits and interprets them as fixed-width
 * segments (DD/MM or MM/DD = 2 digits each, YYYY = 4 digits).
 * Used for auto-accept when the user types all digits without separators.
 * Returns null if the input doesn't have exactly 8 digits or is invalid.
 */
export function parseDateInput(text: string, format: LocaleDateFormat): Date | null {
  const digits = text.replace(/\D/g, '')
  if (digits.length !== format.maxDigits) return null

  let day = 0
  let month = 0
  let year = 0
  let position = 0

  for (const part of format.parts) {
    const length = part === 'year' ? 4 : 2
    const value = parseInt(digits.slice(position, position + length), 10)
    position += length

    switch (part) {
      case 'day':
        day = value
        break
      case 'month':
        month = value
        break
      case 'year':
        year = value
        break
    }
  }

  return validateDateParts(day, month, year)
}

export type DatePreference = 'past' | 'future'

/**
 * Coerce a 2-digit year to a full year based on preference.
 * - 'past': always 1900s (79 → 1979)
 * - 'future': always 2000s (79 → 2079)
 * - undefined: use 1900s if within the past 65 years, otherwise 2000s
 *   (e.g., in 2026: 61→1961, 60→2060, 79→1979, 26→2026)
 */
export function coerceTwoDigitYear(twoDigitYear: number, preference?: DatePreference): number {
  if (preference === 'past') return 1900 + twoDigitYear
  if (preference === 'future') return 2000 + twoDigitYear

  const currentYear = new Date().getFullYear()
  const asPast = 1900 + twoDigitYear
  if (currentYear - asPast <= 65 && currentYear - asPast >= 0) return asPast
  return 2000 + twoDigitYear
}

/**
 * Lenient parse: splits on any non-digit separator and accepts variable-width
 * segments — single-digit day/month (e.g., "2" → 2) and 2-digit year
 * (e.g., "26" → 2026). Used when the user confirms with Enter, Tab, or blur.
 */
export function parseDateInputLenient(
  text: string,
  format: LocaleDateFormat,
  datePreference?: DatePreference,
): Date | null {
  const segments = text.split(/\D+/).filter(Boolean)
  if (segments.length !== 3) return null

  let day = 0
  let month = 0
  let year = 0

  for (let i = 0; i < format.parts.length; i++) {
    const value = parseInt(segments[i], 10)
    if (isNaN(value) || value < 0) return null

    switch (format.parts[i]) {
      case 'day':
        day = value
        break
      case 'month':
        month = value
        break
      case 'year':
        year = value < 100 ? coerceTwoDigitYear(value, datePreference) : value
        break
    }
  }

  return validateDateParts(day, month, year)
}

function validateDateParts(day: number, month: number, year: number): Date | null {
  if (month < 1 || month > 12 || day < 1 || year < 1) return null

  const date = new Date(year, month - 1, day)
  // Verify no date overflow (e.g., Feb 30 rolls to Mar 2)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null
  }

  return date
}

// ── Constraint Checking ────────────────────────────────────────────────────

export function isDateOutOfRange(date: Date, min?: Date | null, max?: Date | null): boolean {
  if (min && isBefore(date, min)) return true
  if (max && isAfter(date, max)) return true
  return false
}

export function clampMonth(calendarMonth: CalendarMonth, min?: Date | null, max?: Date | null): CalendarMonth {
  let { year, month } = calendarMonth
  if (min) {
    const minYear = min.getFullYear()
    const minMonth = min.getMonth()
    if (year < minYear || (year === minYear && month < minMonth)) {
      year = minYear
      month = minMonth
    }
  }
  if (max) {
    const maxYear = max.getFullYear()
    const maxMonth = max.getMonth()
    if (year > maxYear || (year === maxYear && month > maxMonth)) {
      year = maxYear
      month = maxMonth
    }
  }
  return { year, month }
}
