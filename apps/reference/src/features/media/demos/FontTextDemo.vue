<template>
  <ReferenceComponentDemo
    title="Font Text"
    anchor="font-text"
    description="Renders text in a specific font-family. Pure primitive — no layout, no font loading, no scaling."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content font-text-demo">
          <UtensilFontText font-family="Figtree" text="The quick brown fox" />
        </div>
        <div class="demo-label">Figtree</div>
        <div class="demo-code">
          <code>&lt;UtensilFontText font-family="Figtree" text="..." /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content font-text-demo">
          <UtensilFontText font-family="Plus Jakarta Sans" text="The quick brown fox" />
        </div>
        <div class="demo-label">Plus Jakarta Sans</div>
        <div class="demo-code">
          <code>&lt;UtensilFontText font-family="Plus Jakarta Sans" text="..." /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content font-text-demo">
          <UtensilFontText font-family="Merriweather" text="The quick brown fox" />
        </div>
        <div class="demo-label">Merriweather</div>
        <div class="demo-code">
          <code>&lt;UtensilFontText font-family="Merriweather" text="..." /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content font-text-demo">
          <UtensilFontText font-family="Inter">Slot content in Inter</UtensilFontText>
        </div>
        <div class="demo-label always-visible">Slot Content</div>
        <div class="demo-code">
          <code>&lt;UtensilFontText font-family="Inter"&gt;...&lt;/UtensilFontText&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilFontTextDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import UtensilFontText from 'utensil-vue/components/font/UtensilFontText.vue'
import UtensilFontTextDoc from 'utensil-vue/components/font/UtensilFontTextDoc.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
</script>

<style scoped>
.demo-content.font-text-demo {
  background-color: var(--pencil-2);
  padding: var(--space-3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-4);
  text-align: center;
}
</style>
