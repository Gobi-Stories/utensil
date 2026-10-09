<template>
  <!-- @vue-generic {import('./acme-theme').AcmeThemeConfig} -->
  <UtensilThemeRoot name="acme" pen="blue" pencil="gray" :mode="mode" :variants="acmeVariantMap" :icons="acmeIconMap">
    <slot></slot>
  </UtensilThemeRoot>
</template>

<script setup lang="ts">
import UtensilThemeRoot from '@gobistories/utensil-vue/theme/UtensilThemeRoot.vue'
import { useUtensilIcons } from '@gobistories/utensil-vue/components/icon/use-utensil-icons'
import type { ThemeMode } from '@gobistories/utensil-vue/theme/utensil-theme'
import { acmeVariantMap } from './acme-theme'
import { acmeIconMap } from './acme-icons'

defineProps<{ mode?: ThemeMode }>()

useUtensilIcons(document.head)
</script>
