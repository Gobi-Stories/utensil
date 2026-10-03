<template generic="Theme extends ThemeConfig">
  <div
    class="utensil-spinner"
    :class="themeClasses"
    :style="themeStyle"
    role="status"
    aria-live="polite"
    :aria-label="ariaLabel"
    :aria-hidden="!ariaLabel"
  >
    <div class="circle">
      <div class="arc" :class="{ soft }"></div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import type { ColorProp, ScaleProp, ThemeConfig } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'

export interface Props<Theme extends ThemeConfig> {
  color?: ColorProp<Theme>
  scale?: ScaleProp
  ariaLabel?: string
  soft?: boolean
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  scale: 1,
  ariaLabel: 'Loading...',
})

const { classes: themeClasses, style: themeStyle } = useTheme({
  pen: () => props.color,
  relativeScale: () => props.scale,
})
</script>

<style scoped>
@layer utensil {
  .utensil-spinner {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .utensil-spinner .circle {
    position: relative;
    width: var(--space-6);
    height: var(--space-6);
    border-radius: 50%;
    border: 2px solid var(--utensil-spinner-track-color, var(--white-a5));
  }

  .utensil-spinner .arc {
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: var(--utensil-spinner-color, var(--pen-9));
    animation: utensil-spinner-rotate 1s linear infinite;

    &.soft {
      border-top-color: var(--utensil-spinner-color, var(--pen-a7));
    }
  }

  /* Animation */
  @keyframes utensil-spinner-rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
