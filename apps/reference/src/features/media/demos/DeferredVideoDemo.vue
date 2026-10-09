<template>
  <ReferenceComponentDemo
    title="Deferred Video"
    anchor="deferred-video"
    description="Shows a still image and lazy-mounts a looping video on hover. The video is destroyed on mouse out."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content media-demo">
          <UtensilDeferredVideo :imgSrc="samplePortrait" :videoSrc="sampleVideo" alt="Hover to play" />
        </div>
        <div class="demo-label">Hover to Play</div>
        <div class="demo-code">
          <code>&lt;UtensilDeferredVideo :imgSrc="poster" :videoSrc="video" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content media-demo">
          <UtensilDeferredVideo :imgSrc="sampleLandscape" :videoSrc="sampleVideo2" fit="contain" />
        </div>
        <div class="demo-label">Fit Contain</div>
        <div class="demo-code">
          <code>&lt;UtensilDeferredVideo fit="contain" /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilDeferredVideoDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import UtensilDeferredVideo from '@gobistories/utensil-vue/components/media/UtensilDeferredVideo.vue'
import UtensilDeferredVideoDoc from '@gobistories/utensil-vue/components/media/UtensilDeferredVideoDoc.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

import sampleLandscape from '@/features/assets/sample-landscape.svg'
import samplePortrait from '@/features/assets/sample-portrait.svg'
import sampleVideo from '@/features/assets/sample-video.mp4'
import sampleVideo2 from '@/features/assets/sample-video-2.mp4'
</script>

<style scoped>
.demo-content.media-demo {
  background-color: var(--pencil-2);
  padding: var(--space-3);
  height: 140px;
  position: relative;
}
</style>
