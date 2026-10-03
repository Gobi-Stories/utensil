<template>
  <div id="programmatic-dialogs" class="component-demo">
    <h3><a class="demo-anchor" href="#programmatic-dialogs">Programmatic Dialogs</a></h3>
    <p>
      Show dialogs and confirmations programmatically using composables, without template-level component instances.
    </p>
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton @click="openProgrammaticDialog">Show Dialog</UtensilButton>
        </div>
        <div class="demo-label">showReferenceDialog()</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton @click="openProgrammaticConfirm">Show Confirm</UtensilButton>
        </div>
        <div class="demo-label">showReferenceConfirm()</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UtensilButton from 'utensil-vue/components/button/UtensilButton.vue'
import { toasts } from '@/app/reference-toast'
import { showReferenceDialog } from '@/app/reference-dialog'
import { showReferenceConfirm } from '@/app/reference-confirm'

const { add: showToast } = toasts

function openProgrammaticDialog() {
  showReferenceDialog({
    title: 'Programmatic Dialog',
    message: 'This dialog was opened programmatically — no template wiring needed.',
    onOk: () => showToast('Programmatic dialog OK!'),
  })
}

function openProgrammaticConfirm() {
  showReferenceConfirm({
    title: 'Programmatic Confirm',
    message: 'This confirm was opened programmatically - no template wiring needed.',
    onOk: () => showToast('Confirmed programmatically!'),
  })
}
</script>

<style scoped>
.demo-content {
  min-height: 140px;
}
</style>
