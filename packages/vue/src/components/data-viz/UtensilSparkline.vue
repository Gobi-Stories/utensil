<template generic="Theme extends ThemeConfig">
  <svg
    class="utensil-sparkline"
    :class="themeClasses"
    :style="style"
    :viewBox="`0 0 ${width} ${height}`"
    preserveAspectRatio="none"
    role="img"
    :aria-label="ariaLabel"
  >
    <path v-if="fill" class="utensil-sparkline-fill" :d="areaPath" />
    <path class="utensil-sparkline-line" :d="linePath" vector-effect="non-scaling-stroke" />
  </svg>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed } from 'vue'
import type { ColorProp, ThemeConfig } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'

export interface Props<Theme extends ThemeConfig> {
  values: number[]
  /** The line's color: the pen's step 9, its fill a light step of the same pen */
  color?: ColorProp<Theme>
  /** A soft fill under the line */
  fill?: boolean
  /** ViewBox width; the sparkline stretches to fill its box, so this only sets the drawing's proportions */
  width?: number
  /** ViewBox height; the sparkline stretches to fill its box */
  height?: number
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  color: 'pen',
  fill: false,
  width: 120,
  height: 36,
  ariaLabel: 'Trend',
})

const penColor = computed<ColorProp<Theme>>(() => props.color || 'pen')

const { classes: themeClasses, style } = useTheme({
  pen: penColor,
})

// Room above the highest point and below the lowest, so peaks and troughs don't touch the box
const EDGE_ROOM = 1 / 8

const points = computed(() => {
  const values = props.values
  if (!values.length) {
    return []
  }

  const max = Math.max(...values)
  const min = Math.min(...values)
  const room = props.height * EDGE_ROOM
  const innerHeight = props.height - room * 2

  return values.map((value, index) => ({
    x: values.length > 1 ? (index / (values.length - 1)) * props.width : props.width / 2,
    // A flat series runs through the middle, so a steady figure doesn't read as zero
    y: max === min ? props.height / 2 : room + innerHeight - ((value - min) / (max - min)) * innerHeight,
  }))
})

const linePath = computed(() =>
  points.value
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(' '),
)

const areaPath = computed(() => {
  if (!points.value.length) {
    return ''
  }

  const first = points.value[0]
  const last = points.value[points.value.length - 1]

  return `${linePath.value} L ${last.x.toFixed(1)} ${props.height} L ${first.x.toFixed(1)} ${props.height} Z`
})
</script>

<style scoped>
@layer utensil {
  /* Stretches to whatever box it's given. The round caps at the ends may reach past it. */
  .utensil-sparkline {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .utensil-sparkline-line {
    fill: none;
    stroke: var(--pen-9);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .utensil-sparkline-fill {
    fill: var(--pen-a3);
    stroke: none;
  }

  .utensil-high-contrast .utensil-sparkline-line {
    stroke: var(--pen-11);
  }

  .utensil-high-contrast .utensil-sparkline-fill {
    fill: var(--pen-a5);
  }
}
</style>
