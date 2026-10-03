<template generic="Theme extends ThemeConfig">
  <div class="utensil-confirm">
    <!-- Trigger slot -->
    <slot :confirm="confirm" :isOpen="isOpen"></slot>

    <!-- Confirmation dialog -->
    <UtensilDialog
      ref="dialog"
      :model-value="isOpen"
      @update:model-value="isOpen = $event"
      :title="title"
      :size="size"
      :noCancel="noCancel"
      :okLabel="okLabel"
      :okVariation="okVariation"
      :okColor="okColor"
      :cancelLabel="cancelLabel"
      :cancelVariation="cancelVariation"
      :cancelColor="cancelColor"
      :noCloseOnOk="noCloseOnOk"
      :closeOnBackdrop="closeOnBackdrop"
      :closeOnEscape="closeOnEscape"
      :appendToDom="appendToDom"
      :scrollable="scrollable"
      :fullscreenOnMobile="fullscreenOnMobile"
      :addHistory="addHistory"
      :blur="blur"
      @ok="ok"
      @opened="emit('opened')"
      @cancel="emit('cancel')"
      @closing="emit('closing', $event)"
      @closed="closed"
    >
      <!-- Message content -->
      <template #default="{ ok, cancel }">
        <slot name="message" :ok="ok" :cancel="cancel" :close="() => close()">
          {{ message }}
        </slot>
      </template>

      <!-- Custom footer for adoptChildButton mode -->
      <template v-if="adoptChildButton" #footer="{ ok, cancel }">
        <!-- Cancel slot when noCancel is true -->
        <slot v-if="noCancel" name="cancel" :ok="ok" :cancel="cancel" :close="() => close()" />
        <!-- Otherwise, show cancel button -->
        <UtensilButton v-else :variation="cancelVariationProp" :color="cancelColorProp" @click="cancel">
          {{ cancelLabel }}
        </UtensilButton>
        <!-- Replace OK button with the trigger content -->
        <slot v-if="!isOpen" :confirm="confirm"></slot>
        <slot v-else :confirm="ok"></slot>
      </template>
      <template v-else #footer="{ ok, cancel }">
        <slot name="footer" :ok="ok" :cancel="cancel" :close="() => close()" />
      </template>
    </UtensilDialog>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed, ref } from 'vue'
import UtensilDialog from './UtensilDialog.vue'
import UtensilButton from '../button/UtensilButton.vue'
import type { UtensilDialogComponent } from './dialogs'
import type { ColorProp, UtensilUIVariation, ThemeConfig } from '../../theme/utensil-theme'

export interface Props<Theme extends ThemeConfig> {
  // Content
  title?: string
  message?: string
  // Behavior
  adoptChildButton?: boolean
  noCancel?: boolean
  noCloseOnOk?: boolean
  // Labels
  okLabel?: string
  okVariation?: UtensilUIVariation
  okColor?: ColorProp<Theme>
  cancelLabel?: string
  cancelVariation?: UtensilUIVariation
  cancelColor?: ColorProp<Theme>
  // Dialog props
  size?: 'small' | 'medium' | 'large'
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  appendToDom?: boolean
  scrollable?: boolean
  fullscreenOnMobile?: boolean
  addHistory?: boolean
  blur?: boolean
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  closeOnBackdrop: false,
  closeOnEscape: true,
  size: 'medium',
  blur: true,
})

const cancelVariationProp = computed<UtensilUIVariation>(() => props.cancelVariation || 'soft')
const cancelColorProp = computed<ColorProp<Theme>>(() => props.cancelColor || 'pencil')

const emit = defineEmits<{
  open: []
  ok: []
  cancel: []
  opened: []
  closing: [event: Event]
  closed: []
}>()

const dialog = ref<UtensilDialogComponent>()
const isOpen = ref(false)
const okCallback = ref<() => void>()

function confirm(ok?: () => void): void {
  okCallback.value = ok
  isOpen.value = true
  emit('open')
}

function ok(): void {
  emit('ok')
  okCallback.value?.()
}

function close(force = false) {
  dialog.value?.close(force)
}

function closed(): void {
  emit('closed')
  isOpen.value = false
  okCallback.value = undefined
}

defineExpose({
  confirm,
  close,
})
</script>
