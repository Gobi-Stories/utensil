<template>
  <div class="utensil-placeholder">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon"
      :class="{ show: showIcon }"
    >
      <!-- Video -->
      <template v-if="mediaType === 'video'">
        <polygon points="23 7 16 12 23 17 23 7"></polygon>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
      </template>
      <!-- Image -->
      <template v-else-if="mediaType === 'image'">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </template>
      <!-- Audio waveform -->
      <template v-else-if="mediaType === 'audio'">
        <path stroke-width="3" d="M2 11v2M7 5v14M12 8v8M17 2v20M22 10v4M23 0"></path>
      </template>
      <!-- Music -->
      <template v-else-if="mediaType === 'music'">
        <path d="M9 18V5l12-2v13"></path>
        <circle cx="6" cy="18" r="3"></circle>
        <circle cx="18" cy="16" r="3"></circle>
      </template>
      <!-- Font -->
      <template v-else-if="mediaType === 'font'">
        <path d="M4 7V4h16v3"></path>
        <path d="M9 20h6"></path>
        <path d="M12 4v16"></path>
      </template>
      <!-- File -->
      <template v-else>
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
        <polyline points="13 2 13 9 20 9"></polyline>
      </template>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  mediaType?: string
}

defineProps<Props>()

const showIcon = ref(false)

onMounted(() => {
  setTimeout(() => {
    showIcon.value = true
  }, 30)
})
</script>

<style scoped>
@layer utensil {
  .utensil-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    color: var(--pencil-a10);
  }

  .utensil-placeholder .icon:not(.immediate) {
    opacity: 0;
    transition: opacity 300ms ease-in;
    transition-delay: 270ms;
  }

  .utensil-placeholder .icon.show {
    opacity: 1;
  }
}
</style>
