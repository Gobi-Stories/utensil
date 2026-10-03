<template>
  <ReferenceComponentDemo
    title="Media"
    anchor="media"
    description="Unified media component that displays images, videos, or placeholders with fade transitions."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content media-demo">
          <UtensilMedia :src="sampleLandscape" media-type="image" alt="Media image" fit="cover" />
        </div>
        <div class="demo-label">Fit with Cover</div>
        <div class="demo-code">
          <code>&lt;UtensilMedia media-type="image" fit="cover" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content media-demo">
          <UtensilMedia :src="samplePortrait" media-type="image" fit="contain" />
        </div>
        <div class="demo-label">Fit with Contain</div>
        <div class="demo-code">
          <code>&lt;UtensilMedia media-type="image" fit="contain" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content media-demo">
          <UtensilMedia :src="sampleVideo" media-type="video" :fade="true" />
        </div>
        <div class="demo-label">Video with Fade</div>
        <div class="demo-code">
          <code>&lt;UtensilMedia media-type="video" :fade="true" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content media-demo">
          <UtensilMedia media-type="image" placeholder-media-type="image" />
        </div>
        <div class="demo-label always-visible">Placeholder Only</div>
        <div class="demo-code">
          <code>&lt;UtensilMedia media-type="image" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content media-demo">
          <UtensilMedia
            v-if="mediaLoadKey"
            :key="mediaLoadKey"
            :src="sampleSquare"
            media-type="image"
            :fade="true"
            @load="onMediaLoad"
          />
          <div v-else class="no-media-state">
            <span>No media loaded</span>
          </div>
          <UtensilButton class="demo-button shadow-2" scale="small" @click="reloadMedia"
            >{{ mediaLoadKey ? 'Unload' : 'Load' }} Media</UtensilButton
          >
        </div>
        <div class="demo-label">Interactive Loading</div>
        <div class="demo-code">
          <code>&lt;UtensilMedia :fade="true" @load="onLoad" /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilMediaDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilMedia from 'utensil-vue/components/media/UtensilMedia.vue'
import UtensilMediaDoc from 'utensil-vue/components/media/UtensilMediaDoc.vue'
import UtensilButton from 'utensil-vue/components/button/UtensilButton.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

import sampleLandscape from '@/features/assets/sample-landscape.svg'
import samplePortrait from '@/features/assets/sample-portrait.svg'
import sampleSquare from '@/features/assets/sample-square.svg'
import sampleVideo from '@/features/assets/sample-video.mp4'

const mediaLoadKey = ref(0)

function onMediaLoad() {
  console.log('Media loaded')
}

function reloadMedia() {
  mediaLoadKey.value = mediaLoadKey.value ? 0 : Date.now()
}
</script>

<style scoped>
.demo-content.media-demo {
  background-color: var(--pencil-2);
  padding: var(--space-3);
  height: 140px;
  position: relative;
}

.demo-button {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  min-width: 100px;
}

.no-media-state {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--pencil-11);
  font-style: italic;
  font-size: 0.9rem;
}
</style>
