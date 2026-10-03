<template>
  <div ref="listboxRef" class="utensil-listbox" role="listbox" :aria-label="ariaLabel">
    <slot :focused-value="currentFocusedValue" :set-focused-value="setFocusedValue" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import { useFocusNavigation } from '../../composables/useFocusNavigation'

interface Props {
  /** Array of navigable values for keyboard navigation */
  values?: string[]
  /** Currently focused value (controlled) */
  focusedValue?: string | null
  /** Accessible label for screen readers */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  values: () => [],
  focusedValue: null,
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

// Sync with prop changes - only when value changes to a specific value
// Don't clear focus when value becomes null (element without data-value may be focused)
watch(
  () => props.focusedValue,
  (value) => {
    if (value !== null && value !== currentFocusedValue.value) {
      // Find the element with matching data-value and focus it
      const items = getItems()
      const target = items.find((el) => el.dataset.value === value)
      if (target) {
        setFocused(target)
      }
    }
  },
)

function setFocusedValue(value: string | null) {
  if (value === null) {
    clearFocus()
  } else {
    const items = getItems()
    const target = items.find((el) => el.dataset.value === value)
    if (target) {
      setFocused(target)
    }
  }
  emit('update:focusedValue', value)
  scrollToFocused()
}

function focusNext() {
  navFocusNext()
  emit('update:focusedValue', currentFocusedValue.value)
  scrollToFocused()
}

function focusPrev() {
  navFocusPrev()
  emit('update:focusedValue', currentFocusedValue.value)
  scrollToFocused()
}

function focusFirst() {
  navFocusFirst()
  emit('update:focusedValue', currentFocusedValue.value)
  scrollToFocused()
}

function focusLast() {
  navFocusLast()
  emit('update:focusedValue', currentFocusedValue.value)
  scrollToFocused()
}

function focusValue(value: string | null) {
  setFocusedValue(value)
}

function scrollToFocused() {
  nextTick(() => {
    const focused = listboxRef.value?.querySelector('[data-focused]')
    focused?.scrollIntoView({ block: 'nearest' })
  })
}

function reset() {
  clearFocus()
  emit('update:focusedValue', null)
}

defineExpose({
  focusedValue: currentFocusedValue,
  setFocusedValue,
  focusNext,
  focusPrev,
  focusFirst,
  focusLast,
  focusValue,
  reset,
})
</script>

<style scoped>
@layer utensil {
  .utensil-listbox {
    display: flex;
    flex-direction: column;
    max-height: 240px;
    overflow-y: auto;
  }
}
</style>
