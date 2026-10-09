<template>
  <ReferenceComponentDemo
    title="Select"
    anchor="select"
    description="A fully-featured select component with keyboard navigation, icons, disabled states, and style variations."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilSelect v-model="basicSelect" :options="fruitOptions" placeholder="Select a fruit..." />
          <div class="input-value">Value: "{{ basicSelect ?? 'null' }}"</div>
        </div>
        <div class="demo-label">Basic Select</div>
        <div class="demo-code">
          <code>&lt;UtensilSelect v-model="value" :options="options" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilSelect v-model="softSelect" :options="fruitOptions" variation="soft" placeholder="Soft variation" />
          <div class="input-value">Value: "{{ softSelect ?? 'null' }}"</div>
        </div>
        <div class="demo-label">Soft Variation</div>
        <div class="demo-code">
          <code>&lt;UtensilSelect variation="soft" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilSelect v-model="iconSelect" :options="iconOptions" placeholder="Select a file type..." />
          <div class="input-value">Value: "{{ iconSelect ?? 'null' }}"</div>
        </div>
        <div class="demo-label">With Icons</div>
        <div class="demo-code">
          <code>&lt;UtensilSelect :options="[{ value: 'img', label: 'Image', icon: 'image' }]" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilSelect :options="fruitOptions" placeholder="Disabled select" disabled />
          <div class="input-value">Disabled state</div>
        </div>
        <div class="demo-label">Disabled</div>
        <div class="demo-code">
          <code>&lt;UtensilSelect disabled /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilSelect
            v-model="disabledOptionsSelect"
            :options="disabledOptions"
            placeholder="Some options disabled"
          />
          <div class="input-value">Value: "{{ disabledOptionsSelect ?? 'null' }}"</div>
        </div>
        <div class="demo-label">Disabled Options</div>
        <div class="demo-code">
          <code>&lt;UtensilSelect :options="[{ value: 'x', label: 'X', disabled: true }]" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilSelect v-model="longListSelect" :options="longOptions" placeholder="Scrollable list..." />
          <div class="input-value">Value: "{{ longListSelect ?? 'null' }}"</div>
        </div>
        <div class="demo-label">Long List (Scrollable)</div>
        <div class="demo-code">
          <code>&lt;UtensilSelect :options="manyOptions" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilSelect v-model="folderSelect" :options="folderOptions" placeholder="Custom actions...">
            <template #append="{ close }">
              <div
                class="select-action"
                data-focusable
                tabindex="-1"
                @click="handleManageFolders(close)"
                @keydown.enter="handleManageFolders(close)"
                @keydown.space.prevent="handleManageFolders(close)"
              >
                <UtensilIcon icon="cog" class="action-icon" />
                <span>Manage folders...</span>
              </div>
            </template>
          </UtensilSelect>
          <div class="input-value">Value: "{{ folderSelect ?? 'null' }}"</div>
          <div v-if="manageFoldersClicked" class="input-note">✓ Manage folders clicked!</div>
        </div>
        <div class="demo-label">With Append Slot</div>
        <div class="demo-code">
          <code>&lt;UtensilSelect&gt;&lt;template #append&gt;...&lt;/template&gt;&lt;/UtensilSelect&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilSelectDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import UtensilSelect from '@gobistories/utensil-vue/components/select/UtensilSelect.vue'
import UtensilSelectDoc from '@gobistories/utensil-vue/components/select/UtensilSelectDoc.vue'
import UtensilIcon from '@gobistories/utensil-vue/components/icon/UtensilIcon.vue'
import type { SelectOption } from '@gobistories/utensil-vue/components/select/utensil-select'
import type { ReferenceThemeConfig } from '@/theme/reference-theme'

const basicSelect = ref<string | null>(null)
const softSelect = ref<string | null>(null)
const iconSelect = ref<string | null>(null)
const disabledOptionsSelect = ref<string | null>(null)
const longListSelect = ref<string | null>(null)

const fruitOptions: SelectOption<ReferenceThemeConfig>[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'dragon-fruit', label: 'Dragon Fruit' },
  { value: 'elderberry', label: 'Elderberry' },
]

const iconOptions: SelectOption<ReferenceThemeConfig>[] = [
  { value: 'image', label: 'Image', icon: 'image' },
  { value: 'video', label: 'Video', icon: 'video' },
  { value: 'music', label: 'Music', icon: 'music' },
  { value: 'file', label: 'File', icon: 'file' },
]

const disabledOptions: SelectOption<ReferenceThemeConfig>[] = [
  { value: 'available', label: 'Available' },
  { value: 'unavailable', label: 'Unavailable (disabled)', disabled: true },
  { value: 'another', label: 'Another Option' },
  { value: 'also-disabled', label: 'Also Disabled', disabled: true },
]

const longOptions: SelectOption<ReferenceThemeConfig>[] = Array.from({ length: 20 }, (_, i) => ({
  value: `option-${i + 1}`,
  label: `Option ${i + 1}`,
}))

// Append slot demo
const folderSelect = ref<string | null>(null)
const manageFoldersClicked = ref(false)
const folderOptions: SelectOption<ReferenceThemeConfig>[] = [
  { value: 'documents', label: 'Documents', icon: 'file' },
  { value: 'photos', label: 'Photos', icon: 'image' },
  { value: 'videos', label: 'Videos', icon: 'video' },
]

function handleManageFolders(close: () => void) {
  close()
  manageFoldersClicked.value = true
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

.input-demo .utensil-select {
  width: 100%;
}

/* Select action slot styles */
.select-action {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-top: 1px solid var(--pencil-6);
  font-size: var(--font-size-2);
  color: var(--pen-11);
  cursor: pointer;
  outline: none;
  transition: background-color 0.1s ease;
}

.select-action:hover,
.select-action[data-focused] {
  background-color: var(--pen-a3);
}

.select-action .action-icon {
  font-size: 0.9rem;
}
</style>
