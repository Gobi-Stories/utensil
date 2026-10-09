<template>
  <ReferenceComponentDemo
    title="Spinner Overlay"
    anchor="spinner-overlay"
    description="Overlay spinner for loading states over content."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content spinner-overlay-demo">
          <div class="overlay-demo-container">
            <ReferenceSpinnerOverlay :show="overlayDemo1" :delay="0">
              <div class="overlay-content-box">
                <span>Content underneath the overlay</span>
              </div>
            </ReferenceSpinnerOverlay>
            <UtensilButton class="overlay-trigger" scale="small" @click="overlayDemo1 = !overlayDemo1">
              {{ overlayDemo1 ? 'Hide' : 'Show' }} Overlay
            </UtensilButton>
          </div>
        </div>
        <div class="demo-label">Basic Overlay</div>
      </div>
      <div class="demo-item">
        <div class="demo-content spinner-overlay-demo">
          <div class="overlay-demo-container">
            <ReferenceSpinnerOverlay :show="overlayDemo2" :delay="0" blur>
              <div class="overlay-content-box">
                <span>Content with blur</span>
              </div>
            </ReferenceSpinnerOverlay>
            <UtensilButton class="overlay-trigger" scale="small" @click="overlayDemo2 = !overlayDemo2">
              {{ overlayDemo2 ? 'Hide' : 'Show' }} Overlay
            </UtensilButton>
          </div>
        </div>
        <div class="demo-label">With Blur</div>
      </div>
      <div class="demo-item">
        <div class="demo-content spinner-overlay-demo">
          <div class="overlay-demo-container">
            <ReferenceSpinnerOverlay :show="overlayDemo3" :delay="0" with-backdrop>
              <div class="overlay-content-box">
                <span>Content with backdrop</span>
              </div>
            </ReferenceSpinnerOverlay>
            <UtensilButton class="overlay-trigger" scale="small" @click="overlayDemo3 = !overlayDemo3">
              {{ overlayDemo3 ? 'Hide' : 'Show' }} Backdrop
            </UtensilButton>
          </div>
        </div>
        <div class="demo-label">With Backdrop</div>
      </div>
      <div class="demo-item">
        <div class="demo-content spinner-overlay-demo">
          <div class="overlay-demo-container">
            <ReferenceSpinnerOverlay :show="overlayDemo4" :delay="0" with-backdrop title="Transcribing subtitles">
              <div class="overlay-content-box">
                <span>Content with a titled overlay</span>
              </div>
            </ReferenceSpinnerOverlay>
            <UtensilButton class="overlay-trigger" scale="small" @click="overlayDemo4 = !overlayDemo4">
              {{ overlayDemo4 ? 'Hide' : 'Show' }} Title
            </UtensilButton>
          </div>
        </div>
        <div class="demo-label">With Title</div>
      </div>
    </div>

    <template #api>
      <UtensilSpinnerOverlayDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { ReferenceSpinnerOverlay } from '@/theme/components/ReferenceSpinnerOverlay'
import UtensilSpinnerOverlayDoc from '@gobistories/utensil-vue/components/spinner/UtensilSpinnerOverlayDoc.vue'
import UtensilButton from '@gobistories/utensil-vue/components/button/UtensilButton.vue'

const overlayDemo1 = ref(false)
const overlayDemo2 = ref(false)
const overlayDemo3 = ref(false)
const overlayDemo4 = ref(false)
</script>

<style scoped>
.demo-content {
  min-height: 200px;
}

.demo-content.spinner-overlay-demo {
  position: relative;
  height: 120px;
  padding: 0;
  overflow: hidden;
}

.overlay-demo-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.overlay-trigger {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
}

.overlay-content-box {
  padding: var(--space-3);
  text-align: center;
  background-color: var(--pencil-2);
  border-radius: var(--radius-2);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
