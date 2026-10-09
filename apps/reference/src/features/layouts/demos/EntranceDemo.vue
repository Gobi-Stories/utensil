<template>
  <ReferenceComponentDemo
    title="Entrance"
    anchor="entrance"
    description="Staggered fade-up entrance animation applied to each direct child. Children require no participation."
  >
    <div class="entrance-demo-wrapper">
      <div class="entrance-demo-toolbar">
        <ReferenceButton
          v-for="option in entranceSpeeds"
          :key="option"
          :variation="entranceSpeed === option ? 'solid' : 'soft'"
          scale="small"
          :pressed="entranceSpeed === option ? 'pressed' : false"
          @click="playAtSpeed(option)"
        >
          {{ option === 'normal' ? 'Normal' : 'Fast' }}
        </ReferenceButton>
        <ReferenceButton variation="soft" scale="small" icon="refresh" @click="replayEntrance">Replay</ReferenceButton>
      </div>
      <div class="entrance-demo-stage">
        <UtensilEntrance ref="entranceRef" :speed="entranceSpeed">
          <h2 class="entrance-heading">Authentic stories, effortlessly collected.</h2>
          <p class="text-content entrance-subtitle">
            We help you create powerful employee video content without the hassle. Choose a service below and get
            started today.
          </p>
          <div class="entrance-cards">
            <div class="entrance-card">
              <div class="entrance-card-icon primary">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                </svg>
              </div>
              <h3>Employee content</h3>
              <p>Collect authentic video testimonials directly from your team members.</p>
            </div>
            <div class="entrance-card">
              <div class="entrance-card-icon secondary">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" />
                </svg>
              </div>
              <h3>Professional production</h3>
              <p>We film and produce your stories from start to finish at a fixed cost.</p>
            </div>
          </div>
        </UtensilEntrance>
      </div>
    </div>

    <template #api>
      <UtensilEntranceDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import UtensilEntrance, { type EntranceSpeed } from '@gobistories/utensil-vue/components/entrance/UtensilEntrance.vue'
import UtensilEntranceDoc from '@gobistories/utensil-vue/components/entrance/UtensilEntranceDoc.vue'
import { ReferenceButton } from '@/theme/components/ReferenceButton'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

const entranceRef = ref<InstanceType<typeof UtensilEntrance>>()
const entranceSpeeds: EntranceSpeed[] = ['normal', 'fast']
const entranceSpeed = ref<EntranceSpeed>('normal')

async function playAtSpeed(speed: EntranceSpeed) {
  entranceSpeed.value = speed
  await nextTick()
  replayEntrance()
}

function replayEntrance() {
  entranceRef.value?.replay()
}
</script>

<style scoped>
.entrance-demo-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.entrance-demo-toolbar {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
}

.entrance-demo-stage {
  background: var(--pencil-2);
  border-radius: var(--radius-4);
  padding: var(--space-7) var(--space-6);
  text-align: center;
  display: flex;
  justify-content: center;
}

.entrance-demo-stage .utensil-entrance {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  max-width: 560px;
}

.entrance-heading {
  font-family: 'Merriweather', Georgia, serif;
  font-size: var(--font-size-6);
  font-weight: 300;
  line-height: var(--line-height-6);
  color: var(--pencil-12);
  letter-spacing: -0.02em;
}

.entrance-subtitle {
  color: var(--pencil-11);
  max-width: 440px;
}

.entrance-cards {
  display: flex;
  gap: var(--space-4);
  width: 100%;
  margin-block-start: var(--space-2);
}

.entrance-card {
  flex: 1;
  background: var(--panel-solid);
  border-radius: var(--radius-3);
  padding: var(--space-5) var(--space-4);
  text-align: start;
  box-shadow: var(--shadow-2);
}

.entrance-card h3 {
  font-size: var(--font-size-3);
  font-weight: 600;
  color: var(--pencil-12);
  margin-block-end: var(--space-2);
}

.entrance-card p {
  font-size: var(--font-size-2);
  color: var(--pencil-11);
  line-height: var(--line-height-3);
}

.entrance-card-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-block-end: var(--space-3);
}

.entrance-card-icon svg {
  width: 20px;
  height: 20px;
}

.entrance-card-icon.primary {
  background: var(--pen-a3);
  color: var(--pen-a11);
}

.entrance-card-icon.secondary {
  background: var(--pencil-a3);
  color: var(--pencil-a11);
}
</style>
