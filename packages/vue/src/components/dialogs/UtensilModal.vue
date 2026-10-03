<template>
  <dialog
    ref="dialog"
    class="utensil-modal"
    tabindex="-1"
    :class="{ 'fullscreen-on-mobile': fullscreenOnMobile, blur, 'no-overlay': noShade }"
    @click="backdropClose"
    @cancel="closing"
    @close="closed"
  >
    <div class="utensil-modal-container" :class="{ [size]: true, expand: expand }" @click.stop>
      <slot :close="(force: boolean) => close(force === true)" :isOpen="isOpen" />
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useModalHost } from './useModalHost'
import { useModalKeyboard } from '../../composables/use-modal-keyboard'

const modalHostRef = useModalHost()

interface Props {
  modelValue?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  appendToDom?: boolean
  fullscreenOnMobile?: boolean
  size?: 'small' | 'medium' | 'large'
  expand?: boolean
  addHistory?: boolean
  blur?: boolean
  noShade?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  closeOnBackdrop: true,
  closeOnEscape: true,
  appendToDom: false,
  fullscreenOnMobile: false,
  size: 'large',
  expand: false,
  addHistory: false,
  blur: true,
  noShade: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  opened: []
  closing: [event: Event]
  closed: []
}>()

const isOpen = computed(() => props.modelValue)

const dialog = ref<HTMLDialogElement>()
const originalParent = ref<Node | null>(null)
const originalNextSibling = ref<Node | null>(null)
const addedHistory = ref(false)
let historyMarker: number | null = null

const dialogElement = computed(() => dialog.value!)

useModalKeyboard(dialog)

onMounted(() => {
  if (props.appendToDom) {
    moveToDomBody()
  }
  syncShowState()
})

watch(
  () => props.modelValue,
  () => {
    syncShowState()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  // Ensure dialog is closed before destroying
  if (dialogElement.value && dialogElement.value.open) {
    dialogElement.value.close()
  }

  // Restore original position if moved
  if (props.appendToDom) {
    restoreDomPosition()
  }
})

function moveToDomBody(): void {
  if (!dialogElement.value) {
    return
  }

  if (!modalHostRef.value) {
    return
  }

  // Store original position for restoration
  originalParent.value = dialogElement.value.parentNode
  originalNextSibling.value = dialogElement.value.nextSibling

  // Move dialog to the host element
  modalHostRef.value.appendChild(dialogElement.value)
}

function restoreDomPosition(): void {
  if (!dialogElement.value || !originalParent.value) {
    return
  }

  if (originalNextSibling.value) {
    originalParent.value.insertBefore(dialogElement.value, originalNextSibling.value)
  } else {
    originalParent.value.appendChild(dialogElement.value)
  }

  originalParent.value = null
  originalNextSibling.value = null
}

function syncShowState(): void {
  nextTick(() => {
    if (!dialogElement.value) {
      return
    }

    if (props.modelValue === dialogElement.value.open) {
      return
    }

    const show = props.modelValue && !dialogElement.value.open
    if (!show) {
      dialogElement.value.close()
      return
    }

    dialogElement.value.showModal()
    emit('opened')
    pushHistory()
  })
}

// A close request fires the same cancel event as Escape; this tells the two apart
let closeRequested = false

function closing(cancelEvent: Event): void {
  // The native cancel (Escape) is held back for a dialog that mustn't light-dismiss
  if (!props.closeOnEscape && !closeRequested) {
    cancelEvent.preventDefault()
    return
  }

  emit('closing', cancelEvent)

  // Check if the event was cancelled
  nextTick(() => {
    if (cancelEvent.defaultPrevented) {
      pushHistory()
    }
  })
}

function pushHistory() {
  if (!props.addHistory) {
    return
  }

  if (addedHistory.value) {
    return
  }

  addedHistory.value = true
  // Stamp the entry so popstate can tell whether navigation popped a child
  // layer (e.g. a nested stage) or the modal itself. Without this marker any
  // history.back() from a child would close the modal too.
  historyMarker = Date.now() + Math.random()
  history.pushState({ utensilModalMarker: historyMarker }, '')
  window.addEventListener('popstate', historyPopped)
}

function historyPopped(e: PopStateEvent) {
  // A child layer popped its own entry — we're still the active state, stay open.
  if (e.state?.utensilModalMarker === historyMarker) {
    return
  }

  addedHistory.value = false
  historyMarker = null
  window.removeEventListener('popstate', historyPopped)
  close()
}

function close(force = false) {
  if (force) {
    dialogElement.value.close()
    return
  }

  // Use requestClose if available, otherwise close directly
  closeRequested = true
  try {
    dialogElement.value.requestClose()
  } catch {
    dialogElement.value.close()
  } finally {
    closeRequested = false
  }
}

function backdropClose(): void {
  if (!props.closeOnBackdrop) {
    return
  }

  close()
}

function closed(): void {
  emit('update:modelValue', false)
  emit('closed')

  if (addedHistory.value) {
    addedHistory.value = false
    historyMarker = null
    window.removeEventListener('popstate', historyPopped)
    // Remove the pushed state
    history.back()
  }
}

defineExpose({
  close,
})
</script>

<style scoped>
@layer utensil {
  .utensil-modal {
    --dialog-padding: 0;
    --dialog-max-width: 90vw;
    --dialog-max-height: 85vh;
    --dialog-backdrop-color: var(--overlay);
    --backdrop-blur: var(--utensil-modal-backdrop-blur, 4px);
    --close-button-size: 32px;

    &.no-overlay {
      --dialog-backdrop-color: transparent;
    }

    /* Reset dialog default styles while preserving essential functionality */
    border: none;
    padding: 0;
    margin: 0;
    background: transparent;
    color: inherit;
    font: inherit;

    /* Override default dialog positioning */
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;

    /* Center content using flexbox */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* The dialog takes focus only to keep keys inside; it isn't a control */
  .utensil-modal:focus {
    outline: none;
  }

  /* Style the backdrop */
  .utensil-modal::backdrop {
    background-color: var(--dialog-backdrop-color);
  }

  .utensil-modal.blur::backdrop {
    backdrop-filter: blur(var(--backdrop-blur));
  }

  /* Fullscreen on mobile */
  .utensil-modal.fullscreen-on-mobile .utensil-modal-container {
    @media (max-width: 656px) {
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
      border-radius: 0;
    }
  }

  .utensil-modal-container {
    /* Cvar for configuring border radius from parent components */
    --modal-radius: var(--utensil-modal-radius, 0);

    position: relative;
    width: var(--dialog-max-width);
    max-width: var(--dialog-max-width);
    max-height: var(--dialog-max-height);
    align-content: center;
    padding: var(--dialog-padding);
    border: none;
    border-radius: var(--modal-radius);
    box-shadow: var(--shadow-5);
    overflow: hidden;
  }

  .utensil-modal.no-overlay .utensil-modal-container {
    box-shadow: var(--shadow-border-5);
  }

  .utensil-modal-container.expand {
    height: var(--dialog-max-height);
  }

  /* Size variants */
  .utensil-modal-container.small {
    --dialog-max-width: 400px;
    --dialog-max-height: 300px;
  }

  .utensil-modal-container.medium {
    --dialog-max-width: 600px;
    --dialog-max-height: 500px;
  }

  .utensil-modal-content {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  /* Medium screens */
  @media (min-width: 768px) {
    .utensil-modal {
      --dialog-max-width: 80vw;
      --dialog-max-height: 80vh;
    }

    .utensil-modal-container.small {
      --dialog-max-width: 450px;
      --dialog-max-height: 350px;
    }

    .utensil-modal-container.medium {
      --dialog-max-width: 650px;
      --dialog-max-height: 550px;
    }
  }

  /* Large screens */
  @media (min-width: 1200px) {
    .utensil-modal {
      --dialog-max-width: 70vw;
      --dialog-max-height: 80vh;
    }
  }

  /* Ensure dialog doesn't show when not open */
  .utensil-modal:not([open]) {
    display: none !important;
  }
}
</style>
