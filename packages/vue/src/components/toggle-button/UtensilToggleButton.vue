<template generic="Theme extends ThemeConfig">
  <div
    class="utensil-toggle-button"
    :class="[
      $attrs.class,
      {
        disabled,
        'label-start': label && labelPosition === 'start',
        'label-end': label && labelPosition === 'end',
      },
    ]"
  >
    <UtensilButton
      ref="buttonRef"
      v-bind="$attrs"
      :icon="icon"
      icon-only
      :variation="buttonVariation"
      :color="buttonColor"
      :scale="scale"
      :disabled="disabled"
      :round="round"
      :pressed="pressedValue"
      :role="role === 'radio' ? 'radio' : undefined"
      :autofocus="autofocus"
      @click="toggle"
    >
      <slot>{{ label || 'Toggle' }}</slot>
    </UtensilButton>
    <span v-if="label" class="utensil-toggle-button-label" @click="clickButton">{{ label }}</span>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed, useTemplateRef } from 'vue'
import type { IconProp, ColorProp, ThemeConfig, ScaleProp, UtensilUIVariation } from '../../theme/utensil-theme'
import UtensilButton from '../button/UtensilButton.vue'

export type ToggleRole = 'button' | 'radio'

export interface Props<Theme extends ThemeConfig> {
  icon: IconProp<Theme>
  label?: string
  labelPosition?: 'start' | 'end'
  variation?: UtensilUIVariation
  color?: ColorProp<Theme>
  /** Variation while on, falling back to `variation` */
  onVariation?: UtensilUIVariation
  /** Variation while off, falling back to `variation` */
  offVariation?: UtensilUIVariation
  /** Color while on, falling back to `color` */
  onColor?: ColorProp<Theme>
  /** Color while off, falling back to `color` */
  offColor?: ColorProp<Theme>
  scale?: ScaleProp
  disabled?: boolean
  round?: boolean
  autofocus?: boolean
  /** Controls ARIA semantics: 'button' uses aria-pressed, 'radio' uses aria-checked with role="radio" */
  role?: ToggleRole
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  labelPosition: 'start',
  variation: 'soft',
  color: 'pen',
  disabled: false,
  round: false,
  autofocus: false,
  scale: 1,
  role: 'button',
})

defineOptions({ inheritAttrs: false })

const model = defineModel<boolean>({ default: false })

const buttonVariation = computed<UtensilUIVariation>(() => {
  if (model.value) {
    return props.onVariation ?? props.variation
  }
  // A solid toggle rests as text so only the on state carries the fill.
  return props.offVariation ?? (props.variation === 'solid' ? 'text' : props.variation)
})

const buttonColor = computed<ColorProp<Theme>>(() => {
  if (model.value) {
    return props.onColor ?? props.color
  }
  return props.offColor ?? props.color
})

const pressedValue = computed(() => {
  if (props.role === 'radio') {
    return model.value ? 'checked' : 'unchecked'
  }
  return model.value ? 'pressed' : false
})

function toggle() {
  if (!props.disabled) {
    model.value = !model.value
  }
}

const buttonRef = useTemplateRef<{ $el: HTMLButtonElement }>('buttonRef')

// Route label clicks through the button so listeners bound by the consumer fire too.
function clickButton() {
  buttonRef.value?.$el.click()
}
</script>

<style scoped>
@layer utensil {
  .utensil-toggle-button {
    --label-display: var(--utensil-toggle-button-label-display, block);

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    line-height: normal;
  }

  .utensil-toggle-button.label-start .utensil-toggle-button-label {
    order: -1;
  }

  .utensil-toggle-button-label {
    display: var(--label-display);
    font-size: var(--font-size-2);
    font-weight: 500;
    color: var(--pencil-11);
    cursor: pointer;
    user-select: none;
  }

  .utensil-toggle-button.disabled .utensil-toggle-button-label {
    opacity: 0.5;
    cursor: default;
    pointer-events: none;
  }
}
</style>
