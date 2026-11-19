<template generic="Theme extends ThemeConfig">
  <div
    class="utensil-toggle-button"
    :class="[
      $attrs.class,
      {
        disabled: disabled || ariaDisabled || blocked,
        'aria-disabled': ariaDisabled && !disabled,
        blocked: blocked && !disabled,
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
      :aria-disabled="ariaDisabled"
      :blocked="blocked"
      :blocked-described-by="blockedDescribedBy"
      :round="round"
      :pressed="role === 'button' ? model : undefined"
      :role="role === 'radio' ? 'radio' : undefined"
      :aria-checked="role === 'radio' ? model : undefined"
      :class="{ selected: role === 'radio' && model }"
      :autofocus="autofocus"
      @click="toggle"
    >
      <slot>{{ label || 'Toggle' }}</slot>
    </UtensilButton>
    <!-- The button is already named by the label; this visible copy routes its clicks to the button, unread -->
    <span v-if="label" class="utensil-toggle-button-label" aria-hidden="true" @click="clickButton">{{ label }}</span>
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
  /** Drawn disabled and announced unavailable, and neither toggles nor emits click, but stays focusable */
  ariaDisabled?: boolean
  /** Not ready yet: drawn unavailable and doesn't toggle, but is announced as an ordinary toggle and emits click */
  blocked?: boolean
  /** Id of the element that says why a blocked toggle isn't ready */
  blockedDescribedBy?: string
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
  ariaDisabled: false,
  blocked: false,
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

function toggle() {
  if (!props.disabled && !props.ariaDisabled && !props.blocked) {
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
  }

  /* An aria-disabled or blocked label still routes its clicks through the button */
  .utensil-toggle-button.disabled:not(.aria-disabled, .blocked) .utensil-toggle-button-label {
    pointer-events: none;
  }
}
</style>
