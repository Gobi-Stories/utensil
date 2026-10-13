<template>
  <div id="baseline" class="component-demo">
    <h3><a class="demo-anchor" href="#baseline">Baseline</a></h3>
    <p>
      Values below the baseline extend the axis down, keeping zero on a gridline, and a dashed line marks it. Bars run
      from it and areas fill to it. It's zero unless given.
    </p>
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <UtensilDataViz type="line" :series="score" :labels="weekLabels" :show-legend="false" />
        </div>
        <div class="demo-label always-visible">A line falling below zero</div>
        <div class="demo-code">
          <code>:series="[{ label: 'Score', values: [24, 8, -15, -32, 5, 18] }]"</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilDataViz type="area" :series="target" :labels="weekLabels" :baseline="70" :show-legend="false" />
        </div>
        <div class="demo-label always-visible">An area filled to a baseline of 70</div>
        <div class="demo-code">
          <code>type="area" :baseline="70"</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilDataViz type="bar" :series="change" :labels="quarterLabels" show-values />
        </div>
        <div class="demo-label always-visible">Bars above and below zero</div>
        <div class="demo-code">
          <code>type="bar" :series="[{ label: 'Change', values: [12, -8, 5, -14] }, ...]"</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilDataViz type="horizontal-bar" :series="change" :labels="quarterLabels" show-values />
        </div>
        <div class="demo-label always-visible">Horizontal bars either side of zero</div>
        <div class="demo-code">
          <code>type="horizontal-bar"</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilDataViz type="stacked-bar" :series="flows" :labels="quarterLabels" show-values />
        </div>
        <div class="demo-label always-visible">Stacks up and down from zero</div>
        <div class="demo-code">
          <code>type="stacked-bar"</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UtensilDataViz from '@gobistories/utensil-vue/components/data-viz/UtensilDataViz.vue'
import type { DataSeries } from '@gobistories/utensil-vue/components/data-viz/utensil-data-viz'

const weekLabels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6']
const quarterLabels = ['Q1', 'Q2', 'Q3', 'Q4']

const score: DataSeries[] = [{ label: 'Score', values: [24, 8, -15, -32, 5, 18] }]

const target: DataSeries[] = [{ label: 'Uptime', values: [82, 76, 64, 58, 71, 88] }]

const change: DataSeries[] = [
  { label: 'Change', values: [12, -8, 5, -14] },
  { label: 'Forecast', values: [9, -4, 7, -6] },
]

const flows: DataSeries[] = [
  { label: 'Joined', values: [24, 18, 30, 22] },
  { label: 'Left', values: [-10, -16, -8, -12] },
]
</script>

<style scoped>
.demo-grid {
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
}
</style>
