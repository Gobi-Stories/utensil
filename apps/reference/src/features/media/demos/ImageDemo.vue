<template>
  <ReferenceComponentDemo
    title="Image"
    anchor="image"
    description="Image component with load/error handling and click events."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content media-demo">
          <UtensilImage :src="sampleLandscape" alt="Sample image" @load="onImageLoad" @error="onImageError" />
        </div>
        <div class="demo-label">Basic Image</div>
        <div class="demo-code">
          <code>&lt;UtensilImage src="image.jpg" alt="Description" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content media-demo">
          <UtensilImage :src="samplePortrait" alt="Portrait image" @click="onImageClick" />
        </div>
        <div class="demo-label always-visible">Clickable</div>
        <div class="demo-code">
          <code>&lt;UtensilImage @click="handleClick" /&gt;</code>
        </div>
      </div>
      <div class="demo-item no-border">
        <div class="demo-content media-demo">
          <UtensilImage src="/nonexistent-image.jpg" alt="Invalid image source" @error="onImageError" />
          <div class="error-overlay" v-if="showImageError">
            <span>Image failed to load</span>
          </div>
        </div>
        <div class="demo-label always-visible">Error Handling</div>
        <div class="demo-code">
          <code>&lt;UtensilImage src="non-image.pdf" @error="onError" /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilImageDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilImage from '@gobistories/utensil-vue/components/media/UtensilImage.vue'
import UtensilImageDoc from '@gobistories/utensil-vue/components/media/UtensilImageDoc.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { toasts } from '@/app/reference-toast'

import sampleLandscape from '@/features/assets/sample-landscape.svg'
import samplePortrait from '@/features/assets/sample-portrait.svg'

const showImageError = ref(false)

function onImageLoad() {
  console.log('Image loaded')
}

function onImageError() {
  showImageError.value = true
}

function onImageClick() {
  toasts.add('Image clicked!')
}
</script>

<style scoped>
.demo-content.media-demo {
  background-color: var(--pencil-2);
  padding: var(--space-3);
  height: 140px;
  position: relative;
}

/* Constrain standalone UtensilImage in demos */
.demo-content.media-demo .utensil-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* Hide broken image display when we have an error overlay */
.demo-content.media-demo:has(.error-overlay) .utensil-image {
  opacity: 0;
  visibility: hidden;
}

.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--pen-a2);
  border: 2px dashed var(--pen-8);
  border-radius: var(--radius-2);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  color: var(--pen-11);
  font-weight: 500;
  font-size: 0.85rem;
  gap: var(--space-1);
}

.error-overlay small {
  font-size: 0.75rem;
  font-weight: 400;
  opacity: 0.8;
}
</style>
