<template generic="Theme extends ThemeConfig">
  <button
    type="button"
    class="utensil-action-strip-item"
    :class="{ selected, disabled }"
    :aria-pressed="selected"
    :aria-disabled="disabled"
    :disabled="disabled"
  >
    <span class="item-icon">
      <UtensilIcon :icon="icon" :color="iconColor" />
    </span>
    <span class="item-label">{{ label }}</span>
    <!-- Adornments (badges, affordance glyphs) positioned by the consumer -->
    <slot></slot>
  </button>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import UtensilIcon from '../icon/UtensilIcon.vue'
import type { ColorProp, IconProp, ThemeConfig } from '../../theme/utensil-theme'

// An action-strip entry: an icon with its label underneath.
export interface Props<Theme extends ThemeConfig> {
  label: string
  icon: IconProp<Theme>
  iconColor?: ColorProp<Theme>
  selected?: boolean
  disabled?: boolean
}

defineProps<Props<Theme>>()
</script>

<style scoped>
@layer utensil {
  .utensil-action-strip-item {
    --item-padding: var(--utensil-action-strip-item-padding, var(--space-2) var(--space-1));
    --font-size: var(--utensil-action-strip-item-font-size, var(--font-size-1));
    --icon-font-size: var(--utensil-action-strip-item-icon-font-size, var(--font-size-5));
    --gap: var(--utensil-action-strip-item-gap, calc(1.5 * var(--space-1)));
    --item-selected-background-color: var(--utensil-action-strip-item-selected-background-color, var(--pen-a3));
    --item-selected-background-paper: var(--utensil-action-strip-item-selected-background-paper, var(--paper-a1));
    --hover-background-color: var(--utensil-action-strip-item-hover-background, var(--panel-hover));
    --border-radius: var(--utensil-action-strip-item-border-radius, var(--radius-3));

    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--gap);
    width: 100%;
    /* The strip's sheet-form grid overrides this for roomier tiles */
    padding: var(--item-padding);
    border: none;
    border-radius: var(--border-radius);
    background: none;
    color: var(--pencil-11);
    font: inherit;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    outline: 2px solid transparent;
    outline-offset: -2px;

    &:focus-visible {
      outline-color: var(--pen-8);
    }

    &:hover:not(.disabled):not(.selected) {
      background-color: var(--hover-background-color);
    }

    &.selected {
      background-color: var(--item-selected-background-color);
      background-image: linear-gradient(var(--item-selected-background-paper));
      color: var(--pen-a11);
    }

    &.disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  .item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--icon-font-size);
    line-height: 1;
  }

  .item-label {
    max-width: 100%;
    overflow: hidden;
    text-align: center;
    color: var(--pencil-a12);
    font-size: var(--font-size);
    font-weight: 500;
    line-height: 1;

    /* Labels may wrap to two lines before truncating. */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  .utensil-action-strip-item.selected {
    .item-label {
      color: var(--pen-a11);
    }
  }
}
</style>
