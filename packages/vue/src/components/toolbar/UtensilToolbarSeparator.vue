<template>
  <UtensilDivider
    class="utensil-toolbar-separator"
    :vertical="separatorOrientation === 'vertical'"
    :color="toolbar ? 'pen' : undefined"
  />
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import UtensilDivider from '../divider/UtensilDivider.vue'
import { TOOLBAR_DEFAULTS, UtensilToolbarContextKey, type ToolbarOrientation } from './utensil-toolbar'

/** A rule between groups of a toolbar's controls, across the direction they run in */
export interface Props {
  /** The separator's own direction; by default across the toolbar's */
  orientation?: ToolbarOrientation
}

const props = defineProps<Props>()

// In a toolbar, the separator is drawn in its pen
const toolbar = inject(UtensilToolbarContextKey, null)

const separatorOrientation = computed<ToolbarOrientation>(() => {
  if (props.orientation) {
    return props.orientation
  }
  const toolbarOrientation = toolbar?.orientation.value ?? TOOLBAR_DEFAULTS.orientation
  return toolbarOrientation === 'horizontal' ? 'vertical' : 'horizontal'
})
</script>

<style scoped>
@layer utensil {
  .utensil-toolbar-separator {
    flex: none;
    margin-block: var(--utensil-toolbar-separator-margin, var(--space-1));
  }

  .utensil-toolbar-separator.vertical {
    min-height: var(--space-4);
    margin-block: 0;
    margin-inline: var(--utensil-toolbar-separator-margin, var(--space-1));
  }

  .utensil-high-contrast .utensil-divider.utensil-toolbar-separator {
    border-color: var(--pen-a9);
  }
}
</style>
