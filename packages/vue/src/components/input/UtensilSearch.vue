<template>
  <div class="utensil-search">
    <UtensilInput
      v-model="query"
      type="search"
      icon="search"
      :label="label"
      :label-placement="labelPlacement"
      :placeholder="placeholder"
      :variation="variation"
      :height="height"
      :disabled="disabled"
      :autofocus="autofocus"
      :blur-on-enter-key="blurOnEnterKey"
      @input="(value) => emitValue(value, debounce)"
      @change="(value: string) => emitValue(value)"
      @search="() => emitValue(query)"
      @blur="() => emitValue(query)"
      @keyup.esc="clear"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import UtensilInput from './UtensilInput.vue'
import type { Debouncer } from '../../lib/debouncer/debouncer'
import { DebouncerEnd } from '../../lib/debouncer/debouncer-end'

interface Props {
  modelValue?: string
  label?: string
  labelPlacement?: 'block' | 'inline'
  placeholder?: string
  variation?: 'surface' | 'soft' | 'outline'
  height?: 'normal' | 'large'
  debounce?: boolean
  disabled?: boolean
  autofocus?: boolean
  blurOnEnterKey?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Search...',
  debounce: false,
  disabled: false,
  autofocus: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const query = ref('')

// The last value the host holds, whether it came from here or from the host — a value passed in
// (e.g. restored from a URL) must still be clearable
let emittedValue = ''
const debouncer: Debouncer = new DebouncerEnd(500)

watch(
  () => props.modelValue,
  (value: string) => {
    query.value = value || ''
    emittedValue = value || ''
  },
  { immediate: true },
)

function clear() {
  query.value = ''
  emitValue('')
}

// An immediate emit (search, change, blur, clear) settles the value at once, overtaking a
// debounced one still waiting
function emitValue(value: string, debounce = false) {
  if (debounce) {
    debouncer.run(() => emitChange(value))
    return
  }

  debouncer.cancel()
  emitChange(value)
}

function emitChange(value: string) {
  if (value === emittedValue) {
    return
  }

  emittedValue = value
  emit('update:modelValue', value)
}
</script>
