<template>
  <ReferenceComponentDemo
    title="Page Indicator"
    anchor="page-indicator"
    description="A row of dots, one per page, with the current page drawn as a pill. Each dot is a button that jumps to its page, so it navigates as well as indicates."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content page-indicator-demo">
          <ReferencePageIndicator v-model="page" :count="5" />
          <span class="page-readout">Page {{ page + 1 }} of 5</span>
        </div>
        <div class="demo-label always-visible">Interactive</div>
      </div>
      <div class="demo-item">
        <div class="demo-content page-indicator-demo">
          <ReferencePageIndicator :count="4" :modelValue="1" color="favorite" />
        </div>
        <div class="demo-label always-visible">Color</div>
      </div>
      <div class="demo-item">
        <div class="demo-content page-indicator-demo">
          <ReferencePageIndicator :count="3" :modelValue="2" scale="large" />
        </div>
        <div class="demo-label always-visible">Large</div>
      </div>
      <div class="demo-item">
        <div class="demo-content page-indicator-demo">
          <ReferencePageIndicator :count="3" :modelValue="0" disabled />
        </div>
        <div class="demo-label always-visible">Disabled</div>
      </div>
    </div>

    <template #api>
      <UtensilPageIndicatorDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilPageIndicatorDoc from 'utensil-vue/components/page-indicator/UtensilPageIndicatorDoc.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { ReferencePageIndicator } from '@/theme/components/ReferencePageIndicator'

const page = ref(0)
</script>

<style scoped>
.page-indicator-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.page-readout {
  font-size: var(--font-size-1);
  color: var(--pencil-a11);
}
</style>
