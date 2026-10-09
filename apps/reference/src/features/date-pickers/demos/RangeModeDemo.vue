<template>
  <div id="range-mode" class="component-demo">
    <h3><a class="demo-anchor" href="#range-mode">Range Mode</a></h3>
    <p>Range mode with dual months. Select two dates to define the range.</p>
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content picker-demo">
          <ReferenceDatePicker
            class="dual-range"
            v-model:range="pickerRange"
            mode="range"
            :number-of-months="2"
            placeholder="Select date range"
          />
          <div class="demo-value">{{ formatRangeDisplay(pickerRange) }}</div>
        </div>
        <div class="demo-label">Range Picker (Dual Month)</div>
      </div>
      <div class="demo-item">
        <div class="demo-content picker-demo">
          <ReferenceDatePicker
            class="dual-range"
            v-model:range="pickerRangePresets"
            mode="range"
            placeholder="With presets"
            :presets="datePresets"
          />
          <div class="demo-value">{{ formatRangeDisplay(pickerRangePresets) }}</div>
        </div>
        <div class="demo-label">With Presets</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ReferenceDatePicker } from '@/theme/components/ReferenceDatePicker'
import type { DateRange } from '@gobistories/utensil-vue/components/date-picker/utensil-date-picker'
import type { DatePreset } from '@gobistories/utensil-vue/components/date-picker/UtensilDatePicker.vue'
import { formatRangeDisplay, today } from '../date-pickers'

const pickerRange = ref<DateRange>({ start: null, end: null })
const pickerRangePresets = ref<DateRange>({ start: null, end: null })

const datePresets: DatePreset[] = [
  {
    label: 'Today',
    value: { start: today, end: today },
  },
  {
    label: 'Last 7 days',
    value: {
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
      end: today,
    },
  },
  {
    label: 'Last 30 days',
    value: {
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30),
      end: today,
    },
  },
  {
    label: 'This month',
    value: {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: new Date(today.getFullYear(), today.getMonth() + 1, 0),
    },
  },
  {
    label: 'Last month',
    value: {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: new Date(today.getFullYear(), today.getMonth(), 0),
    },
  },
]
</script>

<style scoped>
.demo-content.picker-demo {
  flex-direction: column;
}

.utensil-date-picker.dual-range {
  min-width: 255px;
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
