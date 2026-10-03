<template>
  <div
    class="utensil-table-row"
    :class="[`v-${variant}`, { interactive }]"
    role="row"
    :tabindex="interactive ? 0 : -1"
    @click="onClick"
    @keydown.enter="onClick"
    @keydown.space.prevent="onClick"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
type RowVariant = 'default' | 'muted' | 'clustered'

interface Props {
  variant?: RowVariant
  interactive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  interactive: false,
})

const emit = defineEmits<{ click: [event: Event] }>()

function onClick(event: Event) {
  if (props.interactive) emit('click', event)
}
</script>

<style scoped>
@layer utensil {
  /*
   * UtensilTableRow — a single data row inside `<UtensilTable>`.
   *
   * Reads `--utensil-table-columns` from the parent for its grid layout. Children
   * are arbitrary slot content (custom cells) — author lays out their own
   * markup per column.
   *
   * Variants:
   *   default   — standard padding and contrast
   *   muted     — softened text colour, same padding
   *   clustered — tighter vertical padding for grouped/related rows (e.g. log
   *               entries from the same author within a short window)
   */
  .utensil-table-row {
    display: grid;
    grid-template-columns: var(--utensil-table-columns);
    gap: var(--utensil-table-gap);
    align-items: center;
    padding-block: var(--utensil-table-padding-block);
    padding-inline: var(--utensil-table-padding-inline);
    border-bottom: 1px solid var(--pencil-a3);
    font-size: var(--font-size-2);
    color: var(--pencil-a12);
  }

  .utensil-table-row:last-child {
    border-bottom: 0;
  }

  .utensil-table-row.interactive {
    cursor: pointer;
  }

  .utensil-table-row.interactive:hover {
    background: var(--pencil-a2);
  }

  .utensil-table-row.interactive:focus-visible {
    outline: 2px solid var(--pen-8);
    outline-offset: -2px;
  }

  .utensil-table-row.v-muted {
    color: var(--pencil-a11);
  }

  .utensil-table-row.v-clustered {
    padding-block: var(--space-1);
    font-size: var(--font-size-1);
    color: var(--pencil-a11);
  }
}
</style>
