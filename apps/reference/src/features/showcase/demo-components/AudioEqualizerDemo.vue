<template>
  <div class="audio-equalizer-demo">
    <div class="demo-header">
      <div class="header-text">
        <h3 class="demo-title"><span>Equalizer</span></h3>
        <p class="demo-subtitle">Shape your sound</p>
      </div>
      <button class="reset-button" :class="{ visible: hasChanges }" @click="resetBands">Reset</button>
    </div>

    <ReferenceAudioEqualizer v-model="bandValues" :bands="bands" :min="-12" :max="12" color="primary" />

    <ReferenceRadioGroup v-model="activePreset" aria-label="Equalizer presets" :scale="0.85">
      <ReferenceRadioGroupButton
        v-for="preset in presets"
        :key="preset.name"
        :value="preset.name"
        :label="preset.name"
      />
    </ReferenceRadioGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ReferenceAudioEqualizer } from '@/theme/components/ReferenceAudioEqualizer'
import { ReferenceRadioGroup } from '@/theme/components/ReferenceRadioGroup'
import { ReferenceRadioGroupButton } from '@/theme/components/ReferenceRadioGroupButton'
import type { AudioBand } from 'utensil-vue/components/audio-equalizer/audio-equalizer'

const bands: AudioBand[] = [
  { label: 'Bass' },
  { label: 'Low' },
  { label: 'Mid' },
  { label: 'High' },
  { label: 'Treble' },
]

const defaultValues = [0, 0, 0, 0, 0]
const bandValues = ref([...defaultValues])
const activePreset = ref<string>()

interface Preset {
  name: string
  values: number[]
}

const presets: Preset[] = [
  { name: 'Dialogue', values: [-3, 1, 5, 3, 0] },
  { name: 'Cinematic', values: [6, 3, -1, 2, 4] },
  { name: 'Voiceover', values: [-4, 0, 6, 4, -2] },
  { name: 'Ambient', values: [3, 4, 0, -2, -3] },
]

const hasChanges = computed(() => bandValues.value.some((v) => v !== 0))

watch(activePreset, (name) => {
  const preset = presets.find((p) => p.name === name)
  if (preset) {
    bandValues.value = [...preset.values]
  }
})

function resetBands() {
  bandValues.value = [...defaultValues]
  activePreset.value = undefined
}
</script>

<style scoped>
.audio-equalizer-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-5);
}

.demo-header {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  width: 100%;
}

.header-icon {
  color: var(--pen-9);
  font-size: var(--font-size-4);
}

.header-text {
  flex: 1;
}

.demo-title {
  font-size: var(--font-size-4);
  color: var(--pencil-12);
  line-height: var(--line-height-2);

  span {
    vertical-align: baseline;
  }
}

.demo-subtitle {
  font-size: var(--font-size-2);
  color: var(--pencil-a11);
}

.reset-button {
  font-size: var(--font-size-1);
  font-weight: 500;
  color: var(--pen-11);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-2);
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 0.2s ease,
    background-color 0.15s ease;
}

.reset-button.visible {
  opacity: 1;
  pointer-events: auto;
}

.reset-button:hover {
  background-color: var(--pencil-a3);
}

/* Reduced motion */
.utensil-reduced-motion .reset-button {
  transition: none;
}
</style>
