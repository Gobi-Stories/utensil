<template>
  <ReferenceComponentDemo
    title="Audio Equalizer"
    anchor="audio-equalizer"
    description="Vertical slider equalizer for adjusting audio frequency bands."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content eq-demo">
          <ReferenceAudioEqualizer v-model="eqBands" color="primary" />
        </div>
        <div class="demo-label always-visible">Audio Equalizer</div>
        <div class="demo-code">
          <code>&lt;UtensilAudioEqualizer v-model="bands" /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilAudioEqualizerDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ReferenceAudioEqualizer } from '@/theme/components/ReferenceAudioEqualizer'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import UtensilAudioEqualizerDoc from 'utensil-vue/components/audio-equalizer/UtensilAudioEqualizerDoc.vue'

const eqBands = ref([0, 0, 0, 0, 0])
</script>

<style scoped>
.demo-content.eq-demo {
  min-height: 220px;
  padding: var(--space-4);
}
</style>
