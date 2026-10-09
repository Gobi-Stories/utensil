<template>
  <ReferenceComponentDemo
    title="Upload Progress Bar"
    anchor="upload-progress-bar"
    description="Specialized progress bar for file uploads with different states."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content progress-demo">
          <div class="upload-demo">
            <div class="upload-controls">
              <UtensilButton size="small" @click="startUploadDemo"> Start Upload </UtensilButton>
              <UtensilButton size="small" variation="outline" @click="resetUploadDemo"> Reset </UtensilButton>
            </div>
            <div class="upload-status">
              Status: {{ uploadState(uploadDemo) }}
              <span v-if="isUploading(uploadDemo)"> ({{ Math.round(uploadDemo) }}%) </span>
            </div>
            <UtensilUploadProgressBar :progress="uploadDemo" />
          </div>
        </div>
        <div class="demo-label">Upload States</div>
        <div class="demo-code">
          <code>&lt;UtensilUploadProgressBar :progress="uploadProgress" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content progress-demo">
          <div class="progress-container">
            <div class="progress-label">Pending</div>
            <UtensilUploadProgressBar :progress="0" size="small" />
          </div>
          <div class="progress-container">
            <div class="progress-label">Uploading 30%</div>
            <UtensilUploadProgressBar :progress="30" size="small" />
          </div>
          <div class="progress-container">
            <div class="progress-label">Processing</div>
            <UtensilUploadProgressBar :progress="100" size="small" />
          </div>
          <div class="progress-container">
            <div class="progress-label">Failed</div>
            <UtensilUploadProgressBar :progress="100" errored size="small" />
          </div>
        </div>
        <div class="demo-label">Upload States</div>
        <div class="demo-code">
          <code>&lt;UtensilUploadProgressBar :progress="progress" :errored="failed" size="small" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content progress-demo">
          <div class="flex column gap-4">
            <UtensilBox variation="soft" class="file-item shadow-3">
              <div class="file-info">
                <UtensilIcon icon="file" />
                <span>document.pdf</span>
              </div>
              <UtensilUploadProgressBar :progress="fileUpload1" size="medium" />
            </UtensilBox>
            <UtensilBox variation="soft" class="file-item shadow-3">
              <div class="file-info">
                <UtensilIcon icon="image" />
                <span>photo.jpg</span>
              </div>
              <UtensilUploadProgressBar :progress="fileUpload2" size="medium" />
            </UtensilBox>
            <div class="upload-actions">
              <UtensilButton size="small" @click="simulateUploads"> Upload Files </UtensilButton>
            </div>
          </div>
        </div>
        <div class="demo-label">File Upload UI</div>
        <div class="demo-code">
          <code>&lt;UtensilUploadProgressBar :progress="file.progress" /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilUploadProgressBarDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import UtensilUploadProgressBar from '@gobistories/utensil-vue/components/progress/UtensilUploadProgressBar.vue'
import UtensilUploadProgressBarDoc from '@gobistories/utensil-vue/components/progress/UtensilUploadProgressBarDoc.vue'
import UtensilButton from '@gobistories/utensil-vue/components/button/UtensilButton.vue'
import UtensilIcon from '@gobistories/utensil-vue/components/icon/UtensilIcon.vue'
import UtensilBox from '@gobistories/utensil-vue/components/box/UtensilBox.vue'

const uploadDemo = ref<number>(0)

function startUploadDemo() {
  uploadDemo.value = 0

  const uploadInterval = setInterval(() => {
    uploadDemo.value += 1
    if (uploadDemo.value >= 100) {
      clearInterval(uploadInterval)
    }
  }, 50)
}

function resetUploadDemo() {
  uploadDemo.value = 0
}

// File upload simulation
const fileUpload1 = ref<number>(0)
const fileUpload2 = ref<number>(0)

function simulateUploads() {
  // Reset states
  fileUpload1.value = 1
  fileUpload2.value = 1

  // Start first file after a delay
  setTimeout(() => {
    const interval1 = setInterval(() => {
      fileUpload1.value += 3
      if (fileUpload1.value >= 100) {
        clearInterval(interval1)
      }
    }, 150)
  }, 500)

  // Start second file after another delay
  setTimeout(() => {
    const interval2 = setInterval(() => {
      fileUpload2.value += 2
      if (fileUpload2.value >= 100) {
        clearInterval(interval2)
      }
    }, 200)
  }, 1500)
}

function uploadState(progress: number): string {
  if (!progress) {
    return 'pending'
  }

  if (progress < 100) {
    return 'uploading'
  }

  return 'complete'
}

function isUploading(progress: number) {
  return progress > 0 && progress < 100
}
</script>

<style scoped>
.demo-content {
  min-height: 200px;
}

.demo-content.progress-demo {
  display: flex;
  min-height: 180px;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: stretch;
  gap: var(--space-3);
}

.progress-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  margin-bottom: var(--space-3);
}

.progress-label {
  font-size: 0.9rem;
  color: var(--pencil-11);
  font-weight: 500;
}

.upload-demo {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.upload-controls {
  display: flex;
  gap: var(--space-2);
  justify-content: center;
  padding: var(--space-2);
}

.upload-status {
  font-size: 0.9rem;
  color: var(--pencil-11);
  text-align: center;
  font-family: ui-monospace, monospace;
}

.file-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-2);
  border-radius: var(--radius-2);
}

.file-info {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.9rem;
  color: var(--pencil-12);
}

.upload-actions {
  display: flex;
  justify-content: center;
  margin-top: var(--space-2);
  margin-bottom: var(--space-3);
  padding: var(--space-2);
}
</style>
