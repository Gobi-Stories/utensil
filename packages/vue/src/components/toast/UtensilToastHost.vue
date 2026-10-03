<template generic="Theme extends ThemeConfig">
  <div ref="stackRef" class="utensil-toast-host">
    <UtensilToast
      v-for="toast in displayToasts"
      :key="toast.id"
      :show="toast.show"
      :message="toast.message"
      :color="toast.color"
      :scale="toast.scale"
      :busy="toast.busy"
      :progress="toast.progress"
      :dismissible="toast.dismissible"
      :icon="toast.icon"
      :action="toast.action"
      :onDismiss="() => dismissToast(toast)"
      :onClick="toast.onClick"
      :data-toast-id="toast.id"
      @transitionend="(event: TransitionEvent) => onTransitionEnd(toast.id, event)"
    />
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { ref, watch, onMounted, computed } from 'vue'
import type { ThemeConfig } from '../../theme/utensil-theme'
import type { ToastEntry } from './useToasts'
import UtensilToast from './UtensilToast.vue'

// Note: The useToasts composable can provide the props
const props = defineProps<{
  toasts: ToastEntry<Theme>[]
  dismiss: (id: number) => void
  remove: (id: number) => void
}>()

const stackRef = ref<HTMLElement>()
const heights: Record<number, number> = {}
let gap = 8

onMounted(() => {
  if (stackRef.value) {
    const value = getComputedStyle(stackRef.value).getPropertyValue('--toast-gap')
    const parsed = parseFloat(value)
    if (!Number.isNaN(parsed)) {
      gap = parsed
    }
  }
})

// Reverse toasts so newer toasts get a later DOM order and are stacked on top
const displayToasts = computed(() => [...props.toasts].reverse())

// Runs only for the user's dismissal — timed dismissals go straight through the stack
function dismissToast(toast: ToastEntry<Theme>) {
  toast.onDismiss?.()
  props.dismiss(toast.id)
}

function recalculate() {
  if (!stackRef.value) {
    return
  }

  const active = props.toasts.filter((toast) => !toast.leaving)

  let offset = 0
  for (let i = active.length - 1; i >= 0; i--) {
    const toast = active[i]
    const el = stackRef.value.querySelector<HTMLElement>(`[data-toast-id="${toast.id}"]`)
    if (!el) {
      continue
    }

    // Measure once on first appearance
    if (!(toast.id in heights)) {
      heights[toast.id] = el.offsetHeight
    }

    el.style.setProperty('--utensil-toast-offset', `${offset}`)
    offset += heights[toast.id] + gap
  }
}

// Recalculate after every relevant DOM update
watch(() => props.toasts.map((toast) => `${toast.id}:${toast.show}:${toast.leaving}`), recalculate, { flush: 'post' })

function onTransitionEnd(toastId: number, event: TransitionEvent) {
  const toast = props.toasts.find((toast) => toast.id === toastId)
  if (!toast) {
    return
  }

  if (toast.show) {
    return
  }

  // Listen for opacity specifically since it determines visibility
  // Checking translate would fire multiple times
  if (event.propertyName !== 'opacity') {
    return
  }

  const target = event.target as HTMLElement
  if (!target.classList.contains('utensil-toast')) {
    return
  }

  delete heights[toast.id]
  props.remove(toast.id)
}
</script>

<style scoped>
@layer utensil {
  .utensil-toast-host {
    --toast-z-index: var(--side-menu-z-index, 100);
    --toast-gap: var(--utensil-toast-host-gap, var(--space-2));

    pointer-events: none;
  }

  .utensil-toast-item {
    position: absolute;
    inset-inline: 0;
    width: fit-content;
    margin-inline: auto;
    transition: bottom 0.3s ease;
  }
}
</style>
