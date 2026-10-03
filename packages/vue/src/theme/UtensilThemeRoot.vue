<template>
  <UtensilTheme class="utensil-theme-root" v-bind="props">
    <UtensilModalHost v-if="modalHost">
      <slot></slot>
    </UtensilModalHost>
    <slot v-else></slot>
  </UtensilTheme>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import '../utensil-css-include'
import type {
  ColorProp,
  ThemeConfig,
  ThemeName,
  ThemeMode,
  VariantMap,
  IconMap,
  TextThemeProp,
  ScaleProp,
  RadiusScaleProp,
  ThemeContrast,
  ThemeReducedMotion,
  TextThemeClasses,
} from './utensil-theme'
import UtensilTheme from './UtensilTheme.vue'
import UtensilModalHost from '../components/dialogs/UtensilModalHost.vue'

/**
 * Repeated definition of ThemeProps as Vue's SFC compiler can't resolve the type from the import.
 * @see ThemeProps from './utensil-theme'
 * @link https://github.com/vuejs/core/issues/8286#issuecomment-1545659320
 */
export interface Props<Theme extends ThemeConfig> {
  mode?: ThemeMode
  name?: ThemeName
  pen?: ColorProp<Theme>
  pencil?: ColorProp<Theme>
  paper?: ColorProp<Theme>
  contrast?: ThemeContrast
  reducedMotion?: ThemeReducedMotion
  text?: TextThemeProp<Theme>
  textThemeClasses?: TextThemeClasses<Theme>
  variants?: Partial<VariantMap<Theme>>
  icons?: Partial<IconMap<Theme>>
  scale?: ScaleProp
  radiusScale?: RadiusScaleProp
  /** Include a modal host element inside the theme root for teleporting dialogs/modals */
  modalHost?: boolean
}

const props = defineProps<Props<Theme>>()
</script>
