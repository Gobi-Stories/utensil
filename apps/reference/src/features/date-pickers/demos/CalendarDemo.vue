<template>
  <ReferenceComponentDemo
    title="Calendar"
    anchor="calendar"
    description="An inline calendar for picking a single date. Click a day to select it."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content calendar-demo">
          <ReferenceCalendar v-model="singleDate" />
          <div class="demo-value">{{ singleDate ? formatDisplayDate(singleDate) : 'No date selected' }}</div>
        </div>
        <div class="demo-label">Default (Monday start)</div>
      </div>
      <div class="demo-item">
        <div class="demo-content calendar-demo">
          <ReferenceCalendar v-model="singleDateSunday" :week-starts-on="0" />
          <div class="demo-value">
            {{ singleDateSunday ? formatDisplayDate(singleDateSunday) : 'No date selected' }}
          </div>
        </div>
        <div class="demo-label">Sunday Start</div>
      </div>
      <div class="demo-item">
        <div class="demo-content calendar-demo">
          <ReferenceCalendar v-model="singleDateColor" color="blue" />
          <div class="demo-value">
            {{ singleDateColor ? formatDisplayDate(singleDateColor) : 'No date selected' }}
          </div>
        </div>
        <div class="demo-label">Custom Color</div>
      </div>
      <div class="demo-item">
        <div class="demo-content calendar-demo">
          <ReferenceCalendar v-model="singleDateAdjacent" show-adjacent-days />
          <div class="demo-value">
            {{ singleDateAdjacent ? formatDisplayDate(singleDateAdjacent) : 'No date selected' }}
          </div>
        </div>
        <div class="demo-label always-visible">Adjacent Days Visible</div>
      </div>
    </div>

    <template #api>
      <UtensilCalendarDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ReferenceCalendar } from '@/theme/components/ReferenceCalendar'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import UtensilCalendarDoc from '@gobistories/utensil-vue/components/date-picker/UtensilCalendarDoc.vue'
import { formatDisplayDate } from '../date-pickers'

const singleDate = ref<Date | null>(null)
const singleDateSunday = ref<Date | null>(null)
const singleDateColor = ref<Date | null>(null)
const singleDateAdjacent = ref<Date | null>(null)
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
