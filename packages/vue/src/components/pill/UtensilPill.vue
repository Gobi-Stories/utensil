<template generic="Theme extends ThemeConfig">
  <div
    class="utensil-pill"
    :class="[...themeClasses, `ui-${variation}`, { removable, rounded, squared, icon, count: count !== undefined }]"
    :style="style"
  >
    <span class="utensil-pill-content">
      <slot>
        <UtensilIcon v-if="icon" :icon="icon" />
        <span v-if="label">{{ label }}</span>
      </slot>
    </span>

    <!-- Removable mode: show close button -->
    <button
      v-if="removable"
      class="utensil-pill-close"
      @click.stop="handleRemove"
      :aria-label="`Remove ${ariaLabel || 'item'}`"
    >
      <UtensilIcon icon="times" />
    </button>

    <!-- Non-removable mode: show count if provided -->
    <span v-else-if="count !== undefined" class="utensil-pill-count">
      {{ count }}
    </span>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed } from 'vue'
import type { ColorProp, IconProp, ThemeConfig, ScaleProp, UtensilUIVariation } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'
import UtensilIcon from '../icon/UtensilIcon.vue'

export interface Props<Theme extends ThemeConfig> {
  label?: string
  color?: ColorProp<Theme>
  variation?: UtensilUIVariation
  icon?: IconProp<Theme>
  scale?: ScaleProp
  removable?: boolean
  count?: number
  rounded?: boolean
  squared?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  variation: 'solid',
  color: 'pen',
  scale: 1,
  removable: false,
})

const emit = defineEmits<{
  removed: [value: string | undefined]
}>()

const penColor = computed<ColorProp<Theme>>(() => {
  return props.color || 'pen'
})

const { classes: themeClasses, style } = useTheme({
  pen: penColor,
  relativeScale: () => props.scale,
})

function handleRemove() {
  emit('removed', props.ariaLabel)
}
</script>

<style scoped>
@layer utensil {
  .utensil-pill {
    --pill-height: var(--space-6);
    --font-size: var(--font-size-2);
    --inline-padding: var(--space-3);

    height: var(--pill-height);
    min-width: var(--pill-height);
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
    border-radius: var(--radius-6);
    font-size: var(--font-size);
    padding: 0 var(--inline-padding);
    font-weight: 500;
    line-height: normal;
    transition:
      background-color 0.2s ease,
      color 0.2s ease,
      box-shadow 0.2s ease,
      transform 0.15s ease;

    &.rounded {
      border-radius: var(--radius-rounded);
    }

    &.squared {
      border-radius: var(--radius-squared);
    }

    &.icon {
      padding-inline-start: calc(var(--inline-padding) - var(--space-1));
    }

    &.removable {
      padding-inline-start: calc(var(--inline-padding) - var(--space-1) * 0.75);
      padding-inline-end: calc(var(--inline-padding) - var(--space-1) * 1.5);
    }

    &.count {
      padding-inline-start: calc(var(--inline-padding) - var(--space-1) / 2);
      padding-inline-end: calc(var(--inline-padding) - var(--space-1));
    }

    &.icon.removable,
    &.icon.count {
      padding-inline-start: calc(var(--inline-padding) - var(--space-1) * 1.5);
    }

    &.icon.count {
      padding-inline-start: calc(var(--inline-padding) - var(--space-1));
      padding-inline-end: calc(var(--inline-padding) - var(--space-1) * 1.5);
    }
  }

  .utensil-pill-content {
    flex: 1;
    display: flex;
    align-items: center;
    gap: var(--space-1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .utensil-pill-close {
    --close-size: 20px;

    width: var(--close-size);
    height: var(--close-size);
    border: none;
    border-radius: 50%;
    color: currentColor;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    transition:
      background-color 0.15s ease,
      transform 0.15s ease;
    flex-shrink: 0;
    transform: translateZ(0); /* Force GPU layer to prevent icon wiggle */

    &:hover {
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.9);
    }

    &:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 1px;
    }
  }

  .utensil-pill-count {
    font-size: calc(var(--font-size) - 2px);
    font-weight: 600;
    padding: 2px 6px;
    border-radius: var(--radius-4);
    min-width: 20px;
    text-align: center;
    flex-shrink: 0;
  }

  /* Sub-element variation styling */
  .utensil-pill.ui-solid .utensil-pill-close {
    background-color: var(--white-a6);

    &:hover {
      background-color: var(--white-a4);
    }
  }

  .utensil-pill.ui-solid .utensil-pill-count {
    background-color: var(--white-a6);
  }

  .utensil-pill:not(.ui-solid) .utensil-pill-close {
    background-color: var(--pen-a4);

    &:hover {
      background-color: var(--pen-a5);
    }
  }

  .utensil-pill:not(.ui-solid) .utensil-pill-count {
    background-color: var(--pen-a4);
  }
}
</style>
