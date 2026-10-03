<template>
  <component :is="element" class="utensil-header">
    <slot>{{ title }}</slot>
    <div v-if="$slots.actions" class="utensil-header-actions">
      <slot name="actions"></slot>
    </div>
  </component>
</template>

<script setup lang="ts">
type HeaderElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

interface Props {
  title?: string
  element?: HeaderElement
}

const { element = 'h3' } = defineProps<Props>()
</script>

<style scoped>
@layer utensil {
  .utensil-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-3);
  }

  .utensil-header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-shrink: 0;
  }
}
</style>
