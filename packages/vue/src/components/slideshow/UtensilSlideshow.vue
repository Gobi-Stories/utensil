<template>
  <slot v-bind="slotScope" />
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useKeys } from '../../composables/use-keys'

interface Props {
  length: number
  modelValue?: number
  windowSize?: number
  nearEndThreshold?: number
}

const { length, modelValue = 0, windowSize = 3, nearEndThreshold = 5 } = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [index: number]
  'near-end': [index: number]
}>()

const current = computed(() => Math.max(0, Math.min(length - 1, modelValue)))
const hasNext = computed(() => current.value < length - 1)
const hasPrevious = computed(() => current.value > 0)

const window = computed(() => {
  if (length === 0) return []
  const size = Math.max(1, windowSize)
  const halfBack = Math.floor((size - 1) / 2)
  let start = current.value - halfBack
  let end = start + size - 1
  if (start < 0) {
    end += -start
    start = 0
  }
  if (end > length - 1) {
    start -= end - (length - 1)
    end = length - 1
  }
  start = Math.max(0, start)
  const indexes: number[] = []
  for (let i = start; i <= end; i++) {
    indexes.push(i)
  }
  return indexes
})

function setIndex(next: number) {
  const clamped = Math.max(0, Math.min(length - 1, next))
  if (clamped !== modelValue) {
    emit('update:modelValue', clamped)
  }
}

function next() {
  if (hasNext.value) setIndex(current.value + 1)
}

function previous() {
  if (hasPrevious.value) setIndex(current.value - 1)
}

watch(
  () => current.value,
  (idx) => {
    if (length > 0 && idx >= length - nearEndThreshold) {
      emit('near-end', idx)
    }
  },
  { immediate: true },
)

watch(
  () => length,
  (len) => {
    if (len > 0 && current.value >= len - nearEndThreshold) {
      emit('near-end', current.value)
    }
  },
)

// The consumer binds these on the element that owns the slideshow's keys. At either end the
// arrow is left to the page.
const { onKeydown } = useKeys({
  ArrowRight: () => {
    if (!hasNext.value) {
      return false
    }

    next()
  },
  ArrowLeft: () => {
    if (!hasPrevious.value) {
      return false
    }

    previous()
  },
})

const slotScope = computed(() => ({
  current: current.value,
  window: window.value,
  hasNext: hasNext.value,
  hasPrevious: hasPrevious.value,
  next,
  previous,
  onKeydown,
}))

defineExpose({ next, previous, onKeydown })
</script>
