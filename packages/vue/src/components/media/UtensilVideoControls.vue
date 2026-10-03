<template generic="Theme extends ThemeConfig">
  <div class="utensil-video-controls" :class="{ disabled }" :style="themeStyle">
    <UtensilButton
      class="utensil-video-controls-button"
      variation="text"
      :icon="playing ? 'pause' : 'play'"
      :aria-label="playing ? 'Pause' : 'Play'"
      :disabled="disabled"
      iconOnly
      round
      @click="togglePlaying"
    />

    <span class="utensil-video-controls-time" aria-hidden="true">{{ formatTime(currentTime) }}</span>

    <UtensilRangeSlider
      class="utensil-video-controls-scrubber"
      :class="themeClasses"
      :modelValue="currentTime"
      :min="0"
      :max="effectiveMax"
      :step="0.01"
      :disabled="disabled || duration <= 0"
      ariaLabel="Seek"
      rounded
      @update:modelValue="$emit('update:currentTime', $event)"
    />

    <span class="utensil-video-controls-time" aria-hidden="true">{{ formatTime(duration) }}</span>

    <UtensilButton
      class="utensil-video-controls-button"
      variation="text"
      :icon="muted ? 'volume-mute' : 'volume-high'"
      :aria-label="muted ? 'Unmute' : 'Mute'"
      :disabled="disabled"
      iconOnly
      round
      @click="toggleMuted"
    />
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed } from 'vue'
import type { ColorProp, ScaleProp, ThemeConfig } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'
import UtensilButton from '../button/UtensilButton.vue'
import UtensilRangeSlider from '../range-slider/UtensilRangeSlider.vue'

export interface Props<Theme extends ThemeConfig> {
  playing: boolean
  muted: boolean
  currentTime: number
  duration: number
  disabled?: boolean
  color?: ColorProp<Theme>
  scale?: ScaleProp
}

const props = defineProps<Props<Theme>>()

const emit = defineEmits<{
  'update:playing': [playing: boolean]
  'update:muted': [muted: boolean]
  'update:currentTime': [time: number]
}>()

const penColor = computed<ColorProp<Theme> | undefined>(() => props.color)

const { classes: themeClasses, style: themeStyle } = useTheme({
  pen: penColor,
  relativeScale: () => props.scale,
})

// Avoid a 0-range slider before metadata loads — keeps the thumb pinned at 0
// rather than letting the input go undefined.
const effectiveMax = computed(() => (props.duration > 0 ? props.duration : 1))

function togglePlaying() {
  emit('update:playing', !props.playing)
}

function toggleMuted() {
  emit('update:muted', !props.muted)
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
  return `${m}:${s.toString().padStart(2, '0')}`
}
</script>

<style scoped>
@layer utensil {
  .utensil-video-controls {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
  }

  .utensil-video-controls.disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  .utensil-video-controls-time {
    font-size: var(--font-size-1);
    font-variant-numeric: tabular-nums;
    color: var(--pencil-a12);
    min-width: 3.5ch;
    text-align: center;
  }

  .utensil-video-controls-scrubber {
    flex: 1;
  }
}
</style>
