<template>
  <ReferenceComponentDemo
    title="Stage"
    anchor="stage"
    description="Viewport-filling presentation surface for media-focused viewing. Renders as a modal dialog in the browser top layer, fades in on mount, and dismisses on Escape."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton @click="stageOpen = true">Open Stage</UtensilButton>
          <UtensilStage v-if="stageOpen" @close="stageOpen = false">
            <div class="stage-demo-content">
              <UtensilImage :src="sampleLandscape" alt="Stage demo" />
              <UtensilButton class="stage-demo-close shadow-2" scale="small" @click="stageOpen = false"
                >Close</UtensilButton
              >
            </div>
          </UtensilStage>
        </div>
        <div class="demo-label always-visible">Stage</div>
        <div class="demo-code">
          <code>&lt;UtensilStage v-if="open" @close="open = false"&gt;...&lt;/UtensilStage&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilStageDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilStage from '@gobistories/utensil-vue/components/stage/UtensilStage.vue'
import UtensilStageDoc from '@gobistories/utensil-vue/components/stage/UtensilStageDoc.vue'
import UtensilImage from '@gobistories/utensil-vue/components/media/UtensilImage.vue'
import UtensilButton from '@gobistories/utensil-vue/components/button/UtensilButton.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

import sampleLandscape from '@/features/assets/sample-landscape.svg'

const stageOpen = ref(false)
</script>

<style scoped>
.stage-demo-content {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stage-demo-content .utensil-image {
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
}

.stage-demo-close {
  position: absolute;
  top: var(--space-2);
  left: var(--space-2);
}
</style>
