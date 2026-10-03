<template generic="Theme extends ThemeConfig">
  <div
    class="utensil-progress-bar"
    :class="[`size-${size}`, ...themeClasses, rounded ? 'rounded' : '']"
    :style="themeStyle"
    role="progressbar"
    :aria-valuenow="indeterminate ? undefined : value"
    :aria-valuemin="0"
    :aria-valuemax="100"
    :aria-label="ariaLabel"
  >
    <div class="track">
      <div class="fill" :style="{ width: `${indeterminate ? 100 : value}%` }"></div>
      <div v-if="indeterminate" class="fill indeterminate"></div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed } from 'vue'
import type { ColorProp, ThemeConfig } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'

export interface Props<Theme extends ThemeConfig> {
  value?: number
  indeterminate?: boolean
  size?: 'small' | 'medium' | 'large'
  ariaLabel?: string
  rounded?: boolean
  color?: ColorProp<Theme>
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  value: 0,
  size: 'medium',
  ariaLabel: 'Progress',
  color: 'pen',
})

const penColor = computed<ColorProp<Theme>>(() => props.color || 'pen')

const { classes: themeClasses, style: themeStyle } = useTheme({
  pen: penColor,
})

// Validate value prop
if (props.value < 0 || props.value > 100) {
  console.warn('UtensilProgressBar: value prop must be between 0 and 100')
}
</script>

<style scoped>
@layer utensil {
  .utensil-progress-bar {
    --border-radius: 0 display: block;
    width: 100%;

    &.rounded {
      --border-radius: var(--radius-2);
    }
  }

  .utensil-progress-bar .track {
    position: relative;
    width: 100%;
    border-radius: var(--border-radius);
    background-color: var(--pencil-a3);
    overflow: hidden;
  }

  .utensil-progress-bar .fill {
    position: absolute;
    height: 100%;
    border-radius: var(--border-radius);
    background-color: var(--pen-9);
    transition: width 0.3s ease;
  }

  .utensil-progress-bar .fill.indeterminate {
    width: 40%;
    left: -40%;
    background-color: var(--pen-6);
    animation: utensil-progress-pulse 2s ease-in-out infinite;
    animation-delay: 2s;
    border-radius: var(--border-radius);
  }

  /* Size variants */
  .utensil-progress-bar.size-small .track {
    height: 2px;
  }

  .utensil-progress-bar.size-medium .track {
    height: 4px;
  }

  .utensil-progress-bar.size-large .track {
    height: 6px;
  }

  @keyframes utensil-progress-pulse {
    0% {
      left: -40%;
    }
    40% {
      left: 100%;
    }
    40.016% {
      left: -40%;
    }
    80% {
      left: 100%;
    }
    80.016% {
      left: -40%;
    }
    100% {
      left: -40%;
    }
  }
}
</style>
