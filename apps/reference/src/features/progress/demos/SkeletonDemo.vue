<template>
  <ReferenceComponentDemo
    title="Skeleton"
    anchor="skeleton"
    description="Placeholder loading skeletons for content that hasn't loaded yet."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content skeleton-demo">
          <UtensilSkeleton width="100%" height="var(--space-4)" />
          <UtensilSkeleton width="80%" height="var(--space-4)" />
          <UtensilSkeleton width="60%" height="var(--space-4)" />
        </div>
        <div class="demo-label">Text Lines</div>
      </div>
      <div class="demo-item">
        <div class="demo-content skeleton-demo">
          <div class="skeleton-card-demo">
            <UtensilSkeleton circle width="48px" />
            <div class="skeleton-card-lines">
              <UtensilSkeleton width="40%" height="var(--space-4)" />
              <UtensilSkeleton width="100%" height="var(--space-3)" />
              <UtensilSkeleton width="70%" height="var(--space-3)" />
            </div>
          </div>
        </div>
        <div class="demo-label">Card Layout</div>
      </div>
      <div class="demo-item">
        <div class="demo-content skeleton-demo">
          <UtensilSkeleton rounded width="100%" height="var(--space-5)" />
          <UtensilSkeleton rounded width="100%" height="var(--space-5)" />
          <UtensilSkeleton rounded width="100%" height="var(--space-5)" />
        </div>
        <div class="demo-label always-visible">Rounded</div>
      </div>
      <div class="demo-item">
        <div class="demo-content skeleton-demo skeleton-resolve-demo">
          <div class="skeleton-resolve-content-area">
            <template v-if="!skeletonLoaded">
              <UtensilSkeleton circle width="48px" />
              <UtensilSkeleton width="60%" height="var(--space-4)" />
              <UtensilSkeleton width="100%" height="var(--space-3)" />
            </template>
            <template v-else>
              <div class="skeleton-resolved-content">
                <div class="skeleton-resolved-avatar">AB</div>
                <div class="skeleton-resolved-name">Alice Bergström</div>
                <div class="skeleton-resolved-bio">Designer & creative director based in Stockholm.</div>
              </div>
            </template>
          </div>
          <UtensilButton
            class="skeleton-load-button"
            scale="small"
            variation="outline"
            :busy="skeletonLoading"
            @click="toggleSkeletonLoad"
          >
            {{ skeletonLoaded ? 'Reset' : 'Load Content' }}
          </UtensilButton>
        </div>
        <div class="demo-label always-visible">Resolve to Content</div>
      </div>
    </div>

    <template #api>
      <UtensilSkeletonDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import UtensilSkeleton from 'utensil-vue/components/skeleton/UtensilSkeleton.vue'
import UtensilSkeletonDoc from 'utensil-vue/components/skeleton/UtensilSkeletonDoc.vue'
import UtensilButton from 'utensil-vue/components/button/UtensilButton.vue'

const skeletonLoaded = ref(false)
const skeletonLoading = ref(false)
let skeletonTimeout: ReturnType<typeof setTimeout> | null = null

function toggleSkeletonLoad() {
  if (skeletonLoaded.value) {
    skeletonLoaded.value = false
    return
  }
  skeletonLoading.value = true
  skeletonTimeout = setTimeout(() => {
    skeletonLoaded.value = true
    skeletonLoading.value = false
  }, 1500)
}

onBeforeUnmount(() => {
  if (skeletonTimeout) {
    clearTimeout(skeletonTimeout)
  }
})
</script>

<style scoped>
.demo-content {
  min-height: 200px;
}

.demo-content.skeleton-demo {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-items: flex-start;
}

.demo-content.skeleton-resolve-demo {
  align-items: center;
  justify-content: space-between;
}

.skeleton-resolve-content-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
}

.skeleton-card-demo {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
  width: 100%;
}

.skeleton-card-lines {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1;
}

.skeleton-load-button {
  align-self: center;
  min-width: 140px;
}

.skeleton-resolved-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
}

.skeleton-resolved-avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background-color: var(--pen-9);
  color: var(--pen-contrast);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: var(--font-size-2);
}

.skeleton-resolved-name {
  font-weight: 600;
  color: var(--pencil-12);
}

.skeleton-resolved-bio {
  color: var(--pencil-11);
  font-size: var(--font-size-2);
  text-align: center;
}
</style>
