<template>
  <ReferenceComponentDemo
    title="Font Preview"
    anchor="font-preview"
    description="Centred, auto-scaled text preview for a font. Parallel to UtensilMedia in role — fits within the parent container."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content media-demo">
          <UtensilFontPreview font-family="Figtree" />
        </div>
        <div class="demo-label">Figtree (default 'Aa')</div>
        <div class="demo-code">
          <code>&lt;UtensilFontPreview font-family="Figtree" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content media-demo">
          <UtensilFontPreview font-family="Plus Jakarta Sans" text="Plus Jakarta" />
        </div>
        <div class="demo-label">With Title Text</div>
        <div class="demo-code">
          <code>&lt;UtensilFontPreview font-family="Plus Jakarta Sans" text="Plus Jakarta" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content media-demo">
          <UtensilFontPreview font-family="Merriweather" text="Merriweather" />
        </div>
        <div class="demo-label">Serif</div>
        <div class="demo-code">
          <code>&lt;UtensilFontPreview font-family="Merriweather" text="Merriweather" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content media-demo">
          <UtensilFontPreview font-family="Inter" text="Aa" style="--font-preview-size: 3rem" />
        </div>
        <div class="demo-label always-visible">Fixed Size Override</div>
        <div class="demo-code">
          <code>&lt;UtensilFontPreview style="--font-preview-size: 3rem" /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilFontPreviewDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import UtensilFontPreview from 'utensil-vue/components/font/UtensilFontPreview.vue'
import UtensilFontPreviewDoc from 'utensil-vue/components/font/UtensilFontPreviewDoc.vue'
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
