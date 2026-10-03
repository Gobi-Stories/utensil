<template>
  <div class="utensil-media" :class="fit">
    <UtensilPlaceholder :class="outClasses" :media-type="placeholderMediaType || mediaType" />
    <UtensilImage
      v-if="src && mediaType === 'image'"
      :class="classes"
      :src="src"
      :alt="alt"
      @load="loadedMedia"
      @error="onError"
    />
    <UtensilVideo
      v-if="src && mediaType === 'video'"
      :class="classes"
      :src="src"
      :fade="fade"
      @load="loadedMedia"
      @error="onError"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UtensilImage from './UtensilImage.vue'
import UtensilVideo from './UtensilVideo.vue'
import UtensilPlaceholder from './UtensilPlaceholder.vue'
import { useFader } from '../fader/useFader'

interface Props {
  src?: string
  alt?: string
  fade?: boolean
  mediaType?: string
  placeholderMediaType?: string
  fit?: 'cover' | 'contain'
}

withDefaults(defineProps<Props>(), {
  alt: '',
  fade: false,
  fit: 'cover',
})

const emit = defineEmits<{
  load: []
  error: [error: MediaError | null | undefined]
}>()

const { show, classes, outClasses } = useFader({ delay: 150 })

const showPlaceholderIcon = ref(false)
const hasError = ref(false)

onMounted(() => {
  showPlaceholderIcon.value = true
})

function loadedMedia() {
  show.value = true
  emit('load')
}

function onError(error?: MediaError | null) {
  hasError.value = hasError.value || error?.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED
  emit('error', error)
}
</script>

<style scoped>
@layer utensil {
  .utensil-media {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .utensil-media img,
  .utensil-media video {
    position: absolute;
    max-width: 100%;
    max-height: 100%;
  }

  .utensil-media.cover img,
  .utensil-media.cover video {
    object-fit: cover;
  }

  .utensil-media.contain img,
  .utensil-media.contain video {
    object-fit: contain;
    object-position: center;
  }

  .utensil-media .utensil-placeholder {
    position: absolute;
    inset: 0;
    color: var(--pencil-8);
  }
}
</style>
