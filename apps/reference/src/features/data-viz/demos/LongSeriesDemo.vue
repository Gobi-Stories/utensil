<template>
  <div id="long-series" class="component-demo">
    <h3><a class="demo-anchor" href="#long-series">Long Series</a></h3>
    <p>
      A long, jagged line draws in whole, however long its path. Crowded x-axis labels thin to what the width fits, and
      the chart fills a wide box at its natural height.
    </p>
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <UtensilDataViz type="line" interactive :series="weekly" :labels="weekLabels" :show-legend="false" />
        </div>
        <div class="demo-label always-visible">52 weeks swinging between their extremes</div>
        <div class="demo-code">
          <code>&lt;UtensilDataViz type="line" :series="weekly" :labels="weeks" /&gt;</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UtensilDataViz from '@gobistories/utensil-vue/components/data-viz/UtensilDataViz.vue'
import type { DataSeries } from '@gobistories/utensil-vue/components/data-viz/utensil-data-viz'

const weekLabels = Array.from({ length: 52 }, (_, index) => `W${index + 1}`)

const weekly: DataSeries[] = [
  { label: 'Satisfied', values: weekLabels.map((_, index) => (index % 2 === 0 ? 10 + (index % 7) : 90 - (index % 5))) },
]
</script>
