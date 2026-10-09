<template>
  <ReferenceComponentDemo
    title="Search"
    anchor="search"
    description="Specialized search input with debouncing support."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilSearch v-model="searchBasic" placeholder="Search products..." variation="soft" />
          <div class="input-value">Value: "{{ searchBasic }}"</div>
        </div>
        <div class="demo-label">Basic Search</div>
        <div class="demo-code">
          <code>&lt;UtensilSearch v-model="query" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilSearch v-model="searchDebounced" placeholder="Search with debounce" :debounce="true" />
          <div class="input-value">Value: "{{ searchDebounced }}"</div>
        </div>
        <div class="demo-label">Debounced Search</div>
        <div class="demo-code">
          <code>&lt;UtensilSearch v-model="query" :debounce="true" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilSearch placeholder="Disabled search" disabled />
          <div class="input-value">Disabled state</div>
        </div>
        <div class="demo-label">Disabled</div>
        <div class="demo-code">
          <code>&lt;UtensilSearch disabled /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilSearchDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import UtensilSearch from '@gobistories/utensil-vue/components/input/UtensilSearch.vue'
import UtensilSearchDoc from '@gobistories/utensil-vue/components/input/UtensilSearchDoc.vue'

const searchBasic = ref('')
const searchDebounced = ref('')
</script>

<style scoped>
.demo-content.input-demo {
  flex-direction: column;
  align-items: stretch;
}

.input-value {
  margin-top: var(--space-2);
  padding: var(--space-1) var(--space-2);
  background-color: var(--pencil-3);
  border-radius: var(--radius-2);
  font-size: 0.85rem;
  color: var(--pencil-11);
  text-align: center;
  font-family: ui-monospace, monospace;
}
</style>
