<template>
  <svg class="donut-svg" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
    <circle class="donut-track" cx="100" cy="100" r="70" />
    <g transform="rotate(-90 100 100)">
      <circle
        v-for="(segment, index) in donutSegments"
        :key="'donut-' + index"
        class="donut-segment"
        :class="{ animated: animate }"
        cx="100"
        cy="100"
        r="70"
        pathLength="100"
        fill="none"
        :stroke="segment.color"
        stroke-width="24"
        :stroke-dasharray="segment.dashArray"
        :stroke-dashoffset="segment.dashOffset"
      />
    </g>
    <text v-if="donutTotal > 0" class="donut-center-text" x="100" y="100" text-anchor="middle">
      {{ donutTotal }}
    </text>
    <text v-if="donutTotal > 0" class="donut-center-label" x="100" y="118" text-anchor="middle">total</text>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type DataSeries, getSeriesColor } from './utensil-data-viz'

export interface Props {
  series: DataSeries[]
  animate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  animate: true,
})

const donutTotal = computed(() => {
  if (props.series.length === 0) return 0
  return props.series.reduce((sum, s) => sum + (s.values[0] ?? 0), 0)
})

// Measured in hundredths of the ring (its pathLength), so the draw-in from 0 covers each segment exactly
const donutSegments = computed(() => {
  if (donutTotal.value === 0) return []
  const gap = (4 / (2 * Math.PI * 70)) * 100
  let cumulative = 0

  return props.series.map((s, index) => {
    const value = s.values[0] ?? 0
    const proportion = (value / donutTotal.value) * 100
    const arcLength = Math.max(proportion - gap, 0)
    const segment = {
      color: getSeriesColor(index, s),
      dashArray: `${arcLength} ${100 - arcLength}`,
      dashOffset: String(-cumulative - gap / 2),
    }
    cumulative += proportion
    return segment
  })
})
</script>

<style scoped>
@layer utensil {
  .donut-svg {
    flex-grow: 1;
    max-width: 60%;
    align-self: center;
  }

  .donut-track {
    fill: none;
    stroke: var(--pencil-a3);
    stroke-width: 24;
  }

  .donut-segment.animated {
    animation: utensil-data-viz-donut-fill 0.8s ease-out both;
  }

  .donut-center-text {
    font-size: 24px;
    font-weight: 700;
    fill: var(--pencil-a11);
  }

  .donut-center-label {
    font-size: 11px;
    fill: var(--pencil-a11);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  @keyframes utensil-data-viz-donut-fill {
    from {
      stroke-dasharray: 0 100;
      stroke-dashoffset: 0;
    }
  }

  .utensil-high-contrast .donut-track {
    stroke: var(--pencil-a5);
  }

  .utensil-reduced-motion .donut-segment.animated {
    animation: none;
  }
}
</style>
