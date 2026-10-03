<template>
  <ReferenceComponentDemo
    title="Drawer"
    anchor="drawer"
    description="Collapsible side panel with responsive overlay, light dismiss, configurable transitions, and optional mobile bottom sheet mode."
  >
    <div class="demo-grid">
      <div class="demo-item demo-item-wide">
        <div class="demo-content drawer-demo">
          <div ref="drawerDemoContainer" class="drawer-demo-container">
            <UtensilDrawer
              ref="drawerRef"
              :container="drawerDemoContainer ?? undefined"
              width="180px"
              collapsed-width="0px"
              aria-label="Demo navigation"
              :ignoreOutsideClickOn="['.toggle-responsive-drawer']"
              position="start"
              #default="{ mode }"
            >
              <div class="drawer-demo-content" :class="{ open: 'closed' != mode }">
                <div class="drawer-demo-menu-item">Dashboard</div>
                <div class="drawer-demo-menu-item">Projects</div>
                <div class="drawer-demo-menu-item">Settings</div>
              </div>
            </UtensilDrawer>
            <div class="drawer-demo-main">
              <UtensilButton
                class="toggle-responsive-drawer"
                scale="small"
                variation="soft"
                @click="drawerRef?.toggle()"
                >Toggle Drawer</UtensilButton
              >
            </div>
          </div>
        </div>
        <div class="demo-label">Responsive Drawer</div>
      </div>
      <div class="demo-item demo-item-wide">
        <div class="demo-content drawer-demo">
          <div ref="drawerAlwaysDemoContainer" class="drawer-demo-container">
            <div class="drawer-demo-main">
              <UtensilButton
                class="toggle-overlay-drawer"
                scale="small"
                variation="soft"
                @click="drawerAlwaysRef?.toggle()"
                >Toggle Overlay Drawer</UtensilButton
              >
            </div>
            <UtensilDrawer
              ref="drawerAlwaysRef"
              :container="drawerAlwaysDemoContainer ?? undefined"
              overlay="always"
              width="180px"
              aria-label="Overlay navigation"
              :startClosed="true"
              :ignoreOutsideClickOn="['.toggle-overlay-drawer']"
              #default="{ mode }"
            >
              <div class="drawer-demo-content" :class="{ open: 'closed' != mode }">
                <div class="drawer-demo-menu-item">Home</div>
                <div class="drawer-demo-menu-item">Files</div>
                <div class="drawer-demo-menu-item">Teams</div>
              </div>
            </UtensilDrawer>
          </div>
        </div>
        <div class="demo-label always-visible">Always Overlay</div>
      </div>
    </div>

    <template #api>
      <UtensilDrawerDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import UtensilDrawer from 'utensil-vue/components/drawer/UtensilDrawer.vue'
import UtensilDrawerDoc from 'utensil-vue/components/drawer/UtensilDrawerDoc.vue'
import UtensilButton from 'utensil-vue/components/button/UtensilButton.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

const drawerDemoContainer = useTemplateRef('drawerDemoContainer')
const drawerRef = useTemplateRef<InstanceType<typeof UtensilDrawer>>('drawerRef')
const drawerAlwaysDemoContainer = useTemplateRef('drawerAlwaysDemoContainer')
const drawerAlwaysRef = useTemplateRef<InstanceType<typeof UtensilDrawer>>('drawerAlwaysRef')
</script>

<style scoped>
.drawer-demo {
  --utensil-drawer-z-index: 1;
}

.demo-content.drawer-demo {
  padding: 0;
}

.drawer-demo-container {
  position: relative;
  display: flex;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: var(--pencil-2);
  container-type: inline-size;
  container-name: size-container;
}

.drawer-demo-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  height: 100%;
  padding: var(--space-3);
  background-color: var(--panel-solid);

  &.open {
    box-shadow: var(--shadow-border-2);
  }
}

.drawer-demo-menu-item {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-2);
  font-size: var(--font-size-2);
  color: var(--pencil-a11);
  white-space: nowrap;
}

.drawer-demo-main {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: var(--space-4);
}

.demo-item-wide {
  grid-column: 1 / -1;
}

.demo-content {
  min-height: 200px;
}
</style>
