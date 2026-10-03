<template generic="Theme extends ThemeConfig">
  <div
    class="utensil-divider"
    :class="[...themeClasses, { vertical, 'has-label': !!label && !vertical }]"
    :style="themeStyle"
    role="separator"
    :aria-orientation="vertical ? 'vertical' : 'horizontal'"
  >
    <template v-if="label && !vertical">
      <span class="utensil-divider-label">{{ label }}</span>
    </template>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed } from 'vue'
import type { ColorProp, ThemeConfig } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'

export interface Props<Theme extends ThemeConfig> {
  vertical?: boolean
  label?: string
  color?: ColorProp<Theme>
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  vertical: false,
  color: 'pencil',
})

const penColor = computed<ColorProp<Theme>>(() => props.color)

const { classes: themeClasses, style: themeStyle } = useTheme({
  pen: penColor,
})
</script>

<style scoped>
@layer utensil {
  .utensil-divider {
    background-color: var(--pen-6);
    height: 1px;
    width: 100%;
  }

  .utensil-divider.vertical {
    height: auto;
    width: 1px;
    align-self: stretch;
  }

  .utensil-divider.has-label {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    background: none;
    height: auto;
  }

  .utensil-divider.has-label::before,
  .utensil-divider.has-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: var(--pen-6);
  }

  .utensil-divider-label {
    color: var(--pen-10);
    font-size: var(--font-size-2);
    white-space: nowrap;
  }
}
</style>
