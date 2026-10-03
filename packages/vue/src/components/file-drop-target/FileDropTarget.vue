<template>
  <div
    class="file-drop-target"
    :class="{ active }"
    @dragover.prevent
    @drop.prevent="handleDrop"
    @dragenter.prevent="() => handleDragEnter('root')"
    @dragleave.prevent="() => handleDragLeave('root')"
  >
    <slot :active="active" />
    <div class="overlay-content">
      <slot name="overlay" />
    </div>
    <div
      class="drop-overlay"
      @dragover.prevent
      @dragenter.prevent="() => handleDragEnter('overlay')"
      @dragleave.prevent="() => handleDragLeave('overlay')"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  drop: [files: FileList]
}>()

const active = ref(false)
const enteredOverlay = ref(false)

function handleDrop(event: DragEvent) {
  active.value = false

  if (props.disabled) {
    return
  }

  if (!event.dataTransfer?.files) {
    return
  }
  const files = event.dataTransfer.files

  if (!files) {
    return
  }

  emit('drop', files)
}

function handleDragEnter(layer: 'root' | 'overlay') {
  if (layer === 'overlay') {
    enteredOverlay.value = true
  }

  active.value = true
}

function handleDragLeave(layer: 'root' | 'overlay') {
  if (layer === 'overlay') {
    enteredOverlay.value = false
  }

  if (layer === 'root' && !enteredOverlay.value) {
    active.value = false
  }
}
</script>

<style scoped>
@layer utensil {
  .file-drop-target {
    position: relative;
    isolation: isolate;
  }

  .overlay-content {
    position: absolute;
    inset: 0;
    visibility: hidden;
  }

  .drop-overlay {
    position: absolute;
    inset: 0;
    visibility: hidden;
  }

  .file-drop-target.active .overlay-content {
    visibility: visible;
  }

  .file-drop-target.active .drop-overlay {
    visibility: visible;
  }
}
</style>
