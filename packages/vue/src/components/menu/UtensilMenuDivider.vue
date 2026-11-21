<template>
  <div class="utensil-menu-divider" role="separator" />
</template>

<style scoped>
@layer utensil {
  /* The rule is a border, which forced colors keeps and draws in CanvasText; a fill would take the page's color */
  .utensil-menu-divider {
    height: 1px;
    border-block-start: 1px solid var(--pencil-a6);
    margin: var(--space-1) var(--space-2);
  }

  /* High contrast: a stronger rule, as the divider's */
  .utensil-high-contrast .utensil-menu-divider {
    border-color: var(--pencil-a8);
  }
}
</style>
