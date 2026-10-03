<template>
  <div id="activation-mode" class="component-demo">
    <h3><a class="demo-anchor" href="#activation-mode">Activation Mode</a></h3>
    <p>
      Automatic mode activates tabs on focus (default). Manual mode requires explicit click or Enter/Space key press.
    </p>
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content demo-content-column">
          <UtensilTabs default-value="tab1" activation-mode="automatic">
            <ReferenceTabsList>
              <UtensilTabsTrigger value="tab1">Auto 1</UtensilTabsTrigger>
              <UtensilTabsTrigger value="tab2">Auto 2</UtensilTabsTrigger>
              <UtensilTabsTrigger value="tab3">Auto 3</UtensilTabsTrigger>
            </ReferenceTabsList>
            <UtensilTabsContent value="tab1">
              <div class="tab-panel tab-panel-small">Activated on focus</div>
            </UtensilTabsContent>
            <UtensilTabsContent value="tab2">
              <div class="tab-panel tab-panel-small">Activated on focus</div>
            </UtensilTabsContent>
            <UtensilTabsContent value="tab3">
              <div class="tab-panel tab-panel-small">Activated on focus</div>
            </UtensilTabsContent>
          </UtensilTabs>
        </div>
        <div class="demo-label">Automatic (default)</div>
      </div>
      <div class="demo-item">
        <div class="demo-content demo-content-column">
          <UtensilTabs default-value="tab1" activation-mode="manual">
            <ReferenceTabsList>
              <UtensilTabsTrigger value="tab1">Manual 1</UtensilTabsTrigger>
              <UtensilTabsTrigger value="tab2">Manual 2</UtensilTabsTrigger>
              <UtensilTabsTrigger value="tab3">Manual 3</UtensilTabsTrigger>
            </ReferenceTabsList>
            <UtensilTabsContent value="tab1">
              <div class="tab-panel tab-panel-small">Click or press Enter to activate</div>
            </UtensilTabsContent>
            <UtensilTabsContent value="tab2">
              <div class="tab-panel tab-panel-small">Click or press Enter to activate</div>
            </UtensilTabsContent>
            <UtensilTabsContent value="tab3">
              <div class="tab-panel tab-panel-small">Click or press Enter to activate</div>
            </UtensilTabsContent>
          </UtensilTabs>
        </div>
        <div class="demo-label">Manual</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UtensilTabs from 'utensil-vue/components/tabs/UtensilTabs.vue'
import UtensilTabsTrigger from 'utensil-vue/components/tabs/UtensilTabsTrigger.vue'
import UtensilTabsContent from 'utensil-vue/components/tabs/UtensilTabsContent.vue'
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
