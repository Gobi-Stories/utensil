<template>
  <g v-if="crosshair" class="hover-markers">
    <line class="crosshair" :x1="crosshair.x" :x2="crosshair.x" :y1="crosshair.y1" :y2="crosshair.y2" />
    <circle
      v-for="(point, markerIndex) in points"
      :key="'hover-' + markerIndex"
      :cx="point.x"
      :cy="point.y"
      r="4.5"
      :fill="point.color"
    />
  </g>

  <g class="hover-columns">
    <rect
      v-for="column in columns"
      :key="'col-' + column.index"
      :x="column.x"
      :y="top"
      :width="column.width"
      :height="height"
      fill="transparent"
      @pointerenter="emit('hover', column.index)"
    />
  </g>
</template>

<script setup lang="ts">
import type { HoverColumn, HoverPoint } from './use-chart-hover'

export interface Props {
  columns: HoverColumn[]
  crosshair: { x: number; y1: number; y2: number } | null
  /** The hovered point of each series */
  points: HoverPoint[]
  /** The plot's top and height, which the hover columns span */
  top: number
  height: number
}

defineProps<Props>()

const emit = defineEmits<{
  /** A pointer entered a point's column */
  hover: [index: number]
}>()
</script>

<style scoped>
@layer utensil {
  .crosshair {
    stroke: var(--pencil-a7);
    stroke-width: 1;
  }

  .utensil-high-contrast .crosshair {
    stroke: var(--pencil-a9);
  }
}
</style>
