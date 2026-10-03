<template>
  <UtensilToggleButton
    class="utensil-toggle-reduced-motion-button"
    :variation="variation"
    :icon="reducedMotion === 'reduced' ? 'circle-pause' : 'circle-play'"
    :scale="scale"
    @click="toggleReducedMotion"
  />
</template>

<script lang="ts" setup>
import type { UtensilUIVariation, ScaleProp } from '../../theme/utensil-theme'
import { useUserThemePreferences } from '../../theme/useUserThemePreferences'
import UtensilToggleButton from '../toggle-button/UtensilToggleButton.vue'

const { scale = 1, variation = 'text' } = defineProps<{ scale?: ScaleProp; variation?: UtensilUIVariation }>()

const { reducedMotion, toggleReducedMotion } = useUserThemePreferences()
</script>

<style scoped>
@layer utensil {
  .utensil-toggle-reduced-motion-button {
    --utensil-toggle-button-label-display: var(--utensil-toggle-reduced-motion-button-label-display, block);
  }
}
</style>
