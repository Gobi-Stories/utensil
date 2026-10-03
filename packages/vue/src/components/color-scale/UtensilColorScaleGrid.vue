<template>
  <div class="utensil-color-scale-grid">
    <!-- Category labels -->
    <div class="scale-labels-wrapper">
      <div class="scale-labels-spacer"></div>
      <div class="scale-labels">
        <div class="scale-label" style="grid-column: 1 / 3">Backgrounds</div>
        <div class="scale-label" style="grid-column: 3 / 6">Interactive components</div>
        <div class="scale-label" style="grid-column: 6 / 9">Borders and separators</div>
        <div class="scale-label" style="grid-column: 9 / 11">Solid colors</div>
        <div class="scale-label" style="grid-column: 11 / 13">Accessible text</div>
      </div>
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
@layer utensil {
  .utensil-color-scale-grid {
    margin-bottom: var(--space-6);
  }

  .scale-labels-wrapper {
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 12px;
    margin-bottom: var(--space-2);
  }

  .scale-labels {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 4px;
  }

  .scale-label {
    font-size: 0.75rem;
    color: var(--pencil-12);
    text-align: center;
    padding: var(--space-2) 0;
    border-bottom: 2px solid var(--pen-7);
  }

  /* Width matches UtensilColorScale when row labels are hidden */
  @container size-container (max-width: 551px) {
    .scale-labels-wrapper {
      grid-template-columns: 1fr;
    }
  }

  @container size-container (max-width: 487px) {
    .scale-labels-wrapper {
      display: none;
    }
  }
}
</style>
