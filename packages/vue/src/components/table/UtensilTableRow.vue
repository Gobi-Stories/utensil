<template>
  <div
    class="utensil-table-row"
    :class="[`v-${variant}`, { interactive }]"
    role="row"
    :tabindex="interactive ? 0 : -1"
    @click="onClick"
    @keydown.enter.self.prevent="onClick"
    @keydown.space.self.prevent="onClick"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
export type TableRowVariant = 'default' | 'muted' | 'clustered'

export interface Props {
  variant?: TableRowVariant
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
    outline: 2px solid transparent;
    outline-offset: -2px;
    transition: outline-color 0.1s ease;
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
    outline-color: var(--pen-8);
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

<!-- Unscoped: slotted links aren't reached by scoped styles; .utensil-table-row scopes them -->
<style>
@layer utensil {
  /*
   * A stretched link: .utensil-table-row-link on a link in the row makes the whole row follow it. The row is its own
   * stacking context, so the link layers over positioned cells without reaching outside the row.
   */
  .utensil-table-row:has(.utensil-table-row-link) {
    position: relative;
    isolation: isolate;
  }

  .utensil-table-row:has(.utensil-table-row-link):hover {
    background: var(--pencil-a2);
  }

  /* :hover outranks the text themes' link hover, which would underline and recolour the row's name */
  .utensil-table-row .utensil-table-row-link,
  .utensil-table-row .utensil-table-row-link:hover {
    color: inherit;
    text-decoration: none;
    outline: none;
  }

  .utensil-table-row .utensil-table-row-link::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  /* The row shows the link's focus ring around itself */
  .utensil-table-row:has(.utensil-table-row-link:focus-visible) {
    outline-color: var(--pen-8);
  }

  /* Other controls in the row stay above the link */
  .utensil-table-row:has(.utensil-table-row-link)
    :where(a, button, input, select, textarea, label, [tabindex]):not(.utensil-table-row-link) {
    position: relative;
    z-index: 2;
  }
}
</style>
