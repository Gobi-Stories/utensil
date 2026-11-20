<template>
  <div
    ref="listboxRef"
    class="utensil-listbox"
    :class="{ full }"
    role="listbox"
    :aria-label="ariaLabelledby ? undefined : ariaLabel"
    :aria-labelledby="ariaLabelledby"
    :aria-multiselectable="multiselectable || undefined"
    @mousedown="focusOnPress"
  >
    <slot :focused-value="currentFocusedValue" :set-focused-value="setFocusedValue" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed, onBeforeUnmount } from 'vue'
import { useFocusNavigation } from '../../composables/useFocusNavigation'

export interface Props {
  /** Currently focused value (controlled) */
  focusedValue?: string | null
  /** Accessible label for screen readers */
  ariaLabel?: string
  /** Id of the element that names the listbox, such as a visible label; takes precedence over ariaLabel */
  ariaLabelledby?: string
  /** Whether more than one option can be selected */
  multiselectable?: boolean
  /** Shows every option, however many, rather than scrolling past the maximum height */
  full?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  focusedValue: null,
  multiselectable: false,
  full: false,
})

const emit = defineEmits<{
  'update:focusedValue': [value: string | null]
}>()

const listboxRef = ref<HTMLElement>()

const {
  focusedElement,
  setFocused,
  clearFocus,
  focusNext: navFocusNext,
  focusPrev: navFocusPrev,
  focusFirst: navFocusFirst,
  focusLast: navFocusLast,
  getItems,
} = useFocusNavigation(listboxRef, { orientation: 'vertical', wrap: false })

// Derive focused value from focused element's data-value attribute
const currentFocusedValue = computed(() => {
  return focusedElement.value?.dataset.value ?? null
})

// The focused item's id, for the aria-activedescendant of the element that keeps DOM focus
const activeDescendant = computed(() => focusedElement.value?.id || null)

// Focuses the item with a value, scrolled into view; a value with no focusable item, such as a disabled option's,
// leaves focus where it is
function focusItemByValue(value: string) {
  const target = getItems().find((el) => el.dataset.value === value)
  if (!target) return false
  setFocused(target)
  scrollToFocused()
  return true
}

// Follows the controlled value, including the one it starts with. A null value leaves focus as it is, since an item
// without a data-value may be focused.
watch(
  () => props.focusedValue,
  (value) => {
    if (value === null || value === currentFocusedValue.value || focusItemByValue(value)) return
    // Not rendered yet, as on mount: try once it is, unless the value has moved on
    nextTick(() => {
      if (props.focusedValue === value && value !== currentFocusedValue.value) focusItemByValue(value)
    })
  },
  { immediate: true },
)

function setFocusedValue(value: string | null) {
  if (value === null) {
    clearFocus()
  } else if (!focusItemByValue(value)) {
    return
  }
  emit('update:focusedValue', value)
}

function afterMove() {
  emit('update:focusedValue', currentFocusedValue.value)
  scrollToFocused()
}

function focusNext() {
  navFocusNext()
  afterMove()
}

function focusPrev() {
  navFocusPrev()
  afterMove()
}

function focusFirst() {
  navFocusFirst()
  afterMove()
}

function focusLast() {
  navFocusLast()
  afterMove()
}

function scrollToFocused() {
  nextTick(() => focusedElement.value?.scrollIntoView({ block: 'nearest' }))
}

// Type-ahead: the characters typed in quick succession, matched against the start of each item's text
const TYPEAHEAD_RESET = 500
let typed = ''
let typedTimeout: ReturnType<typeof setTimeout> | null = null

/**
 * Focuses the next item whose text starts with what has been typed. Typing one character again moves on through the
 * items that start with it. Returns whether an item matched.
 */
function typeahead(character: string) {
  if (typedTimeout) clearTimeout(typedTimeout)
  typedTimeout = setTimeout(() => (typed = ''), TYPEAHEAD_RESET)
  typed += character.toLowerCase()

  const items = getItems()
  const repeated = [...typed].every((c) => c === typed[0])
  const search = repeated ? typed[0] : typed
  const current = focusedElement.value ? items.indexOf(focusedElement.value) : -1
  // A repeated character, or a new search, starts after the focused item; a longer search may stay on it
  const start = repeated || typed.length === 1 ? current + 1 : Math.max(current, 0)
  const ordered = [...items.slice(start), ...items.slice(0, start)]
  const match = ordered.find((el) => (el.textContent ?? '').trim().toLowerCase().startsWith(search))
  if (!match) return false
  setFocused(match)
  afterMove()
  return true
}

// Options cancel their mousedown so a host such as a select's trigger keeps focus. A listbox that takes focus itself
// is its own host, so a press inside it focuses it, and the keyboard, type-ahead included, carries on from there.
// focusVisible: false keeps a press from showing the keyboard's focus ring; TypeScript's DOM types don't have it yet
const pressFocus: FocusOptions & { focusVisible?: boolean } = { preventScroll: true, focusVisible: false }

function focusOnPress() {
  const el = listboxRef.value
  if (el?.hasAttribute('tabindex') && !el.contains(document.activeElement)) el.focus(pressFocus)
}

function reset() {
  clearFocus()
  typed = ''
  emit('update:focusedValue', null)
}

onBeforeUnmount(() => {
  if (typedTimeout) clearTimeout(typedTimeout)
})

defineExpose({
  focusedValue: currentFocusedValue,
  activeDescendant,
  setFocusedValue,
  focusNext,
  focusPrev,
  focusFirst,
  focusLast,
  typeahead,
  reset,
})
</script>

<style scoped>
@layer utensil {
  .utensil-listbox {
    display: flex;
    flex-direction: column;
    max-height: var(--utensil-listbox-max-height, calc(240px * var(--scale, 1)));
    overflow-y: auto;
    outline: 2px solid transparent;
    outline-offset: 2px;
  }

  /* A ring for a listbox that takes focus itself, rather than leaving it on a host such as a select's trigger */
  .utensil-listbox:focus-visible {
    outline-color: var(--pen-8);
  }

  .utensil-listbox.full {
    max-height: none;
  }
}
</style>
