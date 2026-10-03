<template>
  <div id="states" class="component-demo">
    <h3><a class="demo-anchor" href="#states">States</a></h3>
    <p>Various configurations: custom colors, disabled state, min/max constraints.</p>
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content picker-demo">
          <ReferenceDatePicker v-model="pickerColor" color="green" placeholder="Green accent" />
          <div class="demo-value">{{ pickerColor ? formatDisplayDate(pickerColor) : 'null' }}</div>
        </div>
        <div class="demo-label">Custom Color</div>
      </div>
      <div class="demo-item">
        <div class="demo-content picker-demo">
          <ReferenceDatePicker v-model="pickerConstrained" :min="minDate" :max="maxDate" placeholder="Constrained" />
          <div class="demo-value">{{ pickerConstrained ? formatDisplayDate(pickerConstrained) : 'null' }}</div>
        </div>
        <div class="demo-label">Min/Max Constrained</div>
      </div>
      <div class="demo-item">
        <div class="demo-content picker-demo">
          <ReferenceDatePicker placeholder="Disabled" disabled />
          <div class="demo-value">Disabled state</div>
        </div>
        <div class="demo-label">Disabled</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ReferenceDatePicker } from '@/theme/components/ReferenceDatePicker'
import { formatDisplayDate, minDate, maxDate } from '../date-pickers'

const pickerColor = ref<Date | null>(null)
const pickerConstrained = ref<Date | null>(null)
</script>

<style scoped>
.demo-content.picker-demo {
  flex-direction: column;
}

.demo-value {
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
