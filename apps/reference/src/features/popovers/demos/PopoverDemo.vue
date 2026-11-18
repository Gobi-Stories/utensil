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
      <div class="demo-item">
        <div class="demo-content">
          <UtensilPopover placement="bottom">
            <template #trigger="{ toggle, isOpen }">
              <ReferenceButton variation="soft" color="pencil" icon="search" :pressed="isOpen" @click="toggle">
                Zoom {{ zoom }}%
              </ReferenceButton>
            </template>
            <div class="zoom-panel">
              <ReferenceRangeSlider v-model="zoom" label="Zoom" :min="25" :max="200" unit="%" />
            </div>
          </UtensilPopover>
        </div>
        <div class="demo-label">Control in a Popover</div>
      </div>
    </div>

    <template #api>
      <UtensilPopoverDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import UtensilPopover from '@gobistories/utensil-vue/components/popover/UtensilPopover.vue'
import UtensilPopoverDoc from '@gobistories/utensil-vue/components/popover/UtensilPopoverDoc.vue'
import UtensilButton from '@gobistories/utensil-vue/components/button/UtensilButton.vue'
import { ref } from 'vue'
import { ReferenceButton } from '@/theme/components/ReferenceButton'
import { ReferenceRangeSlider } from '@/theme/components/ReferenceRangeSlider'

const zoom = ref(100)
</script>

<style scoped>
.zoom-panel {
  width: 14rem;
  padding: var(--space-3);
  background-color: var(--panel-solid);
  border-radius: var(--radius-3);
  box-shadow: var(--shadow-border-3);
}

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
