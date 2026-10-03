<template>
  <ReferenceComponentDemo
    title="Menu Item Variants"
    anchor="menu-item-variants"
    description="Menu items support icons, disabled state, and color styling."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <div class="standalone-menu">
            <UtensilMenuItem icon="edit" label="With Icon" @click="() => {}" />
            <UtensilMenuItem label="Without Icon" @click="() => {}" />
            <UtensilMenuItem icon="lock" label="Disabled" disabled @click="() => {}" />
            <UtensilMenuItem icon="trash-alt" label="Danger" color="red" @click="() => {}" />
          </div>
        </div>
        <div class="demo-label">Item Variants</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <div class="standalone-menu">
            <UtensilMenuItem icon="cut" @click="() => {}">
              <span>Custom slot content</span>
            </UtensilMenuItem>
            <UtensilMenuDivider />
            <UtensilMenuItem icon="paste" label="After divider" @click="() => {}" />
          </div>
        </div>
        <div class="demo-label">Slots & Dividers</div>
      </div>
    </div>

    <template #api>
      <UtensilMenuItemDoc />
      <UtensilMenuDividerDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import UtensilMenuDividerDoc from 'utensil-vue/components/menu/UtensilMenuDividerDoc.vue'
import UtensilMenuItemDoc from 'utensil-vue/components/menu/UtensilMenuItemDoc.vue'
import { ReferenceMenuItem as UtensilMenuItem } from '@/theme/components/ReferenceMenuItem'
import UtensilMenuDivider from 'utensil-vue/components/menu/UtensilMenuDivider.vue'
</script>

<style scoped>
.standalone-menu {
  display: flex;
  flex-direction: column;
  padding: var(--space-2);
  box-shadow: var(--shadow-border-3);
  border-radius: var(--radius-3);
}
</style>
