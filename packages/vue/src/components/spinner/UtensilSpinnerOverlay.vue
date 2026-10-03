<template generic="Theme extends ThemeConfig">
  <div class="utensil-spinner-overlay">
    <slot />
    <transition name="spinner-fade">
      <div
        v-if="showSpinner"
        class="overlay-container"
        :class="{
          'with-backdrop': withBackdrop,
          'with-blur': blur,
          lift: lift,
          vanish: vanish,
        }"
        role="status"
        aria-live="polite"
        :aria-label="ariaLabel"
      >
        <UtensilSpinner :color="color" :scale="scale" :soft="soft" :aria-label="ariaLabel" />
        <span v-if="title" class="overlay-title">{{ title }}</span>
        <span class="screen-reader">{{ ariaLabel }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { ref, watch, onBeforeUnmount } from 'vue'
import UtensilSpinner from './UtensilSpinner.vue'
import type { ColorProp, ScaleProp, ThemeConfig } from '../../theme/utensil-theme'

export interface Props<Theme extends ThemeConfig> {
  show?: boolean
  delay?: number
  color?: ColorProp<Theme>
  scale?: ScaleProp
  soft?: boolean
  withBackdrop?: boolean
  blur?: boolean
  ariaLabel?: string
  lift?: boolean
  vanish?: boolean
  // Visible caption under the spinner naming the work in progress
  title?: string
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  show: false,
  delay: 300,
  scale: 1,
  soft: false,
  withBackdrop: false,
  blur: false,
  ariaLabel: 'Loading...',
  lift: false,
  vanish: false,
})

const showSpinner = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.show,
  (newValue: boolean) => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    if (newValue) {
      if (props.delay > 0) {
        timer = setTimeout(() => {
          showSpinner.value = true
        }, props.delay)
      } else {
        showSpinner.value = true
      }
    } else {
      showSpinner.value = false
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer)
  }
})
</script>

<style scoped>
@layer utensil {
  .utensil-spinner-overlay {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .spinner-fade-enter-active,
  .spinner-fade-leave-active:not(.vanish) {
    transition: opacity 1s ease;
  }

  .spinner-fade-enter-to,
  .spinner-fade-leave-from {
    opacity: 1;
  }

  .spinner-fade-enter-from,
  .spinner-fade-leave-to {
    opacity: 0;
  }

  .overlay-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
  }

  .overlay-title {
    color: var(--pencil-12);
    font-size: var(--font-size-3);
    font-weight: 600;
  }

  .overlay-container.lift {
    bottom: 10%;
  }

  .overlay-container.with-backdrop {
    background-color: var(--screen);
  }

  .overlay-container.with-blur {
    backdrop-filter: blur(2px);
  }
}
</style>
