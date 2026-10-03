<template>
  <!-- The browser's own menu never opens over this one: the Menu key raises it on release, by
       which time focus is in here -->
  <UtensilPopoverPositioned ref="popoverRef" v-model="isOpenModel" :position="position" @contextmenu.prevent>
    <UtensilMenu :active="isOpen" @close="close">
      <template #default="{ isFocused, focus }">
        <slot :close="close" :is-focused="isFocused" :focus="focus" />
      </template>
    </UtensilMenu>
  </UtensilPopoverPositioned>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import UtensilPopoverPositioned from '../popover/UtensilPopoverPositioned.vue'
import UtensilMenu from '../menu/UtensilMenu.vue'
import { normalizePosition, type ContextMenuPosition } from '../popover/utensil-popover-positioned'

interface Props {
  /** Whether the menu is open (controlled mode) */
  modelValue?: boolean
  /** Position to show the menu at - accepts { x, y } or { top, left } */
  position?: ContextMenuPosition
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  position: () => ({ x: 0, y: 0 }),
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const popoverRef = ref<InstanceType<typeof UtensilPopoverPositioned>>()
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
  if (isControlled.value) {
    emit('update:modelValue', true)
  } else {
    internalOpen.value = true
  }
}

/**
 * Force-opens the menu, even if a light-dismiss just closed it in the same event.
 * Use this for right-click re-triggering where the menu should reposition and stay open.
 */
function forceOpen() {
  popoverRef.value?.forceOpen()
}

function close() {
  if (isControlled.value) {
    emit('update:modelValue', false)
  } else {
    internalOpen.value = false
  }
}

function toggle() {
  // Delegate to the popover which tracks light-dismiss timing
  popoverRef.value?.toggle()
}

// Like a dialog, the menu hands focus back to where it opened from once it closes — unless its
// choice moved focus on, e.g. into a dialog
let returnFocus: HTMLElement | null = null

watch(isOpen, async (open) => {
  if (open) {
    const active = document.activeElement
    returnFocus = active instanceof HTMLElement && active !== document.body ? active : null
    return
  }

  const target = returnFocus
  returnFocus = null
  await nextTick()
  const active = document.activeElement
  const lost = !(active instanceof HTMLElement) || active === document.body || active.checkVisibility?.() === false

  if (target?.isConnected && lost) {
    target.focus({ preventScroll: true })
  }
})

// Normalize position to { x, y } format (supports legacy { top, left })
const position = computed(() => normalizePosition(props.position))

defineExpose({
  open,
  close,
  toggle,
  forceOpen,
  isOpen,
})
</script>
