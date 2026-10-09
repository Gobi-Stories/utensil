<template>
  <ReferenceComponentDemo title="Spinner" anchor="spinner" description="Loading spinner component with scalable sizes.">
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceSpinner scale="micro" />
        </div>
        <div class="demo-label">Micro Spinner</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceSpinner />
        </div>
        <div class="demo-label">Normal Spinner</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceSpinner scale="super" />
        </div>
        <div class="demo-label">Super Spinner</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceSpinner color="primary" />
          <ReferenceSpinner color="success" />
          <ReferenceSpinner color="warning" />
          <ReferenceSpinner color="error" />
          <ReferenceSpinner color="favorite" />
        </div>
        <div class="demo-label">Color Prop</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceSpinner soft />
        </div>
        <div class="demo-label">Soft Spinner</div>
      </div>
    </div>

    <template #api>
      <UtensilSpinnerDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { ReferenceSpinner } from '@/theme/components/ReferenceSpinner'
import UtensilSpinnerDoc from '@gobistories/utensil-vue/components/spinner/UtensilSpinnerDoc.vue'
</script>

<style scoped>
.demo-content {
  min-height: 200px;
}
</style>
