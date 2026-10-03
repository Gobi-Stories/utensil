<template>
  <div class="utensil-color-picker">
    <label v-if="label" :for="inputId" class="utensil-color-picker-label">{{ label }}</label>
    <div v-if="colors?.length" class="color-grid">
      <button
        v-for="color in colors"
        :key="color.value"
        type="button"
        class="color-swatch preset-swatch"
        :class="{ small: 'small' == size, selected: isPicked(color.value) }"
        :style="{ background: color.value }"
        :aria-pressed="isPicked(color.value)"
        :aria-label="color.name || color.value"
        :title="color.name"
        @click="emit('update:modelValue', color.value)"
      ></button>
      <span
        v-if="customPicked"
        class="color-swatch custom-swatch"
        :class="{ small: 'small' == size }"
        :style="{ background: modelValue }"
        :title="modelValue"
      ></span>
      <label class="color-swatch custom-picker" :class="{ small: 'small' == size }" title="Custom color">
        <UtensilIcon icon="palette" />
        <input
          :id="inputId"
          :name="name"
          type="color"
          :value="swatchColor"
          class="picker-input"
          aria-label="Custom color"
          @input="pickSwatch"
        />
      </label>
    </div>
    <div v-else class="color-controls">
      <input
        :id="inputId"
        :name="name"
        type="color"
        :value="swatchColor"
        class="color-swatch"
        :class="{ small: 'small' == size }"
        @input="pickSwatch"
      />
      <UtensilInput
        v-if="showInput"
        :model-value="modelValue"
        :placeholder="placeholder"
        :ariaLabel="label ? `${label} hex value` : undefined"
        class="color-hex-input"
        @change="(value) => emit('update:modelValue', value)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'
import UtensilInput from '../input/UtensilInput.vue'
import UtensilIcon from '../icon/UtensilIcon.vue'
import type { ColorPickerOption } from './utensil-color-picker'

const props = withDefaults(
  defineProps<{
    id?: string
    name?: string
    size?: 'small' | 'normal'
    modelValue: string
    placeholder?: string
    showInput?: boolean
    label?: string
    colors?: ColorPickerOption[]
  }>(),
  {
    showInput: true,
    size: 'normal',
  },
)

const generatedId = `utensil-color-picker-${useId()}`
const inputId = computed(() => props.id || generatedId)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// The native swatch only understands #rrggbb — feed it the opaque part (never triggering its
// format warning) and carry any #rrggbbaa alpha pair across a pick so alpha values survive.
const swatchColor = computed(() => {
  const match = /^#([0-9a-fA-F]{6})/.exec(props.modelValue)
  return match ? `#${match[1]}` : '#000000'
})

const alphaSuffix = computed(() => {
  const match = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})$/.exec(props.modelValue)
  return match ? match[1] : ''
})

function pickSwatch(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value + alphaSuffix.value)
}

function isPicked(value: string) {
  return value.toLowerCase() === props.modelValue.toLowerCase()
}

// The current value sits outside the preset list, shown on its own swatch before the picker
const customPicked = computed(() => !!props.colors?.length && !props.colors.some((color) => isPicked(color.value)))
</script>

<style scoped>
@layer utensil {
  .utensil-color-picker {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .utensil-color-picker-label {
    font-size: var(--font-size-2);
    font-weight: 500;
    color: var(--pencil-11);
  }

  .color-controls {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .color-grid {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-2);
  }

  .color-swatch {
    width: calc(var(--space-5) + var(--space-1));
    height: calc(var(--space-5) + var(--space-1));
    padding: 0;
    border: 1px solid var(--pencil-6);
    border-radius: var(--radius-2);
    cursor: pointer;
    background: none;

    &.small {
      width: 22px;
      height: 22px;
    }
  }

  .color-swatch::-webkit-color-swatch-wrapper {
    padding: 2px;
  }

  .color-swatch::-webkit-color-swatch {
    border: none;
    border-radius: var(--radius-1);
  }

  .preset-swatch,
  .custom-swatch {
    outline: 2px solid transparent;
    outline-offset: 1px;
    transition: outline-color 0.1s ease;
  }

  .preset-swatch.selected,
  .custom-swatch {
    outline-color: var(--pen-indicator);
  }

  .preset-swatch:focus-visible {
    outline-color: var(--pen-8);
  }

  .custom-swatch {
    cursor: default;
  }

  .custom-picker {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--pencil-a3);
    color: var(--pencil-a11);
    outline: 2px solid transparent;
    outline-offset: 1px;
    transition: outline-color 0.1s ease;
  }

  .custom-picker:has(.picker-input:focus-visible) {
    outline-color: var(--pen-8);
  }

  .picker-input {
    position: absolute;
    inset: 0;
    padding: 0;
    border: none;
    opacity: 0;
    cursor: pointer;
  }
}
</style>
