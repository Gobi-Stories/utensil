<template>
  <ReferenceComponentDemo
    title="Side Menu"
    anchor="side-menu"
    description="Responsive navigation side menu with collapsible sections, icon items, and adaptive layout. Built on UtensilDrawer."
  >
    <div class="demo-grid">
      <div class="demo-item demo-item-wide">
        <div class="demo-content side-menu-demo">
          <div ref="sideMenuDemoContainer" class="side-menu-demo-container">
            <UtensilSideMenu
              v-if="sideMenuDemoContainer"
              ref="sideMenuRef"
              :container="sideMenuDemoContainer"
              aria-label="Demo navigation"
              :ignoreOutsideClickOn="['.toggle-side-menu']"
            >
              <template #logo>
                <span class="side-menu-demo-logo">App</span>
              </template>
              <template #default>
                <div class="menu-section">
                  <ReferenceSideMenuItem
                    v-for="item in menuItems"
                    :key="item.title"
                    :title="item.title"
                    :icon="item.icon"
                    :selected="item.title === selectedMenuItem"
                    @click="selectedMenuItem = item.title"
                  />
                </div>
              </template>
              <template #footer>
                <div class="menu-section">
                  <ReferenceSideMenuItem title="Settings" icon="wrench" />
                </div>
              </template>
            </UtensilSideMenu>
            <div class="side-menu-demo-main">
              <UtensilButton class="toggle-side-menu" scale="small" variation="soft" @click="sideMenuRef?.toggle()"
                >Toggle Menu</UtensilButton
              >
            </div>
          </div>
        </div>
        <div class="demo-label">Responsive Side Menu</div>
      </div>
      <div class="demo-item">
        <div class="demo-content side-menu-states-demo">
          <div class="side-menu-states-grid">
            <ReferenceSideMenuItem title="Default" icon="home" />
            <ReferenceSideMenuItem title="Selected" icon="folder" selected />
            <ReferenceSideMenuItem title="Highlighted" icon="chart-column" highlighted />
            <ReferenceSideMenuItem title="Disabled" icon="wrench" disabled />
            <ReferenceSideMenuItem title="Muted" icon="user" muted />
          </div>
        </div>
        <div class="demo-label">Item States</div>
      </div>
    </div>

    <template #api>
      <UtensilSideMenuDoc />
      <UtensilSideMenuItemDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import UtensilSideMenu from 'utensil-vue/components/side-menu/UtensilSideMenu.vue'
import UtensilSideMenuDoc from 'utensil-vue/components/side-menu/UtensilSideMenuDoc.vue'
import UtensilSideMenuItemDoc from 'utensil-vue/components/side-menu/UtensilSideMenuItemDoc.vue'
import UtensilButton from 'utensil-vue/components/button/UtensilButton.vue'
import { ReferenceSideMenuItem } from '@/theme/components/ReferenceSideMenuItem'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { menuItems } from '../menu-items'

const sideMenuDemoContainer = useTemplateRef('sideMenuDemoContainer')
const sideMenuRef = useTemplateRef<InstanceType<typeof UtensilSideMenu>>('sideMenuRef')
const selectedMenuItem = ref('Dashboard')
</script>

<style scoped>
.demo-content {
  min-height: 200px;
}

.demo-content.side-menu-demo {
  padding: 0;
}

.demo-item-wide {
  grid-column: 1 / -1;
}

.side-menu-demo-container {
  position: relative;
  display: flex;
  width: 100%;
  height: 320px;
  border-radius: var(--radius-3);
  overflow: hidden;
  background-color: var(--pencil-2);
  container-type: inline-size;
  container-name: size-container;
}

.side-menu-demo-logo {
  font-weight: 600;
  font-size: var(--font-size-3);
  color: var(--pen-a11);
  white-space: nowrap;
}

.side-menu-demo-main {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: var(--space-4);
}

.side-menu-states-demo {
  flex-direction: column;
  align-items: stretch;
  padding: var(--space-3);
}

.side-menu-states-grid {
  display: flex;
  flex-direction: column;
  width: 200px;
}
</style>
