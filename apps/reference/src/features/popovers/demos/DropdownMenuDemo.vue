<template>
  <ReferenceComponentDemo
    title="Dropdown Menu"
    anchor="dropdown-menu"
    description="For menus triggered by buttons or other elements, use UtensilDropdownMenu which anchors to a trigger element instead of the mouse position."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <UtensilDropdownMenu placement="bottom-start">
            <template #trigger="{ toggle }">
              <UtensilButton @click="toggle">Open Menu</UtensilButton>
            </template>
            <UtensilMenuItem icon="eye" label="View" @click="handleMenuAction('view')" />
            <UtensilMenuItem icon="edit" label="Edit" @click="handleMenuAction('edit')" />
            <UtensilMenuDivider />
            <UtensilMenuItem icon="trash-alt" label="Delete" color="red" @click="handleMenuAction('delete')" />
          </UtensilDropdownMenu>
        </div>
        <div class="demo-label">Dropdown</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilDropdownMenu placement="bottom-end">
            <template #trigger="{ toggle, isOpen }">
              <UtensilButton @click="toggle" style="min-width: 100px">
                {{ isOpen ? 'Close' : 'Actions' }} ▾
              </UtensilButton>
            </template>
            <UtensilMenuItem
              icon="download"
              label="Download"
              @click="handleMenuAction('download')"
              shortcut="Shift + D"
            />
            <UtensilMenuItem icon="copy" label="Copy Link" @click="handleMenuAction('copy-link')" />
            <UtensilMenuItem icon="share-alt" label="Share" @click="handleMenuAction('share')" />
          </UtensilDropdownMenu>
        </div>
        <div class="demo-label">Placed at bottom end</div>
      </div>
    </div>

    <template #api>
      <UtensilDropdownMenuDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import UtensilDropdownMenu from 'utensil-vue/components/dropdown-menu/UtensilDropdownMenu.vue'
import UtensilDropdownMenuDoc from 'utensil-vue/components/dropdown-menu/UtensilDropdownMenuDoc.vue'
import { ReferenceMenuItem as UtensilMenuItem } from '@/theme/components/ReferenceMenuItem'
import UtensilMenuDivider from 'utensil-vue/components/menu/UtensilMenuDivider.vue'
import UtensilButton from 'utensil-vue/components/button/UtensilButton.vue'

function handleMenuAction(action: string) {
  console.log(`Menu action: ${action}`)
}
</script>
