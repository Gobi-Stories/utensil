<template>
  <ReferenceComponentDemo
    title="Mount Benchmark"
    anchor="mount-benchmark"
    description="Opening the disclosure mounts a grid of cards, each composing several themed primitives — the same burst of useTheme() calls as the asset library's media grid. The duration covers the toggle through the first paint after mounting. Close and reopen to remeasure."
  >
    <div class="demo-item">
      <div class="demo-content reactivity-stage">
        <div class="reactivity-controls flex column gap-2">
          <div class="control-row flex align-center gap-3">
            <span class="control-label">Cards</span>
            <ReferenceRadioGroup v-model="benchmarkCount" aria-label="Benchmark card count" :disabled="benchmarkOpen">
              <ReferenceRadioGroupButton value="100" label="100" />
              <ReferenceRadioGroupButton value="300" label="300" />
              <ReferenceRadioGroupButton value="600" label="600" />
            </ReferenceRadioGroup>
          </div>
        </div>

        <p class="benchmark-result" :class="{ measured: benchmarkResult }">
          <template v-if="benchmarkResult">
            Mounted {{ benchmarkResult.count }} cards in {{ benchmarkResult.duration.toFixed(0) }} ms
          </template>
          <template v-else>Open the disclosure to measure.</template>
        </p>

        <UtensilDisclosure v-model:open="benchmarkOpen" :label="`Mount ${benchmarkCount} cards`">
          <div class="benchmark-grid">
            <BenchmarkCard v-for="index in cardCount" :key="index" :index="index - 1" />
          </div>
        </UtensilDisclosure>
      </div>
    </div>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { ReferenceRadioGroup } from '@/theme/components/ReferenceRadioGroup'
import { ReferenceRadioGroupButton } from '@/theme/components/ReferenceRadioGroupButton'
import UtensilDisclosure from '@gobistories/utensil-vue/components/disclosure/UtensilDisclosure.vue'
import BenchmarkCard from '../components/BenchmarkCard.vue'

const benchmarkCount = ref('300')
const benchmarkOpen = ref(false)
const benchmarkResult = ref<{ count: number; duration: number }>()
const cardCount = computed(() => Number(benchmarkCount.value))

// Time from the toggle to the first frame painted after the mount flush — the
// stretch the asset grid blocks on. The watcher runs before the DOM patch, and
// rAF can't fire until the synchronous mount work finishes.
watch(benchmarkOpen, (open) => {
  benchmarkResult.value = undefined
  if (!open) {
    return
  }

  const start = performance.now()
  const count = cardCount.value
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      benchmarkResult.value = { count, duration: performance.now() - start }
    })
  })
})
</script>

<style scoped>
.demo-content.reactivity-stage {
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}

.reactivity-controls {
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--pencil-a6);
  margin-bottom: var(--space-2);
}

.control-row {
  flex-wrap: wrap;
}

.control-label {
  min-width: 96px;
  font-size: var(--font-size-1);
  font-weight: 500;
  color: var(--pencil-a11);
}

.benchmark-result {
  margin: 0;
  font-size: var(--font-size-2);
  color: var(--pencil-a11);
}

.benchmark-result.measured {
  color: var(--pen-a11);
  font-weight: 600;
}

.benchmark-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-3);
  margin-top: var(--space-3);
}
</style>
