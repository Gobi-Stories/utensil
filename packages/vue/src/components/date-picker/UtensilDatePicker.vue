<template generic="Theme extends ThemeConfig">
  <UtensilPopover
    ref="popoverRef"
    class="utensil-date-picker"
    :class="{ disabled, open: isOpen }"
    :placement="placement"
    :offset="4"
  >
    <template #trigger="{ toggle: popoverToggle, isOpen: popoverOpen }">
      <slot
        name="trigger"
        :value="mode === 'single' ? modelValue : range"
        :formatted="formattedValue"
        :is-open="popoverOpen"
        :toggle="popoverToggle"
        :open="openPopover"
        :close="closePopover"
        :disabled="disabled"
      >
        <div
          class="utensil-date-picker-trigger"
          :class="{ open: popoverOpen, editing: !!editing }"
          @click="onTriggerClick($event, popoverToggle)"
          @keydown="handleTriggerKeydown($event, popoverToggle)"
        >
          <!-- Display mode: readonly clickable input -->
          <UtensilInput
            v-if="!editing"
            :model-value="formattedValue"
            :label="label"
            :label-placement="labelPlacement"
            :placeholder="placeholder"
            :variation="variation"
            :height="height"
            :icon="triggerIcon"
            icon-position="start"
            :disabled="disabled"
            :aria-label="ariaLabel || 'Choose date'"
            readonly
          >
            <template #action>
              <button
                class="utensil-date-picker-clear"
                :class="{ visible: clearable && hasValue }"
                aria-label="Clear date"
                tabindex="-1"
                @click.stop="clearValue"
              >
                <UtensilIcon :icon="'times' as IconProp<Theme>" />
              </button>
            </template>
          </UtensilInput>

          <!-- Edit mode: editable text input for keyboard date entry -->
          <UtensilInput
            v-else
            ref="editInputRef"
            :model-value="editText"
            :label="label"
            :label-placement="labelPlacement"
            :placeholder="editPlaceholder"
            :variation="variation"
            :height="height"
            :icon="triggerIcon"
            icon-position="start"
            :aria-label="editingAriaLabel"
            stop-keyboard-propagation
            @input="onEditInput"
            @keydown="onEditKeydown"
            @blur="onEditBlur"
          />
        </div>
      </slot>
    </template>

    <template #default="{ close }">
      <div class="utensil-date-picker-panel" @keydown.escape.stop="close">
        <UtensilCalendar
          :model-value="mode === 'single' ? modelValue : undefined"
          :range="mode === 'range' ? range : undefined"
          :mode="mode"
          :locale="locale"
          :week-starts-on="weekStartsOn"
          :number-of-months="numberOfMonths"
          :min="min"
          :max="max"
          :disabled-dates="disabledDates"
          :color="color"
          :scale="scale"
          @update:model-value="onSingleSelect($event, close)"
          @update:range="onRangeSelect($event, close)"
        />

        <!-- Presets -->
        <UtensilRadioGroup
          v-if="hasPresets"
          class="utensil-date-picker-presets"
          :model-value="selectedPreset"
          variation="soft"
          color="pencil"
          scale="tiny"
          aria-label="Date presets"
          @update:model-value="onPresetSelect($event, close)"
        >
          <UtensilRadioGroupButton
            v-for="preset in presets"
            :key="preset.label"
            :value="preset.label"
            :label="preset.label"
          />
        </UtensilRadioGroup>
      </div>
    </template>
  </UtensilPopover>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { ref, computed, nextTick } from 'vue'
import type { ColorProp, IconProp, ThemeConfig, ScaleProp } from '../../theme/utensil-theme'
import type { PopoverPlacement } from '../popover/utensil-popover'
import UtensilPopover from '../popover/UtensilPopover.vue'
import UtensilInput from '../input/UtensilInput.vue'
import UtensilIcon from '../icon/UtensilIcon.vue'
import UtensilCalendar from './UtensilCalendar.vue'
import UtensilRadioGroup from '../radio-group/UtensilRadioGroup.vue'
import UtensilRadioGroupButton from '../radio-group/UtensilRadioGroupButton.vue'
import type { DateRange, DatePickerVariation, DatePreference } from './utensil-date-picker'
import {
  formatDate,
  formatDateRange,
  getLocaleDateFormat,
  formatDateInputDigits,
  parseDateInput,
  parseDateInputLenient,
  isDateOutOfRange,
  isAfter,
} from './utensil-date-picker'

// ── Types ──────────────────────────────────────────────────────────────────

export interface DatePreset {
  label: string
  value: Date | DateRange
}

// ── Props ──────────────────────────────────────────────────────────────────

export interface Props<Theme extends ThemeConfig> {
  /** Selected date (single mode) */
  modelValue?: Date | null
  /** Selected date range (range mode) */
  range?: DateRange | null
  /** Selection mode */
  mode?: 'single' | 'range'
  /** Input variation */
  variation?: DatePickerVariation
  /** Placeholder text */
  placeholder?: string
  /** BCP 47 locale string */
  locale?: string
  /** 0 = Sunday, 1 = Monday, etc. */
  weekStartsOn?: number
  /** Number of months to display */
  numberOfMonths?: 1 | 2
  /** Minimum selectable date */
  min?: Date | null
  /** Maximum selectable date */
  max?: Date | null
  /** Function to disable specific dates */
  disabledDates?: (date: Date) => boolean
  /** Show clear button */
  clearable?: boolean
  /** Accent color */
  color?: ColorProp<Theme>
  /** Scale */
  scale?: ScaleProp
  /** Whether the picker is disabled */
  disabled?: boolean
  /** Popover placement */
  placement?: PopoverPlacement
  /** Accessible label */
  ariaLabel?: string
  /** Quick selection presets */
  presets?: DatePreset[]
  /** Trigger icon */
  triggerIcon?: IconProp<Theme>
  /** Label text */
  label?: string
  /** Label placement */
  labelPlacement?: 'block' | 'inline'
  /** Input size */
  height?: 'normal' | 'large'
  /** How to interpret 2-digit years: 'past' (79→1979), 'future' (79→2079), or unset for auto */
  datePreference?: DatePreference
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  modelValue: null,
  range: null,
  mode: 'single',
  variation: 'surface',
  placeholder: 'Select date',
  locale: () => navigator?.language || 'en-US',
  weekStartsOn: 1,
  numberOfMonths: 1,
  min: null,
  max: null,
  clearable: true,
  disabled: false,
  placement: 'bottom-start',
  triggerIcon: 'calendar' as never,
  labelPlacement: 'block',
})

const emit = defineEmits<{
  'update:modelValue': [date: Date | null]
  'update:range': [range: DateRange]
}>()

// ── Refs ───────────────────────────────────────────────────────────────────

const popoverRef = ref<InstanceType<typeof UtensilPopover>>()
const isOpen = computed(() => popoverRef.value?.isOpen ?? false)

// ── Text Input Editing ────────────────────────────────────────────────────

type EditingField = 'date' | 'start' | 'end' | null

const editing = ref<EditingField>(null)
const editText = ref('')
const editInputRef = ref<{ focus(): void; blur(): void; select(): void }>()
const pendingRangeStart = ref<Date | null>(null)
let suppressBlur = false

const dateFormat = computed(() => getLocaleDateFormat(props.locale))

const editPlaceholder = computed(() => {
  const pattern = dateFormat.value.placeholder
  if (props.mode === 'range') {
    return editing.value === 'end' ? `End: ${pattern}` : `Start: ${pattern}`
  }
  return pattern
})

const editingAriaLabel = computed(() => {
  if (props.mode === 'range') {
    return editing.value === 'end' ? 'Enter end date' : 'Enter start date'
  }
  return 'Enter date'
})

function startEditing(initialDigit: string) {
  closePopover()
  editing.value = props.mode === 'single' ? 'date' : 'start'
  editText.value = initialDigit
  nextTick(() => {
    editInputRef.value?.focus()
  })
}

function stopEditing() {
  editing.value = null
  editText.value = ''
  pendingRangeStart.value = null
}

function isDateAcceptable(date: Date): boolean {
  if (isDateOutOfRange(date, props.min, props.max)) return false
  if (props.disabledDates?.(date)) return false
  return true
}

function acceptDate(date: Date) {
  if (props.mode === 'single' || editing.value === 'date') {
    emit('update:modelValue', date)
    stopEditing()
  } else if (editing.value === 'start') {
    pendingRangeStart.value = date
    suppressBlur = true
    editing.value = 'end'
    editText.value = ''
    nextTick(() => {
      editInputRef.value?.focus()
    })
  } else if (editing.value === 'end') {
    const start = pendingRangeStart.value!
    const end = date
    if (isAfter(start, end)) {
      emit('update:range', { start: end, end: start })
    } else {
      emit('update:range', { start, end })
    }
    stopEditing()
  }
}

function tryAcceptEdit(): boolean {
  const format = dateFormat.value
  // Try strict parsing first (exact 8 digits)
  const strict = parseDateInput(editText.value, format)
  if (strict && isDateAcceptable(strict)) {
    acceptDate(strict)
    return true
  }
  // Try lenient parsing (variable-width segments, 2-digit year)
  const lenient = parseDateInputLenient(editText.value, format, props.datePreference)
  if (lenient && isDateAcceptable(lenient)) {
    acceptDate(lenient)
    return true
  }
  return false
}

function onEditInput(rawValue: string) {
  const format = dateFormat.value
  const hasNonDigits = /\D/.test(rawValue)

  if (hasNonDigits) {
    // User is typing with separators — let them type freely
    editText.value = rawValue
  } else {
    // Pure digits: auto-format with locale separators
    const digits = rawValue.slice(0, format.maxDigits)
    editText.value = formatDateInputDigits(digits, format)
  }

  // Auto-accept only on strict 8-digit match
  const digits = editText.value.replace(/\D/g, '')
  if (digits.length === format.maxDigits) {
    const parsed = parseDateInput(editText.value, format)
    if (parsed && isDateAcceptable(parsed)) {
      acceptDate(parsed)
    }
  }
}

function onEditKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    stopEditing()
  } else if (event.key === 'Enter' || event.key === 'Tab') {
    event.preventDefault()
    if (!tryAcceptEdit()) {
      stopEditing()
    }
  }
}

function onEditBlur() {
  if (suppressBlur) {
    suppressBlur = false
    return
  }
  if (!tryAcceptEdit()) {
    stopEditing()
  }
}

// ── Computed ───────────────────────────────────────────────────────────────

const hasValue = computed(() => {
  if (props.mode === 'single') return !!props.modelValue
  return !!props.range?.start
})

const formattedValue = computed(() => {
  if (props.mode === 'single') {
    return props.modelValue ? formatDate(props.modelValue, props.locale) : ''
  }
  return props.range ? formatDateRange(props.range, props.locale) : ''
})

const hasPresets = computed(() => props.presets && props.presets.length > 0)
const selectedPreset = ref<string>()

// ── Selection Handlers ─────────────────────────────────────────────────────

function onSingleSelect(date: Date | null, close: () => void) {
  emit('update:modelValue', date)
  if (date) close()
}

function onRangeSelect(range: DateRange, close: () => void) {
  emit('update:range', range)
  // Close when both start and end are selected
  if (range.start && range.end) close()
}

function clearValue() {
  if (props.mode === 'single') {
    emit('update:modelValue', null)
  } else {
    emit('update:range', { start: null, end: null })
  }
}

function applyPreset(preset: DatePreset, close: () => void) {
  if (preset.value instanceof Date) {
    emit('update:modelValue', preset.value)
    close()
  } else {
    emit('update:range', preset.value)
    if (preset.value.start && preset.value.end) close()
  }
}

function onPresetSelect(label: string | undefined, close: () => void) {
  if (!label) return
  const preset = props.presets?.find((p) => p.label === label)
  if (preset) {
    selectedPreset.value = label
    applyPreset(preset, close)
  }
}

// ── Popover Controls ───────────────────────────────────────────────────────

function openPopover() {
  popoverRef.value?.open()
}

function closePopover() {
  popoverRef.value?.close()
}

function onTriggerClick(event: MouseEvent, toggle: () => void) {
  if (props.disabled || editing.value) return
  // Don't toggle if clicking the clear button
  const target = event.target as HTMLElement
  if (target.closest('.utensil-date-picker-clear')) return
  toggle()
}

function handleTriggerKeydown(event: KeyboardEvent, toggle: () => void) {
  if (props.disabled || editing.value) return

  // Digit key on the readonly display → enter text edit mode
  if (/^\d$/.test(event.key)) {
    event.preventDefault()
    startEditing(event.key)
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggle()
  }
}

// ── Public API ─────────────────────────────────────────────────────────────

defineExpose({
  open: () => popoverRef.value?.open(),
  close: () => popoverRef.value?.close(),
  toggle: () => popoverRef.value?.toggle(),
  isOpen,
})
</script>

<style scoped>
@layer utensil {
  .utensil-date-picker {
    --utensil-popover-background: var(--panel-solid);
    --utensil-popover-radius: var(--radius-3);
    --utensil-popover-shadow: var(--shadow-border-3);
    --utensil-popover-padding: 0;
  }

  /* ── Trigger ─────────────────────────────────────────────────────── */

  .utensil-date-picker-trigger {
    cursor: pointer;
  }

  .utensil-date-picker-trigger:not(.editing) :deep(input) {
    cursor: pointer;
  }

  /* ── Clear button ────────────────────────────────────────────────── */

  .utensil-date-picker-clear {
    visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--space-4);
    height: var(--space-4);
    border: none;
    background: transparent;
    color: var(--pencil-a11);
    border-radius: var(--radius-2);
    cursor: pointer;
    font-size: var(--font-size-1);
    line-height: normal;
    transition:
      background-color 0.1s ease,
      color 0.1s ease;

    &.visible {
      visibility: visible;
    }
  }

  .utensil-date-picker-clear:hover {
    background: var(--pencil-a3);
    color: var(--pencil-12);
  }

  /* ── Panel ───────────────────────────────────────────────────────── */

  .utensil-date-picker-panel {
    width: min-content;
    padding: var(--space-3);
  }

  /* ── Presets ──────────────────────────────────────────────────────── */

  .utensil-date-picker-presets {
    --utensil-button-font-size: var(--font-size-1);

    padding-top: var(--space-3);
    border-top: 1px solid var(--pencil-a6);
    margin-top: var(--space-3);
    justify-content: center;
  }
}
</style>
