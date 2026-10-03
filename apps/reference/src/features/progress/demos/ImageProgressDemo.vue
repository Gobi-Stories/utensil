<template>
  <ReferenceComponentDemo
    title="Image Progress"
    anchor="image-progress"
    description="Progress rendered on an image — the remainder is the same image washed out by a CSS filter, so the image's transparency is preserved over any background."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content image-progress-demo">
          <div
            class="image-progress-frame scrubbable"
            @pointerdown="startImageProgressScrub"
            @pointermove="scrubImageProgress"
          >
            <UtensilImageProgress :src="waveformImage" :value="imageProgressValue" ariaLabel="Track playback" />
          </div>
          <div class="progress-controls">
            <UtensilButton scale="small" @click="toggleImageProgress">
              {{ imageProgressPlaying ? 'Pause' : 'Play' }}
            </UtensilButton>
          </div>
        </div>
        <div class="demo-label always-visible">Playback with Scrubbing</div>
        <div class="demo-code">
          <code>&lt;UtensilImageProgress :src="waveformUrl" :value="playedPercent" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content image-progress-demo">
          <div class="image-progress-selection">
            <div class="image-progress-frame">
              <UtensilImageProgress :src="waveformImage" :value="45" ariaLabel="Track playback" />
            </div>
          </div>
        </div>
        <div class="demo-label always-visible">Transparent Over a Selection</div>
        <div class="demo-code">
          <code>&lt;UtensilImageProgress :src="waveformUrl" :value="45" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content image-progress-demo">
          <div class="image-progress-frame">
            <UtensilImageProgress
              :src="waveformImage"
              :value="60"
              remainingFilter="grayscale(1) brightness(1.3)"
              ariaLabel="Track playback"
            />
          </div>
        </div>
        <div class="demo-label always-visible">Custom Remaining Filter</div>
        <div class="demo-code">
          <code>&lt;UtensilImageProgress … remainingFilter="grayscale(1) brightness(1.3)" /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilImageProgressDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import UtensilImageProgress from 'utensil-vue/components/progress/UtensilImageProgress.vue'
import UtensilImageProgressDoc from 'utensil-vue/components/progress/UtensilImageProgressDoc.vue'
import UtensilButton from 'utensil-vue/components/button/UtensilButton.vue'

// A waveform-like SVG so the demo needs no external image
const waveformImage = (() => {
  const bars = Array.from({ length: 60 }, (_, index) => {
    const height = 16 + 76 * Math.abs(Math.sin(index * 0.7) * Math.sin(index * 0.23))
    const y = (100 - height) / 2
    return `<rect x="${index * 10 + 2}" y="${y.toFixed(1)}" width="6" height="${height.toFixed(1)}" rx="3" fill="#2ba6fc"/>`
  }).join('')

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 100" preserveAspectRatio="none">${bars}</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
})()

const imageProgressValue = ref(30)
const imageProgressPlaying = ref(false)
let imageProgressFrame: number | null = null

function toggleImageProgress() {
  if (imageProgressPlaying.value) {
    stopImageProgress()
    return
  }

  imageProgressPlaying.value = true

  if (imageProgressValue.value >= 100) {
    imageProgressValue.value = 0
  }

  const advance = () => {
    imageProgressValue.value += 0.2
    if (imageProgressValue.value >= 100) {
      stopImageProgress()
      return
    }
    imageProgressFrame = requestAnimationFrame(advance)
  }

  advance()
}

function stopImageProgress() {
  imageProgressPlaying.value = false
  if (imageProgressFrame) {
    cancelAnimationFrame(imageProgressFrame)
    imageProgressFrame = null
  }
}

function seekImageProgress(target: HTMLElement, clientX: number) {
  const bounds = target.getBoundingClientRect()
  imageProgressValue.value = Math.min(100, Math.max(0, ((clientX - bounds.left) / bounds.width) * 100))
}

function startImageProgressScrub(event: PointerEvent) {
  const target = event.currentTarget

  if (target instanceof HTMLElement) {
    target.setPointerCapture(event.pointerId)
    seekImageProgress(target, event.clientX)
  }
}

function scrubImageProgress(event: PointerEvent) {
  const target = event.currentTarget

  if (target instanceof HTMLElement && target.hasPointerCapture(event.pointerId)) {
    seekImageProgress(target, event.clientX)
  }
}

onBeforeUnmount(() => {
  if (imageProgressFrame) {
    cancelAnimationFrame(imageProgressFrame)
  }
})
</script>

<style scoped>
.demo-content {
  min-height: 200px;
}

.demo-content.image-progress-demo {
  display: flex;
  min-height: 140px;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  gap: var(--space-3);
}

.image-progress-frame {
  height: var(--space-7);
  border-radius: var(--radius-1);
  overflow: hidden;
}

.image-progress-frame.scrubbable {
  cursor: pointer;
  touch-action: none;
}

.image-progress-selection {
  padding: var(--space-3);
  border-radius: var(--radius-3);
  background-color: var(--pen-a3);
  box-shadow: inset 0 0 0 1px var(--pen-a7);
}

.progress-controls {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-2);
  padding: var(--space-2);
}
</style>
