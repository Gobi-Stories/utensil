<template>
  <div
    class="utensil-skeleton"
    :class="{ rounded, circle }"
    :style="skeletonStyle"
    role="status"
    :aria-label="ariaLabel"
    aria-busy="true"
  >
    <div class="shimmer"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  width?: string
  height?: string
  ariaLabel?: string
  rounded?: boolean
  circle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  ariaLabel: 'Loading...',
})

const skeletonStyle = computed(() => ({
  width: props.width,
  height: props.height,
}))
</script>

<style scoped>
@layer utensil {
  .utensil-skeleton {
    position: relative;
    overflow: hidden;
    background: var(--pencil-a3);
    border-radius: var(--radius-2);
    min-height: var(--space-4);
  }

  .utensil-skeleton.rounded {
    border-radius: var(--radius-rounded);
  }

  .utensil-skeleton.circle {
    border-radius: var(--radius-full);
    aspect-ratio: 1;
  }

  .utensil-skeleton .shimmer {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--pencil-a2) 40%,
      var(--pencil-a4) 50%,
      var(--pencil-a2) 60%,
      transparent 100%
    );
    animation: utensil-skeleton-shimmer 1.8s ease-in-out infinite;
  }

  @keyframes utensil-skeleton-shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .utensil-reduced-motion .utensil-skeleton .shimmer {
    animation: none;
    background: var(--pencil-a2);
  }
}
</style>
