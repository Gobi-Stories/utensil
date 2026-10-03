<template generic="Theme extends ThemeConfig">
  <span class="utensil-label" :class="[...themeClasses, `ui-${variation}`]" :style="style">
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed } from 'vue'
import type { ColorProp, UtensilUIVariation, ScaleProp, ThemeConfig } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'

export interface Props<Theme extends ThemeConfig> {
  text?: string
  color?: ColorProp<Theme>
  variation?: UtensilUIVariation
  scale?: ScaleProp
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  variation: 'soft',
  color: 'pen',
  scale: 1,
})

const penColor = computed<ColorProp<Theme>>(() => props.color)

const { classes: themeClasses, style } = useTheme({
  pen: penColor,
  relativeScale: () => props.scale,
})
</script>

<style scoped>
@layer utensil {
  /*
   * UtensilLabel — a tight, monospace, uppercase tag.
   *
   * Sits alongside UtensilBadge and UtensilPill but trades any sense of "state" for a
   * deliberately scannable, log-line aesthetic. Always rectangular, never
   * interactive, never carries an icon. Use it to mark discriminators (an
   * operation type in an audit log, a tag on a row).
   */
  .utensil-label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: var(--ui-code-font-family);
    font-size: var(--font-size-1);
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    line-height: 1;
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-2);
    white-space: nowrap;
  }
}
</style>
