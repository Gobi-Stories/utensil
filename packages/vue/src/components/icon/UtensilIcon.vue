<template>
  <FontAwesomeIcon
    v-if="iconDefinition"
    class="utensil-icon font-awesome"
    :class="[...classes, { colored: !!props.color }]"
    :style="style"
    :icon="iconDefinition"
    :role="role"
    aria-hidden="true"
  />
  <span
    v-else-if="$slots.default"
    class="utensil-icon custom"
    :class="[...classes, { colored: !!props.color }]"
    :style="style"
    :role="role"
    aria-hidden="true"
  >
    <slot />
  </span>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed, inject, type ComputedRef } from 'vue'
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion'
import { useTheme } from '../../theme/useTheme'
import {
  type ThemeConfig,
  type IconProp,
  type ThemeState,
  ThemeStateKey,
  type ColorProp,
} from '../../theme/utensil-theme'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps<{
  icon?: IconProp<Theme>
  color?: ColorProp<Theme>
  role?: string
}>()

// Use the theme composable to apply theme classes directly to the icon
// Pass props as getters to maintain reactivity
const { classes, style } = useTheme({
  pen: () => props.color,
})

const contextState = inject<ComputedRef<ThemeState<Theme>> | undefined>(ThemeStateKey)

const iconDefinition = computed(() => {
  if (!props.icon) return undefined
  return contextState?.value?.icons[props.icon] || faQuestion
})
</script>

<style>
@layer utensil {
  .utensil-icon.colored {
    color: var(--pen-indicator);
    line-height: normal;
  }

  /* Match Font Awesome's .svg-inline--fa sizing so custom SVGs align consistently */
  .utensil-icon.custom {
    display: inline-block;
    height: 1em;
    width: 1.25em;
    vertical-align: -0.125em;
    overflow: visible;
    box-sizing: content-box;
    text-align: center;
    line-height: normal;
  }

  .utensil-icon.custom > svg {
    height: 1em;
    width: 1em;
    vertical-align: top;
  }
}
</style>
