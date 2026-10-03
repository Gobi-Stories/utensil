<template>
  <!-- Grid lines -->
  <g v-if="showGrid" class="grid-lines">
    <line
      v-for="(y, index) in gridLines"
      :key="'grid-' + index"
      :x1="padding.left"
      :y1="y"
      :x2="viewBox.width - padding.right"
      :y2="y"
    />
  </g>

  <!-- Y-axis labels -->
  <g class="axis-labels y-axis-labels">
    <text
      v-for="(tick, index) in yAxisTicks"
      :key="'y-' + index"
      :x="padding.left - 8"
      :y="tick.y + 4"
      text-anchor="end"
    >
      {{ tick.label }}
    </text>
  </g>

  <!-- X-axis labels -->
  <g class="axis-labels x-axis-labels">
    <text
      v-for="(label, index) in xAxisLabels"
      :key="'x-' + index"
      :x="label.x"
      :y="viewBox.height - padding.bottom + 18"
      text-anchor="middle"
    >
      {{ label.text }}
    </text>
  </g>
</template>

<script setup lang="ts">
interface AxisTick {
  y: number
  label: string
}

interface AxisLabel {
  x: number
  text: string
}

interface Props {
  showGrid: boolean
  gridLines: number[]
  yAxisTicks: AxisTick[]
  xAxisLabels: AxisLabel[]
  padding: { top: number; right: number; bottom: number; left: number }
  viewBox: { width: number; height: number }
}

defineProps<Props>()
</script>

<style scoped>
@layer utensil {
  .grid-lines line {
    stroke: var(--pencil-a3);
    stroke-width: 1;
  }

  .axis-labels text {
    font-size: 10px;
    fill: var(--pencil-a11);
  }

  .utensil-high-contrast .grid-lines line {
    stroke: var(--pencil-a5);
  }
}
</style>
