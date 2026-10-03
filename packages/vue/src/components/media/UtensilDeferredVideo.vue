<template>
  <div class="utensil-deferred-video" :class="fit" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <UtensilImage class="poster" :src="imgSrc" :alt="alt" />
    <UtensilVideo v-if="active" class="target" :src="videoSrc" :fade="true" autoplay loop @load="onVideoLoad" />
    <UtensilSpinnerOverlay class="loading-overlay" :show="active && !videoLoaded" scale="small" :delay="750" soft />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import UtensilImage from './UtensilImage.vue'
import UtensilVideo from './UtensilVideo.vue'
import UtensilSpinnerOverlay from '../spinner/UtensilSpinnerOverlay.vue'

interface Props {
  imgSrc: string
  videoSrc: string
  alt?: string
  fit?: 'cover' | 'contain'
  // External hover signal for when the pointer can't reach this element,
  // e.g. a host's stretched link covers the media and receives the events.
  hovered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  fit: 'cover',
  hovered: false,
})

const selfHovered = ref(false)
const videoLoaded = ref(false)

const active = computed(() => selfHovered.value || props.hovered)

watch(active, (value) => {
  if (!value) videoLoaded.value = false
})

function onMouseEnter() {
  selfHovered.value = true
}

function onMouseLeave() {
  selfHovered.value = false
}

function onVideoLoad() {
  videoLoaded.value = true
}
</script>

<style scoped>
@layer utensil {
  .utensil-deferred-video {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .utensil-deferred-video.cover .poster {
    position: absolute;
    height: 100%;
  }

  .utensil-deferred-video.cover .target {
    object-fit: cover;
    height: 100%;
    max-height: 100%;
  }

  .utensil-deferred-video.contain .poster {
    position: absolute;
    max-height: 100%;
    max-width: 100%;
  }

  .utensil-deferred-video.contain .target {
    object-fit: contain;
    max-width: 100%;
    max-height: 100%;
  }

  .loading-overlay {
    position: absolute;
    inset: 0;
  }
}
</style>
