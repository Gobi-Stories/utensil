<template>
  <div :class="classes.join(' ')" :style="style">
    <slot></slot>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { useTheme } from './useTheme'
import type {
  ColorProp,
  ThemeName,
  ThemeMode,
  VariantMap,
  TextTheme,
  IconMap,
  ThemeConfig,
  ScaleProp,
  RadiusScaleProp,
  ThemeContrast,
  ThemeReducedMotion,
  TextThemeClasses,
} from './utensil-theme'

/**
 * UtensilTheme component provides a scoped theme context with a wrapper div.
 * For components that need theme support without a wrapper div, use the useTheme composable directly.
 */
type Props = {
  mode?: ThemeMode
  name?: ThemeName
  pen?: ColorProp<Theme>
  pencil?: ColorProp<Theme>
  paper?: ColorProp<Theme>
  contrast?: ThemeContrast
  reducedMotion?: ThemeReducedMotion
  text?: TextTheme<Theme>
  textThemeClasses?: TextThemeClasses<Theme>
  variants?: Partial<VariantMap<Theme>>
  icons?: Partial<IconMap<Theme>>
  scale?: ScaleProp
  relativeScale?: ScaleProp
  radiusScale?: RadiusScaleProp
  relativeRadiusScale?: RadiusScaleProp
}

const props = defineProps<Props>()

const { classes, style } = useTheme(props)
</script>

<style></style>
