<template>
  <ReferenceComponentDemo
    title="Context Menu"
    anchor="context-menu"
    description="Right-click on the target area to open the context menu. The menu positions at the cursor location and closes on click outside or Escape."
  >
    <div class="demo-grid">
      <div class="demo-item no-border">
        <UtensilContextMenuArea>
          <div class="demo-content context-target">
            <span class="target-text">Right-click here</span>
          </div>
          <template #menu="{ isFocused, focus, close }">
            <UtensilMenuItem icon="info-circle" label="View Details" @click="handleMenuAction('details')" />
            <UtensilMenuItem icon="edit" label="Edit" @click="handleMenuAction('edit')" />
            <UtensilMenuItem icon="copy" label="Duplicate" @click="handleMenuAction('duplicate')" />
            <UtensilMenuDivider />
            <UtensilMenuItem icon="star" label="Add to Favorites" @click="handleMenuAction('favorite')" />
            <UtensilMenuItem icon="share-alt" label="Share" disabled @click="handleMenuAction('share')" />
            <UtensilMenuDivider />
            <UtensilMenuItem icon="trash-alt" label="Delete" color="red" @click="handleMenuAction('delete')" />
            <UtensilMenuDivider />
            <div
              ref="customItemRef"
              class="custom-menu-action"
              :class="{ focused: customItemRef && isFocused(customItemRef) }"
              data-focusable
              tabindex="-1"
              @click="(handleMenuAction('custom'), close())"
              @keydown.enter="(handleMenuAction('custom'), close())"
              @keydown.space.prevent="(handleMenuAction('custom'), close())"
              @mouseenter="customItemRef && focus(customItemRef)"
            >
              <ReferenceIcon icon="cog" class="custom-action-icon" />
              <span class="custom-action-text">Custom Action</span>
              <UtensilBadge squared>New</UtensilBadge>
            </div>
          </template>
        </UtensilContextMenuArea>
        <div class="demo-label">Right-click trigger</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton @click="openMenuAtButton">Open Context Menu</UtensilButton>
        </div>
        <div class="demo-label">Programmatic trigger</div>
      </div>
    </div>

    <UtensilContextMenu ref="buttonMenuRef" :position="buttonMenuPosition">
      <UtensilMenuItem icon="info-circle" label="View Details" @click="handleMenuAction('details')" />
      <UtensilMenuItem icon="edit" label="Edit" @click="handleMenuAction('edit')" />
      <UtensilMenuItem icon="copy" label="Duplicate" @click="handleMenuAction('duplicate')" />
      <UtensilMenuDivider />
      <UtensilMenuItem icon="star" label="Add to Favorites" @click="handleMenuAction('favorite')" />
      <UtensilMenuItem icon="share-alt" label="Share" disabled @click="handleMenuAction('share')" />
      <UtensilMenuDivider />
      <UtensilMenuItem icon="trash-alt" label="Delete" color="red" @click="handleMenuAction('delete')" />
    </UtensilContextMenu>

    <template #api>
      <UtensilContextMenuDoc />
      <UtensilContextMenuAreaDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilContextMenu from 'utensil-vue/components/context-menu/UtensilContextMenu.vue'
import UtensilContextMenuArea from 'utensil-vue/components/context-menu/UtensilContextMenuArea.vue'
import UtensilContextMenuAreaDoc from 'utensil-vue/components/context-menu/UtensilContextMenuAreaDoc.vue'
import UtensilContextMenuDoc from 'utensil-vue/components/context-menu/UtensilContextMenuDoc.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { ReferenceMenuItem as UtensilMenuItem } from '@/theme/components/ReferenceMenuItem'
import UtensilMenuDivider from 'utensil-vue/components/menu/UtensilMenuDivider.vue'
import UtensilButton from 'utensil-vue/components/button/UtensilButton.vue'
import UtensilBadge from 'utensil-vue/components/badge/UtensilBadge.vue'
import { ReferenceIcon } from '@/theme/components/ReferenceIcon'

const customItemRef = ref<HTMLElement>()
const buttonMenuRef = ref<InstanceType<typeof UtensilContextMenu>>()
const buttonMenuPosition = ref({ top: 0, left: 0 })

function openMenuAtButton(event: MouseEvent) {
  const button = event.target as HTMLElement
  const rect = button.getBoundingClientRect()
  buttonMenuPosition.value = { top: rect.bottom + 4, left: rect.left }
  buttonMenuRef.value?.toggle()
}

function handleMenuAction(action: string) {
  console.log(`Menu action: ${action}`)
}
</script>

<style scoped>
.context-target {
  background-color: var(--pencil-3);
  border: 2px dashed var(--pencil-6);
  border-top-left-radius: var(--radius-2);
  border-top-right-radius: var(--radius-2);
  cursor: context-menu;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.context-target:hover {
  background-color: var(--pencil-4);
  border-color: var(--pencil-8);
}

.target-text {
  color: var(--pencil-11);
  font-size: var(--font-size-2);
}

.custom-menu-action {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  margin: 0 var(--space-1);
  border-radius: var(--radius-2);
  background: linear-gradient(135deg, var(--pen-a3), var(--pen-a2));
  font-size: var(--font-size-2);
  color: var(--pen-11);
  cursor: pointer;
  outline: none;
  transition: background 0.1s ease;
}

.custom-menu-action:hover,
.custom-menu-action[data-focused],
.custom-menu-action.focused {
  background: linear-gradient(135deg, var(--pen-a4), var(--pen-a3));
}

.custom-action-icon {
  flex-shrink: 0;
  color: var(--pen-9);
}

.custom-action-text {
  flex: 1;
}
</style>
