<template generic="Theme extends ThemeConfig">
  <div
    ref="containerRef"
    class="utensil-radio-group"
    :class="[...themeClasses, { disabled, segmented: frame === 'segmented', invert }]"
    :style="style"
    :role="multiple ? 'group' : 'radiogroup'"
    :aria-label="ariaLabel"
    :aria-disabled="disabled || undefined"
    :aria-describedby="descriptionId"
    @keydown="onKeydown"
  >
    <slot
      :value="currentValue"
      :set-value="setValue"
      :variation="variation"
      :on-variation="onVariation"
      :off-variation="offVariation"
      :on-color="onColor"
      :off-color="offColor"
      :scale="scale"
      :disabled="disabled"
      :is-tabbable="isTabbable"
    />
    <span :id="descriptionId" class="screen-reader">
      Use arrow keys to navigate options. Home for first option, End for last option.
    </span>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { ref, computed, provide, useId } from 'vue'
import type { ColorProp, ThemeConfig, UtensilUIVariation, ScaleProp, RadiusScaleProp } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'
import { UtensilRadioGroupContextKey, type UtensilRadioGroupFrame } from './utensil-radio-group'

export interface Props<Theme extends ThemeConfig> {
  /** Accessible label for the radio group */
  ariaLabel?: string
  /** Visual variation for all children */
  variation?: Exclude<UtensilUIVariation, 'solid'>
  /** Accent color */
  color?: ColorProp<Theme>
  /** Variation for selected children, taking precedence over `variation` */
  onVariation?: UtensilUIVariation
  /** Variation for unselected children, taking precedence over `variation` */
  offVariation?: UtensilUIVariation
  /** Color for selected children */
  onColor?: ColorProp<Theme>
  /** Color for unselected children */
  offColor?: ColorProp<Theme>
  /** Scale for all children */
  scale?: ScaleProp
  /** Radius scale for all children */
  radiusScale?: RadiusScaleProp
  /** Whether all children are disabled */
  disabled?: boolean
  /** Whether keyboard navigation wraps around */
  loop?: boolean
  /** Selects multiple values via the selection model instead of a single value */
  multiple?: boolean
  /** Group chrome: `plain` (default) or `segmented` (inset frame with raised selected) */
  frame?: UtensilRadioGroupFrame
  /** Invert background and button colors */
  invert?: boolean
}

const {
  variation = 'soft',
  color = 'pen',
  onVariation,
  offVariation,
  onColor,
  offColor,
  disabled = false,
  loop = true,
  scale = 1,
  radiusScale = 1,
  ariaLabel,
  multiple = false,
  frame = 'plain',
  invert = false,
} = defineProps<Props<Theme>>()

const model = defineModel<string>()
// The selected values in multiple mode.
const selection = defineModel<string[]>('selection', { default: () => [] })

const containerRef = ref<HTMLElement>()
const descriptionId = `utensil-radio-group-${useId()}`

const currentValue = computed(() => model.value)

const penColor = computed<ColorProp<Theme>>(() => color || 'pen')

const { classes: themeClasses, style } = useTheme({
  pen: penColor,
  relativeRadiusScale: radiusScale,
})

function isSelected(value: string): boolean {
  return multiple ? selection.value.includes(value) : model.value === value
}

function setValue(value: string) {
  if (disabled) return

  if (multiple) {
    selection.value = selection.value.includes(value)
      ? selection.value.filter((candidate) => candidate !== value)
      : [...selection.value, value]
    return
  }

  model.value = value
}

function isTabbable(value: string): boolean {
  // Checkbox-style groups keep every option tabbable.
  if (multiple) return true
  if (currentValue.value === value) return true
  if (currentValue.value === undefined || currentValue.value === '') {
    const buttons = getButtons()
    return buttons.length > 0 && buttons[0].getAttribute('data-value') === value
  }
  return false
}

function getButtons(): HTMLElement[] {
  if (!containerRef.value) return []
  return Array.from(
    containerRef.value.querySelectorAll<HTMLElement>(
      '[role="radio"]:not([aria-disabled="true"]), [role="checkbox"]:not([aria-disabled="true"])',
    ),
  )
}

function onKeydown(event: KeyboardEvent) {
  const buttons = getButtons()
  if (buttons.length === 0) return

  const currentButton = document.activeElement as HTMLElement
  const currentIndex = buttons.indexOf(currentButton)
  if (currentIndex === -1) return

  let targetIndex: number | null = null

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault()
      if (currentIndex < buttons.length - 1) {
        targetIndex = currentIndex + 1
      } else if (loop) {
        targetIndex = 0
      }
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault()
      if (currentIndex > 0) {
        targetIndex = currentIndex - 1
      } else if (loop) {
        targetIndex = buttons.length - 1
      }
      break
    case 'Home':
      event.preventDefault()
      targetIndex = 0
      break
    case 'End':
      event.preventDefault()
      targetIndex = buttons.length - 1
      break
  }

  if (targetIndex !== null) {
    const targetButton = buttons[targetIndex]
    targetButton.focus()
    const value = targetButton.getAttribute('data-value')
    if (value) {
      setValue(value)
    }
  }
}

provide(UtensilRadioGroupContextKey<Theme>(), {
  value: currentValue,
  multiple: computed(() => multiple),
  isSelected,
  setValue,
  variation: computed(() => variation),
  onVariation: computed(() => onVariation),
  offVariation: computed(() => offVariation),
  onColor: computed(() => onColor),
  offColor: computed(() => offColor),
  scale: computed(() => scale),
  disabled: computed(() => disabled),
  isTabbable,
})
</script>

<style scoped>
@layer utensil {
  .utensil-radio-group {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    gap: var(--utensil-radio-group-gap, var(--space-1));
  }

  .utensil-radio-group.disabled {
    opacity: 0.5;
    cursor: default;
    pointer-events: none;
  }

  /*
   * Segmented frame — inset container with raised selected option. Per-button
   * chrome is neutralized so the frame provides the visual grouping. Behaviour
   * is unchanged from the plain frame; only the look differs.
   */
  .utensil-radio-group.segmented {
    display: inline-flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    padding: var(--utensil-radio-group-segmented-padding, 3px);
    gap: var(--utensil-radio-group-segmented-gap, 3px);
    background-color: var(--pencil-a2);
    border-radius: var(--radius-3);
    box-shadow: inset 0 0 0 1px var(--pencil-a4);
  }

  .utensil-radio-group.segmented :deep([role='radio']) {
    background-color: transparent;
    border-color: transparent;
    box-shadow: none;
    transition:
      background-color 120ms ease,
      color 120ms ease,
      box-shadow 120ms ease;
  }

  .utensil-radio-group.segmented :deep([role='radio']:hover:not([aria-checked='true']):not([aria-disabled='true'])) {
    background-color: var(--pencil-a3);
  }

  .utensil-radio-group.segmented.invert
    :deep([role='radio']:hover:not([aria-checked='true']):not([aria-disabled='true'])) {
    background-color: var(--pen-a3);
  }

  .utensil-radio-group.segmented :deep([role='radio'][aria-checked='true']) {
    background-color: var(--panel-solid);
    box-shadow: var(--shadow-border-1);
  }

  .utensil-radio-group.segmented:not(.invert) :deep([role='radio'][aria-checked='true']) {
    color: var(--pencil-a12);
  }

  .utensil-reduced-motion .utensil-radio-group.segmented :deep([role='radio']) {
    transition: none;
  }

  /* Segmented frame, inverted styles */
  .utensil-radio-group.segmented.invert {
    background-color: var(--pencil-a2);
    box-shadow: inset 0 0 0 1px var(--pen-a4);
  }

  .utensil-radio-group.segmented.invert :deep([role='radio']:not([aria-checked='true']):not([aria-disabled='true'])) {
    color: var(--pencil-a11);
  }

  .utensil-radio-group.segmented.invert :deep([role='radio'][aria-checked='true']) {
    box-shadow: var(--highlight-shadow-border-2);
    box-shadow: none;
    background-color: var(--pen-9);
    color: var(--pen-contrast);
  }
}
</style>
