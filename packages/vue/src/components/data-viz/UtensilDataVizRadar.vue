<template>
  <svg class="radar-svg" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
    <!-- Web rings -->
    <polygon v-for="(ring, ringIndex) in webRings" :key="'ring-' + ringIndex" class="radar-ring" :points="ring" />

    <!-- Spoke lines -->
    <line
      v-for="(spoke, spokeIndex) in spokes"
      :key="'spoke-' + spokeIndex"
      class="radar-spoke"
      x1="100"
      y1="100"
      :x2="spoke.x"
      :y2="spoke.y"
    />

    <!-- Series polygons -->
    <polygon
      v-for="(polygon, seriesIndex) in seriesPolygons"
      :key="'series-' + seriesIndex"
      :points="polygon.points"
      :stroke="polygon.color"
      :fill="polygon.color"
      fill-opacity="0.12"
      stroke-width="2"
      stroke-linejoin="round"
      :class="{ animated: animate }"
      :style="animate ? { animationDelay: `${seriesIndex * 150}ms` } : undefined"
    />

    <!-- Series dots -->
    <circle
      v-for="(dot, dotIndex) in seriesDots"
      :key="'dot-' + dotIndex"
      :cx="dot.x"
      :cy="dot.y"
      r="3"
      :fill="dot.color"
      :class="{ animated: animate }"
      :style="animate ? { animationDelay: `${dotIndex * 60}ms` } : undefined"
    />

    <!-- Axis labels -->
    <text
      v-for="(label, labelIndex) in axisLabels"
      :key="'label-' + labelIndex"
      class="radar-label"
      :x="label.x"
      :y="label.y"
      text-anchor="middle"
      dominant-baseline="middle"
    >
      {{ label.text }}
    </text>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type DataSeries, getSeriesColor } from './utensil-data-viz'

interface Props {
  series: DataSeries[]
  labels?: string[]
  animate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  animate: true,
})

const CENTER = 100
const RADIUS = 70
const LABEL_RADIUS = RADIUS + 18
const RING_COUNT = 4

const axisCount = computed(() => {
  if (props.series.length === 0) return 0
  return Math.max(...props.series.map((s) => s.values.length))
})

const maxValue = computed(() => {
  const all = props.series.flatMap((s) => s.values)
  return Math.max(...all, 1)
})

function getAngle(index: number): number {
  return (2 * Math.PI * index) / axisCount.value - Math.PI / 2
}

function getPoint(index: number, radius: number): { x: number; y: number } {
  const angle = getAngle(index)
  return {
    x: CENTER + Math.cos(angle) * radius,
    y: CENTER + Math.sin(angle) * radius,
  }
}

const webRings = computed(() => {
  return Array.from({ length: RING_COUNT }, (_, ringIndex) => {
    const r = (RADIUS * (ringIndex + 1)) / RING_COUNT
    return Array.from({ length: axisCount.value }, (_, i) => {
      const point = getPoint(i, r)
      return `${point.x},${point.y}`
    }).join(' ')
  })
})

const spokes = computed(() => {
  return Array.from({ length: axisCount.value }, (_, i) => getPoint(i, RADIUS))
})

const seriesPolygons = computed(() => {
  return props.series.map((s, seriesIndex) => {
    const points = s.values
      .map((v, i) => {
        const r = (v / maxValue.value) * RADIUS
        const point = getPoint(i, r)
        return `${point.x},${point.y}`
      })
      .join(' ')
    return { points, color: getSeriesColor(seriesIndex) }
  })
})

const seriesDots = computed(() => {
  const dots: { x: number; y: number; color: string }[] = []
  props.series.forEach((s, seriesIndex) => {
    s.values.forEach((v, i) => {
      const r = (v / maxValue.value) * RADIUS
      const point = getPoint(i, r)
      dots.push({ ...point, color: getSeriesColor(seriesIndex) })
    })
  })
  return dots
})

const axisLabels = computed(() => {
  if (!props.labels) return []
  return props.labels.map((text, i) => {
    const point = getPoint(i, LABEL_RADIUS)
    return { ...point, text }
  })
})
</script>

<style scoped>
@layer utensil {
  .radar-svg {
    flex-grow: 1;
    max-width: 70%;
    align-self: center;
  }

  .radar-ring {
    fill: none;
    stroke: var(--pencil-a3);
    stroke-width: 1;
  }

  .radar-spoke {
    stroke: var(--pencil-a3);
    stroke-width: 1;
  }

  .radar-label {
    font-size: 10px;
    fill: var(--pencil-a11);
  }

  polygon.animated {
    opacity: 0;
    transform-origin: center;
    animation: utensil-data-viz-radar-grow 0.5s ease-out forwards;
  }

  circle.animated {
    opacity: 0;
    animation: utensil-data-viz-fade-in 0.3s ease-out forwards;
  }

  @keyframes utensil-data-viz-radar-grow {
    from {
      opacity: 0;
      transform: scale(0.3);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes utensil-data-viz-fade-in {
    to {
      opacity: 1;
    }
  }

  .utensil-high-contrast .radar-ring,
  .utensil-high-contrast .radar-spoke {
    stroke: var(--pencil-a5);
  }

  .utensil-reduced-motion polygon.animated,
  .utensil-reduced-motion circle.animated {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>
