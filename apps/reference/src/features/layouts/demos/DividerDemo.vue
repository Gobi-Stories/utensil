<template>
  <ReferenceComponentDemo
    title="Divider"
    anchor="divider"
    description="Horizontal or vertical separator with optional label. Uses pencil color by default."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content divider-demo-column">
          <span>Above</span>
          <ReferenceDivider />
          <span>Below</span>
        </div>
        <div class="demo-label">Horizontal</div>
      </div>
      <div class="demo-item">
        <div class="demo-content divider-demo-column">
          <span>Above</span>
          <ReferenceDivider label="or" />
          <span>Below</span>
        </div>
        <div class="demo-label">With Label</div>
      </div>
      <div class="demo-item">
        <div class="demo-content divider-demo-row">
          <span>Left</span>
          <ReferenceDivider vertical />
          <span>Right</span>
        </div>
        <div class="demo-label">Vertical</div>
      </div>
      <div class="demo-item">
        <div class="demo-content divider-demo-column">
          <ReferenceDivider color="primary" />
          <ReferenceDivider color="success" />
          <ReferenceDivider color="warning" />
          <ReferenceDivider color="error" />
          <ReferenceDivider color="favorite" />
        </div>
        <div class="demo-label">Colors</div>
      </div>
      <div class="demo-item">
        <div class="demo-content divider-demo-column">
          <ReferenceDivider label="section" color="primary" />
        </div>
        <div class="demo-label">Colored Label</div>
      </div>
    </div>

    <template #api>
      <UtensilDividerDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import UtensilDividerDoc from '@gobistories/utensil-vue/components/divider/UtensilDividerDoc.vue'
import { ReferenceDivider } from '@/theme/components/ReferenceDivider'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
</script>

<style scoped>
.demo-content {
  min-height: 200px;
}

.demo-content.divider-demo-column {
  flex-direction: column;
  gap: var(--space-3);
}

.demo-content.divider-demo-row {
  gap: var(--space-3);
  min-height: 60px;
}
</style>
