<template>
  <ReferenceTheme :pen="color" :pencil="color">
    <!-- Pen scale -->
    <div class="scale-group">
      <div class="scale-label">{{ displayName }} Pen</div>
      <div class="scale-row">
        <div class="scale-swatch" :style="{ backgroundColor: 'var(--pen-1)' }">
          <span class="swatch-number swatch-number-dark">1</span>
        </div>
        <div class="scale-swatch" :style="{ backgroundColor: 'var(--pen-2)' }">
          <span class="swatch-number swatch-number-dark">2</span>
        </div>
        <div class="scale-swatch" :style="{ backgroundColor: 'var(--pen-3)' }">
          <span class="swatch-number swatch-number-dark">3</span>
        </div>
        <div class="scale-swatch" :style="{ backgroundColor: 'var(--pen-4)' }">
          <span class="swatch-number swatch-number-dark">4</span>
        </div>
        <div class="scale-swatch" :style="{ backgroundColor: 'var(--pen-5)' }">
          <span class="swatch-number swatch-number-dark">5</span>
        </div>
        <div class="scale-swatch" :style="{ backgroundColor: 'var(--pen-6)' }">
          <span class="swatch-number swatch-number-dark">6</span>
        </div>
        <div class="scale-swatch" :style="{ backgroundColor: 'var(--pen-7)' }">
          <span class="swatch-number swatch-number-dark">7</span>
        </div>
        <div class="scale-swatch" :style="{ backgroundColor: 'var(--pen-8)' }">
          <span class="swatch-number swatch-number-light">8</span>
        </div>
        <div class="scale-swatch" :style="{ backgroundColor: 'var(--pen-9)' }">
          <span class="swatch-number swatch-number-light">9</span>
        </div>
        <div class="scale-swatch" :style="{ backgroundColor: 'var(--pen-10)' }">
          <span class="swatch-number swatch-number-light">10</span>
        </div>
        <div class="scale-swatch" :style="{ backgroundColor: 'var(--pen-11)' }">
          <span class="swatch-number swatch-number-light">11</span>
        </div>
        <div class="scale-swatch" :style="{ backgroundColor: 'var(--pen-12)' }">
          <span class="swatch-number swatch-number-light">12</span>
        </div>
      </div>
    </div>

    <!-- Pencil scale -->
    <div class="scale-group">
      <div class="scale-label">{{ displayName }} Pencil</div>
      <div class="scale-row">
        <div class="scale-swatch" :style="{ backgroundColor: 'var(--pencil-1)' }">
          <span class="swatch-number swatch-number-dark">1</span>
        </div>
        <div class="scale-swatch" :style="{ backgroundColor: 'var(--pencil-2)' }">
          <span class="swatch-number swatch-number-dark">2</span>
        </div>
        <div class="scale-swatch" :style="{ backgroundColor: 'var(--pencil-3)' }">
          <span class="swatch-number swatch-number-dark">3</span>
        </div>
        <div class="scale-swatch" :style="{ backgroundColor: 'var(--pencil-4)' }">
          <span class="swatch-number swatch-number-dark">4</span>
        </div>
        <div class="scale-swatch" :style="{ backgroundColor: 'var(--pencil-5)' }">
          <span class="swatch-number swatch-number-dark">5</span>
        </div>
        <div class="scale-swatch" :style="{ backgroundColor: 'var(--pencil-6)' }">
          <span class="swatch-number swatch-number-dark">6</span>
        </div>
        <div class="scale-swatch" :style="{ backgroundColor: 'var(--pencil-7)' }">
          <span class="swatch-number swatch-number-dark">7</span>
        </div>
        <div class="scale-swatch" :style="{ backgroundColor: 'var(--pencil-8)' }">
          <span class="swatch-number swatch-number-light">8</span>
        </div>
        <div class="scale-swatch" :style="{ backgroundColor: 'var(--pencil-9)' }">
          <span class="swatch-number swatch-number-light">9</span>
        </div>
        <div class="scale-swatch" :style="{ backgroundColor: 'var(--pencil-10)' }">
          <span class="swatch-number swatch-number-light">10</span>
        </div>
        <div class="scale-swatch" :style="{ backgroundColor: 'var(--pencil-11)' }">
          <span class="swatch-number swatch-number-light">11</span>
        </div>
        <div class="scale-swatch" :style="{ backgroundColor: 'var(--pencil-12)' }">
          <span class="swatch-number swatch-number-light">12</span>
        </div>
      </div>
    </div>
  </ReferenceTheme>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ColorProp } from 'utensil-vue/theme/utensil-theme'
import type { ReferenceThemeConfig } from '@/theme/reference-theme'
import { ReferenceTheme } from '@/theme/ReferenceTheme'

const { color } = defineProps<{
  color: ColorProp<ReferenceThemeConfig>
}>()

const displayName = computed(() => {
  // Capitalize first letter of color name
  return String(color).charAt(0).toUpperCase() + String(color).slice(1)
})
</script>

<style scoped>
.scale-group {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 12px;
  align-items: center;
  margin-bottom: 4px;
}

.scale-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--pencil-11);
  text-align: right;
  padding-right: 8px;
}

.scale-row {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 4px;
}

.scale-swatch {
  aspect-ratio: 1;
  border-radius: 4px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 4px;
  position: relative;
}

.swatch-number {
  font-size: 0.7rem;
  font-weight: 600;
}

.swatch-number-dark {
  color: var(--pencil-11);
}

.swatch-number-light {
  color: var(--pencil-2);
}
</style>
