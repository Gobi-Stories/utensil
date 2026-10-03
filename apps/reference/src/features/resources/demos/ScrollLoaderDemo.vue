<template>
  <ReferenceComponentDemo
    title="Scroll Loader"
    anchor="scroll-loader"
    description="Automatically loads more content when scrolling near the bottom, with built-in loading and error states."
  >
    <div class="demo-grid">
      <!-- Basic Scroll Loading -->
      <div class="demo-item">
        <div class="demo-content scroll-demo">
          <div class="demo-container">
            <div class="demo-controls">
              <UtensilButton size="small" @click="resetBasicScroll">Reset & Load</UtensilButton>
              <UtensilButton size="small" variation="outline" @click="toggleScrollDisabled">
                {{ basicScrollDisabled ? 'Enable' : 'Disable' }}
              </UtensilButton>
            </div>

            <UtensilScrollLoader
              v-if="basicScrollItems.length"
              class="scroll-loader-demo"
              :items="basicScrollItems"
              :load="loadMoreBasicItems"
              :done="basicScrollDone"
              :has-error="basicScrollError"
              :may-retry="true"
              :loading="basicScrollLoading"
              :disabled="basicScrollDisabled"
              :buffer-length="3"
            >
              <template #default>
                <div v-for="(item, index) in basicScrollItems" :key="item.id" class="scroll-item">
                  <ReferenceAvatar
                    :color="referenceVariants[index % referenceVariants.length]"
                    :fallback="item.name.charAt(0)"
                  />
                  <div class="item-content">
                    <div class="item-name">{{ item.name }}</div>
                    <div class="item-role">{{ item.role }}</div>
                  </div>
                </div>
              </template>
              <template #loading>
                <div class="custom-loading">
                  <UtensilSpinner scale="small" />
                  <span>Loading more items...</span>
                </div>
              </template>
              <template #empty>
                <div class="empty-state">
                  <span>No items to display</span>
                </div>
              </template>
              <template #footer>
                <div class="scroll-footer">All {{ basicScrollItems.length }} items loaded</div>
              </template>
            </UtensilScrollLoader>
          </div>
        </div>
        <div class="demo-label">Basic Scroll Loading ({{ basicScrollItems.length }} items)</div>
        <div class="demo-code">
          <code>&lt;UtensilScrollLoader :items="items" :load="loadMore" :done="done" /&gt;</code>
        </div>
      </div>

      <!-- Horizontal Scroll Loading -->
      <div class="demo-item">
        <div class="demo-content scroll-demo">
          <div class="demo-container">
            <div class="demo-controls">
              <UtensilButton size="small" @click="resetHorizontalScroll">Reset & Load</UtensilButton>
              <span class="demo-status">{{ horizontalScrollItems.length }} / 20 items</span>
            </div>

            <UtensilScrollLoader
              v-if="horizontalScrollItems.length"
              class="horizontal-scroll-demo"
              scroll-container="div"
              :container-props="{ class: 'horizontal-scroller' }"
              :items="horizontalScrollItems"
              :load="loadMoreHorizontalItems"
              :done="horizontalScrollDone"
              :has-error="horizontalScrollError"
              :may-retry="true"
              :loading="horizontalScrollLoading"
              :horizontal="true"
              :buffer-length="2"
            >
              <template #default>
                <div v-for="item in horizontalScrollItems" :key="item.id" class="horizontal-item">
                  <ReferenceAvatar
                    class="product-avatar"
                    color="pencil"
                    radius="medium"
                    scale="giant"
                    :fallback="item.category.charAt(0)"
                    squared
                  />
                  <div class="item-title">{{ item.name }}</div>
                  <div class="item-price">${{ item.price }}</div>
                </div>
              </template>
              <template #loading>
                <div class="horizontal-loading">
                  <UtensilSpinner scale="small" />
                </div>
              </template>
              <template #footer>
                <div class="horizontal-footer">End of products</div>
              </template>
            </UtensilScrollLoader>
          </div>
        </div>
        <div class="demo-label">Horizontal Scroll Loading</div>
        <div class="demo-code">
          <code>&lt;UtensilScrollLoader :horizontal="true" scroll-container="div" /&gt;</code>
        </div>
      </div>

      <!-- Error Handling Demo -->
      <div class="demo-item">
        <div class="demo-content scroll-demo">
          <div class="demo-container">
            <div class="demo-controls">
              <UtensilButton size="small" @click="resetErrorScroll">Reset & Load</UtensilButton>
              <UtensilButton size="small" variation="outline" @click="toggleErrorMode">
                {{ errorModeEnabled ? 'Disable Errors' : 'Enable Errors' }}
              </UtensilButton>
            </div>

            <UtensilScrollLoader
              v-if="errorScrollItems.length"
              class="scroll-loader-demo"
              :items="errorScrollItems"
              :load="loadMoreErrorItems"
              :done="errorScrollDone"
              :has-error="errorScrollError"
              :may-retry="true"
              :loading="errorScrollLoading"
              :buffer-length="3"
            >
              <template #default>
                <div v-for="item in errorScrollItems" :key="item.id" class="scroll-item">
                  <ReferenceAvatar
                    :color="statusColors[item.status]"
                    :fallback="item.name.charAt(0)"
                    size="large"
                    variation="solid"
                  />
                  <div class="item-content">
                    <div class="item-name">{{ item.name }}</div>
                    <div class="item-description">{{ item.description }}</div>
                    <div class="item-status">Status: {{ item.status }}</div>
                  </div>
                </div>
              </template>
              <template #error="{ retry }">
                <div class="custom-error">
                  <div class="error-icon">⚠️</div>
                  <div class="error-message">Failed to load more items</div>
                  <UtensilButton @click="retry" size="small">Try Again</UtensilButton>
                </div>
              </template>
              <template #empty>
                <div class="empty-state">
                  <span>No tasks found</span>
                </div>
              </template>
            </UtensilScrollLoader>
          </div>
        </div>
        <div class="demo-label">Error Handling</div>
        <div class="demo-code">
          <code>&lt;UtensilScrollLoader :has-error="hasError" :may-retry="true" /&gt;</code>
        </div>
      </div>

      <!-- Custom Container Demo -->
      <div class="demo-item">
        <div class="demo-content scroll-demo">
          <div class="demo-container">
            <div class="demo-controls">
              <UtensilButton size="small" @click="resetCustomScroll">Reset & Load</UtensilButton>
              <span class="demo-status">{{ customScrollItems.length }} items</span>
            </div>

            <div class="custom-scroll-wrapper">
              <div class="custom-header">
                <h4>News Feed</h4>
                <span class="feed-count">{{ customScrollItems.length }} articles</span>
              </div>

              <UtensilScrollLoader
                v-if="customScrollItems.length"
                class="custom-scroll-loader"
                scroll-container="section"
                :container-props="{ class: 'news-feed', role: 'feed' }"
                :items="customScrollItems"
                :load="loadMoreCustomItems"
                :done="customScrollDone"
                :has-error="customScrollError"
                :may-retry="true"
                :loading="customScrollLoading"
                :buffer-length="2"
              >
                <template #prepend>
                  <div class="feed-header">Latest news and updates</div>
                </template>
                <template #default>
                  <article v-for="item in customScrollItems" :key="item.id" class="news-item">
                    <div class="news-meta">
                      <span class="news-date">{{ formatDate(item.date) }}</span>
                      <UtensilBadge squared>{{ item.category }}</UtensilBadge>
                    </div>
                    <h5 class="news-title">{{ item.title }}</h5>
                    <p class="news-excerpt">{{ item.excerpt }}</p>
                  </article>
                </template>
                <template #loading>
                  <div class="news-loading">
                    <UtensilSpinner />
                    <span>Loading more articles...</span>
                  </div>
                </template>
                <template #footer>
                  <div class="news-footer">You're all caught up!</div>
                </template>
              </UtensilScrollLoader>
            </div>
          </div>
        </div>
        <div class="demo-label">Custom Container & Semantic HTML</div>
        <div class="demo-code">
          <code>&lt;UtensilScrollLoader scroll-container="section" :container-props="props" /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilScrollLoaderDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import UtensilScrollLoader from 'utensil-vue/components/scroll-loader/UtensilScrollLoader.vue'
import UtensilScrollLoaderDoc from 'utensil-vue/components/scroll-loader/UtensilScrollLoaderDoc.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import UtensilSpinner from 'utensil-vue/components/spinner/UtensilSpinner.vue'
import UtensilButton from 'utensil-vue/components/button/UtensilButton.vue'
import UtensilBadge from 'utensil-vue/components/badge/UtensilBadge.vue'
import { referenceVariants, type ReferenceColorProp } from '@/theme/reference-theme'
import { ReferenceAvatar } from '@/theme/components/ReferenceAvatar'

// Mock data types
interface ScrollItem {
  id: string
  name: string
  role: string
}

interface HorizontalItem {
  id: string
  name: string
  category: string
  price: number
}

interface ErrorItem {
  id: string
  name: string
  description: string
  status: 'active' | 'pending' | 'completed'
}

interface NewsItem {
  id: string
  title: string
  excerpt: string
  category: string
  date: Date
}

// Basic scroll demo state
const statusColors: Record<string, ReferenceColorProp> = {
  active: 'success',
  pending: 'warning',
  completed: 'pencil',
}

const basicScrollItems = ref<ScrollItem[]>([])
const basicScrollLoading = ref(false)
const basicScrollError = ref(false)
const basicScrollDisabled = ref(false)
const basicScrollDone = computed(() => basicScrollItems.value.length >= 15)

// Horizontal scroll demo state
const horizontalScrollItems = ref<HorizontalItem[]>([])
const horizontalScrollLoading = ref(false)
const horizontalScrollError = ref(false)
const horizontalScrollDone = computed(() => horizontalScrollItems.value.length >= 20)

// Error demo state
const errorScrollItems = ref<ErrorItem[]>([])
const errorScrollLoading = ref(false)
const errorScrollError = ref(false)
const errorModeEnabled = ref(false)
const errorLoadAttempts = ref(0)
const errorScrollDone = computed(() => errorScrollItems.value.length >= 12)

// Custom container demo state
const customScrollItems = ref<NewsItem[]>([])
const customScrollLoading = ref(false)
const customScrollError = ref(false)
const customScrollDone = computed(() => customScrollItems.value.length >= 10)

// Load functions
const loadMoreBasicItems = () => {
  if (basicScrollDone.value) return

  basicScrollLoading.value = true
  basicScrollError.value = false

  const startId = basicScrollItems.value.length + 1
  const roles = ['Developer', 'Designer', 'Manager', 'Analyst', 'Engineer']

  const newItems: ScrollItem[] = Array.from({ length: 3 }, (_, i) => ({
    id: `basic-${startId + i}`,
    name: `User ${startId + i}`,
    role: roles[(startId + i - 1) % roles.length],
  }))

  basicScrollItems.value.push(...newItems)
  basicScrollLoading.value = false
}

const loadMoreHorizontalItems = () => {
  if (horizontalScrollDone.value) return

  horizontalScrollLoading.value = true
  horizontalScrollError.value = false

  const startId = horizontalScrollItems.value.length + 1
  const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports']

  const newItems: HorizontalItem[] = Array.from({ length: 4 }, (_, i) => ({
    id: `horizontal-${startId + i}`,
    name: `Product ${startId + i}`,
    category: categories[(startId + i - 1) % categories.length],
    price: Math.floor(Math.random() * 200) + 10,
  }))

  horizontalScrollItems.value.push(...newItems)
  horizontalScrollLoading.value = false
}

const loadMoreErrorItems = () => {
  if (errorScrollDone.value) return

  errorScrollLoading.value = true
  errorScrollError.value = false

  // Simulate errors when error mode is enabled
  if (errorModeEnabled.value && errorLoadAttempts.value < 2) {
    errorLoadAttempts.value++
    errorScrollError.value = true
    errorScrollLoading.value = false
    return
  }

  errorLoadAttempts.value = 0
  const startId = errorScrollItems.value.length + 1
  const statuses: ('active' | 'pending' | 'completed')[] = ['active', 'pending', 'completed']

  const newItems: ErrorItem[] = Array.from({ length: 3 }, (_, i) => ({
    id: `error-${startId + i}`,
    name: `Task ${startId + i}`,
    description: `Description for task ${startId + i}`,
    status: statuses[(startId + i - 1) % statuses.length],
  }))

  errorScrollItems.value.push(...newItems)
  errorScrollLoading.value = false
}

const loadMoreCustomItems = () => {
  if (customScrollDone.value) return

  customScrollLoading.value = true
  customScrollError.value = false

  const startId = customScrollItems.value.length + 1
  const categories = ['Technology', 'Business', 'Science', 'Sports', 'Entertainment']

  const newItems: NewsItem[] = Array.from({ length: 2 }, (_, i) => ({
    id: `news-${startId + i}`,
    title: `Breaking News Story ${startId + i}`,
    excerpt: `This is an excerpt for news story ${startId + i}. It provides a brief summary of the article content.`,
    category: categories[(startId + i - 1) % categories.length],
    date: new Date(Date.now() - (startId + i) * 24 * 60 * 60 * 1000),
  }))

  customScrollItems.value.push(...newItems)
  customScrollLoading.value = false
}

// Reset functions
const resetBasicScroll = () => {
  basicScrollItems.value = []
  basicScrollError.value = false
  loadMoreBasicItems()
}

const resetHorizontalScroll = () => {
  horizontalScrollItems.value = []
  horizontalScrollError.value = false
  loadMoreHorizontalItems()
}

const resetErrorScroll = () => {
  errorScrollItems.value = []
  errorScrollError.value = false
  errorLoadAttempts.value = 0
  loadMoreErrorItems()
}

const resetCustomScroll = () => {
  customScrollItems.value = []
  customScrollError.value = false
  loadMoreCustomItems()
}

// Toggle functions
const toggleScrollDisabled = () => {
  basicScrollDisabled.value = !basicScrollDisabled.value
}

const toggleErrorMode = () => {
  errorModeEnabled.value = !errorModeEnabled.value
  errorLoadAttempts.value = 0
}

// Utility functions
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Initialize with some items
resetBasicScroll()
resetHorizontalScroll()
resetErrorScroll()
resetCustomScroll()
</script>

<style scoped>
.demo-content {
  min-height: 400px;
}

.demo-content.scroll-demo {
  padding: 0;
}

.demo-container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 400px;
  min-height: 100%;
  overflow: hidden;
}

.demo-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2);
  background-color: var(--pencil-2);
  border-bottom: 1px solid var(--pencil-6);
  flex-wrap: wrap;
}

.demo-status {
  font-size: var(--font-size-2);
  color: var(--pencil-11);
}

.scroll-loader-demo {
  height: 100%;
  overflow-y: scroll;
  padding: var(--space-3);
}

.scroll-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  margin-bottom: var(--space-2);
  border: 1px solid var(--pencil-6);
  border-radius: var(--radius-4);
  background-color: var(--pencil-1);
  transition: transform 0.15s ease;
}

.scroll-item:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-2);
}

.item-content {
  flex: 1;
}

.item-name {
  font-weight: 600;
  color: var(--pencil-12);
  margin-bottom: var(--space-1);
}

.item-role,
.item-description {
  color: var(--pencil-11);
  font-size: var(--font-size-2);
  margin-bottom: var(--space-1);
}

.item-id,
.item-status {
  color: var(--pencil-10);
  font-size: var(--font-size-1);
}

.custom-loading,
.news-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-5);
  color: var(--pencil-11);
}

.custom-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-5);
  text-align: center;
}

.error-icon {
  font-size: 2rem;
}

.error-message {
  color: var(--pencil-11);
  font-size: var(--font-size-3);
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  color: var(--pencil-10);
  font-style: italic;
}

.scroll-footer,
.news-footer {
  text-align: center;
  padding: var(--space-5);
  color: var(--pencil-11);
  font-size: var(--font-size-2);
  font-style: italic;
}

/* Horizontal scroll styles */
.horizontal-scroll-demo {
  height: 100%;
}

.horizontal-scroller {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  overflow-x: auto;
  height: 100%;
}

.horizontal-item {
  flex: 0 0 150px;
  padding: var(--space-3);
  border: 1px solid var(--pencil-6);
  border-radius: var(--radius-4);
  background-color: var(--pencil-1);
  text-align: center;
}

.product-avatar {
  margin: 0 auto var(--space-2);
}

.item-title {
  font-weight: 600;
  color: var(--pencil-12);
  margin-bottom: var(--space-1);
  font-size: var(--font-size-2);
}

.item-price {
  color: var(--pen-11);
  font-weight: 600;
}

.horizontal-loading {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-5);
}

.horizontal-footer {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-5);
  color: var(--pencil-11);
  font-size: var(--font-size-2);
  font-style: italic;
}

/* Custom container styles */
.custom-scroll-wrapper {
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
}

.custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3);
  background-color: var(--pencil-2);
  border-bottom: 1px solid var(--pencil-6);
}

.custom-header h4 {
  margin: 0;
  color: var(--pencil-12);
}

.feed-count {
  color: var(--pencil-11);
  font-size: var(--font-size-2);
}

.custom-scroll-loader {
  flex: 1;
  overflow-y: auto;
}

.news-feed {
  padding: var(--space-3);
}

.feed-header {
  text-align: center;
  padding: var(--space-3);
  color: var(--pencil-11);
  font-size: var(--font-size-2);
  border-bottom: 1px solid var(--pencil-6);
  margin-bottom: var(--space-3);
}

.news-item {
  padding: var(--space-3);
  margin-bottom: var(--space-3);
  border: 1px solid var(--pencil-6);
  border-radius: var(--radius-4);
  background-color: var(--pencil-1);
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
  font-size: var(--font-size-1);
  color: var(--pencil-11);
}

.news-title {
  margin: 0 0 var(--space-2) 0;
  color: var(--pencil-12);
  font-size: var(--font-size-3);
  font-weight: 600;
}

.news-excerpt {
  margin: 0;
  color: var(--pencil-11);
  font-size: var(--font-size-2);
  line-height: 1.5;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .demo-container {
    height: 350px;
  }

  .demo-controls {
    flex-direction: column;
    gap: var(--space-1);
  }
}
</style>
