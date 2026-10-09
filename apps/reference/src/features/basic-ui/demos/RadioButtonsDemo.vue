<template>
  <ReferenceComponentDemo
    title="Radio Buttons"
    anchor="radio-buttons"
    description="Groups toggle buttons as a radio group - only one button can be selected at a time."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceRadioButtons v-model="alignment" aria-label="Text alignment">
            <ReferenceRadioButton value="left" icon="align-left" />
            <ReferenceRadioButton value="center" icon="align-center" />
            <ReferenceRadioButton value="right" icon="align-right" />
          </ReferenceRadioButtons>
        </div>
        <div class="demo-label">Basic</div>
        <div class="demo-code">
          <code>&lt;UtensilRadioButtons v-model="value"&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceRadioButtons v-model="radioVariation" variation="outline" aria-label="Variation demo">
            <ReferenceRadioButton value="left" icon="align-left" />
            <ReferenceRadioButton value="center" icon="align-center" />
            <ReferenceRadioButton value="right" icon="align-right" />
          </ReferenceRadioButtons>
        </div>
        <div class="demo-label">Outline Variation</div>
        <div class="demo-code">
          <code>&lt;UtensilRadioButtons variation="outline"&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceRadioButtons v-model="radioColor" color="success" aria-label="Color demo">
            <ReferenceRadioButton value="left" icon="align-left" />
            <ReferenceRadioButton value="center" icon="align-center" />
            <ReferenceRadioButton value="right" icon="align-right" />
          </ReferenceRadioButtons>
        </div>
        <div class="demo-label">Color</div>
        <div class="demo-code">
          <code>&lt;UtensilRadioButtons color="success"&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <div class="demo-stack">
            <ReferenceRadioButtons v-model="radioWithLabels" aria-label="With labels" showLabels>
              <ReferenceRadioButton value="left" icon="align-left" label="Left" label-position="end" />
              <ReferenceRadioButton value="center" icon="align-center" label="Center" label-position="end" />
              <ReferenceRadioButton value="right" icon="align-right" label="Right" label-position="end" />
            </ReferenceRadioButtons>
          </div>
        </div>
        <div class="demo-label">With Labels</div>
        <div class="demo-code">
          <code>&lt;UtensilRadioButton label="Left" label-position="end" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceRadioButtons v-model="radioDisabled" disabled aria-label="Disabled demo">
            <ReferenceRadioButton value="left" icon="align-left" />
            <ReferenceRadioButton value="center" icon="align-center" />
            <ReferenceRadioButton value="right" icon="align-right" />
          </ReferenceRadioButtons>
        </div>
        <div class="demo-label">Disabled</div>
        <div class="demo-code">
          <code>&lt;UtensilRadioButtons disabled&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceRadioButtons v-model="radioRound" round aria-label="Round demo">
            <ReferenceRadioButton value="left" icon="align-left" />
            <ReferenceRadioButton value="center" icon="align-center" />
            <ReferenceRadioButton value="right" icon="align-right" />
          </ReferenceRadioButtons>
        </div>
        <div class="demo-label">Round</div>
        <div class="demo-code">
          <code>&lt;UtensilRadioButtons round&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilRadioButtonsDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilRadioButtonsDoc from '@gobistories/utensil-vue/components/radio-buttons/UtensilRadioButtonsDoc.vue'
import { ReferenceRadioButtons } from '@/theme/components/ReferenceRadioButtons'
import { ReferenceRadioButton } from '@/theme/components/ReferenceRadioButton'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

const alignment = ref('center')
const radioVariation = ref('left')
const radioColor = ref('center')
const radioWithLabels = ref('left')
const radioDisabled = ref('center')
const radioRound = ref('right')
</script>

<style scoped>
.demo-content {
  min-height: 80px;
}
</style>
