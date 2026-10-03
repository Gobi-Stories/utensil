<template generic="Theme extends ThemeConfig">
  <UtensilAvatar
    :src="src"
    :alt="alt"
    :fallback="fallback"
    variation="solid"
    :color="color"
    :radius="effectiveRadius"
    :scale="effectiveScale"
    :delay-ms="delayMs"
    @load="emit('load')"
    @error="emit('error')"
  >
    <template v-if="$slots.fallback" #fallback>
      <slot name="fallback" />
    </template>
  </UtensilAvatar>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed, inject } from 'vue'
import type { ColorProp, ThemeConfig, ScaleProp } from '../../theme/utensil-theme'
import type { AvatarRadius } from './utensil-avatar-stack'
import { UtensilAvatarStackContextKey } from './utensil-avatar-stack'
import UtensilAvatar from './UtensilAvatar.vue'

export interface Props<Theme extends ThemeConfig> {
  src?: string
  alt?: string
  fallback?: string
  color?: ColorProp<Theme>
  /** Override the stack radius */
  radius?: AvatarRadius
  /** Override the stack scale */
  scale?: ScaleProp
  delayMs?: number
}

const { color = 'pen', delayMs = 0, radius, scale } = defineProps<Props<Theme>>()

const emit = defineEmits<{
  load: []
  error: []
}>()

const context = inject(UtensilAvatarStackContextKey, null)

const effectiveRadius = computed(() => radius ?? context?.radius.value ?? 'full')
const effectiveScale = computed<ScaleProp>(() => scale ?? context?.scale.value ?? 1)
</script>
