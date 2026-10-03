<template>
  <ReferenceComponentDemo
    title="File Drop Target"
    anchor="file-drop-target"
    description="Drag-and-drop file upload target with visual feedback and customizable appearance."
  >
    <div class="demo-column">
      <div class="demo-item file-drop-demo">
        <div class="demo-content file-drop-content">
          <UtensilFileDropTarget @drop="handleFileDrop" rounded>
            <div class="drop-target-placeholder">
              <div class="placeholder-content">
                <UtensilIcon icon="cloud-upload-alt" />
                <p>Drag files here or click to upload</p>
                <small>Supports images, videos, and documents</small>
              </div>
            </div>
          </UtensilFileDropTarget>
        </div>
        <div class="demo-label">Basic Drop Target</div>
        <div class="demo-code">
          <code>&lt;UtensilFileDropTarget @drop="handleDrop" rounded&gt;</code>
        </div>
      </div>
      <div class="demo-item file-drop-demo">
        <div class="demo-content file-drop-content">
          <UtensilFileDropTarget @drop="handleFileDrop">
            <div class="drop-target-placeholder square">
              <div class="placeholder-content">
                <UtensilIcon icon="upload" />
                <p>Drop zone without rounded corners</p>
                <small>Standard rectangular appearance</small>
              </div>
            </div>
          </UtensilFileDropTarget>
        </div>
        <div class="demo-label">Without Rounded Corners</div>
        <div class="demo-code">
          <code>&lt;UtensilFileDropTarget @drop="handleDrop"&gt;</code>
        </div>
      </div>
      <div class="demo-item file-drop-demo">
        <div class="demo-content file-drop-content">
          <UtensilFileDropTarget @drop="handleFileDrop" disabled rounded>
            <div class="drop-target-placeholder disabled">
              <div class="placeholder-content">
                <UtensilIcon icon="ban" />
                <p>Upload disabled</p>
                <small>This drop target is disabled</small>
              </div>
            </div>
          </UtensilFileDropTarget>
        </div>
        <div class="demo-label">Disabled State</div>
        <div class="demo-code">
          <code>&lt;UtensilFileDropTarget disabled&gt;</code>
        </div>
      </div>
    </div>

    <div v-if="droppedFiles.length > 0" class="dropped-files">
      <h4>Dropped Files</h4>
      <ul>
        <li v-for="(file, index) in droppedFiles" :key="index">{{ file.name }} ({{ formatFileSize(file.size) }})</li>
      </ul>
      <UtensilButton variation="outline" size="small" @click="clearFiles"> Clear Files </UtensilButton>
    </div>

    <template #api>
      <UtensilFileDropTargetDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilFileDropTarget from 'utensil-vue/components/file-drop-target/UtensilFileDropTarget.vue'
import UtensilFileDropTargetDoc from 'utensil-vue/components/file-drop-target/UtensilFileDropTargetDoc.vue'
import UtensilIcon from 'utensil-vue/components/icon/UtensilIcon.vue'
import UtensilButton from 'utensil-vue/components/button/UtensilButton.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

const droppedFiles = ref<File[]>([])

function handleFileDrop(files: FileList) {
  const fileArray = Array.from(files)
  droppedFiles.value.push(...fileArray)
  console.log('Files dropped:', fileArray)
}

function clearFiles() {
  droppedFiles.value = []
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.demo-column {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.demo-content.file-drop-content {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  width: 100%;
}

.utensil-file-drop-target {
  container-type: size;
  container-name: file-drop;
  width: 100%;
  max-width: 600px;
  aspect-ratio: 1;
}

.drop-target-placeholder {
  width: 100%;
  height: 100%;
  border: 2px dashed var(--pencil-6);
  border-radius: var(--radius-4);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--pencil-3);
  transition: all 0.15s ease;

  &.square {
    border-radius: 0;
  }
}

.drop-target-placeholder.disabled {
  opacity: 0.5;
  cursor: default;
}

.drop-target-placeholder.disabled:hover {
  border-color: var(--pencil-6);
  background-color: var(--pencil-3);
}

.placeholder-content {
  text-align: center;
  color: var(--pencil-11);
}

.placeholder-content .utensil-icon {
  font-size: 48px;
  margin-bottom: var(--space-3);
  color: var(--pencil-11);
}

.placeholder-content p {
  margin: 0 0 var(--space-1) 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--pencil-12);
}

.placeholder-content small {
  font-size: 14px;
  color: var(--pencil-11);
}

.dropped-files {
  margin-top: var(--space-5);
  padding: var(--space-3);
  border: 1px solid var(--pencil-6);
  border-radius: var(--radius-4);
  background-color: var(--pencil-3);
}

.dropped-files h4 {
  margin: 0 0 var(--space-2) 0;
  color: var(--pencil-12);
}

.dropped-files ul {
  margin: 0 0 var(--space-3) 0;
  padding-left: var(--space-3);
}

.dropped-files li {
  color: var(--pencil-11);
  font-family: ui-monospace, monospace;
  font-size: 0.9rem;
}
</style>
