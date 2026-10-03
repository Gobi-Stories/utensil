<template>
  <transition
    :name="enabled ? name : 'noop'"
    :css="animated"
    :class="{ 'immediate-in': !shouldFadeIn }"
    @afterEnter="contentFadeEnded"
  >
    <slot v-if="internalShow" />
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  enabled?: boolean
  show?: boolean
  name?: string
  once?: boolean
  fadeIn?: boolean
  fadeOut?: boolean
  inDelay?: number
  outDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  enabled: true,
  show: false,
  name: 'utensil-fader',
  once: false,
  fadeIn: true,
  fadeOut: true,
  inDelay: 0,
  outDelay: 0,
})

const contentFaded = ref(false)
const internalShow = ref(false)
// A hide without fade must drop the content in the same update — a css
// transition holds the leaving element for two frames even with
// transition: none
const animated = ref(props.enabled)
const mountedAt = ref(0)
const outDelayTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const shouldFadeIn = ref(props.fadeIn)

onMounted(() => {
  mountedAt.value = Date.now()
})

onUnmounted(() => {
  clearOutDelayTimer()
})

function clearOutDelayTimer() {
  if (outDelayTimer.value !== null) {
    clearTimeout(outDelayTimer.value)
    outDelayTimer.value = null
  }
}

watch(
  () => props.show,
  (newValue: boolean) => {
    if (newValue) {
      // Showing - cancel any pending hide
      clearOutDelayTimer()

      // Determine if we should fade in based on inDelay
      if (props.enabled && props.inDelay > 0) {
        if (mountedAt.value === 0) {
          // Component not yet mounted - don't fade
          shouldFadeIn.value = false
        } else {
          const elapsed = Date.now() - mountedAt.value
          shouldFadeIn.value = props.fadeIn && elapsed >= props.inDelay
        }
      } else {
        shouldFadeIn.value = props.fadeIn
      }

      animated.value = props.enabled
      internalShow.value = true
    } else {
      // Hiding
      contentFaded.value = false
      animated.value = props.enabled && props.fadeOut

      if (props.enabled && props.outDelay > 0) {
        clearOutDelayTimer()
        outDelayTimer.value = setTimeout(() => {
          internalShow.value = false
          outDelayTimer.value = null
        }, props.outDelay)
      } else {
        internalShow.value = false
      }
    }
  },
  { immediate: true },
)

// If enabled changes to false while we have an outDelay timer, apply immediately
watch(
  () => props.enabled,
  (enabled) => {
    if (!enabled && outDelayTimer.value !== null) {
      clearOutDelayTimer()
      animated.value = false
      internalShow.value = props.show
    }
  },
)

function contentFadeEnded() {
  if (props.once) {
    contentFaded.value = true
  }
}
</script>

<style scoped>
@layer utensil {
  .utensil-fader-enter-active,
  .utensil-fader-leave-active {
    transition: opacity 0.2s ease;
  }

  .utensil-fader-enter-active.immediate-in {
    transition: none;
  }

  .utensil-fader-enter-to,
  .utensil-fader-leave-from {
    opacity: 1;
  }

  .utensil-fader-enter-from,
  .utensil-fader-leave-to {
    opacity: 0;
  }
}
</style>
