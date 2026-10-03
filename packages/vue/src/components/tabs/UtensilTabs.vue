<template>
  <div class="utensil-tabs" :data-orientation="orientation">
    <slot :value="currentValue" :set-value="setValue" :orientation="orientation" :activation-mode="activationMode" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide, watch } from 'vue'
import { UtensilTabsContextKey, type TabsOrientation, type TabsActivationMode } from './utensil-tabs'

interface Props {
  /** Selected tab value (controlled mode) */
  modelValue?: string
  /** Default selected tab value (uncontrolled mode) */
  defaultValue?: string
  /** Tab orientation (default: horizontal) */
  orientation?: TabsOrientation
  /** Activation mode - automatic activates on focus, manual requires click/enter (default: automatic) */
  activationMode?: TabsActivationMode
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  defaultValue: undefined,
  orientation: 'horizontal',
  activationMode: 'automatic',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Generate unique ID for this tabs instance
const baseId = `utensil-tabs-${Math.random().toString(36).slice(2, 9)}`

// Controlled vs uncontrolled state
const internalValue = ref<string>(props.defaultValue ?? '')
const isControlled = computed(() => props.modelValue !== undefined)
const currentValue = computed(() => (isControlled.value ? props.modelValue! : internalValue.value))

// Track registered triggers for keyboard navigation
const triggerElements = ref<Map<string, HTMLElement>>(new Map())

function setValue(value: string) {
  if (isControlled.value) {
    emit('update:modelValue', value)
  } else {
    internalValue.value = value
  }
}

function registerTrigger(value: string, element: HTMLElement) {
  triggerElements.value.set(value, element)
}

function unregisterTrigger(value: string) {
  triggerElements.value.delete(value)
}

function getTriggerElement(value: string): HTMLElement | undefined {
  return triggerElements.value.get(value)
}

// Sync internal value when controlled value changes
watch(
  () => props.modelValue,
  (value) => {
    if (value !== undefined) {
      internalValue.value = value
    }
  },
)

// Provide context to children
provide(UtensilTabsContextKey, {
  value: currentValue,
  setValue,
  baseId,
  orientation: computed(() => props.orientation),
  activationMode: computed(() => props.activationMode),
  registerTrigger,
  unregisterTrigger,
  getTriggerElement,
})
</script>

<style scoped>
@layer utensil {
  .utensil-tabs {
    display: flex;
    flex-direction: column;
  }

  .utensil-tabs[data-orientation='vertical'] {
    flex-direction: row;
  }
}
</style>
