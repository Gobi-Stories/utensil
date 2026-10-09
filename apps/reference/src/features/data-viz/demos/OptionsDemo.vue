<template>
  <div id="options" class="component-demo">
    <h3><a class="demo-anchor" href="#options">Options</a></h3>
    <p>Configure grid visibility, legend, value labels, and animations.</p>
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <UtensilDataViz
            type="line"
            :series="singleSeries"
            :labels="monthLabels"
            :show-grid="false"
            :show-legend="false"
          />
        </div>
        <div class="demo-label always-visible">No grid, no legend</div>
        <div class="demo-code">
          <code>:show-grid="false" :show-legend="false"</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilDataViz type="bar" :series="singleSeries" :labels="monthLabels" :animate="false" show-values />
        </div>
        <div class="demo-label always-visible">No animation, show values</div>
        <div class="demo-code">
          <code>:animate="false"</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UtensilDataViz from '@gobistories/utensil-vue/components/data-viz/UtensilDataViz.vue'
import { monthLabels, singleSeries } from '../chart-data'
</script>

<style scoped>
.demo-grid {
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
}
</style>
