<template>
  <!-- @vue-generic {import('./reference-theme').ReferenceThemeConfig} -->
  <UtensilThemeRoot
    class="reference-theme-root"
    :mode="mode"
    name="reference"
    :pen="referenceDefaultPen"
    :pencil="referenceDefaultPencil"
    :paper="referenceDefaultPaper"
    :contrast="contrast"
    :reduced-motion="reducedMotion"
    :variants="referenceVariantMap"
    :icons="referenceIconMap"
    :textThemeClasses="referenceTextThemeClasses"
    :radiusScale="radiusScale"
    modal-host
  >
    <slot></slot>
  </UtensilThemeRoot>
</template>

<script setup lang="ts">
import UtensilThemeRoot from 'utensil-vue/theme/UtensilThemeRoot.vue'
// After UtensilThemeRoot so the reference CSS loads after the Utensil base CSS and wins specificity ties
import './reference-css-include'
import type { RadiusScaleProp, ThemeContrast, ThemeMode, ThemeReducedMotion } from 'utensil-vue/theme/utensil-theme'
import {
  referenceDefaultPen,
  referenceDefaultPencil,
  referenceDefaultPaper,
  referenceTextThemeClasses,
  referenceVariantMap,
} from './reference-theme'
import { referenceIconMap } from './reference-icons'
import { useUtensilIcons } from 'utensil-vue/components/icon/use-utensil-icons'

defineProps<{
  mode?: ThemeMode
  contrast?: ThemeContrast
  reducedMotion?: ThemeReducedMotion
  radiusScale?: RadiusScaleProp
}>()

useUtensilIcons(document.head)
</script>
