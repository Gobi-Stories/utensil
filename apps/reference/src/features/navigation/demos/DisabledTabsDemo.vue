<template>
  <div id="disabled-tabs" class="component-demo">
    <h3><a class="demo-anchor" href="#disabled-tabs">Disabled Tabs</a></h3>
    <p>Individual tabs can be disabled to prevent interaction.</p>
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content demo-content-column">
          <UtensilTabs default-value="tab1">
            <ReferenceTabsList>
              <UtensilTabsTrigger value="tab1">Available</UtensilTabsTrigger>
              <UtensilTabsTrigger value="tab2" disabled>Disabled</UtensilTabsTrigger>
              <UtensilTabsTrigger value="tab3">Also Available</UtensilTabsTrigger>
            </ReferenceTabsList>
            <UtensilTabsContent value="tab1">
              <div class="tab-panel tab-panel-small">This tab is available</div>
            </UtensilTabsContent>
            <UtensilTabsContent value="tab2">
              <div class="tab-panel tab-panel-small">This tab is disabled</div>
            </UtensilTabsContent>
            <UtensilTabsContent value="tab3">
              <div class="tab-panel tab-panel-small">This tab is available</div>
            </UtensilTabsContent>
          </UtensilTabs>
        </div>
        <div class="demo-label">Disabled Tab</div>
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
