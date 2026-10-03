<template generic="Theme extends ThemeConfig">
  <div
    class="utensil-calendar"
    :class="[...themeClasses, { disabled, 'dual-month': numberOfMonths === 2 }]"
    :style="style"
    role="application"
    aria-roledescription="calendar"
    :aria-label="ariaLabel || 'Calendar'"
    :aria-describedby="descriptionId"
  >
    <div
      v-for="(visibleMonth, index) in visibleMonths"
      :key="`${visibleMonth.year}-${visibleMonth.month}`"
      class="utensil-calendar-month"
    >
      <!-- Month header -->
      <div class="utensil-calendar-header">
        <button
          v-if="index === 0"
          class="utensil-calendar-nav"
          :disabled="!canNavigatePrev"
          :aria-label="'Previous month'"
          @click="navigatePrev"
        >
          <UtensilIcon :icon="'chevron-left' as IconProp<Theme>" />
        </button>
        <span v-else class="utensil-calendar-nav-spacer" />

        <button
          class="utensil-calendar-title"
          :class="{ inactive: !canPickYear }"
          :aria-label="
            canPickYear
              ? `${monthName(visibleMonth.year, visibleMonth.month)}, click to select year`
              : `${monthName(visibleMonth.year, visibleMonth.month)} ${visibleMonth.year}`
          "
          :tabindex="canPickYear ? 0 : -1"
          @click="canPickYear && toggleYearPicker(index)"
        >
          {{ monthName(visibleMonth.year, visibleMonth.month) }} {{ visibleMonth.year }}
        </button>

        <button
          v-if="index === visibleMonths.length - 1"
          class="utensil-calendar-nav"
          :disabled="!canNavigateNext"
          :aria-label="'Next month'"
          @click="navigateNext"
        >
          <UtensilIcon :icon="'chevron-right' as IconProp<Theme>" />
        </button>
        <span v-else class="utensil-calendar-nav-spacer" />
      </div>

      <!-- Body: day grid always rendered (maintains height), year picker overlays -->
      <div class="utensil-calendar-body">
        <!-- Weekday headers -->
        <div class="utensil-calendar-weekdays">
          <span v-for="(name, i) in weekdayNames" :key="i" class="utensil-calendar-weekday">
            {{ name }}
          </span>
        </div>

        <!-- Days grid -->
        <div class="utensil-calendar-grid" role="grid" @keydown="handleKeydown">
          <button
            v-for="(day, i) in getMonthDays(visibleMonth.year, visibleMonth.month)"
            :key="i"
            class="utensil-calendar-day"
            :class="getDayClasses(day)"
            :tabindex="getDayTabindex(day)"
            :disabled="day.isDisabled || (!day.isCurrentMonth && !showAdjacentDays)"
            :aria-label="day.date.toLocaleDateString(locale)"
            :aria-selected="isDaySelected(day.date)"
            :data-date="day.date.toISOString().split('T')[0]"
            @click="selectDay(day)"
            @mouseenter="handleDayHover(day)"
            @mouseleave="handleDayLeave"
            @focus="handleDayFocus(day)"
          >
            <span class="utensil-calendar-day-number">{{ day.day }}</span>
          </button>
        </div>

        <!-- Year picker overlay -->
        <div
          v-if="yearPickerOpen === index"
          class="utensil-calendar-year-picker"
          role="listbox"
          :aria-label="'Select year'"
        >
          <button
            v-for="year in yearRange"
            :key="year"
            class="utensil-calendar-year-option"
            :class="{ selected: year === visibleMonth.year }"
            role="option"
            :aria-selected="year === visibleMonth.year"
            @click="selectYear(year, index)"
          >
            {{ year }}
          </button>
        </div>
      </div>
    </div>
    <span :id="descriptionId" class="screen-reader">
      Use arrow keys to navigate days. Page Up for previous month, Page Down for next month. Shift+Page Up for previous
      year, Shift+Page Down for next year. Home for first day of month, End for last day. Enter or Space to select a
      date.
    </span>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { ref, computed, watch, nextTick, useId } from 'vue'
import type { ColorProp, IconProp, ThemeConfig, ScaleProp } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'
import UtensilIcon from '../icon/UtensilIcon.vue'
import type { DateRange, CalendarMonth } from './utensil-date-picker'
import {
  isSameDay,
  isSameMonth,
  isBefore,
  isAfter,
  isBetween,
  addDays,
  addMonths,
  startOfDay,
  buildCalendarGrid,
  getWeekdayNames,
  getMonthName,
  isDateOutOfRange,
  clampMonth,
} from './utensil-date-picker'

// ── Props<Theme> ──────────────────────────────────────────────────────────────────

export interface Props<Theme extends ThemeConfig> {
  /** Selected date (single mode) */
  modelValue?: Date | null
  /** Selected date range (range mode) */
  range?: DateRange | null
  /** Selection mode */
  mode?: 'single' | 'range'
  /** BCP 47 locale string */
  locale?: string
  /** 0 = Sunday, 1 = Monday, etc. */
  weekStartsOn?: number
  /** Number of months to display (1 or 2) */
  numberOfMonths?: 1 | 2
  /** Minimum selectable date */
  min?: Date | null
  /** Maximum selectable date */
  max?: Date | null
  /** Function to disable specific dates */
  disabledDates?: (date: Date) => boolean
  /** Accent color */
  color?: ColorProp<Theme>
  /** Scale */
  scale?: ScaleProp
  /** Show leading/trailing days from adjacent months */
  showAdjacentDays?: boolean
  /** Whether the calendar is disabled */
  disabled?: boolean
  /** Accessible label */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  modelValue: null,
  range: null,
  mode: 'single',
  locale: () => navigator?.language || 'en-US',
  weekStartsOn: 1,
  numberOfMonths: 1,
  min: null,
  max: null,
  showAdjacentDays: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [date: Date | null]
  'update:range': [range: DateRange]
  dayClick: [date: Date]
}>()

// ── Theme ──────────────────────────────────────────────────────────────────

const penColor = computed<ColorProp<Theme>>(() => props.color || 'pen')
const { classes: themeClasses, style } = useTheme({
  pen: penColor,
  relativeScale: () => props.scale,
})

const descriptionId = `utensil-calendar-desc-${useId()}`

// ── State ──────────────────────────────────────────────────────────────────

const currentMonth = ref<CalendarMonth>(getInitialMonth())
const hoveredDate = ref<Date | null>(null)
const focusedDate = ref<Date | null>(null)
const yearPickerOpen = ref<number | null>(null)
const rangeAnchor = ref<Date | null>(null)
const internalSelect = ref(false)
const showAdjacentDays = computed(() => props.showAdjacentDays && !props.min && !props.max)

function getInitialMonth(): CalendarMonth {
  if (props.mode === 'range' && props.range?.start) {
    return { year: props.range.start.getFullYear(), month: props.range.start.getMonth() }
  }
  if (props.modelValue) {
    return { year: props.modelValue.getFullYear(), month: props.modelValue.getMonth() }
  }
  const today = new Date()
  return clampMonth({ year: today.getFullYear(), month: today.getMonth() }, props.min, props.max)
}

// ── Computed ───────────────────────────────────────────────────────────────

const visibleMonths = computed<CalendarMonth[]>(() => {
  const months: CalendarMonth[] = [currentMonth.value]
  if (props.numberOfMonths === 2) {
    const next = addMonths(new Date(currentMonth.value.year, currentMonth.value.month, 1), 1)
    months.push({ year: next.getFullYear(), month: next.getMonth() })
  }
  return months
})

const weekdayNames = computed(() => getWeekdayNames(props.locale, props.weekStartsOn, 'narrow'))

const yearRange = computed(() => {
  const center = currentMonth.value.year
  const minYear = props.min ? props.min.getFullYear() : center - 10
  const maxYear = props.max ? props.max.getFullYear() : center + 10
  const rangeStart = Math.min(center - 10, minYear)
  const rangeEnd = Math.max(center + 10, maxYear)
  const years: number[] = []
  for (let y = rangeStart; y <= rangeEnd; y++) {
    if (y >= minYear && y <= maxYear) {
      years.push(y)
    }
  }
  return years
})

const canNavigatePrev = computed(() => {
  if (!props.min) return true
  const prev = addMonths(new Date(currentMonth.value.year, currentMonth.value.month, 1), -1)
  const lastOfPrev = new Date(prev.getFullYear(), prev.getMonth() + 1, 0)
  return !isBefore(lastOfPrev, props.min)
})

const canNavigateNext = computed(() => {
  if (!props.max) return true
  const offset = props.numberOfMonths === 2 ? 2 : 1
  const next = addMonths(new Date(currentMonth.value.year, currentMonth.value.month, 1), offset)
  return !isAfter(new Date(next.getFullYear(), next.getMonth(), 1), props.max)
})

const canPickYear = computed(() => yearRange.value.length > 1)

// ── Calendar Grid ──────────────────────────────────────────────────────────

function isDateDisabled(date: Date): boolean {
  if (isDateOutOfRange(date, props.min, props.max)) return true
  if (props.disabledDates?.(date)) return true
  return false
}

function getMonthDays(year: number, month: number) {
  return buildCalendarGrid(year, month, props.weekStartsOn, isDateDisabled)
}

// ── Day Classes ────────────────────────────────────────────────────────────

function isDaySelected(date: Date): boolean {
  if (props.mode === 'single') {
    return props.modelValue ? isSameDay(date, props.modelValue) : false
  }
  const range = props.range
  if (!range) return false
  if (range.start && isSameDay(date, range.start)) return true
  if (range.end && isSameDay(date, range.end)) return true
  return false
}

function isDayInRange(date: Date): boolean {
  if (props.mode !== 'range') return false

  const range = props.range
  // Committed range
  if (range?.start && range?.end) {
    return isBetween(date, range.start, range.end)
  }

  // Preview range during selection
  if (rangeAnchor.value && hoveredDate.value) {
    return isBetween(date, rangeAnchor.value, hoveredDate.value)
  }

  return false
}

function isDayRangeStart(date: Date): boolean {
  if (props.mode !== 'range') return false
  const range = props.range
  if (range?.start && range?.end) {
    const start = isBefore(range.start, range.end) ? range.start : range.end
    return isSameDay(date, start)
  }
  if (rangeAnchor.value && hoveredDate.value) {
    const start = isBefore(rangeAnchor.value, hoveredDate.value) ? rangeAnchor.value : hoveredDate.value
    return isSameDay(date, start)
  }
  return false
}

function isDayRangeEnd(date: Date): boolean {
  if (props.mode !== 'range') return false
  const range = props.range
  if (range?.start && range?.end) {
    const end = isAfter(range.start, range.end) ? range.start : range.end
    return isSameDay(date, end)
  }
  if (rangeAnchor.value && hoveredDate.value) {
    const end = isAfter(rangeAnchor.value, hoveredDate.value) ? rangeAnchor.value : hoveredDate.value
    return isSameDay(date, end)
  }
  return false
}

function isDayVisible(day: ReturnType<typeof buildCalendarGrid>[0]): boolean {
  return day.isCurrentMonth || showAdjacentDays.value
}

function getDayClasses(day: ReturnType<typeof buildCalendarGrid>[0]) {
  const visible = isDayVisible(day)
  return {
    'outside-month': !day.isCurrentMonth,
    'adjacent-hidden': !day.isCurrentMonth && (!showAdjacentDays.value || day.isDisabled),
    today: day.isToday && visible,
    selected: isDaySelected(day.date) && visible,
    'in-range': isDayInRange(day.date) && visible,
    'range-start': isDayRangeStart(day.date) && visible,
    'range-end': isDayRangeEnd(day.date) && visible,
    disabled: day.isDisabled,
    focused: focusedDate.value ? isSameDay(day.date, focusedDate.value) && visible : false,
  }
}

function getDayTabindex(day: ReturnType<typeof buildCalendarGrid>[0]): number {
  if (!isDayVisible(day) || day.isDisabled) return -1
  // If we have a focused date, only that day is tabbable
  if (focusedDate.value && day.isCurrentMonth) {
    return isSameDay(day.date, focusedDate.value) ? 0 : -1
  }
  // If we have a selected date, make it tabbable
  if (props.modelValue && isSameDay(day.date, props.modelValue)) return 0
  if (props.range?.start && isSameDay(day.date, props.range.start)) return 0
  // Default: first day of month is tabbable
  if (day.day === 1 && day.isCurrentMonth) return 0
  return -1
}

// ── Selection Logic ────────────────────────────────────────────────────────

function selectDay(day: ReturnType<typeof buildCalendarGrid>[0]) {
  if (day.isDisabled || props.disabled) return
  if (!day.isCurrentMonth && !showAdjacentDays.value) return

  const date = startOfDay(day.date)
  emit('dayClick', date)
  internalSelect.value = true

  if (props.mode === 'single') {
    emit('update:modelValue', date)
  } else {
    // Range mode
    if (!rangeAnchor.value) {
      // First click: set anchor
      rangeAnchor.value = date
      emit('update:range', { start: date, end: null })
    } else {
      // Second click: complete range; the same day twice is a valid single-day range
      const start = isBefore(rangeAnchor.value, date) ? rangeAnchor.value : date
      const end = isAfter(rangeAnchor.value, date) ? rangeAnchor.value : date
      emit('update:range', { start, end })
      rangeAnchor.value = null
      hoveredDate.value = null
    }
  }
}

// ── Hover (for range preview) ──────────────────────────────────────────────

function handleDayHover(day: ReturnType<typeof buildCalendarGrid>[0]) {
  if (props.mode === 'range' && rangeAnchor.value && isDayVisible(day) && !day.isDisabled) {
    hoveredDate.value = day.date
  }
}

function handleDayLeave() {
  // Keep hovered date for range preview — cleared on selection or mouse leave from grid
}

function handleDayFocus(day: ReturnType<typeof buildCalendarGrid>[0]) {
  if (isDayVisible(day) && !day.isDisabled) {
    focusedDate.value = day.date
    if (props.mode === 'range' && rangeAnchor.value) {
      hoveredDate.value = day.date
    }
  }
}

// ── Navigation ─────────────────────────────────────────────────────────────

function navigatePrev() {
  const prev = addMonths(new Date(currentMonth.value.year, currentMonth.value.month, 1), -1)
  const clamped = clampMonth({ year: prev.getFullYear(), month: prev.getMonth() }, props.min, props.max)
  currentMonth.value = clamped
  yearPickerOpen.value = null
}

function navigateNext() {
  const next = addMonths(new Date(currentMonth.value.year, currentMonth.value.month, 1), 1)
  const clamped = clampMonth({ year: next.getFullYear(), month: next.getMonth() }, props.min, props.max)
  currentMonth.value = clamped
  yearPickerOpen.value = null
}

function monthName(year: number, month: number): string {
  return getMonthName(year, month, props.locale)
}

function toggleYearPicker(index: number) {
  yearPickerOpen.value = yearPickerOpen.value === index ? null : index
}

function selectYear(year: number, index: number) {
  if (index === 0) {
    currentMonth.value = clampMonth({ year, month: currentMonth.value.month }, props.min, props.max)
  } else {
    // For second month panel, go back one month so this panel shows the selected year/month
    const adjusted = addMonths(new Date(year, currentMonth.value.month, 1), -1)
    currentMonth.value = clampMonth({ year: adjusted.getFullYear(), month: adjusted.getMonth() }, props.min, props.max)
  }
  yearPickerOpen.value = null
}

// ── Keyboard Navigation ────────────────────────────────────────────────────

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled) return

  const current = focusedDate.value || props.modelValue || props.range?.start || new Date()
  let next: Date | null = null

  switch (event.key) {
    case 'ArrowRight':
      next = addDays(current, 1)
      break
    case 'ArrowLeft':
      next = addDays(current, -1)
      break
    case 'ArrowDown':
      next = addDays(current, 7)
      break
    case 'ArrowUp':
      next = addDays(current, -7)
      break
    case 'Home':
      next = new Date(current.getFullYear(), current.getMonth(), 1)
      break
    case 'End':
      next = new Date(current.getFullYear(), current.getMonth() + 1, 0)
      break
    case 'PageUp':
      next = event.shiftKey ? addMonths(current, -12) : addMonths(current, -1)
      break
    case 'PageDown':
      next = event.shiftKey ? addMonths(current, 12) : addMonths(current, 1)
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (focusedDate.value && !isDateDisabled(focusedDate.value)) {
        const day = {
          date: focusedDate.value,
          day: focusedDate.value.getDate(),
          isCurrentMonth: true,
          isToday: false,
          isDisabled: false,
        }
        selectDay(day)
      }
      return
    default:
      return
  }

  if (next) {
    event.preventDefault()
    if (isDateOutOfRange(next, props.min, props.max)) return

    // Auto-navigate to adjacent month if needed
    if (!isSameMonth(next, new Date(currentMonth.value.year, currentMonth.value.month, 1))) {
      const lastVisible = visibleMonths.value[visibleMonths.value.length - 1]
      if (!isSameMonth(next, new Date(lastVisible.year, lastVisible.month, 1))) {
        currentMonth.value = clampMonth({ year: next.getFullYear(), month: next.getMonth() }, props.min, props.max)
      }
    }

    focusedDate.value = next
    if (props.mode === 'range' && rangeAnchor.value) {
      hoveredDate.value = next
    }

    nextTick(() => {
      const dateStr = next.toISOString().split('T')[0]
      const element = document.querySelector(`.utensil-calendar-day[data-date="${dateStr}"]`) as HTMLElement
      element?.focus()
    })
  }
}

// ── Watch for external changes ─────────────────────────────────────────────

watch(
  () => props.modelValue,
  (value) => {
    // Skip navigation when the change came from clicking a day in the grid
    if (internalSelect.value) {
      internalSelect.value = false
      return
    }
    if (value && props.mode === 'single') {
      const month = { year: value.getFullYear(), month: value.getMonth() }
      if (month.year !== currentMonth.value.year || month.month !== currentMonth.value.month) {
        currentMonth.value = clampMonth(month, props.min, props.max)
      }
    }
  },
)

// ── Public API ─────────────────────────────────────────────────────────────

defineExpose({
  navigatePrev,
  navigateNext,
  currentMonth,
})
</script>

<style scoped>
@layer utensil {
  .utensil-calendar {
    position: relative;
    display: inline-flex;
    gap: var(--space-4);
    user-select: none;
    line-height: normal;
  }

  .utensil-calendar.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .utensil-calendar-month {
    display: flex;
    flex-direction: column;
    min-width: 256px;
  }

  /* ── Header ─────────────────────────────────────────────────────── */

  .utensil-calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-1) 0;
    margin-bottom: var(--space-2);
  }

  .utensil-calendar-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--space-6);
    height: var(--space-6);
    border: none;
    background: transparent;
    color: var(--pencil-11);
    border-radius: var(--radius-2);
    cursor: pointer;
    outline: 2px solid transparent;
    outline-offset: -2px;
    transition:
      background-color 0.1s ease,
      color 0.1s ease,
      outline-color 0.1s ease;
    font-size: var(--font-size-2);
  }

  .utensil-calendar-nav:hover:not(:disabled) {
    background: var(--pencil-a3);
    color: var(--pencil-12);
  }

  .utensil-calendar-nav:focus-visible {
    outline-color: var(--pen-8);
  }

  .utensil-calendar-nav:disabled {
    opacity: 0.3;
    cursor: default;
  }

  .utensil-calendar-nav-spacer {
    width: var(--space-6);
    height: var(--space-6);
  }

  .utensil-calendar-title {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-2);
    font-weight: 600;
    color: var(--pencil-12);
    border: none;
    background: transparent;
    border-radius: var(--radius-2);
    padding: var(--space-1) var(--space-2);
    cursor: pointer;
    outline: 2px solid transparent;
    outline-offset: -2px;
    transition:
      background-color 0.1s ease,
      outline-color 0.1s ease;
  }

  .utensil-calendar-title:hover {
    background: var(--pencil-a3);
  }

  .utensil-calendar-title:focus-visible {
    outline-color: var(--pen-8);
  }

  .utensil-calendar-title.inactive {
    cursor: default;
    pointer-events: none;
  }

  /* ── Body (relative container for overlay) ──────────────────────── */

  .utensil-calendar-body {
    position: relative;
  }

  /* ── Year Picker ────────────────────────────────────────────────── */

  .utensil-calendar-year-picker {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-content: start;
    gap: var(--space-1);
    padding: var(--space-2) 0;
    overflow-y: auto;
    background: var(--panel-solid);
  }

  .utensil-calendar-year-option {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-1) var(--space-2);
    border: none;
    background: transparent;
    color: var(--pencil-11);
    font-size: var(--font-size-2);
    border-radius: var(--radius-2);
    cursor: pointer;
    outline: 2px solid transparent;
    outline-offset: -2px;
    transition:
      background-color 0.1s ease,
      color 0.1s ease,
      outline-color 0.1s ease;
  }

  .utensil-calendar-year-option:hover {
    background: var(--pencil-a3);
    color: var(--pencil-12);
  }

  .utensil-calendar-year-option:focus-visible {
    outline-color: var(--pen-8);
  }

  .utensil-calendar-year-option.selected {
    background: var(--pen-9);
    color: var(--pen-contrast);
    font-weight: 600;
  }

  /* ── Weekday Headers ────────────────────────────────────────────── */

  .utensil-calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: var(--space-1);
  }

  .utensil-calendar-weekday {
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--space-6);
    font-size: var(--font-size-1);
    font-weight: 600;
    color: var(--pencil-a11);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* ── Day Grid ───────────────────────────────────────────────────── */

  .utensil-calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }

  .utensil-calendar-day {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    border: none;
    background: transparent;
    color: var(--pencil-12);
    font-size: var(--font-size-2);
    cursor: pointer;
    outline: none;
    padding: 2px;
    transition: color 0.1s ease;
  }

  .utensil-calendar-day-number {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border-radius: var(--radius-2);
    transition:
      background-color 0.1s ease,
      color 0.1s ease,
      outline-color 0.1s ease;
    outline: 2px solid transparent;
    outline-offset: -2px;
  }

  .utensil-calendar-day:hover:not(:disabled) .utensil-calendar-day-number {
    background: var(--pencil-a3);
  }

  .utensil-calendar-day:focus-visible .utensil-calendar-day-number {
    outline-color: var(--pen-8);
  }

  /* Outside month: visible but muted */
  .utensil-calendar-day.outside-month .utensil-calendar-day-number {
    color: var(--pencil-a8);
  }

  /* Outside month: hidden when showAdjacentDays is off */
  .utensil-calendar-day.adjacent-hidden {
    visibility: hidden;
  }

  /* Today */
  .utensil-calendar-day.today .utensil-calendar-day-number {
    font-weight: 700;
    box-shadow: inset 0 0 0 1px var(--pen-a8);
  }

  /* Selected */
  .utensil-calendar-day.selected .utensil-calendar-day-number {
    background: var(--pen-9);
    color: var(--pen-contrast);
    font-weight: 600;
  }

  .utensil-calendar-day.selected:hover:not(:disabled) .utensil-calendar-day-number {
    background: var(--pen-10);
  }

  .utensil-calendar-day.selected:focus-visible .utensil-calendar-day-number {
    outline-offset: 3px;
  }

  /* Range selection */
  .utensil-calendar-day.in-range {
    background: var(--pen-a3);
  }

  .utensil-calendar-day.range-start {
    background: var(--pen-a3);
    border-end-start-radius: var(--radius-2);
    border-start-start-radius: var(--radius-2);
  }

  .utensil-calendar-day.range-end {
    background: var(--pen-a3);
    border-end-end-radius: var(--radius-2);
    border-start-end-radius: var(--radius-2);
  }

  .utensil-calendar-day.range-start.range-end {
    background: transparent;
  }

  .utensil-calendar-day.range-start .utensil-calendar-day-number,
  .utensil-calendar-day.range-end .utensil-calendar-day-number {
    background: var(--pen-9);
    color: var(--pen-contrast);
    font-weight: 600;
  }

  .utensil-calendar-day.range-start:hover:not(:disabled) .utensil-calendar-day-number,
  .utensil-calendar-day.range-end:hover:not(:disabled) .utensil-calendar-day-number {
    background: var(--pen-10);
  }

  .utensil-calendar-day.range-start:focus-visible .utensil-calendar-day-number,
  .utensil-calendar-day.range-end:focus-visible .utensil-calendar-day-number {
    outline-offset: 3px;
  }

  /* Disabled */
  .utensil-calendar-day:disabled {
    cursor: default;
  }

  .utensil-calendar-day:disabled .utensil-calendar-day-number {
    color: var(--pencil-a8);
  }

  /* ── Dual Month ─────────────────────────────────────────────────── */

  .utensil-calendar.dual-month .utensil-calendar-month {
    min-width: 232px;
  }
}
</style>
