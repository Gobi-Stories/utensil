<template>
  <div class="utensil-text-area" :class="{ 'label-inline': label && labelPlacement === 'inline', disabled }">
    <label v-if="label" :for="textAreaId" class="utensil-text-area-label">{{ label }}</label>
    <div
      class="utensil-text-area-control"
      :class="[
        ...themeClasses,
        variation,
        `resize-${disabled ? 'none' : resize}`,
        {
          'has-value': !!model,
          invalid: ariaInvalid,
        },
      ]"
      :style="style"
    >
      <textarea
        ref="textarea"
        v-model="model"
        :id="textAreaId"
        :class="[`ui-${variation}`, { pencil: variation !== 'soft', disabled }]"
        :name="name"
        :placeholder="placeholder"
        @input="(event) => emit('input', (event.target as HTMLTextAreaElement).value)"
        @change="(event) => emit('change', (event.target as HTMLTextAreaElement).value)"
        @keyup="(event) => emit('keyup', event)"
        @keydown="delegateKeyboardEvent"
        @blur="(event) => emit('blur', event)"
        @focus="(event) => emit('focus', event)"
        :rows="rows"
        :maxlength="maxlength"
        :required="required"
        :autofocus="autofocus"
        :disabled="disabled"
        :readonly="readonly"
        :aria-label="ariaLabel"
        :aria-describedby="describedBy()"
        :aria-required="ariaRequired || undefined"
        :aria-invalid="ariaInvalid"
      />
    </div>
    <p
      v-if="$slots.description || description || reserveDescription"
      :id="`${textAreaId}-description`"
      class="description"
      :class="[...themeClasses, { invalid: ariaInvalid }]"
      :style="style"
    >
      <slot name="description">{{ description }}</slot>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useId, useSlots } from 'vue'
import type { UtensilFieldVariation } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'

export interface Props {
  id?: string
  name?: string
  label?: string
  labelPlacement?: 'block' | 'inline'
  /** Text under the text area, such as a hint or an error, that describes it */
  description?: string
  /** Holds the description's line while there is none, for a message that comes and goes */
  reserveDescription?: boolean
  placeholder?: string
  variation?: UtensilFieldVariation
  rows?: number
  maxlength?: number
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  required?: boolean
  autofocus?: boolean
  disabled?: boolean
  readonly?: boolean
  ariaLabel?: string
  ariaRequired?: boolean
  ariaInvalid?: boolean
  ariaDescribedBy?: string
  stopKeyboardPropagation?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  labelPlacement: 'block',
  variation: 'surface',
  rows: 5,
  resize: 'vertical',
  required: false,
  autofocus: false,
  disabled: false,
  readonly: false,
  ariaRequired: false,
  ariaInvalid: false,
  reserveDescription: false,
  stopKeyboardPropagation: false,
})

const generatedId = `utensil-text-area-${useId()}`
const textAreaId = computed(() => props.id || generatedId)

// Described by ariaDescribedBy's elements and the description, while it has content. Called while rendering: slots
// aren't reactive, so a computed would miss a slot added later.
const slots = useSlots()
function describedBy() {
  const description = slots.description || props.description ? `${textAreaId.value}-description` : undefined
  return [props.ariaDescribedBy, description].filter(Boolean).join(' ') || undefined
}

// An invalid text area takes the warning variant as its pen
const { classes: themeClasses, style } = useTheme({ pen: () => (props.ariaInvalid ? 'warning' : undefined) })

const emit = defineEmits<{
  input: [value: string]
  change: [value: string]
  keyup: [event: KeyboardEvent]
  keydown: [event: KeyboardEvent]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const model = defineModel<string>()

const textarea = ref<HTMLTextAreaElement>()
const textareaElement = computed(() => textarea.value!)

function delegateKeyboardEvent(event: KeyboardEvent) {
  emit('keydown', event)

  if (props.stopKeyboardPropagation) {
    event.stopPropagation()
  }
}

function focus() {
  textareaElement.value.focus()
}

// Focuses with the caret placed after the last character. preventScroll stops
// the browser dragging ancestor scrollers around to reveal the caret — the
// consumer controls where the textarea appears.
function focusEnd() {
  const element = textareaElement.value
  element.focus({ preventScroll: true })
  element.setSelectionRange(element.value.length, element.value.length)
}

function blur() {
  textareaElement.value.blur()
}

function select() {
  const element = textareaElement.value
  element.focus({ preventScroll: true })
  element.select()
}

defineExpose({
  focus,
  focusEnd,
  blur,
  select,
})
</script>

<style scoped>
@layer utensil {
  .utensil-text-area {
    --text-area-font-size: var(--utensil-text-area-font-size, var(--font-size-2));

    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    line-height: normal;
  }

  .utensil-text-area.label-inline {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: start;
    gap: var(--space-1) var(--space-3);
  }

  /* The description sits under the text area, beside no label */
  .utensil-text-area.label-inline p.description {
    grid-column: 2;
  }

  .utensil-text-area-label {
    font-size: var(--text-area-font-size);
    font-weight: 500;
    color: var(--pencil-11);
  }

  .utensil-text-area.label-inline .utensil-text-area-label {
    padding-block-start: var(--space-2);
  }

  .utensil-text-area-control {
    position: relative;
    color-scheme: var(--mode);
    overflow: hidden;
    border-radius: var(--radius-3);
  }

  /* Resize applied to the outer container */
  .utensil-text-area-control.resize-none {
    resize: none;
  }

  .utensil-text-area-control.resize-vertical {
    resize: vertical;
  }

  .utensil-text-area-control.resize-horizontal {
    resize: horizontal;
  }

  .utensil-text-area-control.resize-both {
    resize: both;
  }

  .utensil-text-area-control textarea {
    display: block;
    width: 100%;
    height: 100%;
    min-height: 100%;
    border: none;
    border-radius: inherit;
    /* The nearest rounded or squared theme sets it */
    padding: var(--utensil-text-area-padding, var(--space-2) var(--space-3));
    font-size: var(--text-area-font-size);
    line-height: var(--line-height-2);
    font-family: inherit;
    color: var(--pencil-12);
    resize: none;
    outline: none;
    transition:
      box-shadow 0.15s ease,
      background-color 0.15s ease;
  }

  .utensil-text-area-control textarea::placeholder {
    color: var(--pencil-a9);
  }

  /* The variations are the shared ui-<variation> classes, drawn in pencil at rest (soft keeps its pen tint), and
     muted by their shared disabled modifier. Focus draws the pen's 2px ring in every variation. */
  .utensil-text-area-control textarea:focus {
    box-shadow: inset 0 0 0 2px var(--pen-8);
  }

  /* Unstyled draws no field of its own, not even the browser's */
  .utensil-text-area-control.unstyled textarea {
    background-color: transparent;
  }

  .utensil-text-area-control.soft textarea:focus {
    background-color: var(--pen-a4);
  }

  /* Disabled: the field is muted by its shared modifier and can't be resized; its text, label and description go
     with it */
  .utensil-text-area-control textarea:disabled {
    color: var(--pencil-a8);
    cursor: default;
  }

  .utensil-text-area-control textarea:disabled::placeholder {
    color: var(--pencil-a8);
  }

  .utensil-text-area.disabled .utensil-text-area-label,
  .utensil-text-area.disabled p.description {
    color: var(--pencil-a8);
  }

  /* High contrast: the edges and placeholder are drawn strong enough to find the field by. The soft variation
     gains an edge. Focus and invalid keep their own. */
  .utensil-high-contrast .utensil-text-area-control.outline:not(.invalid) textarea:not(:focus, :disabled),
  .utensil-high-contrast .utensil-text-area-control.surface:not(.invalid) textarea:not(:focus, :disabled) {
    box-shadow: inset 0 0 0 1px var(--pencil-a9);
  }

  .utensil-high-contrast .utensil-text-area-control.soft:not(.invalid) textarea:not(:focus, :disabled) {
    box-shadow: inset 0 0 0 1px var(--pen-a9);
  }

  .utensil-high-contrast .utensil-text-area-control textarea:not(:disabled)::placeholder {
    color: var(--pencil-a11);
  }

  /* Invalid: the pen is the warning variant. A soft or unstyled text area gains an edge, so invalid isn't shown by
     color alone. Focus keeps its 2px ring. */
  .utensil-text-area-control.invalid textarea:not(:focus) {
    box-shadow: inset 0 0 0 1px var(--pen-8);
  }

  /* Description */
  .utensil-text-area p.description {
    min-height: 1lh;
    margin: 0;
    font-size: var(--font-size-1);
    color: var(--pencil-a11);
  }

  .utensil-text-area p.description.invalid {
    color: var(--pen-11);
  }

  /* Forced colors drops the box-shadow edge and focus ring: a border in system colors draws the edge, thicker when
     invalid, the field held to its size by a negative margin, and the shared Highlight outline the focus ring */
  @media (forced-colors: active) {
    .utensil-text-area-control:not(.unstyled) textarea {
      border: 1px solid CanvasText;
      margin-block: -1px;
    }

    .utensil-text-area-control.invalid textarea {
      border: 2px solid CanvasText;
      margin-block: -2px;
    }

    .utensil-text-area-control textarea:disabled,
    .utensil-text-area.disabled :is(.utensil-text-area-label, p.description) {
      color: GrayText;
      border-color: GrayText;
    }
  }
}
</style>

<!-- Unscoped: the nearest rounded or squared theme sets the text area's padding, through a cvar it inherits -->
<style>
@layer utensil {
  .utensil-squared {
    --utensil-text-area-padding: var(--space-2) var(--space-3);
  }

  .utensil-rounded {
    --utensil-text-area-padding: var(--space-3) var(--space-4);
  }
}
</style>
