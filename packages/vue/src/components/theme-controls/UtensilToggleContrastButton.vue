<template>
  <UtensilToggleButton
    class="utensil-toggle-contrast-button"
    :variation="variation"
    :icon="contrast === 'high' ? 'circle' : 'circle-half-stroke'"
    :scale="scale"
    :modelValue="contrast === 'high'"
    @click="toggleContrast"
  />
</template>

<script lang="ts" setup>
import type { UtensilUIVariation, ScaleProp } from '../../theme/utensil-theme'
import { useUserThemePreferences } from '../../theme/useUserThemePreferences'
import UtensilToggleButton from '../toggle-button/UtensilToggleButton.vue'

const { scale = 1, variation = 'text' } = defineProps<{ scale?: ScaleProp; variation?: UtensilUIVariation }>()

const { contrast, toggleContrast } = useUserThemePreferences()
</script>

<style scoped>
@layer utensil {
  .utensil-toggle-contrast-button {
    --utensil-toggle-button-label-display: var(--utensil-toggle-contrast-button-label-display, block);
  }
}
</style>
