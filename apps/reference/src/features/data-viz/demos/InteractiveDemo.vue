<template>
  <div id="interactive" class="component-demo">
    <h3><a class="demo-anchor" href="#interactive">Interactive</a></h3>
    <p>
      Line and area charts show a crosshair and a tooltip for the point under the pointer, with reference lines for a
      target and dashed series for a comparison.
    </p>
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <UtensilDataViz
            type="line"
            interactive
            :series="comparison"
            :labels="weekLabels"
            :reference-lines="[{ value: 1050, label: 'Target' }]"
            @hover="hovered = $event"
          />
        </div>
        <div class="demo-label always-visible">
          {{ hovered === null ? 'Hover the chart' : `Hovering ${weekLabels[hovered]}` }}
        </div>
        <div class="demo-code">
          <code>interactive :reference-lines="[{ value: 1050, label: 'Target' }]" @hover="..."</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilDataViz type="area" interactive :series="comparison" :labels="weekLabels">
            <template #tooltip="{ index }">
              <strong>{{ weekLabels[index] }}</strong>
              {{ formatValue(comparison[0].values[index] - comparison[1].values[index]) }} ahead of last quarter
            </template>
          </UtensilDataViz>
        </div>
        <div class="demo-label always-visible">Custom tooltip, dashed comparison without a fill</div>
        <div class="demo-code">
          <code>&lt;template #tooltip="{ index }"&gt;...&lt;/template&gt;</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilDataViz from '@gobistories/utensil-vue/components/data-viz/UtensilDataViz.vue'
import { formatValue, type DataSeries } from '@gobistories/utensil-vue/components/data-viz/utensil-data-viz'

const weekLabels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6']

const comparison: DataSeries[] = [
  { label: 'This quarter', values: [820, 940, 1010, 1150, 1090, 1240] },
  { label: 'Last quarter', values: [610, 650, 700, 760, 820, 870], lineStyle: 'dashed', color: 'var(--pencil-9)' },
]

const hovered = ref<number | null>(null)
</script>

<style scoped>
.demo-grid {
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
}
</style>
