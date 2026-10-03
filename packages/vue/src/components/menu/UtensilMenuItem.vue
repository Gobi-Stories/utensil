<template generic="Theme extends ThemeConfig">
  <div
    ref="itemRef"
    class="utensil-menu-item"
    :class="[...themeClasses, { disabled, colored: color, highlighted }]"
    :style="themeStyle"
    :data-focusable="!disabled || undefined"
    role="menuitem"
    :tabindex="disabled ? -1 : 0"
    :aria-disabled="disabled"
    @click.stop="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
    @mouseenter="handleMouseEnter"
  >
    <slot name="icon">
      <UtensilIcon v-if="icon" :icon="icon" :color="iconColor" class="item-icon" />
    </slot>
    <span class="item-label">
      <slot>{{ label }}</slot>
    </span>
    <span v-if="shortcut" class="item-shortcut">{{ shortcut }}</span>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { ref, inject } from 'vue'
import type { ThemeConfig, IconProp, ColorProp } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'
import UtensilIcon from '../icon/UtensilIcon.vue'
import { UtensilMenuContextKey } from './utensil-menu'

export interface Props<Theme extends ThemeConfig> {
  /** Display label for the menu item */
  label?: string
  /** Optional icon to display before the label */
  icon?: IconProp<Theme>
  /** Color for the icon alone, leaving the label as is */
  iconColor?: ColorProp<Theme>
  /** Optional keyboard shortcut hint */
  shortcut?: string
  /** Whether this item is disabled */
  disabled?: boolean
  /** Color for the menu item */
  color?: ColorProp<Theme>
  /** Highlighted state for the menu item */
  highlighted?: boolean
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  disabled: false,
})

const { classes: themeClasses, style: themeStyle } = useTheme({
  pen: () => props.color,
})

const emit = defineEmits<{
  click: []
}>()

const itemRef = ref<HTMLElement>()
const menuContext = inject(UtensilMenuContextKey, null)

function handleClick() {
  if (props.disabled) return
  emit('click')
}

function handleMouseEnter() {
  if (props.disabled) return
  if (menuContext && itemRef.value) {
    menuContext.setFocused(itemRef.value)
  }
}
</script>

<style scoped>
@layer utensil {
  .utensil-menu-item {
    --color: var(--utensil-menu-item-color, var(--pencil-11));
    --focus-color: var(--utensil-menu-item-focus-color, var(--pencil-a12));
    --focus-background-color: var(--utensil-menu-item-focus-background-color, var(--paper-4));

    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    margin: 0 var(--space-1);
    border-radius: var(--radius-2);
    font-size: var(--font-size-2);
    line-height: normal;
    color: var(--color);
    cursor: pointer;
    outline: none;
    transition: background-color 0.1s ease;
  }

  .utensil-menu-item[data-focused]:not(.disabled),
  .utensil-menu-item:focus:not(.disabled) {
    background-color: var(--focus-background-color);
    color: var(--focus-color);
  }

  .utensil-menu-item.colored {
    color: var(--pen-a11);
  }

  .utensil-menu-item.colored[data-focused]:not(.disabled),
  .utensil-menu-item.colored:focus:not(.disabled) {
    color: var(--pen-11);
  }

  .utensil-menu-item.disabled {
    opacity: 0.5;
    cursor: default;
  }

  .utensil-menu-item.highlighted:not(.disabled) {
    background-color: var(--pen-3);
    color: var(--pen-12);

    .item-icon {
      background-color: var(--pen-3);
    }
  }

  .item-icon {
    flex-shrink: 0;
    width: 16px;
    text-align: center;
  }

  .item-icon:not(.colored) {
    color: inherit;
  }

  .item-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .item-shortcut {
    flex-shrink: 0;
    font-size: var(--font-size-1);
    color: var(--pencil-a10);
    margin-left: var(--space-3);
  }
}
</style>
