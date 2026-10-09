<template>
  <ReferenceComponentDemo
    title="Close Button"
    anchor="close-button"
    description="Specialized close button with consistent styling and hover effects."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <UtensilCloseButton description="Close modal" />
          <UtensilCloseButton variation="overlay" description="Close video" />
        </div>
        <div class="demo-label">Close Buttons</div>
        <div class="demo-code">
          <code>&lt;UtensilCloseButton @click="close" /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilCloseButtonDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import UtensilCloseButton from '@gobistories/utensil-vue/components/circle-button/UtensilCloseButton.vue'
import UtensilCloseButtonDoc from '@gobistories/utensil-vue/components/circle-button/UtensilCloseButtonDoc.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
</script>

<style scoped>
.demo-content {
  min-height: 80px;
}
</style>
