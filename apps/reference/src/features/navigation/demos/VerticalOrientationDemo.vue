<template>
  <div id="vertical-orientation" class="component-demo">
    <h3><a class="demo-anchor" href="#vertical-orientation">Vertical Orientation</a></h3>
    <p>Tabs can be oriented vertically for sidebar-style navigation.</p>
    <div class="demo-grid">
      <div class="demo-item demo-item-wide">
        <div class="demo-content demo-content-start">
          <UtensilTabs default-value="general" orientation="vertical" class="vertical-tabs-demo">
            <ReferenceTabsList>
              <UtensilTabsTrigger value="general">General</UtensilTabsTrigger>
              <UtensilTabsTrigger value="security">Security</UtensilTabsTrigger>
              <UtensilTabsTrigger value="notifications">Notifications</UtensilTabsTrigger>
              <UtensilTabsTrigger value="integrations">Integrations</UtensilTabsTrigger>
            </ReferenceTabsList>
            <UtensilTabsContent value="general">
              <div class="tab-panel">General settings panel content.</div>
            </UtensilTabsContent>
            <UtensilTabsContent value="security">
              <div class="tab-panel">Security settings panel content.</div>
            </UtensilTabsContent>
            <UtensilTabsContent value="notifications">
              <div class="tab-panel">Notification preferences panel content.</div>
            </UtensilTabsContent>
            <UtensilTabsContent value="integrations">
              <div class="tab-panel">Integration settings panel content.</div>
            </UtensilTabsContent>
          </UtensilTabs>
        </div>
        <div class="demo-label">Vertical Orientation</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UtensilTabs from '@gobistories/utensil-vue/components/tabs/UtensilTabs.vue'
import UtensilTabsTrigger from '@gobistories/utensil-vue/components/tabs/UtensilTabsTrigger.vue'
import UtensilTabsContent from '@gobistories/utensil-vue/components/tabs/UtensilTabsContent.vue'
import { ReferenceTabsList } from '@/theme/components/ReferenceTabsList'
</script>

<style scoped>
.tab-panel {
  padding: var(--space-4);
  color: var(--pencil-11);
}

.demo-content-start {
  align-items: flex-start;
  justify-content: flex-start;
}

.demo-item-wide {
  grid-column: 1 / -1;
}

.vertical-tabs-demo {
  width: 100%;
  min-height: 150px;
}

.vertical-tabs-demo .tab-panel {
  padding-left: var(--space-5);
}

.vertical-tabs-demo .utensil-tabs-content {
  max-width: 65%;
}
</style>
