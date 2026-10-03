<template>
  <ReferenceComponentDemo
    title="Date Picker"
    anchor="date-picker"
    description="Composes a calendar with a popover trigger. Click the input to open, select a date to close."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content picker-demo">
          <ReferenceDatePicker
            v-model="pickerSurface"
            label="Date"
            placeholder="Surface variation"
            variation="surface"
          />
          <div class="demo-value">{{ pickerSurface ? formatDisplayDate(pickerSurface) : 'null' }}</div>
        </div>
        <div class="demo-label">Surface (default)</div>
      </div>
      <div class="demo-item">
        <div class="demo-content picker-demo">
          <ReferenceDatePicker v-model="pickerSoft" label="Date" placeholder="Soft variation" variation="soft" />
          <div class="demo-value">{{ pickerSoft ? formatDisplayDate(pickerSoft) : 'null' }}</div>
        </div>
        <div class="demo-label">Soft</div>
      </div>
      <div class="demo-item">
        <div class="demo-content picker-demo">
          <ReferenceDatePicker
            v-model="pickerOutline"
            label="Date"
            placeholder="Outline variation"
            variation="outline"
          />
          <div class="demo-value">{{ pickerOutline ? formatDisplayDate(pickerOutline) : 'null' }}</div>
        </div>
        <div class="demo-label">Outline</div>
      </div>
    </div>

    <template #api>
      <UtensilDatePickerDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ReferenceDatePicker } from '@/theme/components/ReferenceDatePicker'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import UtensilDatePickerDoc from 'utensil-vue/components/date-picker/UtensilDatePickerDoc.vue'
import { formatDisplayDate } from '../date-pickers'

const pickerSurface = ref<Date | null>(null)
const pickerSoft = ref<Date | null>(null)
const pickerOutline = ref<Date | null>(null)
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
