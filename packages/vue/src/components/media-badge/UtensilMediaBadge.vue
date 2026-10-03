<template>
  <UtensilBadge
    class="utensil-media-badge"
    :icon="mediaTypeIcon"
    :label="capitalize(mediaType)"
    :scale="scale"
    :radiusScale="radiusScale"
    :rounded="rounded"
    :squared="squared"
    variation="overlay"
  >
    <slot />
  </UtensilBadge>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RadiusScaleProp, ScaleProp } from '../../theme/utensil-theme'
import UtensilBadge from '../badge/UtensilBadge.vue'
import { mediaTypeToIcon } from '../../lib/media-type/media-type'

interface Props {
  mediaType: string
  scale?: ScaleProp
  radiusScale?: RadiusScaleProp
  rounded?: boolean
  squared?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  scale: 1,
})

const mediaTypeIcon = computed(() => mediaTypeToIcon(props.mediaType))

function capitalize(value: string): string {
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1)
}
</script>

<style>
@layer utensil {
  .utensil-media-badge.utensil-badge {
    justify-content: flex-start;
  }
}
</style>
