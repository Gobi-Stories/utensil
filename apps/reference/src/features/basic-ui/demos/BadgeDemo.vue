<template>
  <ReferenceComponentDemo
    title="Badge"
    anchor="badge"
    description="Flexible badge component with variations, colors, and sizes."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceBadge>Solid</ReferenceBadge>
          <ReferenceBadge variation="soft">Soft</ReferenceBadge>
          <ReferenceBadge variation="surface">Surface</ReferenceBadge>
          <ReferenceBadge variation="outline">Outline</ReferenceBadge>
          <ReferenceBadge variation="text">Text</ReferenceBadge>
          <ReferenceBadge variation="overlay">Overlay</ReferenceBadge>
        </div>
        <div class="demo-label">Style Variations</div>
        <div class="demo-code">
          <code>&lt;UtensilBadge variation="solid"&gt;Badge&lt;/UtensilBadge&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceBadge>Primary</ReferenceBadge>
          <ReferenceBadge color="pencil">Secondary</ReferenceBadge>
          <ReferenceBadge color="success">Success</ReferenceBadge>
          <ReferenceBadge color="warning">Warning</ReferenceBadge>
          <ReferenceBadge color="error">Danger</ReferenceBadge>
        </div>
        <div class="demo-label">Color Badges</div>
        <div class="demo-code">
          <code>&lt;UtensilBadge color="success"&gt;Badge&lt;/UtensilBadge&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceBadge scale="tiny">Tiny</ReferenceBadge>
          <ReferenceBadge scale="small">Small</ReferenceBadge>
          <ReferenceBadge scale="normal">Normal</ReferenceBadge>
          <ReferenceBadge scale="large">Large</ReferenceBadge>
          <ReferenceBadge scale="giant">Giant</ReferenceBadge>
        </div>
        <div class="demo-label">Scale Presets</div>
        <div class="demo-code">
          <code>&lt;UtensilBadge scale="large"&gt;Badge&lt;/UtensilBadge&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceBadge icon="star">Star</ReferenceBadge>
          <ReferenceBadge icon="check" color="success">Done</ReferenceBadge>
          <ReferenceBadge icon="exclamation-triangle" color="warning" variation="soft">Alert</ReferenceBadge>
          <ReferenceBadge icon="eye" variation="outline">Views</ReferenceBadge>
        </div>
        <div class="demo-label">Icon Prop</div>
        <div class="demo-code">
          <code>&lt;UtensilBadge icon="star"&gt;Star&lt;/UtensilBadge&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceBadge variation="surface" rounded>Rounded</ReferenceBadge>
          <ReferenceBadge variation="surface">Normal</ReferenceBadge>
          <ReferenceBadge variation="surface" squared>Squared</ReferenceBadge>
        </div>
        <div class="demo-label">Rounded and Squared</div>
        <div class="demo-code">
          <code>&lt;UtensilBadge rounded&gt;Badge&lt;/UtensilBadge&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceBadge icon="star" squared>Squared</ReferenceBadge>
          <ReferenceBadge icon="check" color="success" squared>With Icon</ReferenceBadge>
        </div>
        <div class="demo-label">Squared with Icons</div>
        <div class="demo-code">
          <code>&lt;UtensilBadge icon="star" squared&gt;Badge&lt;/UtensilBadge&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilBadgeDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import UtensilBadgeDoc from 'utensil-vue/components/badge/UtensilBadgeDoc.vue'
import { ReferenceBadge } from '@/theme/components/ReferenceBadge'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
</script>

<style scoped>
.demo-content {
  min-height: 80px;
}
</style>
