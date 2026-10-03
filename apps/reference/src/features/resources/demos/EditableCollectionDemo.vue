<template>
  <div id="editable-collection" class="component-demo">
    <h3><a class="demo-anchor" href="#editable-collection">Editable Collection</a></h3>
    <p>Collections with create, edit, and delete operations including optimistic updates.</p>
    <div class="demo-grid">
      <!-- Editable Collection -->
      <div class="demo-item">
        <div class="demo-content resource-demo">
          <div class="demo-container">
            <div class="demo-controls">
              <UtensilButton
                size="small"
                variation="outline"
                @click="addNewItem"
                :disabled="!memberCollection.loaded.value"
              >
                Add Item
              </UtensilButton>
            </div>

            <UtensilResourceLoader
              :load="memberCollection.refresh"
              :loaded="memberCollection.loaded.value"
              :syncing="memberCollection.syncing.value"
              :has-error="memberCollection.hasError.value"
              :error="memberCollection.error.value"
              :may-retry="memberCollection.mayRetry.value"
              :show-spinner="true"
              :show-errors="true"
              :loader-delay="300"
              :fade-content="true"
              :lift-ui="false"
            >
              <div v-if="memberCollection.loaded.value" class="demo-loaded-content">
                <h4>Team Members ({{ memberCollection.count.value }} items)</h4>
                <div class="editable-collection-list">
                  <div
                    v-for="member in memberCollection.items.value"
                    :key="member.id"
                    class="editable-item"
                    :class="{ creating: member.creating, updating: member.updating, deleting: member.deleting }"
                  >
                    <div class="item-content">
                      <div class="member-name">{{ member.name }}</div>
                      <div class="member-role">{{ member.role }}</div>
                    </div>
                    <div class="item-actions">
                      <UtensilButton
                        size="tiny"
                        variation="text"
                        @click="updateMember(member)"
                        :disabled="member.updating || member.deleting"
                      >
                        Edit
                      </UtensilButton>
                      <UtensilButton
                        size="tiny"
                        variation="text"
                        color="error"
                        @click="deleteMember(member)"
                        :disabled="member.updating || member.deleting"
                      >
                        Delete
                      </UtensilButton>
                    </div>
                    <div v-if="member.creating" class="item-status">Creating...</div>
                    <div v-if="member.updating" class="item-status">Updating...</div>
                    <div v-if="member.deleting" class="item-status">Deleting...</div>
                  </div>
                </div>
              </div>
            </UtensilResourceLoader>
          </div>
        </div>
        <div class="demo-label">Editable Collection (add, edit, delete members)</div>
        <div class="demo-code">
          <code>const collection = useEditableCollection(api, { path: '/members' })</code>
        </div>
      </div>

      <!-- Collection with Pagination -->
      <div class="demo-item">
        <div class="demo-content resource-demo">
          <div class="demo-container">
            <div class="demo-controls">
              <UtensilButton
                size="small"
                variation="outline"
                @click="paginatedCollection.loadNextPage()"
                :disabled="!paginatedCollection.pagesAvailable.value || paginatedCollection.syncing.value"
              >
                Load More
              </UtensilButton>
            </div>

            <UtensilResourceLoader
              :load="paginatedCollection.refresh"
              :loaded="paginatedCollection.loaded.value"
              :syncing="paginatedCollection.syncing.value"
              :has-error="paginatedCollection.hasError.value"
              :error="paginatedCollection.error.value"
              :may-retry="paginatedCollection.mayRetry.value"
              :show-spinner="true"
              :show-errors="true"
              :loader-delay="300"
              :fade-content="true"
              :lift-ui="false"
            >
              <div v-if="paginatedCollection.loaded.value" class="demo-loaded-content">
                <h4>Products ({{ paginatedCollection.count.value }} loaded)</h4>
                <div class="paginated-list">
                  <div v-for="product in paginatedCollection.items.value" :key="product.id" class="product-item">
                    <div class="product-name">{{ product.name }}</div>
                    <div class="product-price">${{ product.price }}</div>
                  </div>
                </div>
                <div v-if="paginatedCollection.pagesAvailable.value" class="pagination-info">
                  Page {{ paginatedCollection.page.value + 1 }} • More items available
                </div>
                <div v-else class="pagination-info">All items loaded</div>
              </div>
            </UtensilResourceLoader>
          </div>
        </div>
        <div class="demo-label">Paginated Collection (click Load More)</div>
        <div class="demo-code">
          <code>await collection.loadNextPage()</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import UtensilResourceLoader from 'utensil-vue/components/resource/UtensilResourceLoader.vue'
import UtensilButton from 'utensil-vue/components/button/UtensilButton.vue'

interface TeamMember {
  id: string
  name: string
  role: string
  creating?: boolean
  updating?: boolean
  deleting?: boolean
}

interface ProductItem {
  id: string
  name: string
  price: number
}

const mockMembers: TeamMember[] = [
  { id: '1', name: 'Sarah Johnson', role: 'Product Manager' },
  { id: '2', name: 'Mike Chen', role: 'Lead Developer' },
  { id: '3', name: 'Emma Wilson', role: 'UX Designer' },
]

const mockProducts: ProductItem[] = Array.from({ length: 25 }, (_, i) => ({
  id: `product-${i + 1}`,
  name: `Product ${i + 1}`,
  price: Math.floor(Math.random() * 1000) + 10,
}))

// Simulated editable collection state

const memberCollection = (() => {
  const items = ref<TeamMember[]>([])
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
      items.value = mockMembers.map((m) => ({ ...m }))
      loaded.value = true
      syncing.value = false
    }, 500)
  }

  async function create(member: TeamMember) {
    items.value = [...items.value, { ...member, creating: true }]
    await new Promise((resolve) => setTimeout(resolve, 800))
    items.value = items.value.map((m) => (m.id === member.id ? { ...member, creating: false } : m))
  }

  async function modify(member: TeamMember) {
    items.value = items.value.map((m) => (m.id === member.id ? { ...member, updating: true } : m))
    await new Promise((resolve) => setTimeout(resolve, 800))
    items.value = items.value.map((m) => (m.id === member.id ? { ...member, updating: false } : m))
  }

  async function remove(member: TeamMember) {
    items.value = items.value.map((m) => (m.id === member.id ? { ...member, deleting: true } : m))
    await new Promise((resolve) => setTimeout(resolve, 800))
    items.value = items.value.filter((m) => m.id !== member.id)
  }

  refresh()

  return { items, loaded, syncing, hasError, error, mayRetry, count, refresh, create, modify, remove }
})()

const PAGE_SIZE = 5

const paginatedCollection = (() => {
  const items = ref<ProductItem[]>([])
  const loaded = ref(false)
  const syncing = ref(false)
  const hasError = ref(false)
  const error = ref<Error | null>(null)
  const mayRetry = ref(true)
  const page = ref(0)
  const count = computed(() => items.value.length)
  const pagesAvailable = computed(() => items.value.length < mockProducts.length)

  function refresh() {
    syncing.value = true
    hasError.value = false
    error.value = null
    page.value = 0
    setTimeout(() => {
      items.value = mockProducts.slice(0, PAGE_SIZE)
      loaded.value = true
      syncing.value = false
    }, 400)
  }

  function loadNextPage() {
    if (!pagesAvailable.value) {
      return
    }
    syncing.value = true
    page.value++
    setTimeout(() => {
      items.value = mockProducts.slice(0, (page.value + 1) * PAGE_SIZE)
      syncing.value = false
    }, 400)
  }

  refresh()

  return { items, loaded, syncing, hasError, error, mayRetry, count, page, pagesAvailable, refresh, loadNextPage }
})()

let nextMemberId = 4

const addNewItem = async () => {
  const newMember: TeamMember = {
    id: `member-${nextMemberId}`,
    name: `New Member ${nextMemberId}`,
    role: 'Developer',
  }
  nextMemberId++
  await memberCollection.create(newMember)
}

const updateMember = async (member: TeamMember) => {
  const newRole = member.role === 'Developer' ? 'Senior Developer' : 'Developer'
  await memberCollection.modify({ ...member, role: newRole })
}

const deleteMember = async (member: TeamMember) => {
  await memberCollection.remove(member)
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

.editable-collection-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.editable-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2);
  border: 1px solid var(--pencil-6);
  border-radius: var(--radius-2);
  background-color: var(--pencil-1);
  transition: all 0.15s ease;
}

.editable-item.creating {
  border-color: var(--pen-8);
  background-color: var(--pen-a2);
}

.editable-item.updating {
  border-color: var(--pen-8);
  background-color: var(--pen-a3);
}

.editable-item.deleting {
  border-color: var(--pencil-8);
  background-color: var(--pencil-a3);
  opacity: 0.7;
}

.item-content {
  flex: 1;
}

.member-name {
  font-weight: 500;
  color: var(--pencil-12);
  font-size: var(--font-size-2);
}

.member-role {
  font-size: var(--font-size-1);
  color: var(--pencil-11);
  margin-top: var(--space-1);
}

.item-actions {
  display: flex;
  gap: var(--space-1);
}

.item-status {
  font-size: var(--font-size-1);
  color: var(--pencil-11);
  text-transform: uppercase;
  font-weight: 500;
  font-style: italic;
  margin-left: var(--space-2);
}

.paginated-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2);
  border: 1px solid var(--pencil-6);
  border-radius: var(--radius-2);
  background-color: var(--pencil-1);
}

.product-name {
  font-weight: 500;
  color: var(--pencil-12);
  font-size: var(--font-size-2);
}

.product-price {
  color: var(--pen-11);
  font-weight: 500;
  font-size: var(--font-size-2);
}

.pagination-info {
  margin-top: var(--space-2);
  text-align: center;
  font-size: var(--font-size-2);
  color: var(--pencil-11);
  font-style: italic;
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
