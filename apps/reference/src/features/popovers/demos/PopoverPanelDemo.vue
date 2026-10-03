<template>
  <ReferenceComponentDemo
    title="Popover Panel"
    anchor="popover-panel"
    description="A styled popover with default appearance. Click the trigger to toggle. Light dismiss (click outside) closes it automatically."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <UtensilPopoverPanel>
            <template #trigger="{ toggle }">
              <UtensilButton @click="toggle">Toggle Popover</UtensilButton>
            </template>
            <div class="popover-content">
              <p>This is a basic popover.</p>
              <p>Click outside or press Escape to close.</p>
            </div>
          </UtensilPopoverPanel>
        </div>
        <div class="demo-label">Basic</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilPopoverPanel v-model="controlledPopover">
            <template #trigger="{ toggle }">
              <UtensilButton @click="toggle"> {{ controlledPopover ? 'Close' : 'Open' }} Popover </UtensilButton>
            </template>
            <template #default="{ close }">
              <div class="popover-content">
                <p>This popover is controlled via v-model.</p>
                <UtensilButton size="small" @click="close">Close from content</UtensilButton>
              </div>
            </template>
          </UtensilPopoverPanel>
        </div>
        <div class="demo-label">Close From Content</div>
      </div>
    </div>

    <template #api>
      <UtensilPopoverPanelDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import UtensilPopoverPanel from 'utensil-vue/components/popover/UtensilPopoverPanel.vue'
import UtensilPopoverPanelDoc from 'utensil-vue/components/popover/UtensilPopoverPanelDoc.vue'
import UtensilButton from 'utensil-vue/components/button/UtensilButton.vue'

const controlledPopover = ref(false)
</script>

<style scoped>
.popover-content {
  padding: var(--space-2);
}
</style>
