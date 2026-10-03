<template generic="Theme extends ThemeConfig">
  <div class="utensil-badge" :class="[...themeClasses, `ui-${variation}`, { squared, rounded, icon }]" :style="style">
    <UtensilIcon v-if="icon" :icon="icon" />
    <slot>
      <span v-if="label">{{ label }}</span>
    </slot>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed } from 'vue'
import type {
  ColorProp,
  IconProp,
  ThemeConfig,
  ScaleProp,
  UtensilUIVariation,
  RadiusScaleProp,
} from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'
import UtensilIcon from '../icon/UtensilIcon.vue'

export interface Props<Theme extends ThemeConfig> {
  label?: string
  color?: ColorProp<Theme>
  variation?: UtensilUIVariation
  icon?: IconProp<Theme>
  rounded?: boolean
  squared?: boolean
  scale?: ScaleProp
  radiusScale?: RadiusScaleProp
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  variation: 'solid',
  color: 'pen',
  squared: false,
  scale: 1,
})

const penColor = computed<ColorProp<Theme>>(() => {
  return props.color || 'pen'
})

const { classes: themeClasses, style } = useTheme({
  pen: penColor,
  relativeScale: () => props.scale,
  radiusScale: () => props.radiusScale,
})
</script>

<style scoped>
@layer utensil {
  .utensil-badge {
    --badge-height: calc(5 * var(--space-1));
    --badge-padding-x: calc(2 * var(--space-1));
    --badge-icon-padding-start: calc(1.5 * var(--space-1));
    --badge-gap: var(--space-1);
    --badge-radius: var(--radius-5);

    height: var(--badge-height);
    min-width: var(--badge-height);
    width: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--badge-gap);
    border-radius: var(--badge-radius);
    font-size: var(--font-size-1);
    line-height: normal;
    font-weight: 500;
    padding: 0 var(--badge-padding-x);
    white-space: nowrap;

    &.squared {
      justify-content: flex-start;
      border-radius: var(--radius-squared);
    }

    &.rounded {
      border-radius: var(--radius-rounded);
    }
  }

  .utensil-badge.icon {
    padding-inline-start: var(--badge-icon-padding-start);
  }
}
</style>
