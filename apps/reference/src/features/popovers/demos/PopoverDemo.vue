<template>
  <ReferenceComponentDemo
    title="Popover"
    anchor="popover"
    description="The base UtensilPopover is unstyled, allowing full customization for tooltips, context menus, hover cards, etc."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <UtensilPopover>
            <template #trigger="{ toggle }">
              <UtensilButton color="success" @click="toggle">Custom Tooltip Style</UtensilButton>
            </template>
            <div class="custom-tooltip">This is a custom styled tooltip!</div>
          </UtensilPopover>
        </div>
        <div class="demo-label">Tooltip Style</div>
      </div>
    </div>

    <template #api>
      <UtensilPopoverDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import UtensilPopover from 'utensil-vue/components/popover/UtensilPopover.vue'
import UtensilPopoverDoc from 'utensil-vue/components/popover/UtensilPopoverDoc.vue'
import UtensilButton from 'utensil-vue/components/button/UtensilButton.vue'
</script>

<style scoped>
.custom-tooltip {
  background-color: var(--pen-9);
  color: var(--pen-contrast);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-2);
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
}
</style>
