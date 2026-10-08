<template generic="Theme extends ThemeConfig">
  <div class="utensil-text-area" :class="{ 'label-inline': label && labelPlacement === 'inline' }">
    <label v-if="label" :for="textAreaId" class="utensil-text-area-label">{{ label }}</label>
    <div
      class="utensil-text-area-control"
      :class="[
        ...themeClasses,
        variation,
        `resize-${resize}`,
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
        :aria-describedby="ariaDescribedBy"
        :aria-required="ariaRequired"
        :aria-invalid="ariaInvalid"
      />
    </div>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { ref, computed, useId } from 'vue'
import type { ThemeConfig } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'

export interface Props {
  id?: string
  name?: string
  label?: string
  labelPlacement?: 'block' | 'inline'
  placeholder?: string
  variation?: 'surface' | 'soft' | 'outline'
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
  stopKeyboardPropagation: false,
})

const generatedId = `utensil-text-area-${useId()}`
const textAreaId = computed(() => props.id || generatedId)

// An invalid text area takes the warning variant as its pen
const { classes: themeClasses, style } = useTheme<Theme>({ pen: () => (props.ariaInvalid ? 'warning' : undefined) })

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
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    line-height: normal;
  }

  .utensil-text-area.label-inline {
    flex-direction: row;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .utensil-text-area.label-inline .utensil-text-area-control {
    flex: 1;
  }

  .utensil-text-area-label {
    font-size: var(--font-size-2);
    font-weight: 500;
    color: var(--pencil-11);
  }

  .utensil-text-area.label-inline .utensil-text-area-label {
    padding-top: var(--space-2);
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

  .utensil-text-area-control textarea,
  .utensil-squared .utensil-text-area-control textarea {
    display: block;
    width: 100%;
    height: 100%;
    min-height: 100%;
    border: none;
    border-radius: inherit;
    padding: var(--space-2) var(--space-3);
    font-size: var(--font-size-2);
    line-height: var(--line-height-2);
    font-family: inherit;
    color: var(--pencil-12);
    resize: none;
    outline: none;
    transition:
      box-shadow 0.15s ease,
      background-color 0.15s ease;
  }

  .utensil-rounded .utensil-text-area-control textarea,
  .utensil-rounded.utensil-text-area-control textarea {
    padding: var(--space-3) var(--space-4);
  }

  .utensil-text-area-control textarea::placeholder {
    color: var(--pencil-a9);
  }

  .utensil-text-area-control textarea:disabled {
    opacity: 0.5;
    cursor: default;
  }

  /* Outline variation */
  .utensil-text-area-control.outline textarea {
    background-color: var(--pencil-surface);
    box-shadow: inset 0 0 0 1px var(--pencil-a6);
  }

  .utensil-text-area-control.outline textarea:focus {
    background-color: var(--pencil-2);
    box-shadow: inset 0 0 0 2px var(--pen-8);
  }

  /* Surface variation */
  .utensil-text-area-control.surface textarea {
    background-color: var(--pencil-surface);
    box-shadow: inset 0 0 0 1px var(--pencil-a7);
  }

  .utensil-text-area-control.surface textarea:focus {
    box-shadow: inset 0 0 0 2px var(--pen-8);
    background-color: var(--pencil-surface);
  }

  /* Soft variation */
  .utensil-text-area-control.soft textarea {
    background-color: var(--pen-a3);
    box-shadow: none;
  }

  .utensil-text-area-control.soft textarea:focus {
    background-color: var(--pen-a4);
    box-shadow: inset 0 0 0 2px var(--pen-8);
  }

  /* Invalid: the pen is the warning variant. A soft text area gains an edge, so invalid isn't shown by color alone.
     Focus keeps its 2px ring. */
  .utensil-text-area-control.invalid.outline textarea:not(:focus),
  .utensil-text-area-control.invalid.surface textarea:not(:focus),
  .utensil-text-area-control.invalid.soft textarea:not(:focus) {
    box-shadow: inset 0 0 0 1px var(--pen-8);
  }
}
</style>
