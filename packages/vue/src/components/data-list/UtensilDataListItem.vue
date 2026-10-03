<template>
  <div
    class="utensil-data-list-item"
    :class="[effectiveOrientation, alignment ? `align-${alignment}` : '', { block: isBlock }]"
  >
    <dt class="utensil-data-list-label">
      <slot name="label">{{ label }}</slot>
    </dt>
    <dd class="utensil-data-list-value">
      <slot></slot>
    </dd>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'

type DataListOrientation = 'horizontal' | 'vertical'
type DataListAlign = 'baseline' | 'start' | 'center' | 'end'

interface Props {
  label?: string
  alignment?: DataListAlign
}

defineProps<Props>()

const parentOrientation = inject<() => DataListOrientation>('utensil-data-list-orientation', () => 'horizontal')
const parentBlock = inject<() => boolean>('utensil-data-list-block', () => false)

const effectiveOrientation = computed(() => parentOrientation())
const isBlock = computed(() => parentBlock())
</script>

<style scoped>
@layer utensil {
  .utensil-data-list-label {
    color: var(--pencil-a11);
    display: flex;
    align-items: center;
  }

  .utensil-data-list-value {
    margin: 0;
    min-width: 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  /* Horizontal layout - participates in parent grid via subgrid */
  .utensil-data-list-item.horizontal {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: span 2;
    align-items: baseline;
  }

  /* Zero-width joiner for baseline alignment (horizontal only) */
  .utensil-data-list-item.horizontal .utensil-data-list-label::before,
  .utensil-data-list-item.horizontal .utensil-data-list-value::before {
    content: '\200d';
  }

  /* Block mode: value aligns to end */
  .utensil-data-list-item.horizontal.block .utensil-data-list-value {
    justify-content: flex-end;
    text-align: right;
  }

  /* Vertical layout */
  .utensil-data-list-item.vertical {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);

    & .utensil-data-list-label {
      margin-bottom: var(--space-1);
    }
  }

  /* Alignment overrides (horizontal mode) */
  .utensil-data-list-item.align-start {
    align-items: start;
  }

  .utensil-data-list-item.align-center {
    align-items: center;
  }

  .utensil-data-list-item.align-end {
    align-items: end;
  }

  /* High contrast mode */
  .utensil-high-contrast .utensil-data-list-label {
    color: var(--pencil-12);
  }
}
</style>
