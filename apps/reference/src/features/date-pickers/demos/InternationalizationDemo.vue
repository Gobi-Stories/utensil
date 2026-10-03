<template>
  <div id="internationalization" class="component-demo">
    <h3><a class="demo-anchor" href="#internationalization">Internationalization</a></h3>
    <p>The calendar uses Intl.DateTimeFormat for locale-aware month names, day names, and date formatting.</p>
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content calendar-demo">
          <ReferenceCalendar v-model="i18nDate" locale="de-DE" />
          <div class="demo-value">Deutsch</div>
        </div>
        <div class="demo-label">German (de-DE)</div>
      </div>
      <div class="demo-item">
        <div class="demo-content calendar-demo">
          <ReferenceCalendar v-model="i18nDate" locale="ja-JP" />
          <div class="demo-value">Japanese</div>
        </div>
        <div class="demo-label">Japanese (ja-JP)</div>
      </div>
      <div class="demo-item">
        <div class="demo-content calendar-demo">
          <ReferenceCalendar v-model="i18nDate" locale="ar-SA" />
          <div class="demo-value">Arabic</div>
        </div>
        <div class="demo-label">Arabic (ar-SA)</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ReferenceCalendar } from '@/theme/components/ReferenceCalendar'

const i18nDate = ref<Date | null>(null)
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
