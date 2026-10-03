<template>
  <UtensilProgressBar v-if="errored" :value="100" color="warning" :size="size" aria-label="Upload failed" />
  <UtensilProgressBar v-else-if="!progress" :value="1" :size="size" aria-label="Upload pending" />
  <UtensilProgressBar v-else-if="progress < 100" :value="displayProgress" :size="size" aria-label="Upload progress" />
  <UtensilProgressBar v-else :value="100" indeterminate :size="size" aria-label="Processing upload" />
</template>

<script setup lang="ts">
import UtensilProgressBar from './UtensilProgressBar.vue'
import { computed } from 'vue'

interface Props {
  progress: number // between 0 and 1
  errored?: boolean
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  errored: false,
  size: 'medium',
})

const displayProgress = computed(() => Math.max(1, props.progress))
</script>
