<template generic="Theme extends ThemeConfig">
  <div
    class="utensil-progress-bar"
    :class="[`size-${size}`, `indeterminate-fill-${indeterminateFill}`, ...themeClasses, { rounded, squared }]"
    :style="themeStyle"
    role="progressbar"
    :aria-valuenow="indeterminate ? undefined : clampedValue"
    :aria-valuemin="0"
    :aria-valuemax="100"
    :aria-label="ariaLabel"
  >
    <div class="track">
      <!-- Separate fills, so leaving the indeterminate state shows the value at once instead of transitioning down to it -->
      <template v-if="indeterminate">
        <div v-if="indeterminateFill === 'full'" class="fill full"></div>
        <div class="fill indeterminate"></div>
      </template>
      <div v-else class="fill" :style="{ width: `${clampedValue}%` }"></div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed } from 'vue'
import type { ColorProp, ThemeConfig } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'

export interface Props<Theme extends ThemeConfig> {
  /** Percent complete, from 0 to 100. Values outside the range are clamped to it. */
  value?: number
  indeterminate?: boolean
  // What the indeterminate pulse runs over: the full fill, or the empty track
  indeterminateFill?: 'full' | 'none'
  size?: 'small' | 'medium' | 'large'
  ariaLabel?: string
  /** The theme's rounded corners. */
  rounded?: boolean
  /** The theme's squared corners, slightly rounded. */
  squared?: boolean
  color?: ColorProp<Theme>
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  value: 0,
  indeterminateFill: 'full',
  size: 'medium',
  ariaLabel: 'Progress',
  color: 'pen',
})

const penColor = computed<ColorProp<Theme>>(() => props.color || 'pen')

const { classes: themeClasses, style: themeStyle } = useTheme({
  pen: penColor,
})

// The value within 0 to 100, as the fill and aria-valuenow show it; a value that isn't a number shows as 0
const clampedValue = computed(() => (Number.isFinite(props.value) ? Math.min(100, Math.max(0, props.value)) : 0))
</script>

<style scoped>
@layer utensil {
  .utensil-progress-bar {
    --progress-bar-radius: 0;
    display: block;
    width: 100%;

    &.size-small {
      --progress-bar-size-thickness: calc(2px * var(--scale, 1));
    }

    &.size-medium {
      --progress-bar-size-thickness: calc(4px * var(--scale, 1));
    }

    &.size-large {
      --progress-bar-size-thickness: calc(6px * var(--scale, 1));
    }

    &.rounded {
      --progress-bar-radius: var(--radius-rounded);
    }

    &.squared {
      --progress-bar-radius: var(--radius-squared);
    }
  }

  .utensil-progress-bar .track {
    position: relative;
    width: 100%;
    height: var(--utensil-progress-bar-thickness, var(--progress-bar-size-thickness));
    border-radius: var(--progress-bar-radius);
    background-color: var(--utensil-progress-bar-track, var(--pencil-a3));
    overflow: hidden;
  }

  .utensil-progress-bar .fill {
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    border-radius: var(--progress-bar-radius);
    background-color: var(--pen-track);
    transition: width 0.3s ease;
  }

  .utensil-progress-bar .fill.full {
    width: 100%;
  }

  /* A segment sweeping across from the start edge, in either writing direction */
  .utensil-progress-bar .fill.indeterminate {
    width: 40%;
    inset-inline-start: -40%;
    background-color: var(--pen-6);
    animation: utensil-progress-pulse 2s ease-in-out infinite;
  }

  /* Over the empty track, the segment is the fill's own color */
  .utensil-progress-bar.indeterminate-fill-none .fill.indeterminate {
    background-color: var(--pen-track);
  }

  .utensil-high-contrast .utensil-progress-bar .track {
    background-color: var(--utensil-progress-bar-track, var(--pencil-a6));
  }

  .utensil-high-contrast .utensil-progress-bar .fill.indeterminate {
    background-color: var(--pen-4);
  }

  .utensil-high-contrast .utensil-progress-bar.indeterminate-fill-none .fill.indeterminate {
    background-color: var(--pen-track);
  }

  /* Reduced motion: the fill jumps to its value, and the indeterminate segment fades across the whole bar in place */
  .utensil-reduced-motion .utensil-progress-bar .fill {
    transition: none;
  }

  .utensil-reduced-motion .utensil-progress-bar .fill.indeterminate {
    width: 100%;
    inset-inline-start: 0;
    animation: utensil-progress-fade 2s ease-in-out infinite alternate;
  }

  @keyframes utensil-progress-pulse {
    0% {
      inset-inline-start: -40%;
    }
    40% {
      inset-inline-start: 100%;
    }
    40.016% {
      inset-inline-start: -40%;
    }
    80% {
      inset-inline-start: 100%;
    }
    80.016% {
      inset-inline-start: -40%;
    }
    100% {
      inset-inline-start: -40%;
    }
  }

  @keyframes utensil-progress-fade {
    from {
      opacity: 0.25;
    }
    to {
      opacity: 1;
    }
  }

  /* Forced colors replaces the track's and fill's colors with the page's: an outline draws the track and the
     system's Highlight the fill */
  @media (forced-colors: active) {
    .utensil-progress-bar .track {
      outline: 1px solid CanvasText;
      outline-offset: -1px;
    }

    .utensil-progress-bar .fill {
      background-color: Highlight !important;
    }
  }
}
</style>
