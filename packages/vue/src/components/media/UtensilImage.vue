<template>
  <img
    class="utensil-image"
    :src="src"
    :alt="alt"
    draggable="false"
    @load="(event) => emit('load', event)"
    @error="() => emit('error')"
    @click="(event) => emit('click', event)"
  />
</template>

<script setup lang="ts">
interface Props {
  src: string
  alt?: string
}

defineProps<Props>()

const emit = defineEmits<{
  load: [event: Event]
  error: []
  click: [event: MouseEvent]
}>()
</script>
