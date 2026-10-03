<template generic="Theme extends ThemeConfig">
  <div
    class="utensil-callout"
    :class="[...themeClasses, `ui-${variation}`, { 'text-pencil': textPencil, center }]"
    :style="style"
    :role="role"
  >
    <div v-if="icon" class="utensil-callout-icon" :class="{ center }">
      <UtensilIcon :icon="icon" :color="iconColor" />
    </div>
    <div class="utensil-callout-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed } from 'vue'
import type { ColorProp, ThemeConfig, ScaleProp, IconProp, RadiusScaleProp } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'
import UtensilIcon from '../icon/UtensilIcon.vue'

export type CalloutVariation = 'soft' | 'surface' | 'outline'

export interface Props<Theme extends ThemeConfig> {
  color?: ColorProp<Theme>
  icon?: IconProp<Theme>
  iconColor?: ColorProp<Theme>
  variation?: CalloutVariation
  textPencil?: boolean
  scale?: ScaleProp
  radiusScale?: RadiusScaleProp
  role?: 'alert' | 'status'
  center?: boolean
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  variation: 'soft',
  color: 'pen',
  textPencil: false,
  scale: 1,
  role: undefined,
})

const penColor = computed<ColorProp<Theme>>(() => props.color || 'pen')

const { classes: themeClasses, style } = useTheme({
  pen: penColor,
  relativeScale: () => props.scale,
  relativeRadiusScale: () => props.radiusScale,
})
</script>

<style scoped>
@layer utensil {
  .utensil-callout {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-3);
    font-size: var(--font-size-2);
    line-height: var(--line-height-2);

    &.center {
      align-items: center;
    }
  }

  /* Icon container */
  .utensil-callout-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--space-5);
    height: var(--line-height-2);
    font-size: var(--font-size-4);

    &.center {
      align-items: center;
    }
  }

  /* Content */
  .utensil-callout-content {
    flex: 1;
    min-width: 0;
    line-height: var(--line-height-2);
  }

  /* Text pencil - use pencil colors for text content only */
  .utensil-callout.text-pencil .utensil-callout-content {
    color: var(--pencil-a11);
  }
}
</style>
