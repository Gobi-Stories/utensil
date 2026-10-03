<template generic="Theme extends ThemeConfig">
  <div
    class="utensil-card"
    :class="[...themeClasses, `ui-${variation}`, { pencil: !highlighted, interactive, wireframe }]"
    :style="style"
    :tabindex="interactive ? 0 : undefined"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed } from 'vue'
import type { ColorProp, ThemeConfig, ScaleProp, UtensilUIVariation, RadiusScaleProp } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'

export interface Props<Theme extends ThemeConfig> {
  color?: ColorProp<Theme>
  variation?: UtensilUIVariation
  scale?: ScaleProp
  radiusScale?: RadiusScaleProp
  shadow?: boolean
  highlighted?: boolean
  interactive?: boolean
  wireframe?: boolean
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  color: 'pen',
  variation: 'unstyled',
  scale: 1,
})

const penColor = computed<ColorProp<Theme>>(() => props.color || 'pen')

const { classes: themeClasses, style } = useTheme({
  pen: penColor,
  relativeScale: () => props.scale,
  radiusScale: () => props.radiusScale,
})
</script>

<style scoped>
@layer utensil {
  .utensil-card {
    box-sizing: border-box;
    padding: var(--space-4);
    border-radius: var(--radius-4);
  }

  /* Outline and text use panel-solid background instead of transparent */
  .utensil-card.ui-outline {
    background-color: var(--panel-solid);
  }

  .utensil-card.ui-text {
    background-color: var(--panel-solid);
  }

  /* Interactive base */
  .utensil-card.interactive {
    cursor: pointer;
    outline: 2px solid transparent;
    outline-offset: -2px;
    transition:
      outline-color 0.1s ease,
      background-color 0.15s ease,
      box-shadow 0.15s ease;
  }

  /* Interactive focus */
  .utensil-card.interactive:focus-visible {
    outline-color: var(--pen-8);
  }

  /* Interactive solid — offset focus ring from filled background */
  .utensil-card.interactive.ui-solid {
    outline-offset: 3px;
  }

  /* Interactive surface active */
  .utensil-card.interactive.ui-surface:active {
    filter: none;
  }

  /* Reduced motion */
  .utensil-reduced-motion .utensil-card.interactive {
    transition: none;
  }
}
</style>
