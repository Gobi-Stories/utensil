<template>
  <video
    v-if="!destroyed"
    ref="video"
    class="utensil-video"
    :class="{
      'utensil-fade-in-pending': fade && !loaded,
      'utensil-fade-in': fade && loaded,
    }"
    :src="src"
    :loop="loop"
    :autoplay="autoplay"
    :preload="autoplay ? 'auto' : 'metadata'"
    crossorigin="anonymous"
    playsinline
    muted
    @canplay="videoLoaded"
    @error="(event) => onError((event.target as HTMLVideoElement).error)"
  />
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, computed } from 'vue'

interface Props {
  src: string
  fade?: boolean
  autoplay?: boolean
  loop?: boolean
}

withDefaults(defineProps<Props>(), {
  fade: false,
  autoplay: false,
  loop: false,
})

const emit = defineEmits<{
  load: [event: Event]
  error: [error: MediaError | null]
}>()

const video = ref<HTMLVideoElement>()
const loaded = ref(false)
const destroyed = ref(false)

const videoElement = computed(() => video.value!)

onBeforeUnmount(() => {
  if (videoElement.value) {
    videoElement.value.setAttribute('src', '')
    videoElement.value.load()
  }
})

function videoLoaded(event: Event) {
  loaded.value = true
  emit('load', event)
}

function onError(error: MediaError | null) {
  emit('error', error)
}
</script>
