<template>
  <div
    class="utensil-image-progress"
    role="progressbar"
    :aria-valuenow="clampedValue"
    :aria-valuemin="0"
    :aria-valuemax="100"
    :aria-label="ariaLabel"
  >
    <div class="layer" :style="{ backgroundImage }"></div>
    <div
      class="layer remaining"
      :style="{ backgroundImage, filter: remainingFilter, clipPath: `inset(0 0 0 ${clampedValue}%)` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Progress rendered on an image: the image at full color is the completed
// portion, and a copy rendered through a CSS filter covers the remainder.
// filter (unlike backdrop-filter) processes only the copy's own pixels, so
// the image's transparency is preserved and whatever the component sits over
// shows through untouched.

interface Props {
  src: string
  // Percent complete, 0-100
  value?: number
  // CSS filter rendering the incomplete portion of the image
  remainingFilter?: string
  ariaLabel?: string
}

const {
  src,
  value = 0,
  remainingFilter = 'saturate(0.1) brightness(1.15)',
  ariaLabel = 'Progress',
} = defineProps<Props>()

const clampedValue = computed(() => Math.min(100, Math.max(0, value)))

const backgroundImage = computed(() => `url('${src}')`)
</script>

<style scoped>
@layer utensil {
  /* The parent sizes the component — the image stretches to fill it */
  .utensil-image-progress {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .layer {
    position: absolute;
    inset: 0;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
}
</style>
