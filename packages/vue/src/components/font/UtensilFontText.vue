<template>
  <span class="utensil-font-text" :style="{ fontFamily }">
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup lang="ts">
interface Props {
  fontFamily: string
  text?: string
}

defineProps<Props>()
</script>

<style scoped>
@layer utensil {
  .utensil-font-text {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
</style>
