<template>
  <div class="utensil-toggle-switch" :class="{ disabled, 'label-inline': label && labelPlacement === 'inline' }">
    <label v-if="label" :for="inputId" class="utensil-toggle-switch-label">{{ label }}</label>
    <label class="utensil-toggle-switch-control" :class="{ disabled }">
      <input
        :id="inputId"
        type="checkbox"
        :checked="isOn"
        :disabled="disabled"
        @change="toggle"
        @keydown.enter="toggle"
      />
      <svg class="toggle-svg" viewBox="0 0 34 18" xmlns="http://www.w3.org/2000/svg">
        <!-- Track background -->
        <rect class="track" x="2" y="1" width="30" height="16" rx="8" />
        <!-- Handle -->
        <circle class="handle" cx="10" cy="9" r="8" />
      </svg>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

interface Props {
  modelValue?: boolean | string | number
  onValue?: boolean | string | number
  offValue?: boolean | string | number
  disabled?: boolean
  id?: string
  label?: string
  labelPlacement?: 'block' | 'inline'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  onValue: true,
  offValue: false,
  disabled: false,
  labelPlacement: 'block',
})

const generatedId = `utensil-toggle-switch-${useId()}`
const inputId = computed(() => props.id || generatedId)

const emit = defineEmits<{
  'update:modelValue': [value: boolean | string | number]
}>()

const isOn = computed(() => props.modelValue === props.onValue)

function toggle() {
  if (props.disabled) {
    return
  }

  emit('update:modelValue', isOn.value ? props.offValue : props.onValue)
}
</script>

<style scoped>
@layer utensil {
  .utensil-toggle-switch {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    line-height: normal;
  }

  .utensil-toggle-switch.label-inline {
    flex-direction: row;
    align-items: center;
    gap: var(--space-3);
  }

  .utensil-toggle-switch.disabled {
    opacity: 0.5;
  }

  .utensil-toggle-switch-label {
    font-size: var(--font-size-2);
    font-weight: 500;
    color: var(--pencil-11);
    cursor: pointer;
  }

  .utensil-toggle-switch.disabled .utensil-toggle-switch-label {
    cursor: default;
  }

  .utensil-toggle-switch-control {
    position: relative;
    display: inline-block;
    margin: 0;
    cursor: pointer;
  }

  .utensil-toggle-switch-control.disabled {
    cursor: default;
  }

  .utensil-toggle-switch-control input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  .toggle-svg {
    display: block;
    width: 2.125rem;
    height: 1.125rem;
  }

  .track {
    fill: var(--pencil-1);
    stroke: var(--pen-7);
    stroke-width: 2;
    transition: fill 0.2s ease;
  }

  .handle {
    fill: var(--pencil-1);
    stroke: var(--pen-7);
    stroke-width: 2;
    transition: transform 0.2s ease;
    transform-origin: center;
  }

  input:checked + .toggle-svg .track {
    fill: var(--pen-9);
    stroke: var(--pen-9);
  }

  input:checked + .toggle-svg .handle {
    transform: translateX(14px);
    stroke: var(--pen-9);
  }

  input:focus-visible + .toggle-svg {
    outline: 2px solid var(--pen-8);
    outline-offset: 2px;
    border-radius: 9px;
  }
}
</style>
