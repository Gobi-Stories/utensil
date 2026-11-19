<template>
  <div ref="root" class="utensil-password" @focusin="focused = true" @focusout="onFocusout">
    <UtensilInput
      v-model="model"
      :id="id"
      :name="name"
      :label="label"
      :label-placement="labelPlacement"
      :type="inputType"
      :icon="icon"
      :icon-label="passwordVisible ? hidePasswordLabel : showPasswordLabel"
      :placeholder="placeholder"
      :variation="variation"
      :height="height"
      :autofocus="autofocus"
      :disabled="disabled"
      :size="size"
      :readonly="readonly"
      :blurOnEnterKey="blurOnEnterKey"
      iconPosition="end"
      required
      @input="(value) => emit('input', value)"
      @change="(value) => emit('change', value)"
      @focus="(event) => emit('focus', event)"
      @blur="(event) => emit('blur', event)"
      @iconClick="() => (passwordVisible = !passwordVisible)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useTemplateRef } from 'vue'
import type { UtensilFieldVariation } from '../../theme/utensil-theme'
import UtensilInput from './UtensilInput.vue'

const model = defineModel<string>()

export interface Props {
  id?: string
  name?: string
  label?: string
  labelPlacement?: 'block' | 'inline'
  modelValue?: string
  placeholder?: string
  variation?: UtensilFieldVariation
  height?: 'normal' | 'large'
  debounce?: boolean
  autofocus?: boolean
  disabled?: boolean
  size?: string | number
  readonly?: boolean
  blurOnEnterKey?: boolean
  // Names the button that shows the password
  showPasswordLabel?: string
  // Names the button that hides it again
  hidePasswordLabel?: string
}

withDefaults(defineProps<Props>(), {
  placeholder: 'Enter password',
  showPasswordLabel: 'Show password',
  hidePasswordLabel: 'Hide password',
})

const emit = defineEmits<{
  input: [value: string]
  change: [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const passwordVisible = ref<boolean>(false)
const focused = ref<boolean>(false)
const inputType = computed(() => (passwordVisible.value ? 'text' : 'password'))

const root = useTemplateRef<HTMLElement>('root')

const icon = computed(() => {
  if (!focused.value && !passwordVisible.value) {
    return 'lock'
  }

  return passwordVisible.value ? 'eye-slash' : 'eye'
})

// Focus is tracked across the input and its show/hide button, so moving between them keeps the password shown;
// leaving the field hides it again
function onFocusout(event: FocusEvent) {
  if (root.value?.contains(event.relatedTarget as Node | null)) return
  focused.value = false
  passwordVisible.value = false
}
</script>
