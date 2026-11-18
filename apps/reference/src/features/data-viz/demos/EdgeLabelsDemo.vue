<template>
  <div id="edge-labels" class="component-demo">
    <h3><a class="demo-anchor" href="#edge-labels">Edge Labels</a></h3>
    <p>
      The first and last points sit at the drawing's edges, so their axis and value labels run inward from them rather
      than centring past the edge, and a long label such as a month and year shows in full.
    </p>
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <UtensilDataViz type="line" :series="views" :labels="monthLabels" :show-legend="false" show-values />
        </div>
        <div class="demo-label always-visible">A line with month and year labels</div>
        <div class="demo-code">
          <code>:labels="['Apr 2026', 'May 2026', ..., 'Sep 2026']"</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilDataViz type="area" :series="views" :labels="monthLabels" :show-legend="false" />
        </div>
        <div class="demo-label always-visible">An area with month and year labels</div>
        <div class="demo-code">
          <code>type="area" :labels="['Apr 2026', ..., 'Sep 2026']"</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UtensilDataViz from '@gobistories/utensil-vue/components/data-viz/UtensilDataViz.vue'
import type { DataSeries } from '@gobistories/utensil-vue/components/data-viz/utensil-data-viz'

const monthLabels = ['Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026']

const views: DataSeries[] = [{ label: 'Views', values: [18400, 21250, 19800, 24600, 23100, 27900] }]
</script>
