<template>
  <div id="collection-resource" class="component-demo">
    <h3><a class="demo-anchor" href="#collection-resource">Collection Resource</a></h3>
    <p>Load and display collections of resources with filtering and search capabilities.</p>
    <div class="demo-grid">
      <!-- Basic Collection -->
      <div class="demo-item">
        <div class="demo-content resource-demo">
          <div class="demo-container">
            <div class="demo-controls">
              <UtensilButton
                size="small"
                variation="outline"
                @click="basicCollection.refresh()"
                :disabled="!basicCollection.loaded.value"
              >
                Refresh
              </UtensilButton>
            </div>

            <UtensilResourceLoader
              :load="basicCollection.refresh"
              :loaded="basicCollection.loaded.value"
              :syncing="basicCollection.syncing.value"
              :has-error="basicCollection.hasError.value"
              :error="basicCollection.error.value"
              :may-retry="basicCollection.mayRetry.value"
              :show-spinner="true"
              :show-errors="true"
              :loader-delay="300"
              :fade-content="true"
              :lift-ui="false"
            >
              <div v-if="basicCollection.loaded.value" class="demo-loaded-content">
                <h4>Project Collection ({{ basicCollection.count.value }} items)</h4>
                <div class="collection-list">
                  <div
                    v-for="item in basicCollection.items.value"
                    :key="item.id"
                    class="collection-item"
                    :class="{ active: item.status === 'active' }"
                  >
                    <div class="item-title">{{ item.name }}</div>
                    <div class="item-status">{{ item.status }}</div>
                  </div>
                </div>
              </div>
            </UtensilResourceLoader>
          </div>
        </div>
        <div class="demo-label">Basic Collection Loading</div>
        <div class="demo-code">
          <code>const collection = useCollection(api, { path: '/projects' })</code>
        </div>
      </div>

      <!-- Searchable Collection -->
      <div class="demo-item">
        <div class="demo-content resource-demo">
          <div class="demo-container">
            <div class="demo-controls">
              <UtensilInput v-model="searchQuery.term" placeholder="Search assets..." class="search-input" />
            </div>

            <div class="search-results">
              <UtensilResourceLoader
                :load="searchableCollection.refresh"
                :loaded="searchableCollection.loaded.value"
                :syncing="searchableCollection.syncing.value"
                :has-error="searchableCollection.hasError.value"
                :error="searchableCollection.error.value"
                :may-retry="searchableCollection.mayRetry.value"
                :show-spinner="true"
                :show-errors="true"
                :fade-content="true"
                :lift-ui="false"
              >
                <div v-if="searchableCollection.loaded.value" class="demo-loaded-content">
                  <h4>Assets ({{ searchableCollection.count.value }} items)</h4>
                  <div class="collection-grid">
                    <div v-for="asset in searchableCollection.items.value" :key="asset.id" class="asset-item">
                      <div class="asset-type">{{ asset.type }}</div>
                      <div class="asset-name">{{ asset.name }}</div>
                      <div class="asset-size">{{ asset.size }}</div>
                    </div>
                  </div>
                </div>
              </UtensilResourceLoader>
            </div>
          </div>
        </div>
        <div class="demo-label">Searchable Collection (try searching)</div>
        <div class="demo-code">
          <code>collection.load({ query: { term: searchTerm } })</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import UtensilResourceLoader from '@gobistories/utensil-vue/components/resource/UtensilResourceLoader.vue'
import UtensilInput from '@gobistories/utensil-vue/components/input/UtensilInput.vue'
import UtensilButton from '@gobistories/utensil-vue/components/button/UtensilButton.vue'

interface ProjectItem {
  id: string
  name: string
  status: 'active' | 'planning' | 'completed'
}

interface AssetItem {
  id: string
  name: string
  type: 'video' | 'image' | 'document'
  size: string
}

const mockProjects: ProjectItem[] = [
  { id: '1', name: 'Website Redesign', status: 'active' },
  { id: '2', name: 'Mobile App', status: 'planning' },
  { id: '3', name: 'API Integration', status: 'active' },
  { id: '4', name: 'User Research', status: 'completed' },
  { id: '5', name: 'Performance Optimization', status: 'active' },
]

const mockAssets: AssetItem[] = [
  { id: '1', name: 'hero-video.mp4', type: 'video', size: '2.3 MB' },
  { id: '2', name: 'logo.png', type: 'image', size: '45 KB' },
  { id: '3', name: 'presentation.pdf', type: 'document', size: '1.2 MB' },
  { id: '4', name: 'demo-video.mp4', type: 'video', size: '5.1 MB' },
  { id: '5', name: 'screenshot.png', type: 'image', size: '234 KB' },
  { id: '6', name: 'user-manual.pdf', type: 'document', size: '890 KB' },
]

// Simulated collection resource state

const basicCollection = (() => {
  const items = ref<ProjectItem[]>([])
  const loaded = ref(false)
  const syncing = ref(false)
  const hasError = ref(false)
  const error = ref<Error | null>(null)
  const mayRetry = ref(true)
  const count = computed(() => items.value.length)

  function refresh() {
    syncing.value = true
    hasError.value = false
    error.value = null
    setTimeout(() => {
      items.value = [...mockProjects]
      loaded.value = true
      syncing.value = false
    }, 800)
  }

  refresh()

  return { items, loaded, syncing, hasError, error, mayRetry, count, refresh }
})()

const searchQuery = ref({ term: '' })

const searchableCollection = (() => {
  const items = ref<AssetItem[]>([])
  const loaded = ref(false)
  const syncing = ref(false)
  const hasError = ref(false)
  const error = ref<Error | null>(null)
  const mayRetry = ref(true)
  const count = computed(() => items.value.length)

  function refresh() {
    syncing.value = true
    hasError.value = false
    error.value = null
    setTimeout(() => {
      const term = searchQuery.value.term.toLowerCase()
      items.value = term
        ? mockAssets.filter((a) => a.name.toLowerCase().includes(term) || a.type.toLowerCase().includes(term))
        : [...mockAssets]
      loaded.value = true
      syncing.value = false
    }, 600)
  }

  refresh()

  return { items, loaded, syncing, hasError, error, mayRetry, count, refresh }
})()

watch(searchQuery, () => searchableCollection.refresh(), { deep: true })
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

.search-input {
  width: 120px;
  height: 28px;
  font-size: var(--font-size-2);
}

.search-results {
  position: relative;
  width: 100%;
  height: 100%;
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

.collection-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.collection-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2);
  border: 1px solid var(--pencil-6);
  border-radius: var(--radius-2);
  background-color: var(--pencil-1);
}

.collection-item.active {
  border-color: var(--pen-8);
  background-color: var(--pen-a3);
}

.item-title {
  font-weight: 500;
  color: var(--pencil-12);
  font-size: var(--font-size-2);
}

.item-status {
  font-size: var(--font-size-1);
  color: var(--pencil-11);
  text-transform: uppercase;
  font-weight: 500;
  font-style: italic;
  margin-left: var(--space-2);
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--space-2);
}

.asset-item {
  padding: var(--space-2);
  border: 1px solid var(--pencil-6);
  border-radius: var(--radius-2);
  background-color: var(--pencil-1);
  text-align: center;
}

.asset-type {
  font-size: var(--font-size-1);
  color: var(--pencil-11);
  text-transform: uppercase;
  font-weight: 500;
  margin-bottom: var(--space-1);
}

.asset-name {
  font-size: var(--font-size-2);
  color: var(--pencil-12);
  margin-bottom: var(--space-1);
  word-break: break-word;
}

.asset-size {
  font-size: var(--font-size-1);
  color: var(--pencil-11);
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

  .search-input {
    width: 100px;
  }
}
</style>
