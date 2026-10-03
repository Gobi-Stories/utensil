<template>
  <div class="utensil-table-header" role="row">
    <slot />
  </div>
</template>

<style scoped>
@layer utensil {
  /*
   * UtensilTableHeader — the column header row inside `<UtensilTable>`.
   *
   * Optional; omit entirely for headerless tables. Reads
   * `--utensil-table-columns` from the parent so cells align with rows below.
   * Children are arbitrary slot content (column header cells).
   */
  .utensil-table-header {
    display: grid;
    grid-template-columns: var(--utensil-table-columns);
    gap: var(--utensil-table-gap);
    align-items: center;
    padding-block: var(--space-3);
    padding-inline: var(--utensil-table-padding-inline);
    border-bottom: 1px solid var(--pencil-a4);
    font-size: var(--font-size-1);
    font-weight: 600;
    color: var(--pencil-a11);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
}
</style>
