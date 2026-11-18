<template generic="Theme extends ThemeConfig">
  <button
    v-bind="$attrs"
    class="utensil-button"
    :class="[
      ...themeClasses,
      `ui-${variation}`,
      {
        // Disabled buttons drop the interactive styling so hover states don't light them up.
        interactive: !disabled && !ariaDisabled && !blocked && !busy,
        busy: busy,
        disabled: (disabled || ariaDisabled || blocked) && !busy,
        selected: pressed === true,
        'icon-only': iconOnly,
        'icon-start': icon && !iconOnly && iconPosition === 'start',
        'icon-end': icon && !iconOnly && iconPosition === 'end',
        round: round && iconOnly,
        compact,
        block,
      },
    ]"
    :style="style"
    :disabled="disabled || busy"
    :aria-disabled="(ariaDisabled && !disabled && !busy) || undefined"
    :aria-pressed="pressed"
    :aria-describedby="describedBy"
    :autofocus="autofocus"
    @click="handleClick"
  >
    <UtensilSpinner v-if="busy" scale="micro" aria-hidden="true" />
    <template v-if="icon && (iconOnly || iconPosition === 'start')">
      <UtensilIcon v-if="icon" :icon="icon" />
    </template>
    <span :class="{ 'screen-reader': iconOnly }">
      <slot>
        {{ label }}
      </slot>
    </span>
    <UtensilIcon v-if="icon && iconPosition === 'end' && !iconOnly" :icon="icon" />
  </button>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed, useAttrs, type CSSProperties } from 'vue'
import UtensilIcon from '../icon/UtensilIcon.vue'
import UtensilSpinner from '../spinner/UtensilSpinner.vue'
import type { IconProp, ColorProp, ThemeConfig, ScaleProp, UtensilUIVariation } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'

export interface Props<Theme extends ThemeConfig> {
  label?: string
  variation?: UtensilUIVariation
  color?: ColorProp<Theme>
  justify?: 'start' | 'center' | 'end' | 'space-between'
  icon?: IconProp<Theme>
  iconPosition?: 'start' | 'end'
  iconOnly?: boolean
  round?: boolean
  /** Makes the button a toggle, announced pressed or not pressed; leave it unset for a button that isn't one */
  pressed?: boolean
  busy?: boolean
  disabled?: boolean
  /** Looks and is announced disabled, and emits no click, but stays focusable so it can be found and its tooltip read */
  ariaDisabled?: boolean
  /** Not ready yet: looks unavailable but is announced as an ordinary button and emits click, so it can say why */
  blocked?: boolean
  /** Id of the element that says why a blocked button isn't ready, set as its aria-describedby while blocked */
  blockedDescribedBy?: string
  autofocus?: boolean
  scale?: ScaleProp
  block?: boolean
  compact?: boolean
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  variation: 'solid',
  color: 'pen',
  iconPosition: 'start',
  iconOnly: false,
  round: false,
  pressed: undefined,
  busy: false,
  disabled: false,
  ariaDisabled: false,
  blocked: false,
  autofocus: false,
  justify: 'center',
  scale: 1,
  block: false,
})

defineOptions({ inheritAttrs: false })

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const attrs = useAttrs()

// A blocked button's reason joins any description the consumer gives it
const describedBy = computed(() => {
  const ids = [attrs['aria-describedby'], props.blocked ? props.blockedDescribedBy : undefined]
  return ids.filter((id) => typeof id === 'string' && id !== '').join(' ') || undefined
})

const penColor = computed<ColorProp<Theme>>(() => {
  return props.color || 'pen'
})

// Use theme to apply color prop and scale as theme
const { classes: themeClasses, style: themeStyle } = useTheme({
  pen: penColor,
  // Scale is relative so that we preserve overall UI scale
  relativeScale: () => props.scale,
})

const style = computed<CSSProperties>(() => {
  const style = {
    ...themeStyle.value,
    justifyContent: 'center',
  }

  if (props.justify === 'start') {
    style.justifyContent = 'flex-start'
  }

  if (props.justify === 'end') {
    style.justifyContent = 'flex-end'
  }

  if (props.justify == 'space-between') {
    style.justifyContent = 'space-between'
  }

  return style
})

function handleClick(event: MouseEvent): void {
  // Neither an unavailable nor a not-ready action submits its form
  if (props.ariaDisabled || props.blocked) {
    event.preventDefault()
  }
  if (props.disabled || props.busy || props.ariaDisabled) {
    return
  }
  emit('click', event)
}
</script>

<style scoped>
@layer utensil {
  .utensil-button {
    --font-size: var(--utensil-button-font-size, var(--font-size-2));
    --label-display: var(--utensil-button-label-display, inline-block);

    display: inline-flex;
    /* The button's own pressed style stands in for the touch tap flash */
    -webkit-tap-highlight-color: transparent;
    align-items: center;
    justify-content: center;
    gap: var(--space-1);
    outline: 2px solid transparent;
    outline-offset: 3px;
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-3);
    font-family: inherit;
    font-weight: 500;
    font-size: var(--font-size);
    line-height: normal;
    text-decoration: none;
    cursor: pointer;
    white-space: nowrap;
    user-select: none;
    position: relative;
    border: none;
    transition:
      background-color 0.2s ease,
      color 0.2s ease,
      outline-color 0.1s ease;

    span {
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  :where(.utensil-button) {
    background-color: transparent;
    color: var(--pencil-11);
  }

  .utensil-button.compact:not(.icon-only) {
    padding: var(--space-1) var(--space-4);
  }

  .utensil-button.block {
    width: 100%;
    flex-grow: 1;
  }

  .utensil-button.icon-only {
    align-items: baseline;
    padding: var(--space-2);
    width: var(--space-6);
    height: var(--space-6);
  }

  .utensil-button.icon-only .utensil-icon {
    font-size: calc(var(--font-size) + 2px);
  }

  /* Interaction styles - accessible keyboard navigation */
  .utensil-button:focus-visible {
    outline-color: var(--pen-8);
  }

  /* Outline/surface/soft/text — inset focus ring */
  .utensil-button.ui-outline,
  .utensil-button.ui-surface,
  .utensil-button.ui-soft,
  .utensil-button.ui-text {
    outline-offset: -2px;
  }

  .utensil-button.ui-outline:focus-visible {
    outline-style: solid;
  }

  .utensil-button.round {
    border-radius: 50%;
  }

  /* States — the theme's .disabled.ui-* rules draw the disabled look */
  .utensil-button.disabled {
    cursor: default;
  }

  .utensil-button.busy {
    pointer-events: none;
    filter: saturate(0.6) brightness(1.1);
  }

  .utensil-button.busy span,
  .utensil-button.busy .utensil-icon {
    opacity: 0;
  }

  .utensil-button.busy .utensil-spinner {
    position: absolute;
  }

  /* Where the fill is the pen itself, the spinner draws in the label's contrast color */
  .utensil-button.ui-solid,
  .utensil-button.ui-overlay {
    --utensil-spinner-color: currentColor;
    --utensil-spinner-track-color: color-mix(in srgb, currentColor 25%, transparent);
  }

  .utensil-button span {
    display: var(--utensil-button-label-display);
  }
}
</style>
