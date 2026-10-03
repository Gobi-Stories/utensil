<template>
  <div
    class="utensil-side-item"
    :class="{
      selected,
      highlighted,
      disabled,
      muted,
    }"
    role="button"
    tabindex="0"
    :aria-pressed="selected"
    :aria-disabled="disabled"
    @click="onClick"
    @keydown.enter.prevent="activate"
    @keydown.space.prevent="activate"
  >
    <UtensilTooltip :text="title" placement="right" :disabled="!tooltipsEnabled">
      <div class="item-icon" :class="{ small: smallIcon }">
        <UtensilIcon :icon="icon" :color="iconColor" />
      </div>
    </UtensilTooltip>
    <span class="item-text">{{ title }}</span>
    <div class="item-badge">
      <slot name="badge" :selected="selected"></slot>
    </div>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed, inject, ref } from 'vue'
import UtensilIcon from '../icon/UtensilIcon.vue'
import UtensilTooltip from '../tooltip/UtensilTooltip.vue'
import type { ColorProp, IconProp, ThemeConfig } from '../../theme/utensil-theme'
import { sideMenuContextKey } from './side-menu-keys'

export interface Props<Theme extends ThemeConfig> {
  title: string
  icon: IconProp<Theme>
  iconColor?: ColorProp<Theme>
  smallIcon?: boolean
  selected?: boolean
  highlighted?: boolean
  disabled?: boolean
  muted?: boolean
  // Close the (floating) menu when clicked; unset inherits the menu's closeOnClick default.
  closeOnClick?: boolean
}

const {
  title,
  icon,
  selected,
  smallIcon,
  highlighted,
  disabled,
  muted,
  closeOnClick = undefined,
} = defineProps<Props<Theme>>()

const sideMenuContext = inject(sideMenuContextKey, {
  mode: ref('open' as const),
  collapsed: ref(false),
  closeOnClick: ref(false),
  close: () => {},
})
const tooltipsEnabled = computed(() => sideMenuContext.collapsed.value)

function onClick() {
  if (!disabled && (closeOnClick ?? sideMenuContext.closeOnClick.value)) {
    sideMenuContext.close()
  }
}

function activate(event: KeyboardEvent) {
  if (!disabled) {
    ;(event.currentTarget as HTMLElement).click()
  }
}
</script>

<style scoped>
@layer utensil {
  .utensil-side-item {
    --item-color: var(--side-menu-item-color, var(--pencil-11));
    --item-selected-color: var(--side-menu-item-selected-color, var(--pen-a11));
    --item-selected-background: var(--side-menu-item-selected-background, var(--pen-a3));
    --item-selected-background-paper: var(--side-menu-item-selected-background-paper, var(--paper-a1));
    --item-hover-color: var(--side-menu-item-hover-color, var(--item-color));
    --item-hover-background: var(--side-menu-item-hover-background, var(--panel-hover));

    position: relative;
    display: flex;
    align-items: center;
    margin: var(--space-1) 0;
    padding: 0 var(--space-2) 0 0;
    border-radius: var(--radius-2);
    cursor: pointer;
    margin-block-end: 2px;
    color: var(--item-color);
    font-size: var(--font-size-2);
    line-height: normal;
    transition: background-color 0.2s ease;

    outline: 2px solid transparent;
    outline-offset: -2px;

    &:focus-visible {
      outline-color: var(--pen-8);
    }

    &:hover:not(.disabled):not(.selected) {
      background-color: var(--item-hover-background);
      color: var(--item-hover-color);
    }

    &.selected {
      background-color: var(--item-selected-background);
      background-image: linear-gradient(var(--item-selected-background-paper));
      color: var(--item-selected-color);
    }

    &.muted:not(.selected) {
      opacity: 0.75;
    }

    &.disabled {
      opacity: 0.5;
      transition:
        opacity 0.2s ease,
        color 0.2s ease;
      pointer-events: none;
    }

    &.highlighted:not(.disabled) {
      color: var(--pen-a11);

      &.selected {
        background-color: var(--pen-3);
        color: var(--pen-a11);

        .item-icon {
          background-color: var(--pen-3);
        }
      }
    }
  }

  .item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--space-6);
    height: var(--space-6);
    padding: 0 var(--space-2);
    border-radius: var(--radius-2);
    margin-inline-end: calc(var(--space-1) / 2);
    flex-shrink: 0;
    transition: background-color 0.2s ease;
    opacity: var(--side-menu-icon-opacity, 1);

    &.small {
      font-size: 60%;
    }
  }

  .item-text {
    flex-grow: 1;
    transition: opacity var(--side-menu-transition, 0.15s) ease;
    white-space: nowrap;
    overflow: hidden;
    opacity: var(--side-menu-content-opacity, 1);
  }

  .item-badge {
    transition: opacity var(--side-menu-transition, 0.15s) ease;
    opacity: var(--side-menu-content-opacity, 1);
  }
}
</style>
