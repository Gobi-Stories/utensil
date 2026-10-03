<template>
  <ReferenceComponentDemo
    title="Placeholder"
    anchor="placeholder"
    description="SVG icon placeholders for different media types with fade-in animation."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content media-demo">
          <UtensilPlaceholder media-type="image" />
        </div>
        <div class="demo-label">Image Placeholder</div>
        <div class="demo-code">
          <code>&lt;UtensilPlaceholder media-type="image" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content media-demo">
          <UtensilPlaceholder media-type="video" />
        </div>
        <div class="demo-label">Video Placeholder</div>
        <div class="demo-code">
          <code>&lt;UtensilPlaceholder media-type="video" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content media-demo">
          <UtensilPlaceholder media-type="audio" />
        </div>
        <div class="demo-label">Audio Placeholder</div>
        <div class="demo-code">
          <code>&lt;UtensilPlaceholder media-type="audio" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content media-demo">
          <UtensilPlaceholder media-type="music" />
        </div>
        <div class="demo-label">Music Placeholder</div>
        <div class="demo-code">
          <code>&lt;UtensilPlaceholder media-type="music" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content media-demo">
          <UtensilPlaceholder media-type="font" />
        </div>
        <div class="demo-label">Font Placeholder</div>
        <div class="demo-code">
          <code>&lt;UtensilPlaceholder media-type="font" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content media-demo">
          <UtensilPlaceholder media-type="file" />
        </div>
        <div class="demo-label">File Placeholder</div>
        <div class="demo-code">
          <code>&lt;UtensilPlaceholder media-type="file" /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilPlaceholderDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import UtensilPlaceholder from 'utensil-vue/components/media/UtensilPlaceholder.vue'
import UtensilPlaceholderDoc from 'utensil-vue/components/media/UtensilPlaceholderDoc.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
</script>

<style scoped>
.demo-content.media-demo {
  background-color: var(--pencil-2);
  padding: var(--space-3);
  height: 140px;
  position: relative;
}
</style>
