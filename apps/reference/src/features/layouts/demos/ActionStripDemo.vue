<template>
  <ReferenceComponentDemo
    title="Action Strip"
    anchor="action-strip"
    description="Vertical strip of icon actions with labels underneath — a permanent, non-collapsing alternative to the side menu that becomes a full sheet at small widths."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content action-strip-demo">
          <UtensilActionStrip ariaLabel="Demo action strip navigation">
            <template #header>
              <span class="action-strip-demo-logo">A</span>
            </template>
            <ReferenceActionStripItem
              v-for="item in menuItems"
              :key="item.title"
              :label="item.title"
              :icon="item.icon"
              :selected="item.title === selectedStripItem"
              @click="selectedStripItem = item.title"
            />
            <template #footer>
              <ReferenceCircleButton icon="info-circle" color="pencil" description="Help" />
            </template>
          </UtensilActionStrip>
          <div class="action-strip-demo-main">Content area</div>
        </div>
        <div class="demo-label">App Navigation</div>
      </div>
      <div class="demo-item">
        <div ref="actionSheetFrame" class="demo-content action-strip-sheet-demo">
          <ReferenceButton label="Open actions" variation="soft" @click="actionSheetOpen = true" />
          <UtensilActionStrip
            v-model:open="actionSheetOpen"
            :container="actionSheetFrame ?? undefined"
            title="Actions"
            ariaLabel="Demo actions sheet"
          >
            <ReferenceActionStripItem
              v-for="item in menuItems"
              :key="item.title"
              :label="item.title"
              :icon="item.icon"
              :selected="item.title === selectedStripItem"
              @click="selectedStripItem = item.title"
            />
            <template #sheet>
              <div class="action-strip-sheet-extra">Sheet-only content (user menu, support)</div>
            </template>
          </UtensilActionStrip>
        </div>
        <div class="demo-label always-visible">Sheet Form (narrow container)</div>
      </div>
      <div class="demo-item">
        <div class="demo-content action-strip-states-demo">
          <div class="action-strip-states-grid">
            <ReferenceActionStripItem label="Default" icon="home" />
            <ReferenceActionStripItem label="Selected" icon="folder" selected />
            <ReferenceActionStripItem label="Disabled" icon="wrench" disabled />
          </div>
        </div>
        <div class="demo-label always-visible">Item States</div>
      </div>
    </div>

    <template #api>
      <UtensilActionStripDoc />
      <UtensilActionStripItemDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import UtensilActionStrip from 'utensil-vue/components/action-strip/UtensilActionStrip.vue'
import UtensilActionStripDoc from 'utensil-vue/components/action-strip/UtensilActionStripDoc.vue'
import UtensilActionStripItemDoc from 'utensil-vue/components/action-strip/UtensilActionStripItemDoc.vue'
import { ReferenceActionStripItem } from '@/theme/components/ReferenceActionStripItem'
import { ReferenceCircleButton } from '@/theme/components/ReferenceCircleButton'
import { ReferenceButton } from '@/theme/components/ReferenceButton'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { menuItems } from '../menu-items'

const selectedStripItem = ref('Dashboard')

// Sheet-form demo: the narrow frame is the strip's measured container
const actionSheetOpen = ref(false)
const actionSheetFrame = useTemplateRef('actionSheetFrame')
</script>

<style scoped>
.demo-content {
  min-height: 200px;
}

.demo-content.action-strip-demo {
  display: flex;
  align-items: stretch;
  height: 320px;
  padding: 0;
  border-radius: var(--radius-3);
  overflow: hidden;
  background-color: var(--pencil-2);
}

.action-strip-demo-logo {
  font-weight: 700;
  font-size: var(--font-size-4);
  color: var(--pen-a11);
}

.action-strip-demo-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--pencil-a11);
  font-size: var(--font-size-2);
}

/* The narrow frame keeps the strip in its sheet form; the sheet fills the frame */
.demo-content.action-strip-sheet-demo {
  position: relative;
  width: 320px;
  height: 320px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-3);
  overflow: hidden;
  background-color: var(--pencil-2);
}

.action-strip-sheet-extra {
  padding: var(--space-3);
  border-radius: var(--radius-2);
  background-color: var(--pencil-a3);
  color: var(--pencil-a11);
  font-size: var(--font-size-1);
  text-align: center;
}

.action-strip-states-demo {
  align-items: center;
  padding: var(--space-3);
}

.action-strip-states-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  width: 96px;
}
</style>
