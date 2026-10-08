<template generic="Theme extends ThemeConfig">
  <component
    :is="as"
    class="utensil-box"
    :class="[
      ...themeClasses,
      `ui-${variation}`,
      {
        pencil: !highlighted && !selected,
        interactive: (interactive || clickable) && !disabled,
        wireframe,
        shadowed: !!shadow,
        elevated: !!elevation,
        selected,
        disabled,
      },
    ]"
    :style="[style, shadowStyle, elevationStyle]"
    :type="as === 'button' ? 'button' : undefined"
    :disabled="as === 'button' ? disabled : undefined"
    :aria-disabled="disabled && as !== 'button' ? 'true' : undefined"
    :aria-pressed="(as === 'button' || clickable) && selected !== undefined ? selected : undefined"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    v-bind="disabled ? attrsWithoutHref() : $attrs"
    @click.capture="blockDisabledClick"
    @keydown="clickFromKeyboard"
    @keyup="clickFromSpaceRelease"
    @blur="cancelSpacePress"
  >
    <slot></slot>
  </component>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed, useAttrs, type Component } from 'vue'
import type { ColorProp, ThemeConfig, ScaleProp, UtensilUIVariation, RadiusScaleProp } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'

/** A level of the theme's shadow scales, from 1 to 6: `--shadow-border-n` for `shadow`, `--shadow-n` for `elevation`. */
export type BoxShadow = 1 | 2 | 3 | 4 | 5 | 6

export interface Props<Theme extends ThemeConfig> {
  /** Theme color, used when highlighted. */
  color?: ColorProp<Theme>
  variation?: UtensilUIVariation
  scale?: ScaleProp
  radiusScale?: RadiusScaleProp
  /** Edges and elevation from the theme's shadow-border scale. Replaces the variation's own border. */
  shadow?: BoxShadow
  /** Elevation from the theme's shadow scale, without an edge, so the variation keeps its own border. */
  elevation?: BoxShadow
  /** Pen colors instead of the resting pencil colors, and a pen edge on a shadowed box. */
  highlighted?: boolean
  /** The pressed or chosen state of a box that toggles. Sets `aria-pressed` on a button or clickable box. */
  selected?: boolean
  /** Hover and active feedback. Focus and activation come from the element: see `as` and `clickable`. */
  interactive?: boolean
  /** A box that acts as a button when it can't be one: a button role, keyboard focus, and Enter or Space to click. */
  clickable?: boolean
  /** Muted, and blocks clicks. */
  disabled?: boolean
  /** Keep outline backgrounds transparent on interaction. */
  wireframe?: boolean
  /** The element or component to render: `button` or a link component for an interactive box. */
  as?: string | Component
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  color: 'pen',
  variation: 'unstyled',
  scale: 1,
  shadow: undefined,
  elevation: undefined,
  selected: undefined,
  as: 'div',
})

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()

// A disabled link drops its href, so middle-click and "open in new tab" can't follow it either
function attrsWithoutHref() {
  return Object.fromEntries(Object.entries(attrs).filter(([name]) => name !== 'href'))
}

const penColor = computed<ColorProp<Theme>>(() => props.color || 'pen')

const { classes: themeClasses, style } = useTheme({
  pen: penColor,
  relativeScale: () => props.scale,
  radiusScale: () => props.radiusScale,
})

// The edge is always the first, inset layer, so resting and hover shadows have the same shape and animate
function shadowAt(level: number, edge: string) {
  const border = props.highlighted ? 'highlight-shadow-border' : 'shadow-border'
  return `inset 0 0 0 1px ${edge}, var(--${border}-${Math.min(level, 6)})`
}

// Interactive shadowed boxes rise two levels on hover, and their edge takes on the pen
const shadowStyle = computed(() =>
  props.shadow
    ? {
        '--box-shadow': shadowAt(props.shadow, props.highlighted ? 'var(--pen-a7)' : 'transparent'),
        '--box-shadow-hover': shadowAt(props.shadow + 2, props.highlighted ? 'var(--pen-a8)' : 'var(--pen-a6)'),
      }
    : {},
)

// Interactive elevated boxes rise two levels on hover, as shadowed boxes do
const elevationStyle = computed(() => {
  if (!props.elevation) return {}
  const scale = props.highlighted ? 'highlight-shadow' : 'shadow'
  return {
    '--box-elevation': `var(--${scale}-${props.elevation})`,
    '--box-elevation-hover': `var(--${scale}-${Math.min(props.elevation + 2, 6)})`,
  }
})

// Runs before the consumer's click listeners, so a disabled box never clicks (keyboard-triggered link clicks too)
function blockDisabledClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()
    event.stopImmediatePropagation()
  }
}

let spacePressed = false

// As a native button does: Enter clicks on keydown, Space on keyup, unless focus moved off in between
function clickFromKeyboard(event: KeyboardEvent) {
  // Keys pressed in a control inside the box are the control's
  if (!props.clickable || event.target !== event.currentTarget) return
  if (event.key === ' ') {
    event.preventDefault()
    spacePressed = true
  } else if (event.key === 'Enter') {
    event.preventDefault()
    click(event.currentTarget)
  }
}

function clickFromSpaceRelease(event: KeyboardEvent) {
  if (event.key !== ' ' || !spacePressed) return
  spacePressed = false
  if (event.target === event.currentTarget) click(event.currentTarget)
}

function cancelSpacePress() {
  spacePressed = false
}

function click(target: EventTarget | null) {
  if (!props.disabled && target instanceof HTMLElement) target.click()
}
</script>

<style scoped>
@layer utensil {
  .utensil-box {
    box-sizing: border-box;
    padding: var(--utensil-box-padding, var(--space-4));
    /* Content containers are less round than the controls they hold (--radius-3) */
    border-radius: var(--radius-2);
  }

  /* Native buttons and links take the box's look, not the browser's */
  :where(button.utensil-box, a.utensil-box) {
    display: block;
    appearance: none;
    border: none;
    margin: 0;
    background: none;
    font: inherit;
    color: inherit;
    text-align: inherit;
  }

  /* Out-specify the text themes' link styles */
  a.utensil-box,
  a.utensil-box:hover {
    text-decoration: none;
  }

  a.utensil-box.ui-unstyled,
  a.utensil-box.ui-unstyled:hover {
    color: inherit;
  }

  /* Outline and text use panel-solid background instead of transparent, until selected */
  .utensil-box.ui-outline:not(.selected) {
    background-color: var(--panel-solid);
  }

  .utensil-box.ui-text:not(.selected) {
    background-color: var(--panel-solid);
  }

  /* Shadow borders draw the edges, over the variation's own border. The :not()s out-specify the theme's resting
     pencil and disabled borders. */
  .utensil-box.shadowed:not(.interactive:hover):not(.interactive:active) {
    box-shadow: var(--box-shadow);
  }

  .utensil-box.shadowed.ui-unstyled {
    background-color: var(--panel-solid);
  }

  .utensil-box.shadowed.interactive:hover {
    box-shadow: var(--box-shadow-hover);
  }

  .utensil-box.shadowed.interactive:active {
    box-shadow: var(--box-shadow);
  }

  /* Elevation sits behind the content on a layer of its own, beside the variation's border */
  .utensil-box.elevated {
    position: relative;
    isolation: isolate;
  }

  .utensil-box.elevated::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    box-shadow: var(--box-elevation);
    pointer-events: none;
    transition: box-shadow 0.2s ease;
  }

  .utensil-box.elevated.ui-unstyled {
    background-color: var(--panel-solid);
  }

  .utensil-box.elevated.interactive:hover::after {
    box-shadow: var(--box-elevation-hover);
  }

  .utensil-box.elevated.interactive:active::after {
    box-shadow: var(--box-elevation);
  }

  /* Focus ring, for any box that takes focus: a button, a link, a clickable or a disabled clickable box */
  .utensil-box {
    outline: 2px solid transparent;
    outline-offset: -2px;
  }

  .utensil-box:focus-visible {
    outline-color: var(--pen-8);
  }

  /* Offset the focus ring from a filled background */
  .utensil-box.ui-solid {
    outline-offset: 3px;
  }

  /* Interactive base */
  .utensil-box.interactive {
    cursor: pointer;
    transition:
      outline-color 0.1s ease,
      background-color 0.15s ease,
      box-shadow 0.2s ease;
  }

  /* Interactive surface active */
  .utensil-box.interactive.ui-surface:active {
    filter: none;
  }

  /* The theme's .disabled.ui-* rules draw the disabled variations; an unstyled box has no colors to mute */
  .utensil-box.disabled {
    cursor: default;
  }

  .utensil-box.disabled.ui-unstyled {
    opacity: 0.5;
  }

  /* Reduced motion */
  .utensil-reduced-motion .utensil-box.interactive,
  .utensil-reduced-motion .utensil-box.elevated::after {
    transition: none;
  }
}
</style>
