<template>
  <ReferenceComponentDemo
    title="Data Viz"
    anchor="data-viz"
    description="SVG chart component supporting 8 chart types with animated transitions."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <UtensilDataViz type="line" :series="twoSeries" :labels="monthLabels" title="Line Chart" />
        </div>
        <div class="demo-label">Line</div>
        <div class="demo-code">
          <code>&lt;UtensilDataViz type="line" :series="data" :labels="labels" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilDataViz type="bar" :series="twoSeries" :labels="monthLabels" title="Bar Chart" show-values />
        </div>
        <div class="demo-label">Bar</div>
        <div class="demo-code">
          <code>&lt;UtensilDataViz type="bar" :series="data" show-values /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilDataViz type="area" :series="singleSeries" :labels="monthLabels" title="Area Chart" />
        </div>
        <div class="demo-label">Area</div>
        <div class="demo-code">
          <code>&lt;UtensilDataViz type="area" :series="data" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilDataViz type="donut" :series="donutSeries" title="Donut Chart" />
        </div>
        <div class="demo-label">Donut</div>
        <div class="demo-code">
          <code>&lt;UtensilDataViz type="donut" :series="data" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilDataViz type="radar" :series="radarSeries" :labels="radarLabels" title="Radar Chart" />
        </div>
        <div class="demo-label">Radar</div>
        <div class="demo-code">
          <code>&lt;UtensilDataViz type="radar" :series="data" :labels="axes" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilDataViz type="scatter" :series="scatterSeries" title="Scatter Chart" />
        </div>
        <div class="demo-label">Scatter</div>
        <div class="demo-code">
          <code>&lt;UtensilDataViz type="scatter" :series="data" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilDataViz
            type="stacked-bar"
            :series="stackedSeries"
            :labels="monthLabels"
            title="Stacked Bar"
            show-values
          />
        </div>
        <div class="demo-label">Stacked Bar</div>
        <div class="demo-code">
          <code>&lt;UtensilDataViz type="stacked-bar" :series="data" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilDataViz
            type="horizontal-bar"
            :series="twoSeries"
            :labels="monthLabels"
            title="Horizontal Bar"
            show-values
          />
        </div>
        <div class="demo-label">Horizontal Bar</div>
        <div class="demo-code">
          <code>&lt;UtensilDataViz type="horizontal-bar" :series="data" /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilDataVizDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import UtensilDataViz from '@gobistories/utensil-vue/components/data-viz/UtensilDataViz.vue'
import UtensilDataVizDoc from '@gobistories/utensil-vue/components/data-viz/UtensilDataVizDoc.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { monthLabels, singleSeries } from '../chart-data'

const twoSeries = [
  { label: 'Revenue', values: [12, 19, 14, 25, 22, 30] },
  { label: 'Expenses', values: [8, 11, 9, 15, 13, 18] },
]

const donutSeries = [
  { label: 'Direct', values: [42] },
  { label: 'Organic', values: [28] },
  { label: 'Referral', values: [18] },
  { label: 'Social', values: [12] },
]

const radarSeries = [
  { label: 'Product A', values: [85, 70, 90, 60, 75, 80] },
  { label: 'Product B', values: [65, 85, 70, 80, 90, 55] },
]

const radarLabels = ['Speed', 'Power', 'Range', 'Safety', 'Comfort', 'Price']

const scatterSeries = [
  { label: 'Group A', values: [15, 28, 42, 35, 50, 22, 38], xValues: [10, 25, 35, 40, 55, 60, 75] },
  { label: 'Group B', values: [30, 18, 45, 52, 28, 40, 35], xValues: [15, 30, 45, 50, 65, 70, 80] },
]

const stackedSeries = [
  { label: 'Direct', values: [18, 22, 20, 26, 24, 30] },
  { label: 'Organic', values: [10, 14, 16, 12, 18, 15] },
  { label: 'Referral', values: [6, 8, 7, 10, 9, 12] },
]
</script>

<style scoped>
.demo-grid {
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
}
</style>
