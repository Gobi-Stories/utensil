<template>
  <div id="constrained" class="component-demo">
    <h3><a class="demo-anchor" href="#constrained">Constrained</a></h3>
    <p>
      Calendars with min/max dates and disabled dates. Days outside the range or matching the disabled function are not
      selectable.
    </p>
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content calendar-demo">
          <ReferenceCalendar v-model="constrainedDate" :min="minDate" :max="maxDate" />
          <div class="demo-value">Min: {{ formatDisplayDate(minDate) }} / Max: {{ formatDisplayDate(maxDate) }}</div>
        </div>
        <div class="demo-label">Min/Max Dates</div>
      </div>
      <div class="demo-item">
        <div class="demo-content calendar-demo">
          <ReferenceCalendar v-model="noWeekendsDate" :disabled-dates="isWeekend" />
          <div class="demo-value">{{ noWeekendsDate ? formatDisplayDate(noWeekendsDate) : 'Weekends disabled' }}</div>
        </div>
        <div class="demo-label">Disabled Weekends</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ReferenceCalendar } from '@/theme/components/ReferenceCalendar'
import { formatDisplayDate, minDate, maxDate } from '../date-pickers'

const constrainedDate = ref<Date | null>(null)
const noWeekendsDate = ref<Date | null>(null)

function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}
</script>

<style scoped>
.demo-content.calendar-demo {
  flex-direction: column;
  align-items: center;
  min-height: 340px;
  padding: var(--space-4);
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
