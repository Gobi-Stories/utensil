<template>
  <ReferenceComponentDemo
    title="Hint Label"
    anchor="hint-label"
    description="A label with a dotted underline that explains itself in a tooltip on hover or keyboard focus, for metric names, column headers and technical terms."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content hint-metric">
          <UtensilHintLabel
            text="Active users"
            hint="How many people opened the app at least once in the last 30 days."
          />
          <span class="hint-metric-value">4,218</span>
        </div>
        <div class="demo-label always-visible">A metric's name</div>
        <div class="demo-code">
          <code>&lt;UtensilHintLabel text="Active users" :hint="explanation" /&gt;</code>
        </div>
      </div>
      <div class="demo-item hint-table-item">
        <div class="demo-content hint-table">
          <UtensilTable :columns="['1fr', '96px', '96px']">
            <UtensilTableHeader>
              <span role="columnheader">Video</span>
              <span role="columnheader">
                <UtensilHintLabel text="Plays" hint="How many times the video started playing." wrap />
              </span>
              <span role="columnheader">
                <UtensilHintLabel
                  text="Watched to the end"
                  hint="Of all the times the video was played, the share that played to its end."
                  wrap
                />
              </span>
            </UtensilTableHeader>
            <UtensilTableRow v-for="video in videos" :key="video.title">
              <span role="cell">{{ video.title }}</span>
              <span role="cell">{{ video.plays.toLocaleString() }}</span>
              <span role="cell">{{ video.completion }}%</span>
            </UtensilTableRow>
          </UtensilTable>
        </div>
        <div class="demo-label always-visible">Column headers that wrap in a narrow column</div>
        <div class="demo-code">
          <code>&lt;UtensilHintLabel text="Watched to the end" :hint="explanation" wrap /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilHintLabelDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import UtensilHintLabel from '@gobistories/utensil-vue/components/tooltip/UtensilHintLabel.vue'
import UtensilHintLabelDoc from '@gobistories/utensil-vue/components/tooltip/UtensilHintLabelDoc.vue'
import UtensilTable from '@gobistories/utensil-vue/components/table/UtensilTable.vue'
import UtensilTableHeader from '@gobistories/utensil-vue/components/table/UtensilTableHeader.vue'
import UtensilTableRow from '@gobistories/utensil-vue/components/table/UtensilTableRow.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

const videos = [
  { title: 'Spring launch', plays: 12480, completion: 64 },
  { title: 'Product tour', plays: 9213, completion: 41 },
]
</script>

<style scoped>
.demo-content.hint-metric {
  flex-direction: column;
  gap: var(--space-1);
}

.hint-metric-value {
  font-size: var(--font-size-6);
  font-weight: 600;
}

.hint-table-item {
  grid-column: span 2;
}

.demo-content.hint-table {
  align-items: stretch;
}

.demo-content.hint-table > * {
  flex: 1;
}
</style>
