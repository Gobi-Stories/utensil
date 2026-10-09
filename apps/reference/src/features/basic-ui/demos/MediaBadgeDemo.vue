<template>
  <ReferenceComponentDemo
    title="Media Badge"
    anchor="media-badge"
    description="Specialized badge for media types with appropriate icons."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <UtensilMediaBadge media-type="image" />
          <UtensilMediaBadge media-type="video" />
          <UtensilMediaBadge media-type="music" />
          <UtensilMediaBadge media-type="font" />
          <UtensilMediaBadge media-type="document" />
        </div>
        <div class="demo-label">Media Types</div>
        <div class="demo-code">
          <code>&lt;UtensilMediaBadge media-type="video" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilMediaBadge media-type="video" scale="tiny" squared />
          <UtensilMediaBadge media-type="video" scale="small" squared />
          <UtensilMediaBadge media-type="video" scale="normal" squared />
          <UtensilMediaBadge media-type="video" scale="large" squared />
          <UtensilMediaBadge media-type="video" scale="giant" squared />
        </div>
        <div class="demo-label">Scale Presets</div>
        <div class="demo-code">
          <code>&lt;UtensilMediaBadge media-type="video" scale="large" /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilMediaBadgeDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import UtensilMediaBadge from '@gobistories/utensil-vue/components/media-badge/UtensilMediaBadge.vue'
import UtensilMediaBadgeDoc from '@gobistories/utensil-vue/components/media-badge/UtensilMediaBadgeDoc.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
</script>

<style scoped>
.demo-content {
  min-height: 80px;
}
</style>
