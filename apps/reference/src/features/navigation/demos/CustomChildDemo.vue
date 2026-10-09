<template>
  <div id="custom-child" class="component-demo">
    <h3><a class="demo-anchor" href="#custom-child">Custom Child</a></h3>
    <p>Custom children can participate via slot scope without injecting context.</p>
    <div class="demo-grid">
      <div class="demo-item demo-item-wide">
        <div class="demo-content demo-content-column">
          <UtensilTabs default-value="standard">
            <ReferenceTabsList>
              <template #default="{ value, setValue }">
                <UtensilTabsTrigger value="standard">Standard</UtensilTabsTrigger>
                <UtensilTabsTrigger value="also-standard">Also Standard</UtensilTabsTrigger>
                <button
                  class="custom-tab-trigger"
                  :class="{ active: value === 'custom' }"
                  role="tab"
                  type="button"
                  data-value="custom"
                  :aria-selected="value === 'custom'"
                  :tabindex="value === 'custom' ? 0 : -1"
                  @click="setValue('custom')"
                >
                  Custom Trigger
                </button>
              </template>
            </ReferenceTabsList>
            <UtensilTabsContent value="standard">
              <div class="tab-panel tab-panel-small">Standard tab using built-in UtensilTabsTrigger.</div>
            </UtensilTabsContent>
            <UtensilTabsContent value="also-standard">
              <div class="tab-panel tab-panel-small">Another standard tab.</div>
            </UtensilTabsContent>
            <UtensilTabsContent value="custom">
              <div class="tab-panel tab-panel-small">Custom trigger using slot scope.</div>
            </UtensilTabsContent>
          </UtensilTabs>
        </div>
        <div class="demo-label">Custom Tab Trigger via Slot Scope</div>
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
.custom-tab-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: var(--tab-height);
  padding-inline: var(--tab-padding-x);
  border: none;
  border-bottom: 2px dashed transparent;
  background: none;
  font: inherit;
  cursor: pointer;
  color: var(--pen-11);
  outline: none;
}

.custom-tab-trigger:hover {
  color: var(--pen-12);
  background-color: var(--pen-a2);
}

.custom-tab-trigger.active {
  color: var(--pen-12);
  border-bottom-color: var(--pen-indicator);
}

.custom-tab-trigger:focus-visible {
  outline: 2px solid var(--pen-8);
  outline-offset: -2px;
}

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

.demo-item-wide {
  grid-column: 1 / -1;
}
</style>
