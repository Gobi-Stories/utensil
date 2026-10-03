<template>
  <ReferenceComponentDemo
    title="Progress Bar"
    anchor="progress-bar"
    description="Flexible progress bar component with determinate and indeterminate states."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content progress-demo">
          <div class="progress-container">
            <div class="progress-label">0%</div>
            <ReferenceProgressBar :value="0" />
          </div>
          <div class="progress-container">
            <div class="progress-label">25%</div>
            <ReferenceProgressBar :value="25" />
          </div>
          <div class="progress-container">
            <div class="progress-label">50%</div>
            <ReferenceProgressBar :value="50" />
          </div>
          <div class="progress-container">
            <div class="progress-label">75%</div>
            <ReferenceProgressBar :value="75" />
          </div>
          <div class="progress-container">
            <div class="progress-label">100%</div>
            <ReferenceProgressBar :value="100" />
          </div>
        </div>
        <div class="demo-label">Determinate Progress</div>
        <div class="demo-code">
          <code>&lt;UtensilProgressBar :value="50" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content progress-demo">
          <div class="progress-container">
            <div class="progress-label">Indeterminate</div>
            <ReferenceProgressBar :indeterminate="true" />
          </div>
        </div>
        <div class="demo-label">Indeterminate Progress</div>
        <div class="demo-code">
          <code>&lt;UtensilProgressBar :indeterminate="true" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content progress-demo">
          <div class="progress-container">
            <div class="progress-label">Small</div>
            <ReferenceProgressBar :value="60" size="small" />
          </div>
          <div class="progress-container">
            <div class="progress-label">Medium</div>
            <ReferenceProgressBar :value="60" size="medium" />
          </div>
          <div class="progress-container">
            <div class="progress-label">Large</div>
            <ReferenceProgressBar :value="60" size="large" />
          </div>
        </div>
        <div class="demo-label">Size Variants</div>
        <div class="demo-code">
          <code>&lt;UtensilProgressBar size="large" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content progress-demo">
          <div class="progress-container">
            <div class="progress-controls">
              <UtensilButton size="small" @click="startAnimation">
                {{ isAnimating ? 'Reset' : 'Animate' }}
              </UtensilButton>
            </div>
            <div class="progress-label">{{ Math.round(animatedProgress) }}%</div>
            <ReferenceProgressBar :value="animatedProgress" />
          </div>
        </div>
        <div class="demo-label">Interactive Progress</div>
        <div class="demo-code">
          <code>&lt;UtensilProgressBar :value="progress" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content progress-demo">
          <div class="progress-container">
            <div class="progress-label">Rounded</div>
            <ReferenceProgressBar :value="66" rounded />
          </div>
        </div>
        <div class="demo-label">Rounded Progress</div>
        <div class="demo-code">
          <code>&lt;UtensilProgressBar rounded /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content progress-demo">
          <div class="progress-container">
            <ReferenceProgressBar :value="75" color="brand" />
          </div>
          <div class="progress-container">
            <ReferenceProgressBar :value="100" color="success" />
          </div>
          <div class="progress-container">
            <ReferenceProgressBar :value="50" color="warning" />
          </div>
          <div class="progress-container">
            <ReferenceProgressBar :value="30" color="error" />
          </div>
          <div class="progress-container">
            <ReferenceProgressBar :value="60" color="favorite" />
          </div>
        </div>
        <div class="demo-label">Color Prop</div>
        <div class="demo-code">
          <code>&lt;UtensilProgressBar color="blue" /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilProgressBarDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { ReferenceProgressBar } from '@/theme/components/ReferenceProgressBar'
import UtensilProgressBarDoc from 'utensil-vue/components/progress/UtensilProgressBarDoc.vue'
import UtensilButton from 'utensil-vue/components/button/UtensilButton.vue'

const animatedProgress = ref(0)
const isAnimating = ref(false)
let animationId: number | null = null

function startAnimation() {
  if (isAnimating.value) {
    resetAnimation()
    return
  }

  isAnimating.value = true
  animatedProgress.value = 0

  const animate = () => {
    animatedProgress.value += 1
    if (animatedProgress.value >= 100) {
      isAnimating.value = false
      return
    }
    animationId = requestAnimationFrame(animate)
  }

  animate()
}

function resetAnimation() {
  isAnimating.value = false
  animatedProgress.value = 0
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.demo-content {
  min-height: 200px;
}

.demo-content.progress-demo {
  display: flex;
  min-height: 180px;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: stretch;
  gap: var(--space-3);
}

.progress-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  margin-bottom: var(--space-3);
}

.progress-label {
  font-size: 0.9rem;
  color: var(--pencil-11);
  font-weight: 500;
}

.progress-controls {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-2);
  padding: var(--space-2);
}
</style>
