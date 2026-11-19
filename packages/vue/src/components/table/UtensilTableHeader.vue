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
   * Children are arbitrary slot content (column header cells). They sit on
   * the row's bottom edge, so a label that wraps grows upward and its last
   * line stays beside the other headers, above its column's values.
   */
  .utensil-table-header {
    display: grid;
    grid-template-columns: var(--utensil-table-columns, 1fr);
    gap: var(--utensil-table-gap, var(--space-4));
    align-items: end;
    padding-block: var(--utensil-table-padding-block, var(--space-3));
    padding-inline: var(--utensil-table-padding-inline, var(--space-4));
    border-block-end: 1px solid var(--utensil-table-header-separator, var(--pencil-a4));
    font-size: var(--font-size-1);
    font-weight: var(--utensil-table-header-font-weight, 600);
    color: var(--pencil-a11);
    text-transform: uppercase;
    letter-spacing: var(--utensil-table-header-letter-spacing, 0.04em);
  }

  .utensil-high-contrast .utensil-table-header {
    border-block-end-color: var(--utensil-table-header-separator, var(--pencil-a8));
  }
}
</style>
