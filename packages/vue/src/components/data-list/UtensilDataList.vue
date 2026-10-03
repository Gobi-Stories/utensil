<template>
  <dl class="utensil-data-list" :class="[orientation, { block }]">
    <slot></slot>
  </dl>
</template>

<script setup lang="ts">
import { provide } from 'vue'

type DataListOrientation = 'horizontal' | 'vertical'

interface Props {
  orientation?: DataListOrientation
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
  block: false,
})

provide('utensil-data-list-orientation', () => props.orientation)
provide('utensil-data-list-block', () => props.block)
</script>

<style scoped>
@layer utensil {
  .utensil-data-list {
    margin: 0;
    padding: 0;
    font-size: var(--font-size-2);
    overflow-wrap: anywhere;
    text-align: start;
  }

  .utensil-data-list.horizontal {
    display: grid;
    grid-template-columns: var(--data-list-label-width, auto) 1fr;
    gap: var(--space-2) var(--space-4);
  }

  .utensil-data-list.vertical {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }

  .utensil-data-list.block {
    width: 100%;
  }
}
</style>
