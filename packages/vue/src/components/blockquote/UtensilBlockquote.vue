<template generic="Theme extends ThemeConfig">
  <blockquote class="utensil-blockquote" :class="[...themeClasses, weightClass]" :style="style">
    <slot></slot>
  </blockquote>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed } from 'vue'
import type { ColorProp, ThemeConfig, ScaleProp } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'

export type BlockquoteWeight = 'light' | 'regular' | 'medium' | 'bold'

export interface Props<Theme extends ThemeConfig> {
  color?: ColorProp<Theme>
  weight?: BlockquoteWeight
  scale?: ScaleProp
}

const { color = 'pen', weight = 'regular', scale = 1 } = defineProps<Props<Theme>>()

const { classes: themeClasses, style } = useTheme({
  pen: color,
  relativeScale: () => scale,
})

const weightClass = computed(() => `weight-${weight}`)
</script>

<style scoped>
@layer utensil {
  .utensil-blockquote {
    box-sizing: border-box;
    margin: 0;
    font-size: var(--font-size-3);
    line-height: var(--line-height-3);
    font-style: italic;
    color: var(--pen-a11);
    border-left: 4px solid var(--pen-a6);
    padding-left: var(--space-4);
  }

  /* High contrast */
  .utensil-high-contrast .utensil-blockquote {
    border-left-color: var(--pen-a9);
  }

  /* Weight variations */
  .utensil-blockquote.weight-light {
    font-weight: 300;
  }

  .utensil-blockquote.weight-regular {
    font-weight: 400;
  }

  .utensil-blockquote.weight-medium {
    font-weight: 500;
  }

  .utensil-blockquote.weight-bold {
    font-weight: 700;
  }
}
</style>
