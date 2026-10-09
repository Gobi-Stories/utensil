<template>
  <ReferenceComponentDemo
    title="Null Data"
    anchor="null-data"
    description="Empty state component for displaying when no data is available, with optional actions."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content null-data-demo">
          <UtensilNullData
            title="No Items Found"
            description="There are no items to display at this time."
            icon="inbox"
          />
        </div>
        <div class="demo-label">Basic Empty State</div>
        <div class="demo-code">
          <code>&lt;UtensilNullData title="No Items" icon="inbox" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content null-data-demo">
          <UtensilNullData title="No Search Results" icon="search">
            <p>We couldn't find any items matching your search criteria.</p>
            <p>Try adjusting your search terms or filters.</p>
          </UtensilNullData>
        </div>
        <div class="demo-label">With Slot Content</div>
        <div class="demo-code">
          <code
            >&lt;UtensilNullData title="No Results"&gt;&lt;p&gt;Custom content&lt;/p&gt;&lt;/UtensilNullData&gt;</code
          >
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content null-data-demo">
          <UtensilNullData
            title="Get Started"
            description="Create your first project to begin organizing your content."
            icon="plus-circle"
            iconColor="pen"
          >
            <template #actions>
              <UtensilButton variation="solid" icon="plus"> Create Project </UtensilButton>
              <UtensilButton variation="outline"> Import Data </UtensilButton>
            </template>
          </UtensilNullData>
        </div>
        <div class="demo-label">With Actions</div>
        <div class="demo-code">
          <code
            >&lt;UtensilNullData title="Get Started"&gt;&lt;template
            #actions&gt;...&lt;/template&gt;&lt;/UtensilNullData&gt;</code
          >
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content null-data-demo">
          <UtensilNullData
            title="Connection Error"
            description="Unable to load data. Please check your internet connection."
            icon="wifi"
          >
            <template #actions>
              <UtensilButton variation="solid" icon="refresh" @click="refreshDemo"> Retry </UtensilButton>
            </template>
          </UtensilNullData>
        </div>
        <div class="demo-label">Error State</div>
        <div class="demo-code">
          <code>&lt;UtensilNullData title="Error" icon="wifi-off"&gt;...&lt;/UtensilNullData&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilNullDataDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import UtensilNullData from '@gobistories/utensil-vue/components/null-data/UtensilNullData.vue'
import UtensilNullDataDoc from '@gobistories/utensil-vue/components/null-data/UtensilNullDataDoc.vue'
import UtensilButton from '@gobistories/utensil-vue/components/button/UtensilButton.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { toasts } from '@/app/reference-toast'

function refreshDemo() {
  toasts.add('Retry clicked!')
}
</script>

<style scoped>
.demo-content.null-data-demo {
  min-height: 300px;
  padding: var(--space-2);
}
</style>
