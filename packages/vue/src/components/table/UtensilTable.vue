<template>
  <div class="utensil-table" role="table" :style="cssVars">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /**
   * grid-template-columns value. Either a raw CSS string
   * (e.g. `"72px 110px 1fr 240px 200px"`) or an array of values
   * (joined with spaces).
   */
  columns?: string | (string | number)[]
  /**
   * Alternative track template applied at narrow widths (<= 576px of the enclosing
   * size-container). Pair with hiding the dropped cells at the same breakpoint.
   */
  narrowColumns?: string | (string | number)[]
}

const props = defineProps<Props>()

function columnsCss(columns?: string | (string | number)[]): string | undefined {
  if (!columns) return undefined
  if (typeof columns === 'string') return columns
  return columns.map((v) => (typeof v === 'number' ? `${v}px` : v)).join(' ')
}

const cssVars = computed<Record<string, string>>(() => {
  const out: Record<string, string> = {}
  const wide = columnsCss(props.columns)
  const narrow = columnsCss(props.narrowColumns)
  if (wide) out['--utensil-table-columns-wide'] = wide
  if (narrow) out['--utensil-table-columns-narrow'] = narrow
  return out
})
</script>

<style scoped>
@layer utensil {
  /*
   * UtensilTable — composable data table.
   *
   * Use directly as the container; compose `<UtensilTableHeader>` (optional) and
   * `<UtensilTableRow>` children inside. The `columns` prop sets the grid track
   * template that every row reads via `--utensil-table-columns`. Omit
   * `<UtensilTableHeader>` entirely for headerless tables (e.g. audit logs).
   */
  .utensil-table {
    --utensil-table-columns: var(--utensil-table-columns-wide, 1fr);
    --utensil-table-gap: var(--space-4);
    --utensil-table-padding-block: var(--space-3);
    --utensil-table-padding-inline: var(--space-4);

    display: block;
    background: var(--panel-solid);
    border-radius: var(--radius-4);
    box-shadow: inset 0 0 0 1px var(--pencil-a4);
    overflow: hidden;
  }

  @container size-container (max-width: 576px) {
    .utensil-table {
      --utensil-table-columns: var(--utensil-table-columns-narrow, var(--utensil-table-columns-wide, 1fr));
    }
  }
}
</style>
