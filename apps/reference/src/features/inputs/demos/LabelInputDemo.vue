<template>
  <ReferenceComponentDemo
    title="Label Input"
    anchor="label-input"
    description="Label picker with suggestions and autocomplete for tagging content."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content input-demo label-input-demo">
          <div class="label-input-row">
            <ReferenceLabelInput
              :available-labels="availableLabels"
              :omit-labels="labelInputSelectedLabels"
              :highlight-labels="['interviews']"
              trigger-description="Add label"
              @input="handleLabelSelect"
            />
            <div class="selected-labels">
              <ReferenceBadge
                v-for="label in labelInputSelectedLabelsData"
                :key="label.title"
                :label="label.title"
                :icon="label.icon"
                squared
                @click="removeLabel(label.title)"
              />
            </div>
          </div>
          <div class="input-value">
            Selected: {{ labelInputSelectedLabels.length > 0 ? labelInputSelectedLabels.join(', ') : 'none' }}
          </div>
          <div class="input-note">Click + to add labels, click label to remove</div>
        </div>
        <div class="demo-label">Label Picker</div>
        <div class="demo-code">
          <code>&lt;UtensilLabelInput :available-labels="labels" @input="onSelect" /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilLabelInputDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { ReferenceBadge } from '@/theme/components/ReferenceBadge'
import { ReferenceLabelInput, type ReferenceLabel } from '@/theme/components/ReferenceLabelInput'
import UtensilLabelInputDoc from 'utensil-vue/components/label-input/UtensilLabelInputDoc.vue'

const availableLabels = [
  { title: 'colorspace test', icon: 'palette' },
  { title: 'demo', icon: 'play' },
  { title: 'interviews', icon: 'microphone' },
  { title: 'tutorial', icon: 'book' },
] satisfies ReferenceLabel[]

type AvailableLabelTitle = (typeof availableLabels)[number]['title']

const labelInputSelectedLabels = ref<AvailableLabelTitle[]>(['tutorial'])

const labelInputSelectedLabelsData = computed<ReferenceLabel[]>(() =>
  availableLabels.filter((label) => labelInputSelectedLabels.value.includes(label.title)),
)

function handleLabelSelect(label: AvailableLabelTitle) {
  if (!labelInputSelectedLabels.value.includes(label)) {
    labelInputSelectedLabels.value.push(label)
  }
}

function removeLabel(label: AvailableLabelTitle) {
  labelInputSelectedLabels.value = labelInputSelectedLabels.value.filter((candidate) => candidate !== label)
}
</script>

<style scoped>
.demo-content.input-demo {
  flex-direction: column;
  align-items: stretch;
}

.input-value {
  margin-top: var(--space-2);
  padding: var(--space-1) var(--space-2);
  background-color: var(--pencil-3);
  border-radius: var(--radius-2);
  font-size: 0.85rem;
  color: var(--pencil-11);
  text-align: center;
  font-family: ui-monospace, monospace;
}

.input-note {
  margin-top: var(--space-1);
  font-size: 0.8rem;
  color: var(--pencil-11);
  text-align: center;
  font-style: italic;
}

.label-input-demo {
  align-items: flex-start !important;
}

.label-input-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.selected-labels {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  cursor: pointer;
}
</style>
