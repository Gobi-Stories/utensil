<template>
  <div ref="root" class="utensil-entrance" :class="{ ready, disabled: !enabled }" :style="entranceStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

interface Props {
  /** Animation duration in milliseconds */
  duration?: number
  /** Delay between each child in milliseconds */
  stagger?: number
  /** Initial delay before first child animates in milliseconds */
  delay?: number
  /** Vertical translation distance in pixels */
  distance?: number
  /** Whether the entrance animation is enabled */
  enabled?: boolean
}

const { duration = 500, stagger = 120, delay = 80, distance = 16, enabled = true } = defineProps<Props>()

const root = ref<HTMLElement>()
const ready = ref(false)

const entranceStyle = computed(() => ({
  '--entrance-duration': `${duration}ms`,
  '--entrance-stagger': `${stagger}ms`,
  '--entrance-delay': `${delay}ms`,
  '--entrance-distance': `${distance}px`,
}))

function applyIndexes() {
  if (!root.value) return
  const children = root.value.children
  for (let i = 0; i < children.length; i++) {
    const child = children[i] as HTMLElement
    child.style.setProperty('--entrance-index', String(i))
  }
}

let observer: MutationObserver | undefined

onMounted(() => {
  applyIndexes()

  observer = new MutationObserver(() => {
    applyIndexes()
  })

  if (root.value) {
    observer.observe(root.value, { childList: true })
  }

  if (enabled) {
    nextTick(() => {
      ready.value = true
    })
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
})

function replay() {
  ready.value = false
  applyIndexes()
  nextTick(() => {
    // Force reflow so the browser registers the animation removal before re-applying
    void root.value?.offsetHeight
    ready.value = true
  })
}

watch(
  () => enabled,
  (newEnabled) => {
    if (newEnabled) {
      replay()
    }
  },
)

defineExpose({ replay })
</script>

<style>
@layer utensil {
  .utensil-entrance > * {
    opacity: 0;
  }

  .utensil-entrance.ready > * {
    animation: utensil-entrance-fade-up var(--entrance-duration)
      calc(var(--entrance-delay) + var(--entrance-stagger) * var(--entrance-index, 0)) both;
  }

  .utensil-reduced-motion .utensil-entrance > *,
  .utensil-entrance.disabled > * {
    opacity: 1;
    animation: none;
  }

  @keyframes utensil-entrance-fade-up {
    from {
      opacity: 0;
      transform: translateY(var(--entrance-distance));
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
