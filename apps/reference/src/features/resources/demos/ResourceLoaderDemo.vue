<template>
  <ReferenceComponentDemo
    title="Resource Loader"
    anchor="resource-loader"
    description="Provides default behavior for handling loading states and errors with spinners and error messages."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content resource-demo">
          <div class="demo-container">
            <UtensilResourceLoader
              :load="loaderBasicState.load"
              :loaded="loaderBasicState.loaded"
              :syncing="loaderBasicState.syncing"
              :has-error="loaderBasicState.hasError"
              :may-retry="loaderBasicState.mayRetry"
              :show-spinner="true"
              :show-errors="true"
              :loader-delay="300"
              :fade-content="true"
              :lift-ui="false"
            >
              <div class="loader-demo-content">
                <h4>{{ loaderBasicState.resource.title }}</h4>
                <p>{{ loaderBasicState.resource.description }}</p>
                <small>ID: {{ loaderBasicState.resource.id }}</small>
              </div>
            </UtensilResourceLoader>
            <UtensilButton class="loader-trigger" scale="small" @click="loaderBasicState.load?.()"
              >Load Basic</UtensilButton
            >
          </div>
        </div>
        <div class="demo-label">Basic Item Loading</div>
      </div>

      <div class="demo-item">
        <div class="demo-content resource-demo">
          <div class="demo-container">
            <UtensilResourceLoader
              :load="loaderDelayedState.load"
              :loaded="loaderDelayedState.loaded"
              :syncing="loaderDelayedState.syncing"
              :has-error="loaderDelayedState.hasError"
              :may-retry="loaderDelayedState.mayRetry"
              :show-spinner="true"
              :show-errors="true"
              :loader-delay="800"
              spinner-scale="large"
              :fade-content="true"
              :lift-ui="false"
            >
              <div class="loader-demo-content">
                <h4>Collection Loaded ({{ loaderDelayedState.resource.length }} items)</h4>
                <ul class="resource-list">
                  <li v-for="item in loaderDelayedState.resource" :key="item.id">
                    {{ item.name }}
                  </li>
                </ul>
              </div>
            </UtensilResourceLoader>
            <UtensilButton class="loader-trigger" scale="small" @click="loaderDelayedState.load?.()"
              >Load Collection</UtensilButton
            >
          </div>
        </div>
        <div class="demo-label">Collection Loading (3s delay)</div>
      </div>

      <div class="demo-item">
        <div class="demo-content resource-demo">
          <div class="demo-container">
            <UtensilResourceLoader
              :load="loaderErrorState.load"
              :loaded="loaderErrorState.loaded"
              :syncing="loaderErrorState.syncing"
              :has-error="loaderErrorState.hasError"
              :may-retry="loaderErrorState.mayRetry"
              :show-spinner="true"
              :show-errors="true"
              :loader-delay="300"
              :fade-content="true"
              :lift-ui="false"
            >
              <div class="loader-demo-content">
                <h4>{{ loaderErrorState.resource.title }}</h4>
                <p>{{ loaderErrorState.resource.description }}</p>
                <div class="success-message">Successfully loaded after retry!</div>
              </div>
            </UtensilResourceLoader>
            <UtensilButton class="loader-trigger" scale="small" @click="loaderErrorState.load"
              >Load with Error</UtensilButton
            >
          </div>
        </div>
        <div class="demo-label">Error Handling (succeeds after 2 retries)</div>
      </div>
    </div>

    <template #api>
      <UtensilResourceLoaderDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import UtensilResourceLoader from '@gobistories/utensil-vue/components/resource/UtensilResourceLoader.vue'
import UtensilResourceLoaderDoc from '@gobistories/utensil-vue/components/resource/UtensilResourceLoaderDoc.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import UtensilButton from '@gobistories/utensil-vue/components/button/UtensilButton.vue'

type LoaderDemoResource<T> = {
  resource: T
  load?: () => void
  loaded?: boolean
  syncing?: boolean
  hasError?: boolean
  mayRetry?: boolean
  retryAttempts?: number
}

type LoaderBasicItem = { id: string; title: string; description: string }
type LoaderCollectionItem = { id: string; name: string }

const loaderBasicState = reactive<LoaderDemoResource<LoaderBasicItem>>({
  resource: { id: '', title: '', description: '' },
  loaded: false,
  syncing: false,
  hasError: false,
  mayRetry: true,
  load: () => loadLoaderBasic(),
})

const loaderDelayedState = reactive<LoaderDemoResource<LoaderCollectionItem[]>>({
  resource: [],
  loaded: false,
  syncing: false,
  hasError: false,
  mayRetry: true,
  load: () => loadLoaderCollection(),
})

const loaderErrorState = reactive<LoaderDemoResource<LoaderBasicItem>>({
  resource: { id: '', title: '', description: '' },
  loaded: false,
  syncing: false,
  hasError: false,
  mayRetry: true,
  retryAttempts: 0,
  load: () => loadLoaderWithError(),
})

function resetLoaderState<T>(state: LoaderDemoResource<T>) {
  state.loaded = false
  state.syncing = false
  state.hasError = false
  if ('retryAttempts' in state) state.retryAttempts = 0
}

function loadLoaderBasic() {
  resetLoaderState(loaderBasicState)
  loaderBasicState.syncing = true
  setTimeout(() => {
    loaderBasicState.resource = {
      id: 'item-001',
      title: 'Demo Resource Item',
      description: 'This is a successfully loaded resource item with all the expected data.',
    }
    loaderBasicState.loaded = true
    loaderBasicState.syncing = false
  }, 1500)
}

function loadLoaderCollection() {
  resetLoaderState(loaderDelayedState)
  loaderDelayedState.syncing = true
  setTimeout(() => {
    loaderDelayedState.resource = [
      { id: '1', name: 'Project Alpha' },
      { id: '2', name: 'Marketing Campaign' },
      { id: '3', name: 'User Research Study' },
      { id: '4', name: 'Design System Updates' },
      { id: '5', name: 'Performance Optimization' },
    ]
    loaderDelayedState.loaded = true
    loaderDelayedState.syncing = false
  }, 3000)
}

function loadLoaderWithError() {
  if (!loaderErrorState.retryAttempts) resetLoaderState(loaderErrorState)
  loaderErrorState.syncing = true
  loaderErrorState.hasError = false
  setTimeout(() => {
    if ((loaderErrorState.retryAttempts || 0) >= 2) {
      loaderErrorState.resource = {
        id: 'recovery-001',
        title: 'Recovered Resource',
        description: 'This resource failed to load initially but was successfully recovered after retrying.',
      }
      loaderErrorState.loaded = true
      loaderErrorState.syncing = false
      loaderErrorState.retryAttempts = 0
    } else {
      loaderErrorState.retryAttempts = (loaderErrorState.retryAttempts || 0) + 1
      loaderErrorState.hasError = true
      loaderErrorState.syncing = false
    }
  }, 1500)
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

.loader-demo-content {
  padding: var(--space-5);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.loader-demo-content h4 {
  margin: 0 0 var(--space-2) 0;
  color: var(--pencil-12);
  font-size: var(--font-size-4);
}

.loader-demo-content p {
  margin: 0 0 var(--space-1) 0;
  color: var(--pencil-11);
  font-size: var(--font-size-3);
}

.loader-demo-content small {
  color: var(--pencil-11);
  font-size: var(--font-size-2);
}

.loader-trigger {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
}

.resource-list {
  margin: 0;
  padding: 0;
  list-style: none;
  text-align: left;
  max-width: 200px;
}

.resource-list li {
  padding: var(--space-1) 0;
  color: var(--pencil-11);
  font-size: var(--font-size-2);
}

.success-message {
  margin-top: var(--space-2);
  color: var(--pen-11);
  font-weight: 500;
  font-size: var(--font-size-2);
}

@media (max-width: 768px) {
  .demo-container {
    height: 260px;
  }
}
</style>
