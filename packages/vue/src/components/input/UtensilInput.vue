<template generic="Theme extends ThemeConfig">
  <div class="utensil-input" :class="{ 'label-inline': label && labelPlacement === 'inline' }">
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
        <div class="icon-box" v-if="icon">
          <UtensilIcon
            v-if="icon"
            :icon="icon"
            @mousedown.prevent="() => emit('iconClick')"
            :role="hasIconClick ? 'button' : undefined"
          />
        </div>
        <div class="action-box">
          <slot name="action" />
        </div>
        <input
          ref="input"
          v-model="model"
          :id="inputId"
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
          :size="size"
          :readonly="readonly"
          :pattern="pattern"
          :aria-label="ariaLabel"
          :aria-describedby="describedBy"
          :aria-required="ariaRequired"
          :aria-invalid="ariaInvalid"
        />
      </div>
      <p v-if="$slots.description || props.description" :id="`${inputId}-description`" class="description">
        <slot name="description">
          {{ props.description }}
        </slot>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { ref, computed, getCurrentInstance, useId, useSlots } from 'vue'
import type { IconProp, ThemeConfig } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'
import UtensilIcon from '../icon/UtensilIcon.vue'

export interface Props<Theme extends ThemeConfig> {
  type?: string
  id?: string
  name?: string
  label?: string
  labelPlacement?: 'block' | 'inline'
  description?: string
  placeholder?: string
  variation?: 'surface' | 'soft' | 'outline'
  height?: 'normal' | 'large'
  required?: boolean
  autocomplete?: string
  autofocus?: boolean
  disabled?: boolean
  min?: string | number
  max?: string | number
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
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  type: 'text',
  placeholder: '',
  labelPlacement: 'block',
  variation: 'surface',
  height: 'normal',
  required: false,
  autocomplete: 'off',
  autofocus: false,
  disabled: false,
  readonly: false,
  pattern: '.+',
  ariaRequired: false,
  ariaInvalid: false,
  blurOnEnterKey: false,
  stopKeyboardPropagation: false,
  iconPosition: 'start',
})

const generatedId = `utensil-input-${useId()}`
const inputId = computed(() => props.id || generatedId)

// Resolve ariaDescribedBy based on prop or description slot
const slots = useSlots()
const describedBy = computed(() => {
  if (props.ariaDescribedBy) {
    return props.ariaDescribedBy
  }

  if (slots.description || props.description) {
    return `${inputId.value}-description`
  }

  return undefined
})

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

const instance = getCurrentInstance()
const hasIconClick = computed(() => !!instance?.vnode.props?.onIconClick)

const model = defineModel<string>()

const input = ref<HTMLInputElement>()
const inputElement = computed(() => input.value!)

function delegateKeyboardEvent(event: KeyboardEvent) {
  if (props.blurOnEnterKey && event.key === 'Enter') {
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
    --font-size: var(--utensil-input-font-size, var(--font-size-2));

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
    font-size: var(--font-size);
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
    font-size: var(--font-size);
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

  .utensil-input-control input:disabled {
    opacity: 0.5;
    cursor: default;
  }

  /* Outline variation */
  .utensil-input-control.outline input {
    background-color: var(--pencil-surface);
    box-shadow: inset 0 0 0 1px var(--pencil-a6);
  }

  .utensil-input-control.outline input:focus {
    box-shadow: inset 0 0 0 2px var(--pen-8);
    background-color: var(--pencil-2);
  }

  /* Surface variation */
  .utensil-input-control.surface input {
    background-color: var(--pencil-surface);
    box-shadow: inset 0 0 0 1px var(--pencil-a7);
  }

  .utensil-input-control.surface input:focus {
    box-shadow: inset 0 0 0 2px var(--pen-8);
    background-color: var(--pencil-surface);
  }

  /* Soft variation - no outline */
  .utensil-input-control.soft input {
    background-color: var(--pen-a3);
    box-shadow: none;
  }

  .utensil-input-control.soft input:focus {
    background-color: var(--pen-a4);
    box-shadow: inset 0 0 0 2px var(--pen-8);
  }

  /* Invalid: the pen is the warning variant. A soft input gains an edge, so invalid isn't shown by color alone.
     Focus keeps its 2px ring. */
  .utensil-input-control.invalid.outline input:not(:focus),
  .utensil-input-control.invalid.surface input:not(:focus),
  .utensil-input-control.invalid.soft input:not(:focus) {
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
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--space-4);
  }

  .utensil-input-control .icon-box:has(.utensil-icon[role='button']) {
    pointer-events: auto;
    cursor: pointer;
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
    left: var(--space-3);
  }

  .utensil-input-control.icon-end input {
    padding-inline-end: var(--space-7);
  }

  .utensil-input-control.icon-end .icon-box {
    right: var(--space-3);
  }

  /* Action box */
  .utensil-input-control .action-box {
    position: absolute;
    top: 0;
    bottom: 0;
    right: var(--space-2);
    display: flex;
    align-items: center;
    z-index: 1;
  }

  .utensil-input-control .action-box:empty {
    display: none;
  }

  .utensil-input-control.icon-end .action-box {
    left: var(--space-2);
    right: auto;
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
  p.description {
    margin: 0;
    font-size: var(--font-size-1);
    color: var(--pencil-a11);
  }
}
</style>
