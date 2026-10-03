<template generic="Theme extends ThemeConfig">
  <UtensilPopover
    ref="popoverRef"
    :offset="0"
    width="anchor"
    class="utensil-select-base"
    :class="[variation, `placement-${placement}`, { disabled, open: isOpen }]"
    @placement-change="onPlacementChange"
  >
    <template #trigger="{ toggle: popoverToggle, isOpen: popoverOpen }">
      <slot
        name="trigger"
        :value="model"
        :is-open="popoverOpen"
        :placement="placement"
        :toggle="popoverToggle"
        :open="openPopover"
        :close="closePopover"
        :handle-keydown="handleTriggerKeydown"
      />
    </template>
    <template #default="{ close }">
      <UtensilListbox
        ref="listboxRef"
        :values="values"
        :focused-value="focusedValue"
        :aria-label="ariaLabel"
        @update:focused-value="setFocusedValue"
      >
        <template #default="{ focusedValue: listboxFocused, setFocusedValue: setListboxFocused }">
          <slot
            :value="model"
            :select="(value: string) => selectValue(value, close)"
            :focused-value="listboxFocused"
            :set-focused-value="setListboxFocused"
            :is-open="isOpen"
            :close="close"
          />
        </template>
      </UtensilListbox>
    </template>
  </UtensilPopover>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { ref, computed, watch, nextTick } from 'vue'
import type { ThemeConfig } from '../../theme/utensil-theme'
import UtensilPopover from '../popover/UtensilPopover.vue'
import UtensilListbox from '../listbox/UtensilListbox.vue'

export interface Props {
  /** Array of navigable values for keyboard navigation */
  values?: string[]
  /** Visual style variation */
  variation?: 'surface' | 'soft'
  /** Whether the select is disabled */
  disabled?: boolean
  /** Keeps the list open and only reports selections, for multi-select hosts */
  multiple?: boolean
  /** Accessible label for screen readers */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  values: () => [],
  variation: 'surface',
  disabled: false,
  multiple: false,
})

const emit = defineEmits<{
  change: [value: string]
}>()

const model = defineModel<string | null>({ default: null })

const popoverRef = ref<InstanceType<typeof UtensilPopover>>()
const listboxRef = ref<InstanceType<typeof UtensilListbox>>()
const focusedValue = ref<string | null>(null)
const placement = ref<'top' | 'bottom'>('bottom')

const isOpen = computed(() => popoverRef.value?.isOpen ?? false)

// Handle placement changes from popover
function onPlacementChange(detectedPlacement: string) {
  placement.value = detectedPlacement.startsWith('top') ? 'top' : 'bottom'
}

// Reset placement when popover closes
watch(isOpen, (open) => {
  if (!open) {
    placement.value = 'bottom'
  }
})

function selectValue(value: string, close: () => void) {
  // Multi-select hosts own the selection state and keep the list open for further picks.
  if (props.multiple) {
    emit('change', value)
    return
  }

  model.value = value
  emit('change', value)
  close()
}

function setFocusedValue(value: string | null) {
  focusedValue.value = value
}

function openPopover() {
  popoverRef.value?.open()
}

function closePopover() {
  popoverRef.value?.close()
}

function handleTriggerKeydown(event: KeyboardEvent) {
  if (props.disabled) return

  const open = isOpen.value
  const values = props.values

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (!open) {
        popoverRef.value?.open()
        nextTick(() => {
          focusedValue.value = model.value && values.includes(model.value) ? model.value : (values[0] ?? null)
        })
      } else {
        listboxRef.value?.focusNext()
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (!open) {
        popoverRef.value?.open()
        nextTick(() => {
          focusedValue.value = model.value && values.includes(model.value) ? model.value : (values[0] ?? null)
        })
      } else {
        listboxRef.value?.focusPrev()
      }
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (open && focusedValue.value) {
        selectValue(focusedValue.value, popoverRef.value!.close)
      } else if (open) {
        // No focused value - check if there's a focused custom element to click
        const focusedEl = listboxRef.value?.$el?.querySelector('[data-focused]') as HTMLElement | null
        if (focusedEl) {
          focusedEl.click()
        }
      } else {
        popoverRef.value?.open()
        nextTick(() => {
          focusedValue.value = model.value && values.includes(model.value) ? model.value : (values[0] ?? null)
        })
      }
      break
    case 'Escape':
      if (open) {
        event.preventDefault()
        popoverRef.value?.close()
      }
      break
    case 'Home':
      if (open) {
        event.preventDefault()
        listboxRef.value?.focusFirst()
      }
      break
    case 'End':
      if (open) {
        event.preventDefault()
        listboxRef.value?.focusLast()
      }
      break
  }
}

// Reset focused value when popover closes
watch(isOpen, (open) => {
  if (!open) {
    focusedValue.value = null
    listboxRef.value?.reset()
  }
})

defineExpose({
  open: () => popoverRef.value?.open(),
  close: () => popoverRef.value?.close(),
  toggle: () => popoverRef.value?.toggle(),
  isOpen,
})
</script>

<style scoped>
@layer utensil {
  .utensil-select-base {
    /* CSS custom properties for popover styling */
    --utensil-popover-background: var(--background);
    --utensil-popover-shadow: var(--shadow-border-3);
    --utensil-popover-padding: 0;
  }

  /* Popover radius based on placement */
  .utensil-select-base.placement-bottom {
    --utensil-popover-radius: 0 0 var(--radius-3) var(--radius-3);
  }

  .utensil-select-base.placement-top {
    --utensil-popover-radius: var(--radius-3) var(--radius-3) 0 0;
  }
}
</style>
