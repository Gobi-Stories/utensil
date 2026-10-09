<template>
  <ReferenceComponentDemo
    title="Tasks"
    anchor="tasks"
    description="Compact background-task indicator with a popover-listed breakdown."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content tasks-demo">
          <UtensilTasks
            :count="singleProgress < 100 ? 1 : 0"
            :progress="singleProgress"
            :label="`task-${singleProgress}.mp4`"
            placement="bottom-start"
            @click="onTaskClick"
          >
            <ReferenceTask
              title="Upload: task.mp4"
              :state="`${singleProgress}%`"
              :progress="singleProgress"
              :payload="{ id: 'one' }"
            />
          </UtensilTasks>
          <UtensilButton class="pinned-action" size="small" @click="animateSingle">
            {{ singleProgress < 100 ? 'Reset' : 'Start' }}
          </UtensilButton>
        </div>
        <div class="demo-label always-visible">Single Active</div>
      </div>

      <div class="demo-item">
        <div class="demo-content tasks-demo">
          <UtensilTasks
            label="Errors"
            :count="mixedActive"
            :progress="mixedAggregateProgress"
            :errored="true"
            placement="bottom-start"
            @click="onTaskClick"
          >
            <ReferenceTask
              v-for="task in mixedTasks"
              :key="task.id"
              :title="task.title"
              :icon="task.icon"
              :state="task.state"
              :progress="task.progress"
              :errored="task.errored"
              :payload="task"
            >
              <template v-if="task.errored" #actions>
                <UtensilButton size="tiny" @click="retryMixed(task.id)">Retry</UtensilButton>
                <UtensilButton size="tiny" color="error" @click="removeMixed(task.id)">Remove</UtensilButton>
              </template>
            </ReferenceTask>
          </UtensilTasks>
        </div>
        <div class="demo-label always-visible">Mixed Active + Errored</div>
      </div>

      <div class="demo-item">
        <div class="demo-content tasks-demo">
          <UtensilTasks
            :count="manyTasks.length"
            :progress="50"
            label="Lots happening"
            placement="bottom-start"
            @click="onTaskClick"
          >
            <ReferenceTask
              v-for="task in manyTasks"
              :key="task.id"
              :title="task.title"
              :state="task.state"
              :progress="task.progress"
              :payload="task"
            />
          </UtensilTasks>
          <p class="demo-hint">Click trigger; scroll the list</p>
        </div>
        <div class="demo-label always-visible">Scrollable List</div>
      </div>

      <div class="demo-item">
        <div class="demo-content tasks-demo">
          <UtensilTasks :count="0" always-visible label="Always shown" placement="bottom-start" />
          <p class="demo-hint">alwaysVisible bypasses auto-hide</p>
        </div>
        <div class="demo-label always-visible">alwaysVisible</div>
      </div>

      <div class="demo-item">
        <div class="demo-content tasks-demo">
          <UtensilTasks
            :count="manyTasks.length"
            :progress="50"
            label="Uploads"
            label-placement="block"
            always-visible
            placement="top-start"
            @click="onTaskClick"
          >
            <ReferenceTask
              v-for="task in manyTasks"
              :key="task.id"
              :title="task.title"
              :state="task.state"
              :progress="task.progress"
              :payload="task"
            />
          </UtensilTasks>
          <p class="demo-hint">Stacked label above the trigger — like UtensilInput's block label</p>
        </div>
        <div class="demo-label always-visible">Block Label</div>
      </div>
    </div>

    <div v-if="lastClicked" class="dropped-files">
      <h4>Last clicked</h4>
      <pre><code>{{ JSON.stringify(lastClicked, null, 2) }}</code></pre>
      <UtensilButton variation="outline" size="small" @click="lastClicked = null">Clear</UtensilButton>
    </div>

    <template #api>
      <UtensilTasksDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import UtensilTasks from '@gobistories/utensil-vue/components/tasks/UtensilTasks.vue'
import { ReferenceTask } from '@/theme/components/ReferenceTask'
import type { ReferenceIcon } from '@/theme/reference-icons'
import UtensilTasksDoc from '@gobistories/utensil-vue/components/tasks/UtensilTasksDoc.vue'
import UtensilButton from '@gobistories/utensil-vue/components/button/UtensilButton.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

const lastClicked = ref<unknown>(null)

function onTaskClick(payload: unknown) {
  lastClicked.value = payload
}

const singleProgress = ref(100)
let singleInterval: ReturnType<typeof setInterval> | null = null

function animateSingle() {
  if (singleInterval) {
    clearInterval(singleInterval)
    singleInterval = null
  }
  singleProgress.value = 0
  singleInterval = setInterval(() => {
    singleProgress.value = Math.min(100, singleProgress.value + 5)
    if (singleProgress.value >= 100 && singleInterval) {
      clearInterval(singleInterval)
      singleInterval = null
    }
  }, 200)
}

interface MixedTask {
  id: string
  title: string
  icon: ReferenceIcon
  state: string
  progress: number
  errored?: boolean
}

const mixedTasks = ref<MixedTask[]>([
  { id: 'a', title: 'Upload: clip-a.mp4', icon: 'video', state: '32%', progress: 32 },
  { id: 'b', title: 'Upload: clip-b.mp4', icon: 'video', state: 'Processing...', progress: 100 },
  { id: 'c', title: 'Upload: bad.exe', icon: 'file', state: 'File type not supported', progress: 22, errored: true },
])

const mixedActive = computed(() => mixedTasks.value.filter((t) => !t.errored).length)
const mixedAggregateProgress = computed(() => {
  const active = mixedTasks.value.filter((t) => !t.errored)
  if (!active.length) return 0
  return Math.round(active.reduce((sum, t) => sum + t.progress, 0) / active.length)
})

function retryMixed(id: string) {
  const task = mixedTasks.value.find((t) => t.id === id)
  if (task) {
    task.errored = false
    task.progress = 5
    task.state = '5%'
  }
}

function removeMixed(id: string) {
  mixedTasks.value = mixedTasks.value.filter((t) => t.id !== id)
}

const manyTasks = Array.from({ length: 12 }, (_, i) => ({
  id: `m-${i}`,
  title: `Upload: file-${String(i + 1).padStart(2, '0')}.mp4`,
  state: `${(i * 7 + 13) % 100}%`,
  progress: (i * 7 + 13) % 100,
}))

onBeforeUnmount(() => {
  if (singleInterval) clearInterval(singleInterval)
})
</script>

<style scoped>
.demo-item {
  min-height: 200px;
}

.demo-content.tasks-demo {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
}

.pinned-action {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  min-width: 64px;
}

.demo-hint {
  font-size: var(--font-size-1);
  color: var(--pencil-11);
  margin: 0;
}

.dropped-files {
  margin-block-start: var(--space-4);
  padding: var(--space-3);
  background-color: var(--pencil-2);
  border-radius: var(--radius-2);
}

.dropped-files pre {
  margin-block: var(--space-2);
  font-size: var(--font-size-1);
}
</style>
