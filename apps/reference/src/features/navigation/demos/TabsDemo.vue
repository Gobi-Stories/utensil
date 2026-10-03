<template>
  <ReferenceComponentDemo
    title="Tabs"
    anchor="tabs"
    description="Tabs organize content into separate panels. Click a tab to switch panels."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content demo-content-column">
          <UtensilTabs v-model="basicTab" default-value="account">
            <ReferenceTabsList>
              <UtensilTabsTrigger value="account">Account</UtensilTabsTrigger>
              <UtensilTabsTrigger value="documents">Documents</UtensilTabsTrigger>
              <UtensilTabsTrigger value="settings">Settings</UtensilTabsTrigger>
            </ReferenceTabsList>
            <UtensilTabsContent value="account">
              <div class="tab-panel">
                <p>Manage your account settings.</p>
              </div>
            </UtensilTabsContent>
            <UtensilTabsContent value="documents">
              <div class="tab-panel">
                <p>View and organize your documents.</p>
              </div>
            </UtensilTabsContent>
            <UtensilTabsContent value="settings">
              <div class="tab-panel">
                <p>Configure application settings.</p>
              </div>
            </UtensilTabsContent>
          </UtensilTabs>
        </div>
        <div class="demo-label">Default Tabs</div>
      </div>
    </div>

    <template #api>
      <UtensilTabsDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilTabs from 'utensil-vue/components/tabs/UtensilTabs.vue'
import UtensilTabsDoc from 'utensil-vue/components/tabs/UtensilTabsDoc.vue'
import UtensilTabsTrigger from 'utensil-vue/components/tabs/UtensilTabsTrigger.vue'
import UtensilTabsContent from 'utensil-vue/components/tabs/UtensilTabsContent.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { ReferenceTabsList } from '@/theme/components/ReferenceTabsList'

const basicTab = ref('account')
</script>

<style scoped>
.tab-panel {
  padding: var(--space-4);
  color: var(--pencil-11);
}

.demo-content-column {
  flex-direction: column;
  align-items: stretch;
}
</style>
