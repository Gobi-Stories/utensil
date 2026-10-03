<template>
  <ReferenceComponentDemo
    title="Color Picker"
    anchor="color-picker"
    description="Color input backed by the browser's native picker, with an optional hex field or a predefined swatch grid."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <div class="color-picker-demo">
            <UtensilColorPicker v-model="basicColor" label="Color" />
          </div>
        </div>
        <div class="demo-label">Swatch and Hex Input</div>
        <div class="demo-code">
          <code>&lt;UtensilColorPicker v-model="color" label="Color" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <div class="color-picker-demo">
            <UtensilColorPicker v-model="swatchColor" label="Color" :show-input="false" />
          </div>
        </div>
        <div class="demo-label">Swatch Only</div>
        <div class="demo-code">
          <code>&lt;UtensilColorPicker v-model="color" :show-input="false" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <div class="color-picker-demo">
            <UtensilColorPicker v-model="presetColor" label="Brand color" :colors="presetColors" />
          </div>
        </div>
        <div class="demo-label">Predefined Colors</div>
        <div class="demo-code">
          <code>&lt;UtensilColorPicker v-model="color" :colors="brandColors" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <div class="color-picker-demo">
            <UtensilColorPicker v-model="smallColor" label="Brand color" :colors="presetColors" size="small" />
          </div>
        </div>
        <div class="demo-label">Small</div>
        <div class="demo-code">
          <code>&lt;UtensilColorPicker v-model="color" :colors="brandColors" size="small" /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilColorPickerDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import UtensilColorPicker from 'utensil-vue/components/color-picker/UtensilColorPicker.vue'
import UtensilColorPickerDoc from 'utensil-vue/components/color-picker/UtensilColorPickerDoc.vue'
import type { ColorPickerOption } from 'utensil-vue/components/color-picker/utensil-color-picker'

const basicColor = ref('#2664eb')
const swatchColor = ref('#10b981')
const presetColor = ref('#2664eb')
const smallColor = ref('#c026d3')

const presetColors: ColorPickerOption[] = [
  { value: '#2664eb', name: 'Primary' },
  { value: '#10b981', name: 'Secondary' },
  { value: '#f59e0b', name: 'Tertiary' },
  { value: '#c026d3', name: 'Quaternary' },
]
</script>

<style scoped>
.color-picker-demo {
  align-self: center;
  min-width: 220px;
}
</style>
