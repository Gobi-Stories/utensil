<template>
  <div class="use-theme-block" :class="classes" :style="style">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@gobistories/utensil-vue/theme/useTheme'
import type { ScaleProp } from '@gobistories/utensil-vue/theme/utensil-theme'
import type { ReferenceColorProp, ReferenceThemeConfig } from '@/theme/reference-theme'

// Feeds its raw props object to useTheme() the way UtensilTheme does. `primary`
// is not a declared UseThemeProps key — it exercises the composable's dynamic
// per-variant prop resolution.
interface Props {
  pen?: ReferenceColorProp
  pencil?: ReferenceColorProp
  relativeScale?: ScaleProp
  primary?: ReferenceColorProp
}

const props = defineProps<Props>()

const { classes, style } = useTheme<ReferenceThemeConfig>(props)
</script>
