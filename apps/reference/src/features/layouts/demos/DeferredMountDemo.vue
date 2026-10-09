<template>
  <ReferenceComponentDemo
    title="Deferred Mount"
    anchor="deferred-mount"
    description="Defers mounting heavy content until the browser has painted, so navigation and page chrome aren't held behind a heavy subtree's first render. A placeholder renders while it waits."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content fader-demo">
          <div class="fader-controls">
            <UtensilButton size="small" @click="deferredDemo = !deferredDemo"
              >{{ deferredDemo ? 'Unmount' : 'Mount' }} Content</UtensilButton
            >
          </div>
          <div class="fader-content-area">
            <UtensilDeferredMount :active="deferredDemo">
              <div class="demo-fade-content">
                <span>Mounted one painted frame after activation</span>
              </div>
              <template #placeholder>
                <div v-if="deferredDemo" class="demo-fade-content deferred-placeholder">
                  <span>Placeholder…</span>
                </div>
              </template>
            </UtensilDeferredMount>
          </div>
        </div>
        <div class="demo-label">Default (1 frame)</div>
      </div>
      <div class="demo-item">
        <div class="demo-content fader-demo">
          <div class="fader-controls">
            <UtensilButton size="small" @click="deferredSlowDemo = !deferredSlowDemo"
              >{{ deferredSlowDemo ? 'Unmount' : 'Mount' }} Content</UtensilButton
            >
          </div>
          <div class="fader-content-area">
            <UtensilDeferredMount :active="deferredSlowDemo" :frames="60">
              <div class="demo-fade-content">
                <span>Mounted after 60 painted frames</span>
              </div>
              <template #placeholder>
                <div v-if="deferredSlowDemo" class="demo-fade-content deferred-placeholder">
                  <span>Placeholder for ~a second…</span>
                </div>
              </template>
            </UtensilDeferredMount>
          </div>
        </div>
        <div class="demo-label">Slow Motion (60 frames)</div>
      </div>
    </div>

    <template #api>
      <UtensilDeferredMountDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilDeferredMount from '@gobistories/utensil-vue/components/deferred-mount/UtensilDeferredMount.vue'
import UtensilDeferredMountDoc from '@gobistories/utensil-vue/components/deferred-mount/UtensilDeferredMountDoc.vue'
import UtensilButton from '@gobistories/utensil-vue/components/button/UtensilButton.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

const deferredDemo = ref(false)
const deferredSlowDemo = ref(false)
</script>

<style scoped>
.demo-fade-content {
  padding: var(--space-3);
  background-color: var(--pen-a3);
  border-radius: var(--radius-2);
  text-align: center;
}

.demo-fade-content.deferred-placeholder {
  background-color: var(--pencil-a3);
  color: var(--pencil-a11);
  border: 1px dashed var(--pencil-a7);
}

.demo-content.fader-demo {
  position: relative;
  flex-direction: column;
  align-items: stretch;
  min-height: 208px;
}

.fader-controls {
  position: absolute;
  top: var(--space-3);
  align-self: center;
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-3);
}

.fader-content-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
}
</style>
