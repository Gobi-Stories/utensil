<template>
  <slot v-if="ready" />
  <slot v-else name="placeholder" />
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'

/**
 * Defers mounting its content until the browser has painted, so cheap UI (the
 * navigation, page chrome) isn't held behind a heavy subtree's first render.
 * The placeholder slot renders in its place while it waits.
 */
interface Props {
  /** Mount the content; turning this off unmounts it immediately */
  active?: boolean
  /** Painted frames to let through before mounting */
  frames?: number
}

const { active = true, frames = 1 } = defineProps<Props>()

const ready = ref(false)
let pendingFrame: number | undefined

function cancelPending() {
  if (pendingFrame !== undefined) {
    cancelAnimationFrame(pendingFrame)
    pendingFrame = undefined
  }
}

watch(
  () => active,
  (value) => {
    cancelPending()

    if (!value) {
      ready.value = false
      return
    }

    // rAF fires before the pending frame paints, so frames + 1 callbacks land
    // the mount just after the requested number of painted frames.
    let remaining = frames + 1
    const step = () => {
      remaining -= 1
      if (remaining <= 0) {
        pendingFrame = undefined
        ready.value = true
        return
      }
      pendingFrame = requestAnimationFrame(step)
    }
    pendingFrame = requestAnimationFrame(step)
  },
  { immediate: true },
)

onUnmounted(cancelPending)
</script>
