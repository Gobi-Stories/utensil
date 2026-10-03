<template generic="Theme extends ThemeConfig">
  <UtensilPopoverPanel class="utensil-label-input" v-model="isOpen" placement="bottom-start">
    <template #trigger="{ toggle }">
      <UtensilCircleButton icon="plus" variant="outline" :description="triggerDescription" @click="toggle" />
    </template>

    <div class="utensil-label-popup-content">
      <!-- Input field -->
      <UtensilInput
        ref="inputRef"
        v-model="inputValue"
        placeholder="Enter label name..."
        icon="tags"
        icon-position="start"
        @keydown="handleKeydown"
        @input="handleInput"
      />

      <!-- Suggestions list -->
      <div v-if="suggestions.length > 0" class="utensil-label-suggestions">
        <div class="utensil-label-suggestions-header">
          <span>Suggestions</span>
        </div>
        <button
          v-for="(suggestion, index) in suggestions"
          :key="suggestion.title"
          class="utensil-label-suggestion"
          :class="{ active: index === selectedIndex, highlighted: highlightLabels.includes(suggestion.title) }"
          @click="selectLabel(suggestion.title)"
          @mouseenter="selectedIndex = index"
        >
          <UtensilIcon :icon="suggestion.icon ?? 'tag'" />
          <span>{{
            capitalizeUI ? suggestion.title.charAt(0).toUpperCase() + suggestion.title.slice(1) : suggestion.title
          }}</span>
        </button>
      </div>

      <!-- Empty state when no suggestions -->
      <div v-else-if="inputValue.trim() && availableLabels.length > 0" class="utensil-label-empty">
        <UtensilIcon icon="tags" />
        <span>No matching labels found</span>
        <small>Press Enter to create "{{ inputValue.trim() }}"</small>
      </div>

      <!-- Create new label hint -->
      <div v-if="inputValue.trim()" class="utensil-label-hint">
        <small>Press <kbd>Enter</kbd> to create</small>
      </div>
    </div>
  </UtensilPopoverPanel>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { ref, computed, watch, nextTick } from 'vue'
import type { IconProp, ThemeConfig } from '../../theme/utensil-theme'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
import UtensilCircleButton from '../circle-button/UtensilCircleButton.vue'
import UtensilInput from '../input/UtensilInput.vue'
import UtensilIcon from '../icon/UtensilIcon.vue'

export type Label<Theme extends ThemeConfig> = {
  title: string
  icon?: IconProp<Theme>
}

export interface Props<Theme extends ThemeConfig> {
  /** Labels to omit from suggestions */
  omitLabels?: string[]
  /** Available labels to suggest */
  availableLabels?: Label<Theme>[]
  /** Labels to highlight */
  highlightLabels?: string[]
  /** Description for the trigger button */
  triggerDescription?: string
  /** Whether to lowercase new labels */
  lowerCaseInput?: boolean
  /** Whether to capitalize the labels in the UI */
  capitalizeUI?: boolean
}

const {
  omitLabels = [],
  availableLabels = [],
  highlightLabels = [],
  triggerDescription = 'Add label',
  lowerCaseInput = true,
  capitalizeUI = false,
} = defineProps<Props<Theme>>()

const emit = defineEmits<{
  open: []
  close: []
  input: [label: string]
}>()

// Refs
const inputRef = ref<{ focus(): void }>()

// State
const isOpen = ref(false)
const inputValue = ref('')
const selectedIndex = ref(-1)

// Computed
const suggestions = computed(() => {
  const labels = availableLabels.filter((label) => !omitLabels.includes(label.title))

  const term = inputValue.value.trim().toLowerCase()
  if (term) {
    return labels.filter((label) => label.title.toLowerCase().includes(term))
  }

  return labels
})

// Watch open state for cleanup, focus, and events
watch(isOpen, (open) => {
  if (open) {
    inputValue.value = ''
    selectedIndex.value = -1
    emit('open')
    nextTick(() => inputRef.value?.focus())
  } else {
    inputValue.value = ''
    selectedIndex.value = -1
    emit('close')
  }
})

// Methods
function handleInput() {
  selectedIndex.value = -1
}

function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value >= 0 && suggestions.value[selectedIndex.value]) {
        selectLabel(suggestions.value[selectedIndex.value].title)
      } else if (inputValue.value.trim()) {
        selectLabel(inputValue.value.trim())
      }
      break

    case 'ArrowDown':
      event.preventDefault()
      if (suggestions.value.length > 0) {
        selectedIndex.value = Math.min(selectedIndex.value + 1, suggestions.value.length - 1)
      }
      break

    case 'ArrowUp':
      event.preventDefault()
      if (suggestions.value.length > 0) {
        selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
      }
      break

    case 'Tab':
      isOpen.value = false
      break
  }
}

function selectLabel(label: string) {
  emit('input', lowerCaseInput ? label.trim().toLowerCase() : label.trim())
  isOpen.value = false
}
</script>

<style scoped>
@layer utensil {
  .utensil-label-input {
    --utensil-popover-padding: var(--space-4);
  }

  .utensil-label-popup-content {
    min-width: 248px;
    max-width: 368px;
  }

  .utensil-label-suggestions {
    margin-top: var(--space-3);
    max-height: 280px;
    overflow-y: auto;
  }

  .utensil-label-suggestions-header {
    font-size: var(--font-size-1);
    font-weight: 600;
    color: var(--pen-11);
    text-transform: uppercase;
    padding: 0 var(--space-2) var(--space-2) var(--space-2);
    letter-spacing: 0.5px;
    position: sticky;
    top: 0;
    background: var(--panel-solid);
  }

  .utensil-label-suggestion {
    width: 100%;
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2);
    border: none;
    background: transparent;
    border-radius: var(--radius-2);
    font-size: var(--font-size-2);
    color: var(--pencil-12);
    cursor: pointer;
    transition: all 0.15s ease;
    text-align: left;
  }

  .utensil-label-suggestion:hover,
  .utensil-label-suggestion.active {
    background-color: var(--pen-a3);
    color: var(--pen-11);
  }

  .utensil-label-suggestion:active {
    transform: scale(0.98);
  }

  .utensil-label-suggestion .utensil-icon {
    color: var(--pencil-11);
    font-size: var(--font-size-1);
    flex-shrink: 0;
  }

  .utensil-label-suggestion.highlighted {
    color: var(--pen-11);
  }

  .utensil-label-suggestion.highlighted .utensil-icon {
    color: var(--pen-11);
  }

  .utensil-label-suggestion:hover .utensil-icon,
  .utensil-label-suggestion.active .utensil-icon {
    color: var(--pen-11);
  }

  .utensil-label-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-5) var(--space-4);
    color: var(--pencil-11);
    text-align: center;
    margin-top: var(--space-3);
  }

  .utensil-label-empty .utensil-icon {
    font-size: var(--font-size-4);
    opacity: 0.6;
  }

  .utensil-label-empty small {
    font-size: var(--font-size-1);
    opacity: 0.8;
  }

  .utensil-label-hint {
    margin-top: var(--space-3);
    padding-top: var(--space-3);
    border-top: 1px solid var(--pencil-a6);
    text-align: center;
  }

  .utensil-label-hint small {
    font-size: var(--font-size-1);
    color: var(--pencil-11);
  }

  .utensil-label-hint kbd {
    background-color: var(--pencil-a4);
    border: 1px solid var(--pencil-a6);
    border-radius: var(--radius-1);
    padding: 2px 6px;
    font-size: var(--font-size-1);
    font-family: ui-monospace, monospace;
    margin: 0 2px;
  }

  /* Custom scrollbar for suggestions */
  .utensil-label-suggestions::-webkit-scrollbar {
    width: 6px;
  }

  .utensil-label-suggestions::-webkit-scrollbar-track {
    background: transparent;
  }

  .utensil-label-suggestions::-webkit-scrollbar-thumb {
    background: var(--pencil-a6);
    border-radius: var(--radius-1);
  }

  .utensil-label-suggestions::-webkit-scrollbar-thumb:hover {
    background: var(--pencil-a8);
  }
}
</style>
