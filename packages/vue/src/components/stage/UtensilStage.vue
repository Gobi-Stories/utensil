<template>
  <dialog ref="rootEl" class="utensil-stage" tabindex="-1" :class="{ 'is-mounted': mounted }" @close="emit('close')">
    <slot />
  </dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useModalKeyboard } from '../../composables/use-modal-keyboard'

interface Props {
  fadeIn?: boolean
}

const { fadeIn = true } = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const rootEl = ref<HTMLDialogElement>()
const mounted = ref(false)

useModalKeyboard(rootEl)

onMounted(() => {
  rootEl.value?.showModal()
  if (fadeIn) {
    nextTick(() => {
      mounted.value = true
    })
  } else {
    mounted.value = true
  }
})

onBeforeUnmount(() => {
  if (rootEl.value?.open) {
    rootEl.value.close()
  }
})
</script>

<style scoped>
@layer utensil {
  .utensil-stage {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    max-width: none;
    max-height: none;
    margin: 0;
    padding: 0;
    border: none;
    background: black;
    color: white;
    overflow: hidden;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .utensil-stage.is-mounted {
    opacity: 1;
  }

  /* The dialog takes focus only to keep keys inside; it isn't a control */
  .utensil-stage:focus {
    outline: none;
  }

  .utensil-stage::backdrop {
    background: transparent;
  }
}
</style>
