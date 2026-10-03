<template>
  <div class="utensil-password">
    <UtensilInput
      v-model="model"
      :id="id"
      :name="name"
      :label="label"
      :label-placement="labelPlacement"
      :type="inputType"
      :icon="icon"
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
      @focus="(event) => focus(event)"
      @blur="(event) => blur(event)"
      @iconClick="() => (passwordVisible = !passwordVisible)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import UtensilInput from './UtensilInput.vue'

const model = defineModel<string>()

interface Props {
  id?: string
  name?: string
  label?: string
  labelPlacement?: 'block' | 'inline'
  modelValue?: string
  placeholder?: string
  variation?: 'surface' | 'soft' | 'outline'
  height?: 'normal' | 'large'
  debounce?: boolean
  autofocus?: boolean
  disabled?: boolean
  size?: string | number
  readonly?: boolean
  blurOnEnterKey?: boolean
}

withDefaults(defineProps<Props>(), {
  placeholder: 'Enter password',
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

const icon = computed(() => {
  if (!focused.value) {
    return 'lock'
  }

  return passwordVisible.value ? 'eye-slash' : 'eye'
})

function focus(event: FocusEvent) {
  focused.value = true
  emit('focus', event)
}

function blur(event: FocusEvent) {
  focused.value = false
  passwordVisible.value = false
  emit('blur', event)
}
</script>
