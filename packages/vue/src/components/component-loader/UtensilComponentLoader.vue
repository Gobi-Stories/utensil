<template>
  <div ref="containerRef" class="utensil-component-loader" :style="loadingStyle">
    <UtensilSpinnerOverlay :show="loading" vanish>
      <component :is="loadedComponent" v-if="loadedComponent" />
      <slot v-else />
    </UtensilSpinnerOverlay>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, ref, computed, watch, type Component, type CSSProperties } from 'vue'
import UtensilSpinnerOverlay from '../spinner/UtensilSpinnerOverlay.vue'

interface ModuleWithDefault {
  default: Component
}

interface Props {
  path?: string
  modules: Record<string, () => Promise<unknown>>
}

const props = defineProps<Props>()
const loadedComponent = shallowRef<Component | null>(null)
const loading = ref(false)
const containerRef = ref<HTMLElement>()
const preservedHeight = ref<string>()

const loadingStyle = computed<CSSProperties | undefined>(() => {
  if (!preservedHeight.value) return undefined
  return { height: preservedHeight.value }
})

watch(
  () => props.path,
  async (path) => {
    if (!path) {
      loadedComponent.value = null
      loading.value = false
      preservedHeight.value = undefined
      return
    }

    const loader = props.modules[path]
    if (loader) {
      if (containerRef.value) {
        preservedHeight.value = `${containerRef.value.offsetHeight}px`
      }
      loading.value = true
      const module = (await loader()) as ModuleWithDefault
      loadedComponent.value = module.default
      loading.value = false
      preservedHeight.value = undefined
    } else {
      loadedComponent.value = null
      loading.value = false
      preservedHeight.value = undefined
    }
  },
  { immediate: true },
)
</script>

<style scoped>
@layer utensil {
  .utensil-component-loader {
    position: relative;
    width: 100%;
  }
}
</style>
