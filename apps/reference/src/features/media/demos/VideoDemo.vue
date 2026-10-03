<template>
  <ReferenceComponentDemo
    title="Video"
    anchor="video"
    description="Video component with fade-in support and error handling."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content media-demo">
          <UtensilVideo :src="sampleVideo" @load="onVideoLoad" @error="onVideoError" />
        </div>
        <div class="demo-label">Basic Video</div>
        <div class="demo-code">
          <code>&lt;UtensilVideo src="video.mp4" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content media-demo">
          <UtensilVideo :src="sampleVideo2" :fade="true" />
        </div>
        <div class="demo-label">Video with Fade</div>
        <div class="demo-code">
          <code>&lt;UtensilVideo src="video.mp4" :fade="true" /&gt;</code>
        </div>
      </div>
      <div class="demo-item no-border">
        <div class="demo-content media-demo">
          <UtensilVideo src="/nonexistent-video.mp4" @error="onVideoError" />
          <div class="error-overlay" v-if="showVideoError">
            <span>Video failed to load</span>
            <small v-if="videoErrorCode">(Code: {{ videoErrorCode }})</small>
          </div>
        </div>
        <div class="demo-label always-visible">Error Handling</div>
        <div class="demo-code">
          <code>&lt;UtensilVideo src="unsupported.pdf" @error="onError" /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilVideoDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilVideo from 'utensil-vue/components/media/UtensilVideo.vue'
import UtensilVideoDoc from 'utensil-vue/components/media/UtensilVideoDoc.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

import sampleVideo from '@/features/assets/sample-video.mp4'
import sampleVideo2 from '@/features/assets/sample-video-2.mp4'

const showVideoError = ref(false)
const videoErrorCode = ref<number | null>(null)

function onVideoLoad() {
  console.log('Video loaded')
}

function onVideoError(error: MediaError | null) {
  console.log('Video error:', error)
  showVideoError.value = true
  videoErrorCode.value = error?.code || null

  if (error?.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
    console.log('Video source not supported!')
  }
}
</script>

<style scoped>
.demo-content.media-demo {
  background-color: var(--pencil-2);
  padding: var(--space-3);
  height: 140px;
  position: relative;
}

/* Constrain standalone UtensilVideo in demos */
.demo-content.media-demo .utensil-video {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
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
