<template generic="Theme extends ThemeConfig">
  <div
    class="utensil-page-indicator"
    :class="[themeClasses, { disabled }]"
    :style="themeStyle"
    role="group"
    :aria-label="ariaLabel"
  >
    <button
      v-for="page in count"
      :key="page"
      type="button"
      class="page"
      :class="{ current: page - 1 === model }"
      :aria-label="`${pageName} ${page} of ${count}`"
      :aria-current="page - 1 === model ? 'true' : undefined"
      :disabled="disabled"
      @click="model = page - 1"
    ></button>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import type { ColorProp, ScaleProp, ThemeConfig } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'

// A row of dots, one per page, with the current page drawn as a pill. Each dot is a button
// that jumps to its page, so it navigates as well as indicates.
export interface Props<Theme extends ThemeConfig> {
  /** How many pages there are. */
  count: number
  /** Accent color of the current page's marker. */
  color?: ColorProp<Theme>
  scale?: ScaleProp
  /** Accessible name for the group. */
  ariaLabel?: string
  /** Noun in each marker's accessible name: "Page 2 of 5". */
  pageName?: string
  disabled?: boolean
}

const {
  color = 'pen',
  scale = 1,
  ariaLabel = 'Pages',
  pageName = 'Page',
  disabled = false,
} = defineProps<Props<Theme>>()

/** Zero-based index of the current page. */
const model = defineModel<number>({ default: 0 })

const { classes: themeClasses, style: themeStyle } = useTheme({
  pen: () => color,
  relativeScale: () => scale,
})
</script>

<style scoped>
@layer utensil {
  .utensil-page-indicator {
    --dot-size: var(--utensil-page-indicator-dot-size, var(--space-2));
    --dot-gap: var(--utensil-page-indicator-gap, var(--space-2));
    --current-width: var(--utensil-page-indicator-current-width, calc(var(--dot-size) * 3));

    display: inline-flex;
    align-items: center;
    gap: var(--dot-gap);
  }

  .utensil-page-indicator.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .utensil-page-indicator .page {
    position: relative;
    width: var(--dot-size);
    height: var(--dot-size);
    padding: 0;
    border: none;
    border-radius: var(--radius-full);
    background-color: var(--pencil-a6);
    cursor: pointer;
    outline: 2px solid transparent;
    outline-offset: 2px;
    transition:
      width 0.2s ease,
      background-color 0.15s ease,
      outline-color 0.1s ease;
  }

  /* A touch-sized hit area around each small dot. */
  .utensil-page-indicator .page::before {
    content: '';
    position: absolute;
    inset: calc(var(--dot-gap) / -2);
  }

  .utensil-page-indicator .page:hover {
    background-color: var(--pencil-a8);
  }

  .utensil-page-indicator .page:focus-visible {
    outline-color: var(--pen-8);
  }

  .utensil-page-indicator .page.current {
    width: var(--current-width);
    background-color: var(--pen-9);
  }

  .utensil-page-indicator .page.current:hover {
    background-color: var(--pen-10);
  }

  .utensil-reduced-motion .utensil-page-indicator .page {
    transition: none;
  }
}
</style>
