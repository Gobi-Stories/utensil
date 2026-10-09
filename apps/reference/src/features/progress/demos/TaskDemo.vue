<template>
  <ReferenceComponentDemo title="Task" anchor="task" description="Single task row used inside Tasks.">
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content single-task-demo">
          <ReferenceTask title="Upload: photo.jpg" icon="image" state="Uploading..." :progress="42" />
        </div>
        <div class="demo-label always-visible">Active</div>
      </div>
      <div class="demo-item">
        <div class="demo-content single-task-demo">
          <ReferenceTask title="Render: short.mp4" icon="video" state="Processing..." :progress="100" />
        </div>
        <div class="demo-label always-visible">Processing</div>
      </div>
      <div class="demo-item">
        <div class="demo-content single-task-demo">
          <ReferenceTask title="Upload: huge.zip" icon="file" state="Failed" errored>
            <template #actions>
              <UtensilButton size="tiny">Retry</UtensilButton>
              <UtensilButton size="tiny" color="error">Remove</UtensilButton>
            </template>
          </ReferenceTask>
        </div>
        <div class="demo-label always-visible">Errored with Actions</div>
      </div>
    </div>

    <template #api>
      <UtensilTaskDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ReferenceTask } from '@/theme/components/ReferenceTask'
import UtensilTaskDoc from '@gobistories/utensil-vue/components/tasks/UtensilTaskDoc.vue'
import UtensilButton from '@gobistories/utensil-vue/components/button/UtensilButton.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
</script>

<style scoped>
.demo-item {
  min-height: 200px;
}

.demo-content.single-task-demo {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 80px;
  padding-block: var(--space-3);
}
</style>
