<template>
  <div id="colors" class="component-demo">
    <h3><a class="demo-anchor" href="#colors">Colors</a></h3>
    <p>The active tab indicator can use different accent colors.</p>
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content demo-content-column">
          <UtensilTabs default-value="tab1">
            <ReferenceTabsList color="pen">
              <UtensilTabsTrigger value="tab1">Account</UtensilTabsTrigger>
              <UtensilTabsTrigger value="tab2">Billing</UtensilTabsTrigger>
              <UtensilTabsTrigger value="tab3">Team</UtensilTabsTrigger>
            </ReferenceTabsList>
            <UtensilTabsContent value="tab1">
              <div class="tab-panel tab-panel-small">Primary color indicator</div>
            </UtensilTabsContent>
            <UtensilTabsContent value="tab2">
              <div class="tab-panel tab-panel-small">Primary color indicator</div>
            </UtensilTabsContent>
            <UtensilTabsContent value="tab3">
              <div class="tab-panel tab-panel-small">Primary color indicator</div>
            </UtensilTabsContent>
          </UtensilTabs>
        </div>
        <div class="demo-label">Default (Pen)</div>
      </div>
      <div class="demo-item">
        <div class="demo-content demo-content-column">
          <UtensilTabs default-value="tab1">
            <ReferenceTabsList color="success">
              <UtensilTabsTrigger value="tab1">Published</UtensilTabsTrigger>
              <UtensilTabsTrigger value="tab2">Drafts</UtensilTabsTrigger>
              <UtensilTabsTrigger value="tab3">Archived</UtensilTabsTrigger>
            </ReferenceTabsList>
            <UtensilTabsContent value="tab1">
              <div class="tab-panel tab-panel-small">Success color indicator</div>
            </UtensilTabsContent>
            <UtensilTabsContent value="tab2">
              <div class="tab-panel tab-panel-small">Success color indicator</div>
            </UtensilTabsContent>
            <UtensilTabsContent value="tab3">
              <div class="tab-panel tab-panel-small">Success color indicator</div>
            </UtensilTabsContent>
          </UtensilTabs>
        </div>
        <div class="demo-label">Success Color</div>
      </div>
      <div class="demo-item">
        <div class="demo-content demo-content-column">
          <UtensilTabs default-value="tab1">
            <ReferenceTabsList color="warning">
              <UtensilTabsTrigger value="tab1">Pending</UtensilTabsTrigger>
              <UtensilTabsTrigger value="tab2">Review</UtensilTabsTrigger>
              <UtensilTabsTrigger value="tab3">Approved</UtensilTabsTrigger>
            </ReferenceTabsList>
            <UtensilTabsContent value="tab1">
              <div class="tab-panel tab-panel-small">Warning color indicator</div>
            </UtensilTabsContent>
            <UtensilTabsContent value="tab2">
              <div class="tab-panel tab-panel-small">Warning color indicator</div>
            </UtensilTabsContent>
            <UtensilTabsContent value="tab3">
              <div class="tab-panel tab-panel-small">Warning color indicator</div>
            </UtensilTabsContent>
          </UtensilTabs>
        </div>
        <div class="demo-label">Warning Color</div>
      </div>
      <div class="demo-item">
        <div class="demo-content demo-content-column">
          <UtensilTabs default-value="tab1">
            <ReferenceTabsList color="error">
              <UtensilTabsTrigger value="tab1">Errors</UtensilTabsTrigger>
              <UtensilTabsTrigger value="tab2">Warnings</UtensilTabsTrigger>
              <UtensilTabsTrigger value="tab3">Info</UtensilTabsTrigger>
            </ReferenceTabsList>
            <UtensilTabsContent value="tab1">
              <div class="tab-panel tab-panel-small">Error color indicator</div>
            </UtensilTabsContent>
            <UtensilTabsContent value="tab2">
              <div class="tab-panel tab-panel-small">Error color indicator</div>
            </UtensilTabsContent>
            <UtensilTabsContent value="tab3">
              <div class="tab-panel tab-panel-small">Error color indicator</div>
            </UtensilTabsContent>
          </UtensilTabs>
        </div>
        <div class="demo-label">Error Color</div>
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
