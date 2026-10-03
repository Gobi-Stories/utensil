<template>
  <ReferenceComponentDemo
    title="Circle Button"
    anchor="circle-button"
    description="Flexible circular button component with configurable icons, variations, and sizes."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceCircleButton icon="times" variation="soft" description="Close" />
          <ReferenceCircleButton icon="plus" variation="outline" description="Add" />
          <ReferenceCircleButton icon="check" variation="solid" color="success" description="Accept" />
          <ReferenceCircleButton icon="exclamation-triangle" variation="surface" color="error" description="Warning" />
          <ReferenceCircleButton icon="bars" variation="text" description="Accept" />
          <ReferenceCircleButton icon="circle-play" variation="overlay" description="Play" />
        </div>
        <div class="demo-label">Variations</div>
        <div class="demo-code">
          <code>&lt;UtensilCircleButton icon="plus" variation="outline" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceCircleButton icon="cog" scale="tiny" />
          <ReferenceCircleButton icon="cog" scale="small" />
          <ReferenceCircleButton icon="cog" scale="normal" />
          <ReferenceCircleButton icon="cog" scale="large" />
          <ReferenceCircleButton icon="cog" scale="giant" />
        </div>
        <div class="demo-label">Scale Presets</div>
        <div class="demo-code">
          <code>&lt;UtensilCircleButton icon="cog" scale="large" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceCircleButton icon="check" variation="solid" color="success" />
          <ReferenceCircleButton icon="exclamation-triangle" variation="solid" color="warning" />
          <ReferenceCircleButton icon="plus" variation="solid" />
        </div>
        <div class="demo-label">Solid Color Examples</div>
        <div class="demo-code">
          <code>&lt;UtensilCircleButton icon="check" variation="solid" color="success" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content controlled-demo">
          <div class="demo flex row gap-2">
            <ReferenceCircleButton icon="cog" :scale="scaleCircleButtonScale" />
            <ReferenceCircleButton icon="plus" variation="outline" :scale="scaleCircleButtonScale" />
            <ReferenceCircleButton icon="check" variation="solid" color="success" :scale="scaleCircleButtonScale" />
          </div>
          <ReferenceRangeSlider
            class="control"
            v-model="scaleCircleButtonScale"
            label="Scale"
            labelPlacement="inline"
            :min="0.7"
            :max="1.5"
            :step="0.01"
          />
        </div>
        <div class="demo-label">Reactive Scale</div>
        <div class="demo-code">
          <code>&lt;UtensilCircleButton icon="cog" :scale="{{ scaleCircleButtonScale.toFixed(2) }}" /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilCircleButtonDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilCircleButtonDoc from 'utensil-vue/components/circle-button/UtensilCircleButtonDoc.vue'
import { ReferenceCircleButton } from '@/theme/components/ReferenceCircleButton'
import { ReferenceRangeSlider } from '@/theme/components/ReferenceRangeSlider'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

const scaleCircleButtonScale = ref(1)
</script>

<style scoped>
.demo-content:not(.controlled-demo) {
  min-height: 80px;
}
</style>
