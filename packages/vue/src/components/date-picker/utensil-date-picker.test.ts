import { describe, it, expect } from 'vitest'
import {
  isSameDay,
  isSameMonth,
  isToday,
  isBefore,
  isAfter,
  isBetween,
  startOfDay,
  startOfMonth,
  endOfMonth,
  addDays,
  addMonths,
  getDaysInMonth,
  buildCalendarGrid,
  getWeekdayNames,
  getMonthName,
  formatDate,
  formatDateRange,
  getLocaleDateFormat,
  formatDateInputDigits,
  parseDateInput,
  parseDateInputLenient,
  coerceTwoDigitYear,
  isDateOutOfRange,
  clampMonth,
} from './utensil-date-picker'

describe('Date Comparison', () => {
  it('isSameDay compares dates ignoring time', () => {
    const a = new Date(2024, 5, 15, 10, 30)
    const b = new Date(2024, 5, 15, 22, 0)
    expect(isSameDay(a, b)).toBe(true)
  })

  it('isSameDay returns false for different days', () => {
    const a = new Date(2024, 5, 15)
    const b = new Date(2024, 5, 16)
    expect(isSameDay(a, b)).toBe(false)
  })

  it('isSameMonth compares year and month', () => {
    const a = new Date(2024, 5, 1)
    const b = new Date(2024, 5, 30)
    expect(isSameMonth(a, b)).toBe(true)
  })

  it('isSameMonth returns false for different months', () => {
    const a = new Date(2024, 5, 1)
    const b = new Date(2024, 6, 1)
    expect(isSameMonth(a, b)).toBe(false)
  })

  it('isToday returns true for today', () => {
    expect(isToday(new Date())).toBe(true)
  })

  it('isToday returns false for yesterday', () => {
    const yesterday = addDays(new Date(), -1)
    expect(isToday(yesterday)).toBe(false)
  })

  it('isBefore compares by date only', () => {
    const a = new Date(2024, 5, 14, 23, 59)
    const b = new Date(2024, 5, 15, 0, 0)
    expect(isBefore(a, b)).toBe(true)
    expect(isBefore(b, a)).toBe(false)
  })

  it('isAfter compares by date only', () => {
    const a = new Date(2024, 5, 16)
    const b = new Date(2024, 5, 15)
    expect(isAfter(a, b)).toBe(true)
    expect(isAfter(b, a)).toBe(false)
  })

  it('isBetween checks exclusive range', () => {
    const start = new Date(2024, 5, 10)
    const end = new Date(2024, 5, 20)
    expect(isBetween(new Date(2024, 5, 15), start, end)).toBe(true)
    expect(isBetween(new Date(2024, 5, 10), start, end)).toBe(false)
    expect(isBetween(new Date(2024, 5, 20), start, end)).toBe(false)
    expect(isBetween(new Date(2024, 5, 9), start, end)).toBe(false)
  })

  it('isBetween handles reversed range', () => {
    const start = new Date(2024, 5, 20)
    const end = new Date(2024, 5, 10)
    expect(isBetween(new Date(2024, 5, 15), start, end)).toBe(true)
  })
})

describe('Date Manipulation', () => {
  it('startOfDay zeros time components', () => {
    const date = startOfDay(new Date(2024, 5, 15, 14, 30, 45, 123))
    expect(date.getHours()).toBe(0)
    expect(date.getMinutes()).toBe(0)
    expect(date.getSeconds()).toBe(0)
    expect(date.getMilliseconds()).toBe(0)
  })

  it('startOfMonth returns first day', () => {
    const date = startOfMonth(new Date(2024, 5, 15))
    expect(date.getDate()).toBe(1)
    expect(date.getMonth()).toBe(5)
  })

  it('endOfMonth returns last day', () => {
    const date = endOfMonth(new Date(2024, 1, 10)) // February 2024 (leap year)
    expect(date.getDate()).toBe(29)
  })

  it('addDays adds positive days', () => {
    const date = addDays(new Date(2024, 5, 28), 5)
    expect(date.getDate()).toBe(3)
    expect(date.getMonth()).toBe(6) // July
  })

  it('addDays subtracts negative days', () => {
    const date = addDays(new Date(2024, 5, 3), -5)
    expect(date.getDate()).toBe(29)
    expect(date.getMonth()).toBe(4) // May
  })

  it('addMonths handles month overflow', () => {
    // Jan 31 + 1 month should be Feb 28/29, not Mar 2/3
    const date = addMonths(new Date(2024, 0, 31), 1)
    expect(date.getMonth()).toBe(1) // February
    expect(date.getDate()).toBe(29) // 2024 is leap year
  })

  it('addMonths handles negative months', () => {
    const date = addMonths(new Date(2024, 0, 15), -2)
    expect(date.getMonth()).toBe(10) // November
    expect(date.getFullYear()).toBe(2023)
  })

  it('getDaysInMonth returns correct count', () => {
    expect(getDaysInMonth(2024, 1)).toBe(29) // Feb 2024 (leap)
    expect(getDaysInMonth(2023, 1)).toBe(28) // Feb 2023
    expect(getDaysInMonth(2024, 0)).toBe(31) // January
    expect(getDaysInMonth(2024, 3)).toBe(30) // April
  })
})

describe('Calendar Grid', () => {
  it('buildCalendarGrid returns 42 days (6 rows x 7 columns)', () => {
    const grid = buildCalendarGrid(2024, 5, 1, () => false) // June 2024, Monday start
    expect(grid).toHaveLength(42)
  })

  it('marks current month days correctly', () => {
    const grid = buildCalendarGrid(2024, 5, 1, () => false) // June 2024
    const currentMonthDays = grid.filter((d) => d.isCurrentMonth)
    expect(currentMonthDays).toHaveLength(30) // June has 30 days
  })

  it('marks today correctly', () => {
    const now = new Date()
    const grid = buildCalendarGrid(now.getFullYear(), now.getMonth(), 1, () => false)
    const todayDays = grid.filter((d) => d.isToday)
    expect(todayDays.length).toBeGreaterThanOrEqual(1)
  })

  it('applies disabledDates function', () => {
    const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6
    const grid = buildCalendarGrid(2024, 5, 1, isWeekend)
    const disabledWeekends = grid.filter((d) => d.isCurrentMonth && d.isDisabled)
    // June 2024 has 10 weekend days (5 Saturdays + 5 Sundays)
    expect(disabledWeekends).toHaveLength(10)
  })

  it('starts on the correct day with weekStartsOn=0 (Sunday)', () => {
    const grid = buildCalendarGrid(2024, 5, 0, () => false) // June 2024
    // June 1, 2024 is a Saturday. With Sunday start, we need 6 leading days
    // The first cell should be Sunday May 26
    expect(grid[0].date.getDay()).toBe(0) // Sunday
  })

  it('starts on the correct day with weekStartsOn=1 (Monday)', () => {
    const grid = buildCalendarGrid(2024, 5, 1, () => false)
    expect(grid[0].date.getDay()).toBe(1) // Monday
  })
})

describe('Internationalization', () => {
  it('getWeekdayNames returns 7 names', () => {
    const names = getWeekdayNames('en-US', 0, 'short')
    expect(names).toHaveLength(7)
  })

  it('getWeekdayNames respects weekStartsOn', () => {
    const sundayStart = getWeekdayNames('en-US', 0, 'short')
    const mondayStart = getWeekdayNames('en-US', 1, 'short')
    // Sunday start should begin with Sun, Monday start with Mon
    expect(sundayStart[0]).toMatch(/Sun/)
    expect(mondayStart[0]).toMatch(/Mon/)
  })

  it('getMonthName returns localized month', () => {
    const name = getMonthName(2024, 0, 'en-US')
    expect(name).toBe('January')
  })

  it('formatDate returns localized date string', () => {
    const date = new Date(2024, 5, 15)
    const formatted = formatDate(date, 'en-US')
    expect(formatted).toContain('Jun')
    expect(formatted).toContain('15')
    expect(formatted).toContain('2024')
  })

  it('formatDateRange formats complete range', () => {
    const range = {
      start: new Date(2024, 5, 10),
      end: new Date(2024, 5, 20),
    }
    const formatted = formatDateRange(range, 'en-US')
    expect(formatted).toContain('10')
    expect(formatted).toContain('20')
    expect(formatted).toContain('–')
  })

  it('formatDateRange handles partial range', () => {
    expect(formatDateRange({ start: null, end: null }, 'en-US')).toBe('')
    const start = new Date(2024, 5, 10)
    expect(formatDateRange({ start, end: null }, 'en-US')).toContain('10')
  })
})

describe('Locale Date Input', () => {
  it('getLocaleDateFormat detects US format', () => {
    const format = getLocaleDateFormat('en-US')
    expect(format.placeholder).toBe('MM/DD/YYYY')
    expect(format.separator).toBe('/')
    expect(format.parts).toEqual(['month', 'day', 'year'])
    expect(format.maxDigits).toBe(8)
  })

  it('getLocaleDateFormat detects German format', () => {
    const format = getLocaleDateFormat('de-DE')
    expect(format.placeholder).toBe('DD.MM.YYYY')
    expect(format.separator).toBe('.')
    expect(format.parts).toEqual(['day', 'month', 'year'])
  })

  it('formatDateInputDigits formats partial input', () => {
    const format = getLocaleDateFormat('en-US')
    expect(formatDateInputDigits('02', format)).toBe('02')
    expect(formatDateInputDigits('021', format)).toBe('02/1')
    expect(formatDateInputDigits('0214', format)).toBe('02/14')
    expect(formatDateInputDigits('02142', format)).toBe('02/14/2')
    expect(formatDateInputDigits('02142026', format)).toBe('02/14/2026')
  })

  it('formatDateInputDigits respects locale format', () => {
    const format = getLocaleDateFormat('de-DE')
    expect(formatDateInputDigits('14', format)).toBe('14')
    expect(formatDateInputDigits('1402', format)).toBe('14.02')
    expect(formatDateInputDigits('14022026', format)).toBe('14.02.2026')
  })

  it('formatDateInputDigits truncates excess digits', () => {
    const format = getLocaleDateFormat('en-US')
    expect(formatDateInputDigits('021420261', format)).toBe('02/14/2026')
  })

  it('parseDateInput parses valid US date', () => {
    const format = getLocaleDateFormat('en-US')
    const date = parseDateInput('02/14/2026', format)
    expect(date).not.toBeNull()
    expect(date!.getFullYear()).toBe(2026)
    expect(date!.getMonth()).toBe(1) // February
    expect(date!.getDate()).toBe(14)
  })

  it('parseDateInput parses valid German date', () => {
    const format = getLocaleDateFormat('de-DE')
    const date = parseDateInput('14.02.2026', format)
    expect(date).not.toBeNull()
    expect(date!.getFullYear()).toBe(2026)
    expect(date!.getMonth()).toBe(1)
    expect(date!.getDate()).toBe(14)
  })

  it('parseDateInput returns null for incomplete input', () => {
    const format = getLocaleDateFormat('en-US')
    expect(parseDateInput('02/14', format)).toBeNull()
    expect(parseDateInput('02', format)).toBeNull()
    expect(parseDateInput('', format)).toBeNull()
  })

  it('parseDateInput returns null for invalid dates', () => {
    const format = getLocaleDateFormat('en-US')
    expect(parseDateInput('02/30/2024', format)).toBeNull() // Feb 30 doesn't exist
    expect(parseDateInput('13/01/2024', format)).toBeNull() // Month 13
    expect(parseDateInput('00/15/2024', format)).toBeNull() // Month 0
  })

  it('parseDateInput handles leap year validation', () => {
    const format = getLocaleDateFormat('en-US')
    expect(parseDateInput('02/29/2024', format)).not.toBeNull() // Leap year
    expect(parseDateInput('02/29/2023', format)).toBeNull() // Not a leap year
  })

  it('parseDateInputLenient accepts single-digit month and day', () => {
    const format = getLocaleDateFormat('en-US')
    const date = parseDateInputLenient('2/3/2026', format)
    expect(date).not.toBeNull()
    expect(date!.getMonth()).toBe(1) // February
    expect(date!.getDate()).toBe(3)
    expect(date!.getFullYear()).toBe(2026)
  })

  it('parseDateInputLenient accepts 2-digit year with default coercion', () => {
    const format = getLocaleDateFormat('en-US')
    const date = parseDateInputLenient('02/14/26', format)
    expect(date).not.toBeNull()
    expect(date!.getFullYear()).toBe(2026)
    expect(date!.getMonth()).toBe(1)
    expect(date!.getDate()).toBe(14)
  })

  it('parseDateInputLenient accepts single-digit month with 2-digit year', () => {
    const format = getLocaleDateFormat('en-US')
    const date = parseDateInputLenient('2/14/26', format)
    expect(date).not.toBeNull()
    expect(date!.getFullYear()).toBe(2026)
    expect(date!.getMonth()).toBe(1)
    expect(date!.getDate()).toBe(14)
  })

  it('parseDateInputLenient with past preference', () => {
    const format = getLocaleDateFormat('en-US')
    const date = parseDateInputLenient('2/14/79', format, 'past')
    expect(date).not.toBeNull()
    expect(date!.getFullYear()).toBe(1979)
  })

  it('parseDateInputLenient with future preference', () => {
    const format = getLocaleDateFormat('en-US')
    const date = parseDateInputLenient('2/14/79', format, 'future')
    expect(date).not.toBeNull()
    expect(date!.getFullYear()).toBe(2079)
  })

  it('parseDateInputLenient works with German locale', () => {
    const format = getLocaleDateFormat('de-DE')
    const date = parseDateInputLenient('3.2.26', format)
    expect(date).not.toBeNull()
    expect(date!.getDate()).toBe(3)
    expect(date!.getMonth()).toBe(1) // February
    expect(date!.getFullYear()).toBe(2026)
  })

  it('parseDateInputLenient returns null for invalid dates', () => {
    const format = getLocaleDateFormat('en-US')
    expect(parseDateInputLenient('13/1/24', format)).toBeNull() // Month 13
    expect(parseDateInputLenient('2/30/24', format)).toBeNull() // Feb 30
    expect(parseDateInputLenient('2/14', format)).toBeNull() // Missing year
    expect(parseDateInputLenient('', format)).toBeNull()
  })

  it('parseDateInputLenient also accepts full-width input', () => {
    const format = getLocaleDateFormat('en-US')
    const date = parseDateInputLenient('02/14/2026', format)
    expect(date).not.toBeNull()
    expect(date!.getFullYear()).toBe(2026)
  })

  it('coerceTwoDigitYear with past preference always uses 1900s', () => {
    expect(coerceTwoDigitYear(79, 'past')).toBe(1979)
    expect(coerceTwoDigitYear(26, 'past')).toBe(1926)
    expect(coerceTwoDigitYear(0, 'past')).toBe(1900)
  })

  it('coerceTwoDigitYear with future preference always uses 2000s', () => {
    expect(coerceTwoDigitYear(79, 'future')).toBe(2079)
    expect(coerceTwoDigitYear(26, 'future')).toBe(2026)
    expect(coerceTwoDigitYear(0, 'future')).toBe(2000)
  })

  it('coerceTwoDigitYear with no preference uses 65-year window', () => {
    const currentYear = new Date().getFullYear()
    // A year within 65 years past → 1900s
    const recentPast = currentYear - 1900 - 10 // e.g., 2026 → 116
    if (recentPast >= 0 && recentPast < 100) {
      expect(coerceTwoDigitYear(recentPast)).toBe(1900 + recentPast)
    }
    // A year too far in the past → 2000s
    const distantPast = currentYear - 1900 - 70
    if (distantPast >= 0 && distantPast < 100) {
      expect(coerceTwoDigitYear(distantPast)).toBe(2000 + distantPast)
    }
  })
})

describe('Constraint Checking', () => {
  it('isDateOutOfRange checks min', () => {
    const min = new Date(2024, 5, 10)
    expect(isDateOutOfRange(new Date(2024, 5, 9), min, null)).toBe(true)
    expect(isDateOutOfRange(new Date(2024, 5, 10), min, null)).toBe(false)
    expect(isDateOutOfRange(new Date(2024, 5, 11), min, null)).toBe(false)
  })

  it('isDateOutOfRange checks max', () => {
    const max = new Date(2024, 5, 20)
    expect(isDateOutOfRange(new Date(2024, 5, 21), null, max)).toBe(true)
    expect(isDateOutOfRange(new Date(2024, 5, 20), null, max)).toBe(false)
    expect(isDateOutOfRange(new Date(2024, 5, 19), null, max)).toBe(false)
  })

  it('clampMonth clamps to min', () => {
    const min = new Date(2024, 5, 1)
    const result = clampMonth({ year: 2024, month: 3 }, min, null)
    expect(result.year).toBe(2024)
    expect(result.month).toBe(5)
  })

  it('clampMonth clamps to max', () => {
    const max = new Date(2024, 5, 30)
    const result = clampMonth({ year: 2024, month: 8 }, null, max)
    expect(result.year).toBe(2024)
    expect(result.month).toBe(5)
  })

  it('clampMonth returns same month when within range', () => {
    const min = new Date(2024, 3, 1)
    const max = new Date(2024, 8, 30)
    const result = clampMonth({ year: 2024, month: 5 }, min, max)
    expect(result.year).toBe(2024)
    expect(result.month).toBe(5)
  })
})
