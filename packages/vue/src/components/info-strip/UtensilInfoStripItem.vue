<template>
  <div class="utensil-info-strip-item">
    <dt class="utensil-info-strip-label">
      <slot name="label">{{ label }}</slot>
    </dt>
    <dd class="utensil-info-strip-value">
      <slot></slot>
    </dd>
  </div>
</template>

<script setup lang="ts">
// A single stat within a UtensilInfoStrip: a prominent value (default slot) with a small label.
// Alignment and label placement are inherited from the parent strip via CSS custom properties.
interface Props {
  /** Text label for the value. Use the `label` slot for richer content. */
  label?: string
}

defineProps<Props>()
</script>

<style scoped>
@layer utensil {
  .utensil-info-strip-item {
    display: flex;
    flex-direction: column;
    align-items: var(--info-strip-item-align, center);
    gap: var(--space-1);
    min-width: 0;
  }

  .utensil-info-strip-label {
    order: var(--info-strip-label-order, 0);
    font-size: var(--font-size-0);
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--pencil-a10);
  }

  .utensil-info-strip-value {
    margin: 0;
    min-width: 0;
    font-size: var(--font-size-3);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .utensil-high-contrast .utensil-info-strip-label {
    color: var(--pencil-a11);
  }
}
</style>
