<template>
  <UtensilToggleButton
    class="utensil-toggle-mode-button"
    :variation="variation"
    :icon="mode === 'dark' ? 'moon' : 'sun'"
    :scale="scale"
    :modelValue="mode === 'dark'"
    @click="toggleTheme"
  />
</template>

<script lang="ts" setup>
import type { UtensilUIVariation, ScaleProp } from '../../theme/utensil-theme'
import { useUserThemePreferences } from '../../theme/useUserThemePreferences'
import UtensilToggleButton from '../toggle-button/UtensilToggleButton.vue'

const { scale = 1, variation = 'text' } = defineProps<{ scale?: ScaleProp; variation?: UtensilUIVariation }>()

const { mode, setMode } = useUserThemePreferences()

function toggleTheme() {
  setMode(mode.value === 'dark' ? 'light' : 'dark')
}
</script>

<style scoped>
@layer utensil {
  .utensil-toggle-mode-button {
    --utensil-toggle-button-label-display: var(--utensil-toggle-mode-button-label-display, block);
  }
}
</style>
