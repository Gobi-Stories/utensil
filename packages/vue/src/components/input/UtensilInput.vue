<template generic="Theme extends ThemeConfig">
  <div class="utensil-input" :class="{ 'label-inline': label && labelPlacement === 'inline', disabled }">
    <label v-if="label" :for="inputId" class="utensil-input-label">{{ label }}</label>
    <div
      class="utensil-input-control"
      :class="[
        ...themeClasses,
        variation,
        {
          large: height === 'large',
          'icon-start': icon && iconPosition === 'start',
          'icon-end': icon && iconPosition === 'end',
          'has-value': !!model,
          invalid: ariaInvalid,
        },
      ]"
      :style="style"
    >
      <div class="utensil-input-field">
        <input
          ref="input"
          v-model="model"
          :id="inputId"
          :class="[`ui-${variation}`, { pencil: variation !== 'soft', disabled }]"
          :name="name"
          :type="type"
          :placeholder="placeholder"
          @input="(event) => emit('input', (event.target as HTMLInputElement).value)"
          @change="(event) => emit('change', (event.target as HTMLInputElement).value)"
          @search="(event: Event) => emit('search', (event.target as HTMLInputElement).value)"
          @keyup="(event) => emit('keyup', event)"
          @keydown="delegateKeyboardEvent"
          @blur="(event) => emit('blur', event)"
          @focus="(event) => emit('focus', event)"
          :required="required"
          :autocomplete="autocomplete"
          :autofocus="autofocus"
          :disabled="disabled"
          :min="min"
          :max="max"
          :maxlength="maxlength"
          :size="size"
          :readonly="readonly"
          :pattern="pattern"
          :aria-label="ariaLabel"
          :aria-describedby="describedBy()"
          :aria-required="ariaRequired || undefined"
          :aria-invalid="ariaInvalid"
        />
        <div class="icon-box" v-if="icon">
          <!-- With an iconClick listener the icon is a button of its own, after the input in the tab order (the
               icon and action follow the input in the DOM for that). A pointer press puts focus in the input. -->
          <button
            v-if="hasIconClick()"
            type="button"
            class="utensil-input-icon-button"
            :aria-label="iconLabel"
            :disabled="disabled"
            @mousedown.prevent="focus()"
            @click="emit('iconClick')"
          >
            <UtensilIcon :icon="icon" />
          </button>
          <UtensilIcon v-else :icon="icon" />
        </div>
        <div class="action-box">
          <slot name="action" />
        </div>
      </div>
      <p
        v-if="$slots.description || props.description || reserveDescription"
        :id="`${inputId}-description`"
        class="description"
      >
        <slot name="description">
          {{ props.description }}
        </slot>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { ref, computed, getCurrentInstance, useId, useSlots } from 'vue'
import type { IconProp, ThemeConfig, UtensilFieldVariation } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'
import UtensilIcon from '../icon/UtensilIcon.vue'

export interface Props<Theme extends ThemeConfig> {
  type?: string
  id?: string
  name?: string
  label?: string
  labelPlacement?: 'block' | 'inline'
  description?: string
  // Holds the description's line while there is none, for a message that comes and goes
  reserveDescription?: boolean
  placeholder?: string
  variation?: UtensilFieldVariation
  height?: 'normal' | 'large'
  required?: boolean
  autocomplete?: string
  autofocus?: boolean
  disabled?: boolean
  min?: string | number
  max?: string | number
  // The most characters the input takes
  maxlength?: number
  size?: string | number
  readonly?: boolean
  pattern?: string
  ariaLabel?: string
  ariaRequired?: boolean
  ariaInvalid?: boolean
  ariaDescribedBy?: string
  blurOnEnterKey?: boolean
  stopKeyboardPropagation?: boolean
  icon?: IconProp<Theme>
  iconPosition?: 'start' | 'end'
  // Names the icon's button, for an icon that acts through iconClick
  iconLabel?: string
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  type: 'text',
  placeholder: '',
  labelPlacement: 'block',
  variation: 'surface',
  height: 'normal',
  required: false,
  autofocus: false,
  disabled: false,
  readonly: false,
  ariaRequired: false,
  ariaInvalid: false,
  reserveDescription: false,
  blurOnEnterKey: false,
  stopKeyboardPropagation: false,
  iconPosition: 'start',
})

const generatedId = `utensil-input-${useId()}`
const inputId = computed(() => props.id || generatedId)

// Described by ariaDescribedBy's elements and the description, while it has content. Called while rendering: slots
// aren't reactive, so a computed would miss a slot added later.
const slots = useSlots()
function describedBy() {
  const description = slots.description || props.description ? `${inputId.value}-description` : undefined
  return [props.ariaDescribedBy, description].filter(Boolean).join(' ') || undefined
}

// An invalid input takes the warning variant as its pen
const { classes: themeClasses, style } = useTheme<Theme>({ pen: () => (props.ariaInvalid ? 'warning' : undefined) })

const emit = defineEmits<{
  input: [value: string]
  change: [value: string]
  search: [value: string]
  keyup: [event: KeyboardEvent]
  keydown: [event: KeyboardEvent]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
  iconClick: []
}>()

// Called while rendering: the vnode's listeners aren't reactive, so a computed would miss one added later
const instance = getCurrentInstance()
function hasIconClick() {
  return !!instance?.vnode.props?.onIconClick
}

const model = defineModel<string>()

const input = ref<HTMLInputElement>()
const inputElement = computed(() => input.value!)

function delegateKeyboardEvent(event: KeyboardEvent) {
  if (props.blurOnEnterKey && event.key === 'Enter') {
    // Enter only leaves the field: it doesn't submit the form
    event.preventDefault()
    inputElement.value.blur()
    event.stopPropagation()
    return
  }

  emit('keydown', event)

  if (props.stopKeyboardPropagation) {
    event.stopPropagation()
  }
}

function focus(options?: FocusOptions) {
  inputElement.value.focus(options)
}

function blur() {
  inputElement.value.blur()
}

function select() {
  inputElement.value.select()
}

defineExpose({
  focus,
  blur,
  select,
})
</script>

<style scoped>
@layer utensil {
  .utensil-input {
    /* Not --font-size: theme text classes set that, and an invalid input's control is re-themed */
    --input-font-size: var(--utensil-input-font-size, var(--font-size-2));

    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    line-height: normal;
  }

  .utensil-input.label-inline {
    flex-direction: row;
    align-items: center;
    gap: var(--space-3);
  }

  .utensil-input.label-inline .utensil-input-control {
    flex: 1;
  }

  .utensil-input-label {
    font-size: var(--input-font-size);
    font-weight: 500;
    color: var(--pencil-11);
  }

  .utensil-input-control {
    /* Fixes Chrome not applying color-scheme to pseudo elements */
    color-scheme: var(--mode);
  }

  /* The input with its icon and action, which are centered on it */
  .utensil-input-field {
    position: relative;
  }

  .utensil-input-control input {
    width: 100%;
    border: none;
    border-radius: var(--radius-3);
    padding: var(--space-2) var(--space-3);
    font-size: var(--input-font-size);
    font-family: inherit;
    color: var(--pencil-12);
    transition:
      box-shadow 0.15s ease,
      background-color 0.15s ease;
    outline: none;
  }

  .utensil-input-control input::placeholder {
    color: var(--pencil-a9);
  }

  /* The variations are the shared ui-<variation> classes, drawn in pencil at rest (soft keeps its pen tint), and
     muted by their shared disabled modifier. Focus draws the pen's 2px ring in every variation. */
  .utensil-input-control input:focus {
    box-shadow: inset 0 0 0 2px var(--pen-8);
  }

  /* Unstyled draws no field of its own, not even the browser's */
  .utensil-input-control.unstyled input {
    background-color: transparent;
  }

  .utensil-input-control.soft input:focus {
    background-color: var(--pen-a4);
  }

  /* Disabled: the field is muted by its shared modifier; its text, label, icon and description go with it */
  .utensil-input-control input:disabled {
    color: var(--pencil-a8);
    cursor: default;
  }

  .utensil-input.disabled .utensil-input-label,
  .utensil-input.disabled .utensil-input-control .utensil-icon,
  .utensil-input.disabled p.description {
    color: var(--pencil-a8);
  }

  /* High contrast: the edges, placeholder and resting icon are drawn strong enough to find the field by. The
     soft variation gains an edge. Focus, invalid and disabled keep their own. */
  .utensil-high-contrast .utensil-input-control.outline input:not(:focus, :disabled),
  .utensil-high-contrast .utensil-input-control.surface input:not(:focus, :disabled) {
    box-shadow: inset 0 0 0 1px var(--pencil-a9);
  }

  .utensil-high-contrast .utensil-input-control.soft input:not(:focus, :disabled) {
    box-shadow: inset 0 0 0 1px var(--pen-a9);
  }

  .utensil-high-contrast .utensil-input-control input::placeholder {
    color: var(--pencil-a11);
  }

  .utensil-high-contrast .utensil-input-control:not(:focus-within, .has-value, .invalid) .utensil-icon {
    color: var(--pencil-a11);
  }

  /* Invalid: the pen is the warning variant. A soft or unstyled input gains an edge, so invalid isn't shown by color
     alone. Focus keeps its 2px ring. */
  .utensil-input-control.invalid input:not(:focus) {
    box-shadow: inset 0 0 0 1px var(--pen-8);
  }

  .utensil-input-control.invalid .utensil-icon {
    color: var(--pen-9);
  }

  .utensil-input-control.invalid p.description {
    color: var(--pen-11);
  }

  /* Large size */
  .utensil-input-control.large input {
    padding-block: var(--space-3);
  }

  /* Icon styles */
  .utensil-input-control .icon-box {
    position: absolute;
    inset-block: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--space-4);
  }

  /* A decorative icon lets a press through to the input under it */
  .utensil-input-control .icon-box {
    pointer-events: none;
  }

  .utensil-input-icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    border-radius: var(--radius-2);
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
    pointer-events: auto;
    outline: 2px solid transparent;
    outline-offset: 2px;
  }

  .utensil-input-icon-button:focus-visible {
    outline-color: var(--pen-8);
  }

  .utensil-input-icon-button:disabled {
    opacity: 0.5;
    cursor: default;
  }

  .utensil-input-control .utensil-icon {
    color: var(--pencil-a9);
    transition: color 0.15s ease;
  }

  .utensil-input-control:focus-within .utensil-icon {
    color: var(--pen-9);
  }

  .utensil-input-control.has-value .utensil-icon {
    color: var(--pen-9);
  }

  /* Icon positioning */
  .utensil-input-control.icon-start input {
    padding-inline-start: var(--space-7);
  }

  .utensil-input-control.icon-start .icon-box {
    inset-inline-start: var(--space-3);
  }

  .utensil-input-control.icon-end input {
    padding-inline-end: var(--space-7);
  }

  .utensil-input-control.icon-end .icon-box {
    inset-inline-end: var(--space-3);
  }

  /* Action box: after the input in the DOM, so it is drawn over it */
  .utensil-input-control .action-box {
    position: absolute;
    inset-block: 0;
    inset-inline-end: var(--space-2);
    display: flex;
    align-items: center;
  }

  .utensil-input-control .action-box:empty {
    display: none;
  }

  .utensil-input-control.icon-end .action-box {
    inset-inline-start: var(--space-2);
    inset-inline-end: auto;
  }

  .utensil-input-control:has(.action-box:not(:empty)) input {
    padding-inline-end: var(--space-7);
    text-overflow: ellipsis;
  }

  .utensil-input-control.icon-end:has(.action-box:not(:empty)) input {
    padding-inline-start: var(--space-7);
    padding-inline-end: var(--space-3);
  }

  /* Description */
  .utensil-input-control p.description {
    min-height: 1lh;
    margin: 0;
    font-size: var(--font-size-1);
    color: var(--pencil-a11);
  }
}
</style>
