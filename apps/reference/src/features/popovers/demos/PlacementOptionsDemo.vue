<template>
  <div id="placement-options" class="component-demo">
    <h3><a class="demo-anchor" href="#placement-options">Placement Options</a></h3>
    <p>Position the popover relative to the trigger using the placement prop.</p>
    <div class="placement-grid">
      <template v-for="placement in placements" :key="placement">
        <UtensilPopoverPanel class="placement-item" :placement="placement">
          <template #trigger="{ toggle }">
            <UtensilButton variation="outline" size="small" @click="toggle">{{ placement }}</UtensilButton>
          </template>
          <span class="placement-label">{{ placement }}</span>
        </UtensilPopoverPanel>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import UtensilPopoverPanel from '@gobistories/utensil-vue/components/popover/UtensilPopoverPanel.vue'
import UtensilButton from '@gobistories/utensil-vue/components/button/UtensilButton.vue'
import type { PopoverPlacement } from '@gobistories/utensil-vue/components/popover/utensil-popover'

const placements: PopoverPlacement[] = [
  'top-start',
  'top',
  'top-end',
  'left-start',
  'left',
  'left-end',
  'right-start',
  'right',
  'right-end',
  'bottom-start',
  'bottom',
  'bottom-end',
]
</script>

<style scoped>
.placement-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  max-width: 400px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-4);
}

.placement-item {
  display: flex;
  justify-content: center;

  .utensil-button {
    width: 100%;
    height: 50px;
  }
}

.placement-label {
  white-space: nowrap;
}
</style>
