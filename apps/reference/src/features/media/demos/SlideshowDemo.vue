<template>
  <ReferenceComponentDemo
    title="Slideshow"
    anchor="slideshow"
    description="Headless slideshow primitive: index navigation, key bindings, windowed rendering, and near-end pagination signal."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content slideshow-demo">
          <UtensilSlideshow v-model="slideshowIndex" :length="slideshowItems.length">
            <template #default="{ current, window, hasNext, hasPrevious, next, previous, onKeydown }">
              <div
                class="slideshow-stack"
                tabindex="0"
                aria-label="Slides, the arrow keys move between them"
                @keydown="onKeydown"
              >
                <div
                  v-for="i in window"
                  :key="i"
                  class="slideshow-slide"
                  :class="{ active: i === current }"
                  :style="{ background: slideshowItems[i] }"
                >
                  <span>{{ i + 1 }}</span>
                </div>
              </div>
              <div class="slideshow-controls">
                <UtensilButton scale="small" :disabled="!hasPrevious" @click="previous">Prev</UtensilButton>
                <span>{{ current + 1 }} / {{ slideshowItems.length }}</span>
                <UtensilButton scale="small" :disabled="!hasNext" @click="next">Next</UtensilButton>
              </div>
            </template>
          </UtensilSlideshow>
        </div>
        <div class="demo-label always-visible">Windowed Slideshow</div>
        <div class="demo-code">
          <code>&lt;UtensilSlideshow v-model="i" :length="items.length" /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilSlideshowDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilSlideshow from '@gobistories/utensil-vue/components/slideshow/UtensilSlideshow.vue'
import UtensilSlideshowDoc from '@gobistories/utensil-vue/components/slideshow/UtensilSlideshowDoc.vue'
import UtensilButton from '@gobistories/utensil-vue/components/button/UtensilButton.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

const slideshowIndex = ref(0)
const slideshowItems = ['#3b82f6', '#10b981', '#f97316', '#ef4444', '#a855f7', '#06b6d4']
</script>

<style scoped>
.demo-content.slideshow-demo {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  height: 200px;
  padding: var(--space-3);
}

.slideshow-stack {
  position: relative;
  flex: 1;
  aspect-ratio: 1;
  border-radius: var(--radius-2);
  overflow: hidden;
}

.slideshow-stack:focus-visible {
  outline: 2px solid var(--pen-8);
  outline-offset: 2px;
}

.slideshow-slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 700;
  color: white;
  opacity: 0;
  pointer-events: none;
}

.slideshow-slide.active {
  opacity: 1;
  pointer-events: auto;
}

.slideshow-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  font-size: var(--font-size-2);
  color: var(--pencil-11);
}
</style>
