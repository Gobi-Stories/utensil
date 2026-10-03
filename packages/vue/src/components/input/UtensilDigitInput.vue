<template generic="Theme extends ThemeConfig">
  <div
    class="utensil-digit-input"
    :class="[...themeClasses, { invalid, disabled }]"
    :style="themeStyle"
    @paste="handlePaste"
  >
    <input
      v-for="(digit, index) in digits"
      :key="index"
      :ref="(el) => setInputRef(el, index)"
      class="digit-box"
      type="text"
      inputmode="numeric"
      :autocomplete="index === 0 ? 'one-time-code' : 'off'"
      :value="digit"
      :disabled="disabled"
      :aria-label="`${ariaLabel} — digit ${index + 1} of ${length}`"
      @input="onInput(index, $event)"
      @keydown="onKeydown(index, $event)"
      @focus="onFocus(index)"
    />
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { onMounted, ref, watch, type ComponentPublicInstance } from 'vue'
import type { ColorProp, ScaleProp, ThemeConfig } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'

// One box per digit for numeric codes (one-time passwords, 2FA). Typing advances the focus,
// backspace walks it back, focusing a box clears it and everything after so a code can be retyped
// from any point, and pasting or OTP-autofilling a full code completes in one go.
export interface Props<Theme extends ThemeConfig> {
  /** The code as typed so far. Use with v-model. */
  modelValue?: string
  /** How many digits the code has */
  length?: number
  disabled?: boolean
  /** Marks the boxes with the pen color (pair with an error color for failed codes) */
  invalid?: boolean
  /** Focus the first box on mount */
  autofocus?: boolean
  /** Accessible name for the code; each box appends its position */
  ariaLabel?: string
  color?: ColorProp<Theme>
  scale?: ScaleProp
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  modelValue: '',
  length: 6,
  ariaLabel: 'Code',
})

const emit = defineEmits<{
  'update:modelValue': [code: string]
  /** Fires once every digit is filled */
  complete: [code: string]
}>()

const { classes: themeClasses, style: themeStyle } = useTheme({
  pen: () => props.color,
  relativeScale: () => props.scale,
})

const digits = ref<string[]>([])
const focusedIndex = ref(0)

function resetDigits(value: string) {
  digits.value = Array.from({ length: props.length }, (_, index) => value.charAt(index) || '')
}

resetDigits(props.modelValue)

watch(
  () => props.modelValue,
  (value) => {
    // Our own emits echo back through v-model — only genuinely external values reset the boxes.
    if (value !== digits.value.join('')) {
      resetDigits(value)
    }
  },
)

const inputRefs = ref<HTMLInputElement[]>([])

function setInputRef(el: Element | ComponentPublicInstance | null, index: number) {
  if (el instanceof HTMLInputElement) {
    inputRefs.value[index] = el
  }
}

onMounted(() => {
  if (props.autofocus) {
    inputRefs.value[0]?.focus()
  }
})

function syncModel() {
  const code = digits.value.join('')
  emit('update:modelValue', code)
  if (code.length === props.length) {
    emit('complete', code)
  }
}

function fillCode(code: string) {
  digits.value = code.split('').slice(0, props.length)
  inputRefs.value[focusedIndex.value]?.blur()
  syncModel()
}

function setDigit(index: number, value: string) {
  digits.value[index] = value

  if (value && index < props.length - 1) {
    inputRefs.value[index + 1]?.focus()
  } else if (value && digits.value.join('').length === props.length) {
    inputRefs.value[index]?.blur()
  }

  syncModel()
}

function onInput(index: number, event: Event) {
  const target = event.target as HTMLInputElement
  const entered = target.value.replace(/\D/g, '')

  // OTP autofill drops the whole code into one box.
  if (entered.length >= props.length) {
    fillCode(entered)
    return
  }

  const digit = entered.slice(0, 1)
  // Keep the box showing at most one digit even when the browser inserted more.
  target.value = digit
  setDigit(index, digit)
}

function onKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' || event.key === 'Delete') {
    clearFrom(index)

    if (index > 0) {
      inputRefs.value[index - 1]?.focus()
    }
  }
}

function onFocus(index: number) {
  focusedIndex.value = index
  clearFrom(index)
}

// Retyping starts from the focused box: it and everything after empty out.
function clearFrom(index: number) {
  for (let position = index; position < props.length; position++) {
    digits.value[position] = ''
  }

  emit('update:modelValue', digits.value.join(''))
}

function handlePaste(event: ClipboardEvent) {
  // Block the raw insert; arbitrary text would otherwise land in one box and break the flow.
  event.preventDefault()

  const pasted = event.clipboardData?.getData('text').trim() ?? ''
  if (!/^\d+$/.test(pasted)) return

  if (pasted.length >= props.length) {
    fillCode(pasted)
  } else if (pasted.length === 1) {
    setDigit(focusedIndex.value, pasted)
  }
}
</script>

<style scoped>
@layer utensil {
  .utensil-digit-input {
    display: flex;
    gap: var(--space-2);
  }

  .digit-box {
    width: var(--space-7);
    height: var(--space-8);
    padding: 0;
    border: 1px solid var(--pencil-7);
    border-radius: var(--radius-3);
    background-color: var(--surface);
    color: var(--pencil-12);
    font: inherit;
    font-size: var(--font-size-4);
    font-weight: 600;
    text-align: center;
  }

  .digit-box:focus-visible {
    outline: 2px solid var(--pen-8);
    outline-offset: -1px;
  }

  .utensil-digit-input.invalid .digit-box {
    outline: 2px solid var(--pen-8);
    outline-offset: -1px;
  }

  .utensil-digit-input.disabled {
    opacity: 0.5;
  }
}
</style>
