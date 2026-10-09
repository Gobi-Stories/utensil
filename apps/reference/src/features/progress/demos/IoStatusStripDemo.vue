<template>
  <ReferenceComponentDemo
    title="IO Status Strip"
    anchor="io-status-strip"
    description="One strip for an app's io state: loading and saving share it, saving wins while both run, and an error tints whatever is showing."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content io-strip-demo">
          <div class="io-strip-frame">
            <div class="io-strip-header">
              <span>App header</span>
              <div class="flex gap-2">
                <UtensilButton scale="small" :disabled="statusLoading" @click="statusLoad">Load</UtensilButton>
                <UtensilButton scale="small" color="success" :disabled="statusSaving" @click="statusSave">
                  Save
                </UtensilButton>
                <UtensilButton scale="small" color="success" :disabled="statusSaving" @click="statusSaveBurst">
                  Save burst
                </UtensilButton>
                <UtensilButton scale="small" color="success" :disabled="statusSaving" @click="statusSaveSteps">
                  Save in steps
                </UtensilButton>
                <UtensilButton scale="small" color="error" :disabled="statusSaving" @click="statusSaveFail">
                  Failing save
                </UtensilButton>
              </div>
            </div>
            <ReferenceIoStatusStrip
              :loading="statusLoading"
              :saving="statusSaving"
              :progress="statusProgress"
              :error="statusError"
              savingColor="success"
              errorColor="error"
            />
            <div class="io-strip-content">
              A burst of saves settles into one sweep, a stepped save fills as its steps land, and a failed save
              finishes tinted
            </div>
          </div>
        </div>
        <div class="demo-label always-visible">Loading, Saving, and Error</div>
        <div class="demo-code">
          <code
            >&lt;UtensilIoStatusStrip :loading="loading" :saving="saving" :error="failed" savingColor="success"
            errorColor="error" /&gt;</code
          >
        </div>
      </div>
    </div>

    <template #api>
      <UtensilIoStatusStripDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { ReferenceIoStatusStrip } from '@/theme/components/ReferenceIoStatusStrip'
import UtensilIoStatusStripDoc from '@gobistories/utensil-vue/components/progress/UtensilIoStatusStripDoc.vue'
import UtensilButton from '@gobistories/utensil-vue/components/button/UtensilButton.vue'

const statusLoading = ref(false)
const statusSaving = ref(false)
const statusError = ref(false)
const statusProgress = ref<number | undefined>(undefined)
let statusTimeout: ReturnType<typeof setTimeout> | null = null

function statusLoad() {
  statusError.value = false
  statusLoading.value = true
  statusTimeout = setTimeout(() => {
    statusLoading.value = false
  }, 1800)
}

function statusSave() {
  statusError.value = false
  statusSaving.value = true
  statusTimeout = setTimeout(() => {
    statusSaving.value = false
  }, 1200)
}

// Three quick writes with gaps inside the settle window — one continuous sweep
async function statusSaveBurst() {
  statusError.value = false

  for (let burst = 0; burst < 3; burst++) {
    statusSaving.value = true
    await new Promise((resolve) => setTimeout(resolve, 400))
    statusSaving.value = false
    await new Promise((resolve) => setTimeout(resolve, 150))
  }
}

// A save that knows its steps reports them — the strip fills a step at a time
async function statusSaveSteps() {
  statusError.value = false
  statusSaving.value = true
  statusProgress.value = 0

  for (let step = 1; step <= 5; step++) {
    await new Promise((resolve) => setTimeout(resolve, 400))
    statusProgress.value = step / 5
  }

  statusSaving.value = false
  statusProgress.value = undefined
}

function statusSaveFail() {
  statusError.value = false
  statusSaving.value = true
  statusTimeout = setTimeout(() => {
    statusError.value = true
    statusSaving.value = false
  }, 900)
}

onBeforeUnmount(() => {
  if (statusTimeout) {
    clearTimeout(statusTimeout)
  }
})
</script>

<style scoped>
.demo-content {
  min-height: 200px;
}

.demo-content.io-strip-demo {
  min-height: 140px;
  display: flex;
  align-items: stretch;
}

.io-strip-frame {
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid var(--pencil-6);
  border-radius: var(--radius-3);
  overflow: hidden;
}

.io-strip-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
  background-color: var(--pencil-2);
  color: var(--pencil-a11);
  font-size: var(--font-size-2);
}

.io-strip-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  color: var(--pencil-a11);
  font-size: var(--font-size-2);
}
</style>
