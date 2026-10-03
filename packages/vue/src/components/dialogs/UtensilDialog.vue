<template generic="Theme extends ThemeConfig">
  <UtensilModal
    ref="modal"
    class="utensil-dialog"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :closeOnBackdrop="closeOnBackdrop"
    :closeOnEscape="closeOnEscape"
    :appendToDom="appendToDom"
    :fullscreenOnMobile="fullscreenOnMobile"
    :size="size"
    :expand="expand || scrollable"
    :addHistory="addHistory"
    :blur="blur"
    :noShade="noShade"
    @opened="emit('opened')"
    @closing="emit('closing', $event)"
    @closed="closed"
    #="{ isOpen }"
  >
    <div class="utensil-dialog-content">
      <!-- Header -->
      <div v-if="title || showCloseButton || $slots.actions" class="dialog-header">
        <div class="header-content">
          <h2 v-if="title" class="dialog-title">{{ title }}</h2>
          <div v-if="$slots.actions || showCloseButton" class="header-actions">
            <div class="header-actions-desktop">
              <slot name="actions" :ok="ok" :cancel="cancel" :close="() => close()" :isOpen="isOpen" />
            </div>
            <UtensilCloseButton
              v-if="showCloseButton"
              class="header-close-button"
              :description="closeButtonDescription"
              @click="() => close()"
            />
          </div>
        </div>
        <div class="header-actions-mobile">
          <slot name="actions" :ok="ok" :cancel="cancel" :close="() => close()" :isOpen="isOpen" />
        </div>
      </div>

      <!-- Body -->
      <div class="dialog-body" :class="{ scrollable: scrollable }">
        <slot :ok="ok" :cancel="cancel" :close="() => close()" :isOpen="isOpen" />
      </div>

      <!-- Footer -->
      <div v-if="!noFooter" class="dialog-footer">
        <div v-if="$slots.message" class="footer-message">
          <slot name="message" :isOpen="isOpen" />
        </div>
        <slot name="footer" :ok="ok" :cancel="cancel" :close="() => close()" :isOpen="isOpen">
          <UtensilButton v-if="!noCancel" :variation="cancelVariation" :color="cancelColor" @click="cancel">
            {{ cancelLabel }}
          </UtensilButton>
          <UtensilButton
            ref="okButton"
            :variation="okVariation"
            :color="okColor"
            :busy="okLoading"
            :disabled="okDisabled"
            autofocus
            @click="ok"
          >
            {{ okLabel }}
          </UtensilButton>
        </slot>
      </div>
    </div>
  </UtensilModal>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { ref } from 'vue'
import UtensilModal from './UtensilModal.vue'
import UtensilCloseButton from '../circle-button/UtensilCloseButton.vue'
import UtensilButton from '../button/UtensilButton.vue'
import type { UtensilModalComponent } from './dialogs'
import type { ColorProp, UtensilUIVariation, ThemeConfig } from '../../theme/utensil-theme'

export interface Props<Theme extends ThemeConfig> {
  modelValue?: boolean
  // Title and header
  title?: string
  showCloseButton?: boolean
  closeButtonDescription?: string
  // Footer
  noFooter?: boolean
  noCancel?: boolean
  okLabel?: string
  okVariation?: UtensilUIVariation
  okColor?: ColorProp<Theme>
  cancelLabel?: string
  cancelVariation?: UtensilUIVariation
  cancelColor?: ColorProp<Theme>
  okLoading?: boolean
  okDisabled?: boolean
  noCloseOnOk?: boolean
  // UtensilModal props
  scrollable?: boolean
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

const {
  modelValue = false,
  showCloseButton = true,
  closeButtonDescription = 'Close',
  noFooter = false,
  noCancel = false,
  okLabel = 'OK',
  okVariation = 'solid',
  okColor = 'pen',
  cancelLabel = 'Cancel',
  cancelVariation = 'soft',
  cancelColor = 'pencil',
  okLoading = false,
  okDisabled = false,
  noCloseOnOk = false,
  scrollable = false,
  closeOnBackdrop = true,
  closeOnEscape = true,
  appendToDom = false,
  fullscreenOnMobile = false,
  size = 'medium',
  expand = false,
  addHistory = false,
  blur = true,
  noShade = false,
} = defineProps<Props<Theme>>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  opened: []
  closing: [event: Event]
  closed: []
  ok: []
  cancel: []
}>()

const modal = ref<UtensilModalComponent>()

function closed(): void {
  emit('update:modelValue', false)
  emit('closed')
}

function ok(): void {
  emit('ok')
  if (!noCloseOnOk) {
    modal.value?.close(true)
  }
}

function cancel(): void {
  emit('cancel')
  modal.value?.close()
}

function close(force = false) {
  modal.value?.close(force)
}

defineExpose({
  close,
})
</script>

<style scoped>
@layer utensil {
  .utensil-dialog {
    /* Configure modal container to match dialog radius */
    --utensil-modal-radius: var(--radius-4);
    container-type: inline-size;
  }

  .utensil-dialog-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    /* Cap at the modal container's max-height so the body scrolls and the footer
       stays pinned once the dialog reaches its maximum height. */
    max-height: inherit;
    background-color: var(--paper-3);
    border-radius: var(--radius-4);
  }

  .utensil-dialog-content .dialog-header {
    flex-shrink: 0;
    padding: var(--space-4) var(--space-5);
  }

  .utensil-dialog-content .dialog-header .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .utensil-dialog-content .dialog-title {
    margin: 0;
    font-size: var(--font-size-4);
    font-weight: 600;
    color: var(--pencil-12);
  }

  .utensil-dialog-content .header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .utensil-dialog-content .header-close-button {
    margin-right: calc(var(--space-5) * -0.5);
  }

  .utensil-dialog-content .header-actions-mobile {
    display: none;
    padding: var(--space-2) 0 0;
  }

  @container (max-width: 650px) {
    .utensil-dialog-content .header-actions-mobile {
      display: flex;
    }

    .utensil-dialog-content .header-actions-desktop {
      display: none;
    }
  }

  .utensil-dialog-content .dialog-body {
    flex: 1;
    padding: var(--space-5);
    padding-top: var(--space-2);
    overflow-y: auto;

    &.scrollable {
      height: 100%;
      overflow-y: auto;
    }
  }

  .utensil-dialog-content .dialog-footer {
    flex-shrink: 0;
    padding: var(--space-4);
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    gap: var(--space-2);
  }

  /* The message takes the room the buttons leave; when that is too little it wraps onto its own
     line above them. */
  .utensil-dialog-content .dialog-footer .footer-message {
    flex: 1 1 12rem;
    min-width: 0;
  }
}
</style>
