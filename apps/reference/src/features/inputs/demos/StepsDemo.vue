<template>
  <div id="steps" class="component-demo">
    <h3><a class="demo-anchor" href="#steps">Steps</a></h3>
    <p>
      Predefined step values that are evenly spaced on the slider, regardless of their numeric distance. Only values in
      the steps array are selectable.
    </p>
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceRangeSlider v-model="rangeStepsPow2" :steps="[1, 2, 4, 8, 16]" label="Powers of 2" showValue />
          <div class="input-value">Value: {{ rangeStepsPow2 }}</div>
        </div>
        <div class="demo-label">Powers of 2</div>
        <div class="demo-code">
          <code>&lt;UtensilRangeSlider :steps="[1, 2, 4, 8, 16]" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceRangeSlider v-model="rangeStepsFib" :steps="[0, 1, 2, 3, 5, 8, 13]" showValue label="Fibonacci" />
          <div class="input-value">Value: {{ rangeStepsFib }}</div>
        </div>
        <div class="demo-label">Fibonacci</div>
        <div class="demo-code">
          <code>&lt;UtensilRangeSlider :steps="[0, 1, 2, 3, 5, 8, 13]" label="Fibonacci" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceRangeSlider
            v-model="rangeStepsFormatted"
            :steps="[0.25, 0.5, 1, 1.5, 2, 3]"
            label="Playback Speed"
            showValue
            :formatValue="(v: number) => `${v}x`"
            color="success"
          />
          <div class="input-value">Value: {{ rangeStepsFormatted }}x</div>
        </div>
        <div class="demo-label">Playback Speed</div>
        <div class="demo-code">
          <code>&lt;UtensilRangeSlider :steps="[0.25, 0.5, 1, 1.5, 2, 3]" /&gt;</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ReferenceRangeSlider } from '@/theme/components/ReferenceRangeSlider'

const rangeStepsPow2 = ref(4)
const rangeStepsFib = ref(3)
const rangeStepsFormatted = ref(1)
</script>

<style scoped>
.demo-content.input-demo {
  flex-direction: column;
  align-items: stretch;
}

.input-value {
  margin-top: var(--space-2);
  padding: var(--space-1) var(--space-2);
  background-color: var(--pencil-3);
  border-radius: var(--radius-2);
  font-size: 0.85rem;
  color: var(--pencil-11);
  text-align: center;
  font-family: ui-monospace, monospace;
}
</style>
