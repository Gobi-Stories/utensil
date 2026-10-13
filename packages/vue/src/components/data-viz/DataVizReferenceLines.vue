<template>
  <g v-if="lines.length" class="reference-lines">
    <template v-for="(line, lineIndex) in lines" :key="'ref-' + lineIndex">
      <line
        :x1="x1"
        :x2="x2"
        :y1="getY(line.value)"
        :y2="getY(line.value)"
        class="reference-line"
        :style="line.color ? { stroke: line.color } : undefined"
        stroke-width="1.5"
        stroke-dasharray="3 5"
        stroke-linecap="round"
      />
      <text
        v-if="line.label"
        class="reference-label"
        :x="x2"
        :y="getY(line.value) - 4"
        text-anchor="end"
        :style="line.color ? { fill: line.color } : undefined"
      >
        {{ line.label }}
      </text>
    </template>
  </g>
</template>

<script setup lang="ts">
import type { ReferenceLine } from './utensil-data-viz'

export interface Props {
  lines: ReferenceLine[]
  /** Where the lines start and end across the plot */
  x1: number
  x2: number
  getY: (value: number) => number
}

defineProps<Props>()
</script>

<style scoped>
@layer utensil {
  .reference-line {
    stroke: var(--pencil-a8);
  }

  .reference-label {
    font-size: 9px;
    font-weight: 500;
    fill: var(--pencil-a11);
  }

  .utensil-high-contrast .reference-line {
    stroke: var(--pencil-a10);
  }

  .utensil-high-contrast .reference-label {
    fill: var(--pencil-12);
  }
}
</style>
