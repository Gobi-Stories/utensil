<template>
  <UtensilPopover
    class="utensil-dropdown-menu"
    ref="popoverRef"
    v-model="isOpenModel"
    :placement="placement"
    :offset="offset"
  >
    <template #trigger="{ toggle: popoverToggle, isOpen: popoverIsOpen }">
      <slot name="trigger" :toggle="popoverToggle" :is-open="popoverIsOpen" :open="open" :close="close" />
    </template>
    <template #default="{ close: popoverClose }">
      <UtensilMenu :active="isOpen" @close="popoverClose">
        <template #default="{ isFocused, focus }">
          <slot :close="popoverClose" :is-focused="isFocused" :focus="focus" />
        </template>
      </UtensilMenu>
    </template>
  </UtensilPopover>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import UtensilPopover from '../popover/UtensilPopover.vue'
import UtensilMenu from '../menu/UtensilMenu.vue'
import type { PopoverPlacement } from '../popover/utensil-popover'

interface Props {
  /** Whether the menu is open (controlled mode) */
  modelValue?: boolean
  /** Placement of the menu relative to the trigger */
  placement?: PopoverPlacement
  /** Offset from the trigger */
  offset?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  placement: 'bottom-start',
  offset: 4,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const popoverRef = ref<InstanceType<typeof UtensilPopover>>()
const internalOpen = ref(false)

// Controlled vs uncontrolled mode
const isControlled = computed(() => props.modelValue !== undefined)
const isOpen = computed(() => (isControlled.value ? props.modelValue! : internalOpen.value))

// Two-way binding for the popover
const isOpenModel = computed({
  get: () => isOpen.value,
  set: (value: boolean) => {
    if (isControlled.value) {
      emit('update:modelValue', value)
    } else {
      internalOpen.value = value
    }
  },
})

function open() {
  popoverRef.value?.open()
}

function close() {
  popoverRef.value?.close()
}

function toggle() {
  popoverRef.value?.toggle()
}

defineExpose({
  open,
  close,
  toggle,
  isOpen,
})
</script>

<style scoped>
.utensil-dropdown-menu {
  --utensil-popover-shadow: var(--shadow-border-4);
  --utensil-popover-radius: var(--radius-3);
}
</style>
