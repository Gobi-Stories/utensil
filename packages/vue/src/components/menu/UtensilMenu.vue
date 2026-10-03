<template>
  <div ref="menuRef" class="utensil-menu" role="menu" tabindex="-1" @keydown="onKeydown">
    <slot :is-focused="isFocused" :focus="focusElement" :close="close" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, provide } from 'vue'
import { useFocusNavigation } from '../../composables/useFocusNavigation'
import { UtensilMenuContextKey } from './utensil-menu'

interface Props {
  /** Whether the menu is active and should handle keyboard navigation */
  active?: boolean
  /** Whether to auto-focus the menu when it becomes active */
  autoFocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  autoFocus: true,
})

const emit = defineEmits<{
  close: []
}>()

const menuRef = ref<HTMLElement>()

const { focusedElement, setFocused, clearFocus, handleKeydown, getItems } = useFocusNavigation(menuRef, {
  orientation: 'vertical',
})

provide(UtensilMenuContextKey, { setFocused })

/** Check if an element is the currently focused menu item */
function isFocused(el: HTMLElement | null): boolean {
  return el != null && focusedElement.value === el
}

/** Set focus on a menu item element (for custom child components) */
function focusElement(el: HTMLElement | null) {
  setFocused(el)
}

function close() {
  emit('close')
}

function onKeydown(event: KeyboardEvent) {
  if (!props.active) return

  if (event.key === 'Escape') {
    event.preventDefault()
    emit('close')
    return
  }

  // Let Enter and Space be handled by the focused item
  if (event.key === 'Enter' || event.key === ' ') {
    return
  }

  handleKeydown(event)
}

function focusItem(index: number) {
  const items = getItems()
  if (index >= 0 && index < items.length) {
    const element = items[index]
    if (element) {
      setFocused(element, { focus: true })
    }
  }
}

// Auto-focus menu when it becomes active
watch(
  () => props.active,
  (active) => {
    if (active && props.autoFocus) {
      nextTick(() => {
        menuRef.value?.focus()
      })
    }
    if (!active) {
      clearFocus()
    }
  },
)

// Focus on mount if active
onMounted(() => {
  if (props.active && props.autoFocus) {
    menuRef.value?.focus()
  }
})

defineExpose({
  focus: () => menuRef.value?.focus(),
  focusItem,
  focusedElement,
})
</script>

<style>
@layer utensil {
  .utensil-squared {
    --utensil-menu-padding: var(--space-1) 0;
  }

  .utensil-rounded {
    --utensil-menu-padding: var(--space-2) 0;
  }
}
</style>

<style scoped>
@layer utensil {
  .utensil-menu {
    --background-color: var(--utensil-menu-background-color, var(--panel-solid));

    display: flex;
    flex-direction: column;
    gap: 2px;
    background-color: var(--background-color);
    border-radius: var(--radius-3);
    box-shadow: var(--shadow-border-4);
    padding: var(--utensil-menu-padding);
    min-width: 160px;
    max-width: 280px;
  }

  .utensil-menu:focus {
    outline: none;
  }
}
</style>
