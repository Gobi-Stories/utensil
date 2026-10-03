<template>
  <UtensilCircleButton
    icon="times"
    :variation="variation"
    color="pencil"
    :description="description"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
import UtensilCircleButton from './UtensilCircleButton.vue'

interface Props {
  description?: string
  variation?: 'soft' | 'overlay'
}

withDefaults(defineProps<Props>(), {
  description: 'Close',
  variation: 'soft',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function handleClick(event: MouseEvent) {
  emit('click', event)
}
</script>

<style scoped>
@layer utensil {
  /* Fade out soft close button background */
  .utensil-circle-button.ui-soft:hover:not(:disabled) {
    transform: scale(1.1);
    background-color: var(--background);
  }
}
</style>
