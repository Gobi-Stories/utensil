<template>
  <ReferenceComponentDemo
    title="Sparkline"
    anchor="sparkline"
    description="A single series stretched to fill its box, without axes, for how a figure moved."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <div class="stat-cards">
            <div v-for="stat in stats" :key="stat.label" class="stat-card">
              <span class="stat-label">{{ stat.label }}</span>
              <span class="stat-value">{{ stat.value }}</span>
              <ReferenceSparkline
                class="stat-trend"
                :values="stat.trend"
                :color="stat.color"
                :fill="stat.fill"
                :aria-label="`${stat.label} trend`"
              />
            </div>
          </div>
        </div>
        <div class="demo-label always-visible">In stat cards, with and without the fill</div>
        <div class="demo-code">
          <code>&lt;ReferenceSparkline :values="trend" color="success" fill /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilTable class="trend-table" :columns="['1fr', '80px', '120px']">
            <UtensilTableHeader>
              <span>Page</span>
              <span>Views</span>
              <span>Last 8 weeks</span>
            </UtensilTableHeader>
            <UtensilTableRow v-for="page in pages" :key="page.name">
              <span>{{ page.name }}</span>
              <span>{{ page.trend[page.trend.length - 1] }}</span>
              <ReferenceSparkline
                class="row-trend"
                :values="page.trend"
                :color="page.trend[page.trend.length - 1] >= page.trend[0] ? 'success' : 'warning'"
                :aria-label="`${page.name} views trend`"
              />
            </UtensilTableRow>
          </UtensilTable>
        </div>
        <div class="demo-label always-visible">In table cells, colored by direction; a steady figure runs level</div>
        <div class="demo-code">
          <code>:color="rising ? 'success' : 'warning'"</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilSparklineDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import UtensilSparklineDoc from '@gobistories/utensil-vue/components/data-viz/UtensilSparklineDoc.vue'
import UtensilTable from '@gobistories/utensil-vue/components/table/UtensilTable.vue'
import UtensilTableHeader from '@gobistories/utensil-vue/components/table/UtensilTableHeader.vue'
import UtensilTableRow from '@gobistories/utensil-vue/components/table/UtensilTableRow.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import type { ColorProp } from '@gobistories/utensil-vue/theme/utensil-theme'
import { ReferenceSparkline } from '@/theme/components/ReferenceSparkline'
import type { ReferenceThemeConfig } from '@/theme/reference-theme'

interface Stat {
  label: string
  value: string
  trend: number[]
  color: ColorProp<ReferenceThemeConfig>
  fill: boolean
}

const stats: Stat[] = [
  { label: 'Views', value: '1,240', trend: [820, 940, 1010, 980, 1150, 1240], color: 'pen', fill: true },
  { label: 'Signups', value: '86', trend: [40, 52, 48, 61, 70, 86], color: 'success', fill: true },
  { label: 'Churn', value: '3.1%', trend: [2.2, 2.4, 2.3, 2.8, 2.9, 3.1], color: 'warning', fill: false },
]

const pages = [
  { name: 'Home', trend: [310, 320, 300, 340, 360, 355, 380, 410] },
  { name: 'Pricing', trend: [120, 118, 110, 104, 98, 96, 90, 84] },
  { name: 'Docs', trend: [75, 75, 75, 75, 75, 75, 75, 75] },
]
</script>

<style scoped>
.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-3);
  width: 100%;
}

.stat-card {
  --stat-card-padding: var(--space-3);

  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--stat-card-padding);
  border-radius: var(--radius-3);
  background-color: var(--paper-2);
  box-shadow: var(--shadow-border-2);
  /* Clips the bleeding sparkline to the card's rounded corners */
  overflow: hidden;
}

.stat-label {
  font-size: var(--font-size-1);
  color: var(--pencil-a11);
}

.stat-value {
  margin-block-end: var(--space-2);
  font-size: var(--font-size-5);
  font-weight: 600;
}

/* Bleeds through the card's padding to both sides and sits on its bottom edge */
.stat-trend {
  width: calc(100% + 2 * var(--stat-card-padding));
  height: var(--space-7);
  margin-block: auto calc(-1 * var(--stat-card-padding));
  margin-inline: calc(-1 * var(--stat-card-padding));
}

.trend-table {
  width: 100%;
}

.row-trend {
  height: var(--space-5);
}
</style>
