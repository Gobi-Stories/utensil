<template>
  <div id="status-dashboard" class="component-demo">
    <h3><a class="demo-anchor" href="#status-dashboard">Status Dashboard</a></h3>
    <p>
      Badges and pills use solid for active counts, soft for categories, and outline for structural labels — creating
      scannable information density.
    </p>

    <div class="scene-row">
      <div class="dashboard-row">
        <ReferenceBox class="dashboard-stat story-card">
          <div class="stat-header">
            <h5 class="stat-label">Recent Activity</h5>
            <ReferenceButton variation="text" color="pencil" size="tiny">View All</ReferenceButton>
          </div>
          <div class="activity-list">
            <div class="activity-item">
              <ReferenceAvatar fallback="AL" color="primary" variation="solid" />
              <div class="activity-detail">
                <span>Alex published <strong>Product Launch Recap</strong></span>
                <span class="activity-time">2 hours ago</span>
              </div>
              <ReferenceBadge variation="solid" color="success" label="Live" scale="small" />
            </div>
            <div class="activity-item">
              <ReferenceAvatar fallback="MK" color="favorite" variation="soft" />
              <div class="activity-detail">
                <span>Maya added 3 slides to <strong>Summer Campaign</strong></span>
                <span class="activity-time">5 hours ago</span>
              </div>
              <ReferencePill variation="outline" color="pencil" label="Draft" scale="small" />
            </div>
            <div class="activity-item">
              <ReferenceAvatar fallback="JR" color="success" variation="solid" />
              <div class="activity-detail">
                <span>Jordan uploaded <strong>interview-final.mp4</strong></span>
                <span class="activity-time">Yesterday</span>
              </div>
              <ReferencePill variation="soft" color="pencil" label="Processing" scale="small" />
            </div>
          </div>
        </ReferenceBox>

        <ReferenceBox class="dashboard-stat story-card">
          <div class="stat-header">
            <h5>Filters</h5>
            <ReferenceButton variation="text" color="pencil" size="tiny">Clear All</ReferenceButton>
          </div>
          <div class="filter-section">
            <span class="filter-label">Search</span>
            <UtensilInput variation="outline" placeholder="Filter stories..." icon="search" />
          </div>
          <div class="filter-section">
            <span class="filter-label">View</span>
            <ReferenceRadioButtons
              v-model="viewMode"
              variation="outline"
              aria-label="View mode"
              scale="small"
              show-labels
            >
              <ReferenceRadioButton value="grid" icon="table-cells" label="Grid" />
              <ReferenceRadioButton value="list" icon="list" label="List" />
            </ReferenceRadioButtons>
          </div>
          <div class="filter-section">
            <span class="filter-label">Status</span>
            <div class="filter-pills">
              <ReferencePill variation="solid" color="success" label="Published" scale="small" />
              <ReferencePill variation="outline" color="warning" label="Draft" scale="small" />
              <ReferencePill variation="outline" color="pencil" label="Archived" scale="small" />
            </div>
          </div>
        </ReferenceBox>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ReferenceButton } from '@/theme/components/ReferenceButton'
import { ReferenceBox } from '@/theme/components/ReferenceBox'
import { ReferenceBadge } from '@/theme/components/ReferenceBadge'
import { ReferencePill } from '@/theme/components/ReferencePill'
import { ReferenceAvatar } from '@/theme/components/ReferenceAvatar'
import { ReferenceRadioButtons } from '@/theme/components/ReferenceRadioButtons'
import { ReferenceRadioButton } from '@/theme/components/ReferenceRadioButton'
import UtensilInput from 'utensil-vue/components/input/UtensilInput.vue'

const viewMode = ref('grid')
</script>

<style scoped>
.component-demo {
  display: flex;
  flex-direction: column;
}

.scene-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-5);
  margin-top: var(--space-3);
}

.story-card {
  box-shadow: var(--shadow-border-2);
  background-color: var(--paper-2);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.dark-mode .story-card {
  background-color: var(--pencil-a2);
}

.dashboard-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-5);
}

.dashboard-stat {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-label {
  font-size: var(--font-size-3);
  color: var(--pencil-12);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.activity-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) 0;
}

.activity-item:not(:last-child) {
  border-bottom: 1px solid var(--pencil-a3);
}

.activity-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  font-size: var(--font-size-2);
  color: var(--pencil-11);
  min-width: 0;
}

.activity-time {
  font-size: var(--font-size-1);
  color: var(--pencil-9);
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.filter-label {
  font-size: var(--font-size-1);
  color: var(--pencil-11);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

@container size-container (max-width: 660px) {
  .dashboard-row {
    grid-template-columns: 1fr;
  }
}
</style>
