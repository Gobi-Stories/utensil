<template>
  <div class="utensil-menu-divider" role="separator" />
</template>

<style scoped>
@layer utensil {
  .utensil-menu-divider {
    height: 1px;
    background-color: var(--pencil-a6);
    margin: var(--space-1) var(--space-2);
  }

  /* High contrast: a stronger rule, as the divider's */
  .utensil-high-contrast .utensil-menu-divider {
    background-color: var(--pencil-a8);
  }
}
</style>
