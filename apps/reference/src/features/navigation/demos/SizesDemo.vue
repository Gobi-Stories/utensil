<template>
  <div id="sizes" class="component-demo">
    <h3><a class="demo-anchor" href="#sizes">Sizes</a></h3>
    <p>Tabs come in two sizes: Default and Compact.</p>
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content demo-content-column">
          <UtensilTabs default-value="tab1">
            <ReferenceTabsList size="2">
              <UtensilTabsTrigger value="tab1">First</UtensilTabsTrigger>
              <UtensilTabsTrigger value="tab2">Second</UtensilTabsTrigger>
              <UtensilTabsTrigger value="tab3">Third</UtensilTabsTrigger>
            </ReferenceTabsList>
            <UtensilTabsContent value="tab1">
              <div class="tab-panel tab-panel-small">Size 2 content</div>
            </UtensilTabsContent>
            <UtensilTabsContent value="tab2">
              <div class="tab-panel tab-panel-small">Size 2 content</div>
            </UtensilTabsContent>
            <UtensilTabsContent value="tab3">
              <div class="tab-panel tab-panel-small">Size 2 content</div>
            </UtensilTabsContent>
          </UtensilTabs>
        </div>
        <div class="demo-label">Default</div>
      </div>
      <div class="demo-item">
        <div class="demo-content demo-content-column">
          <UtensilTabs default-value="tab1">
            <ReferenceTabsList size="1">
              <UtensilTabsTrigger value="tab1">First</UtensilTabsTrigger>
              <UtensilTabsTrigger value="tab2">Second</UtensilTabsTrigger>
              <UtensilTabsTrigger value="tab3">Third</UtensilTabsTrigger>
            </ReferenceTabsList>
            <UtensilTabsContent value="tab1">
              <div class="tab-panel tab-panel-small">Size 1 content</div>
            </UtensilTabsContent>
            <UtensilTabsContent value="tab2">
              <div class="tab-panel tab-panel-small">Size 1 content</div>
            </UtensilTabsContent>
            <UtensilTabsContent value="tab3">
              <div class="tab-panel tab-panel-small">Size 1 content</div>
            </UtensilTabsContent>
          </UtensilTabs>
        </div>
        <div class="demo-label">Compact</div>
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

.tab-panel-small {
  padding: var(--space-3);
}

.demo-content-column {
  flex-direction: column;
  align-items: stretch;
}
</style>
