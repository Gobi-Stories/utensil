<template>
  <div class="utensil-font-preview">
    <div class="font-style">
      <UtensilFader :show="loaded" :fadeIn="fadeIn">
        <UtensilFontText :fontFamily="fontFamily">
          <slot>{{ text ?? 'Aa' }}</slot>
        </UtensilFontText>
      </UtensilFader>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import UtensilFader from '../fader/UtensilFader.vue'
import UtensilFontText from './UtensilFontText.vue'

interface Props {
  fontFamily: string
  text?: string
}

const props = defineProps<Props>()

const loaded = ref(false)
const fadeIn = ref(true)

watch(
  () => props.fontFamily,
  async (fontFamily) => {
    if (!fontFamily) {
      loaded.value = false
      return
    }
    const spec = `1rem "${fontFamily.replace(/"/g, '\\"')}"`
    if (document.fonts.check(spec)) {
      fadeIn.value = false
      loaded.value = true
      return
    }
    fadeIn.value = true
    loaded.value = false
    await document.fonts.load(spec)
    if (props.fontFamily === fontFamily) {
      loaded.value = true
    }
  },
  { immediate: true },
)
</script>

<style scoped>
@layer utensil {
  .utensil-font-preview {
    width: 100%;
    height: 100%;
    max-height: 100%;
    container-type: inline-size;
    background-color: var(--font-preview-background-color, var(--background));

    .font-style {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      overflow: hidden;
      container-type: inline-size;
      padding: var(--space-4);
      text-align: center;
      text-wrap: balance;
      overflow-wrap: anywhere;
      line-height: 1.25;
      color: var(--font-preview-color, var(--pencil-a12));
      font-size: var(--font-preview-size, clamp(0.875rem, 14cqi, 2.5rem));
    }
  }
}
</style>
