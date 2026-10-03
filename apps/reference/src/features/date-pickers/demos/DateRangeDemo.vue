<template>
  <div id="date-range" class="component-demo">
    <h3><a class="demo-anchor" href="#date-range">Date Range</a></h3>
    <p>
      Range selection mode. Click once to set the start date, click again to set the end date. Hover to preview the
      range.
    </p>
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content calendar-demo">
          <ReferenceCalendar v-model:range="dateRange" mode="range" />
          <div class="demo-value">{{ formatRangeDisplay(dateRange) }}</div>
        </div>
        <div class="demo-label">Single Month Range</div>
      </div>
      <div class="demo-item dual-calendar-item">
        <div class="demo-content calendar-demo">
          <ReferenceCalendar v-model:range="dateRangeDual" mode="range" :number-of-months="2" />
          <div class="demo-value">{{ formatRangeDisplay(dateRangeDual) }}</div>
        </div>
        <div class="demo-label">Dual Month Range</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ReferenceCalendar } from '@/theme/components/ReferenceCalendar'
import type { DateRange } from 'utensil-vue/components/date-picker/utensil-date-picker'
import { formatRangeDisplay } from '../date-pickers'

const dateRange = ref<DateRange>({ start: null, end: null })
const dateRangeDual = ref<DateRange>({ start: null, end: null })
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
