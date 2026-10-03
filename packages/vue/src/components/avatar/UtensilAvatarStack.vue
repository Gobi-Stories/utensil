<template>
  <div class="utensil-avatar-stack" :style="stackStyle">
    <slot></slot>
    <slot name="append"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import type { ScaleProp } from '../../theme/utensil-theme'
import type { AvatarRadius } from './utensil-avatar-stack'
import { UtensilAvatarStackContextKey } from './utensil-avatar-stack'

interface Props {
  overlap?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  /** Shared radius for all stacked avatars */
  radius?: AvatarRadius
  /** Shared scale for all stacked avatars */
  scale?: ScaleProp
}

const { overlap = 2, radius = 'full', scale = 1 } = defineProps<Props>()

const stackStyle = computed(() => ({
  '--stack-overlap': `calc(-1 * var(--space-${overlap}))`,
}))

provide(UtensilAvatarStackContextKey, {
  radius: computed(() => radius),
  scale: computed(() => scale),
})
</script>

<style scoped>
@layer utensil {
  .utensil-avatar-stack {
    --avatar-text-color: var(--pen-contrast);

    display: flex;
    align-items: center;
  }
}
</style>

<style>
@layer utensil {
  .utensil-avatar-stack > .utensil-avatar {
    margin-left: var(--stack-overlap);
    border: 2px solid var(--background);
  }

  .utensil-avatar-stack > .utensil-avatar:first-child {
    margin-left: 0;
  }
}
</style>
