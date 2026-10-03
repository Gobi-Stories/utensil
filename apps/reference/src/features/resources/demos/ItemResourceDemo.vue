<template>
  <div id="item-resource" class="component-demo">
    <h3><a class="demo-anchor" href="#item-resource">Item Resource</a></h3>
    <p>Load and display a single resource item with full CRUD operations.</p>
    <div class="demo-grid">
      <!-- Basic Item Loading -->
      <div class="demo-item">
        <div class="demo-content resource-demo">
          <div class="demo-container">
            <div class="demo-controls">
              <UtensilButton
                size="small"
                variation="outline"
                @click="basicItem.refresh()"
                :disabled="!basicItem.loaded.value"
              >
                Refresh
              </UtensilButton>
            </div>

            <UtensilResourceLoader
              :load="basicItem.refresh"
              :loaded="basicItem.loaded.value"
              :syncing="basicItem.syncing.value"
              :has-error="basicItem.hasError.value"
              :error="basicItem.error.value"
              :may-retry="basicItem.mayRetry.value"
              :show-spinner="true"
              :show-errors="true"
              :loader-delay="300"
              :fade-content="true"
              :lift-ui="false"
            >
              <div v-if="basicItem.loaded.value" class="demo-loaded-content">
                <h4>{{ basicItem.resource.value?.title }}</h4>
                <p>{{ basicItem.resource.value?.description }}</p>
                <div class="item-meta">
                  <span class="meta-label">ID:</span>
                  <span class="meta-value">{{ basicItem.resource.value?.id }}</span>
                </div>
                <div class="item-meta">
                  <span class="meta-label">Category:</span>
                  <span class="meta-value">{{ basicItem.resource.value?.category }}</span>
                </div>
              </div>
            </UtensilResourceLoader>
          </div>
        </div>
        <div class="demo-label">Basic Item Loading</div>
        <div class="demo-code">
          <code>const item = useItem(api, { path: '/items' })</code>
        </div>
      </div>

      <!-- Editable Item -->
      <div class="demo-item">
        <div class="demo-content resource-demo">
          <div class="demo-container">
            <div class="demo-controls">
              <UtensilButton
                size="small"
                variation="outline"
                @click="editItemTitle"
                :disabled="!editableItem.loaded.value || editableItem.syncing.value"
              >
                Edit Title
              </UtensilButton>
            </div>

            <UtensilResourceLoader
              :load="editableItem.refresh"
              :loaded="editableItem.loaded.value"
              :syncing="editableItem.syncing.value"
              :has-error="editableItem.hasError.value"
              :error="editableItem.error.value"
              :may-retry="editableItem.mayRetry.value"
              :show-spinner="true"
              :show-errors="true"
              :loader-delay="300"
              :fade-content="true"
              :lift-ui="false"
            >
              <div v-if="editableItem.loaded.value" class="demo-loaded-content">
                <h4>{{ editableItem.resource.value?.title }}</h4>
                <p>{{ editableItem.resource.value?.description }}</p>
                <div class="item-meta">
                  <span class="meta-label">Status:</span>
                  <span class="meta-value">{{ editableItem.resource.value?.status }}</span>
                </div>
                <div v-if="editableItem.ioState.value === 'saving'" class="saving-indicator">💾 Saving changes...</div>
                <div v-if="editableItem.ioState.value === 'saved'" class="saved-indicator">✅ Changes saved!</div>
              </div>
            </UtensilResourceLoader>
          </div>
        </div>
        <div class="demo-label">Editable Item (click Edit Title to modify)</div>
        <div class="demo-code">
          <code>await item.patch(id, { title: 'New Title' })</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilResourceLoader from 'utensil-vue/components/resource/UtensilResourceLoader.vue'
import UtensilButton from 'utensil-vue/components/button/UtensilButton.vue'

interface DemoItem {
  id: string
  title: string
  description: string
  category: string
  status: 'active' | 'inactive' | 'planning'
}

const mockItems: DemoItem[] = [
  {
    id: '1',
    title: 'Project Alpha',
    description: 'A comprehensive project management solution',
    category: 'Software',
    status: 'active',
  },
  {
    id: '2',
    title: 'Design System',
    description: 'Unified component library for consistent UI',
    category: 'Design',
    status: 'active',
  },
  {
    id: '3',
    title: 'Marketing Campaign',
    description: 'Q4 product launch campaign',
    category: 'Marketing',
    status: 'planning',
  },
]

// Simulated item resource state

const basicItem = (() => {
  const resource = ref<DemoItem | null>(null)
  const loaded = ref(false)
  const syncing = ref(false)
  const hasError = ref(false)
  const error = ref<Error | null>(null)
  const mayRetry = ref(true)

  function refresh() {
    syncing.value = true
    hasError.value = false
    error.value = null
    setTimeout(() => {
      resource.value = { ...mockItems[0] }
      loaded.value = true
      syncing.value = false
    }, 1000)
  }

  refresh()

  return { resource, loaded, syncing, hasError, error, mayRetry, refresh }
})()

const editableItem = (() => {
  const resource = ref<DemoItem | null>(null)
  const loaded = ref(false)
  const syncing = ref(false)
  const hasError = ref(false)
  const error = ref<Error | null>(null)
  const mayRetry = ref(true)
  const ioState = ref<'idle' | 'saving' | 'saved'>('idle')

  function refresh() {
    syncing.value = true
    hasError.value = false
    error.value = null
    setTimeout(() => {
      resource.value = { ...mockItems[1] }
      loaded.value = true
      syncing.value = false
    }, 1000)
  }

  async function patch(_id: string, changes: Partial<DemoItem>) {
    ioState.value = 'saving'
    syncing.value = true
    await new Promise((resolve) => setTimeout(resolve, 800))
    if (resource.value) {
      resource.value = { ...resource.value, ...changes }
    }
    syncing.value = false
    ioState.value = 'saved'
    setTimeout(() => {
      ioState.value = 'idle'
    }, 2000)
  }

  refresh()

  return { resource, loaded, syncing, hasError, error, mayRetry, ioState, refresh, patch }
})()

const editItemTitle = async () => {
  if (editableItem.resource.value) {
    const newTitle = `${editableItem.resource.value.title} (Updated)`
    await editableItem.patch(editableItem.resource.value.id, { title: newTitle })
  }
}
</script>

<style scoped>
.demo-content {
  min-height: 280px;
}

.demo-content.resource-demo {
  padding: 0;
}

.demo-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  height: 360px;
  min-height: 100%;
  padding: var(--space-2);
  overflow: hidden;
}

.demo-controls {
  display: flex;
  justify-content: center;
  gap: var(--space-1);
  flex-wrap: wrap;
  margin-bottom: var(--space-2);
}

.demo-loaded-content {
  padding: var(--space-5);
  height: 100%;
  overflow-y: auto;
}

.demo-loaded-content h4 {
  margin: 0 0 var(--space-3) 0;
  color: var(--pencil-12);
  font-size: var(--font-size-4);
}

.item-meta {
  margin: var(--space-1) 0;
  font-size: var(--font-size-2);
}

.meta-label {
  color: var(--pencil-11);
  font-weight: 500;
}

.meta-value {
  color: var(--pencil-12);
  margin-left: var(--space-1);
}

.saving-indicator {
  margin-top: var(--space-2);
  color: var(--pen-11);
  font-size: var(--font-size-2);
  font-weight: 500;
}

.saved-indicator {
  margin-top: var(--space-2);
  color: var(--pen-11);
  font-size: var(--font-size-2);
  font-weight: 500;
}

@media (max-width: 768px) {
  .demo-container {
    height: 260px;
  }

  .demo-controls {
    position: static;
    margin-bottom: var(--space-2);
    justify-content: center;
  }
}
</style>
