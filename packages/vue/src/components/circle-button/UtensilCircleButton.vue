<template generic="Theme extends ThemeConfig">
  <button
    class="utensil-circle-button"
    :class="[...themeClasses, `ui-${variation}`, 'interactive']"
    :style="style"
    :disabled="disabled"
    @click="handleClick"
  >
    <UtensilIcon :icon="icon" />
    <span class="screen-reader">{{ description }}</span>
  </button>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import type { IconProp, ColorProp, ThemeConfig, ScaleProp, UtensilUIVariation } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'
import UtensilIcon from '../icon/UtensilIcon.vue'

export interface Props<Theme extends ThemeConfig> {
  icon?: IconProp<Theme>
  color?: ColorProp<Theme>
  variation?: UtensilUIVariation
  scale?: ScaleProp
  description?: string
  disabled?: boolean
}

const {
  icon = 'times',
  variation = 'soft',
  color = 'pencil',
  scale = 1,
  description = 'Button',
  disabled = false,
} = defineProps<Props<Theme>>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const { classes: themeClasses, style } = useTheme({
  pen: () => color,
  relativeScale: () => scale,
})

function handleClick(event: MouseEvent) {
  if (!disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
@layer utensil {
  .utensil-circle-button {
    --button-size: var(--space-6);
    --font-size: var(--font-size-3);

    width: var(--button-size);
    height: var(--button-size);
    min-width: var(--button-size);
    min-height: var(--button-size);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size);
    line-height: normal;
    transition:
      background-color 0.2s ease,
      color 0.2s ease,
      transform 0.15s ease,
      box-shadow 0.2s ease;
    will-change: transform;
    transform: translateZ(0); /* Force GPU layer to prevent icon wiggle */

    /* Common hover/active states */
    &:active:not(:disabled) {
      transform: scale(0.95);
      filter: var(--active-filter);
    }

    &:focus-visible {
      outline: 2px solid var(--pen-8);
      outline-offset: 2px;
    }

    /* Disabled state */
    &:disabled {
      opacity: 0.5;
      cursor: default;
      transform: none;

      &:hover {
        transform: none;
      }
    }
  }

  /* Hover transform — component-specific scale effect */
  .utensil-circle-button:hover:not(:disabled) {
    transform: scale(1.1);
  }
}
</style>
