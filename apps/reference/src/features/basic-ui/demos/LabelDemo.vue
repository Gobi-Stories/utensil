<template>
  <ReferenceComponentDemo
    title="Label"
    anchor="label"
    description="Tight monospace uppercase tag for marking discriminators — operation types in audit logs, kinds on a row. Scannable, never interactive, never iconic."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceLabel variation="solid">Solid</ReferenceLabel>
          <ReferenceLabel variation="soft">Soft</ReferenceLabel>
          <ReferenceLabel variation="surface">Surface</ReferenceLabel>
          <ReferenceLabel variation="outline">Outline</ReferenceLabel>
          <ReferenceLabel variation="text">Text</ReferenceLabel>
          <ReferenceLabel variation="overlay">Overlay</ReferenceLabel>
        </div>
        <div class="demo-label">Style Variations</div>
        <div class="demo-code">
          <code>&lt;UtensilLabel variation="soft"&gt;Tag&lt;/UtensilLabel&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceLabel>get</ReferenceLabel>
          <ReferenceLabel color="success">post</ReferenceLabel>
          <ReferenceLabel color="warning">put</ReferenceLabel>
          <ReferenceLabel color="error">delete</ReferenceLabel>
          <ReferenceLabel color="pencil">head</ReferenceLabel>
        </div>
        <div class="demo-label">Colors (log discriminators)</div>
        <div class="demo-code">
          <code>&lt;UtensilLabel color="success"&gt;post&lt;/UtensilLabel&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceLabel scale="tiny">tiny</ReferenceLabel>
          <ReferenceLabel scale="small">small</ReferenceLabel>
          <ReferenceLabel scale="normal">normal</ReferenceLabel>
          <ReferenceLabel scale="large">large</ReferenceLabel>
          <ReferenceLabel scale="giant">giant</ReferenceLabel>
        </div>
        <div class="demo-label">Scale Presets</div>
        <div class="demo-code">
          <code>&lt;UtensilLabel scale="large"&gt;Label&lt;/UtensilLabel&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceLabel text="text prop" />
          <ReferenceLabel>slot content</ReferenceLabel>
        </div>
        <div class="demo-label">Text Prop and Slot</div>
        <div class="demo-code">
          <code>&lt;UtensilLabel text="get" /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilLabelDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import UtensilLabelDoc from 'utensil-vue/components/label/UtensilLabelDoc.vue'
import { ReferenceLabel } from '@/theme/components/ReferenceLabel'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
</script>

<style scoped>
.demo-content {
  min-height: 80px;
}
</style>
