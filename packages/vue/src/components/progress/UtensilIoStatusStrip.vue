<template generic="Theme extends ThemeConfig">
  <UtensilIoStrip
    class="utensil-io-status-strip"
    :active="active"
    :progress="progress"
    :color="color"
    :endColor="endColor"
    :ariaLabel="label"
    :settleMs="settleMs"
  />
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed, ref, watch } from 'vue'
import type { ColorProp, ThemeConfig } from '../../theme/utensil-theme'
import UtensilIoStrip from './UtensilIoStrip.vue'

// One strip for an app's io state: loading and saving share it, saving wins the
// color and label while both run, and an error tints whatever is showing.
export interface Props<Theme extends ThemeConfig> {
  loading?: boolean
  saving?: boolean
  /** How far along the showing operation is, 0–1 — the fill follows it instead of creeping. */
  progress?: number
  /** Overrides the strip color with `errorColor` while true — set while a request has failed. */
  error?: boolean
  loadingColor?: ColorProp<Theme>
  /** Second gradient color while loading. Defaults to `loadingColor` (solid). */
  loadingEndColor?: ColorProp<Theme>
  /** Defaults to `loadingColor`. */
  savingColor?: ColorProp<Theme>
  /** Defaults to `loadingColor`. */
  errorColor?: ColorProp<Theme>
  loadingLabel?: string
  savingLabel?: string
  /** Forwarded to the strip so a burst of requests reads as one operation. */
  settleMs?: number
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  loading: false,
  saving: false,
  error: false,
  loadingColor: 'pen',
  loadingLabel: 'Loading',
  savingLabel: 'Saving changes',
  settleMs: 300,
})

const active = computed(() => props.loading || props.saving)

// What the strip is presenting — held when both flags drop so the finish sweep
// keeps the color of the operation that just completed
const showing = ref<'loading' | 'saving'>('loading')

watch(
  [() => props.loading, () => props.saving],
  ([loading, saving]) => {
    if (saving) {
      showing.value = 'saving'
    } else if (loading) {
      showing.value = 'loading'
    }
  },
  { immediate: true },
)

const color = computed<ColorProp<Theme>>(() => {
  if (props.error) {
    return props.errorColor ?? props.loadingColor
  }

  if (showing.value === 'saving') {
    return props.savingColor ?? props.loadingColor
  }

  return props.loadingColor
})

const endColor = computed<ColorProp<Theme> | undefined>(() =>
  showing.value === 'loading' && !props.error ? props.loadingEndColor : undefined,
)

const label = computed(() => (showing.value === 'saving' ? props.savingLabel : props.loadingLabel))
</script>
