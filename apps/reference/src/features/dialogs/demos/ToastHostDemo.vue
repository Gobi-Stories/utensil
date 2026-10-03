<template>
  <ReferenceComponentDemo
    title="Toast Host"
    anchor="toast-host"
    description="Manages multiple concurrent toasts with reactive handles for progress updates and dismissal."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton @click="fireAndForget">Fire & Forget</UtensilButton>
        </div>
        <div class="demo-label">Multiple Toasts</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton @click="showProgressStackToast">Progress Toast</UtensilButton>
        </div>
        <div class="demo-label">Progress Handle</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton @click="showDismissibleStackToast">Dismissible</UtensilButton>
        </div>
        <div class="demo-label">Dismissible Stack</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton @click="showMixedStackToasts">Mixed</UtensilButton>
        </div>
        <div class="demo-label">Mixed Types</div>
      </div>
    </div>

    <template #api>
      <UtensilToastHostDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import UtensilToastHostDoc from 'utensil-vue/components/toast/UtensilToastHostDoc.vue'
import UtensilButton from 'utensil-vue/components/button/UtensilButton.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { toasts } from '@/app/reference-toast'

const { add: showToast } = toasts

function fireAndForget() {
  showToast('First toast')
  setTimeout(() => showToast('Second toast', { color: 'success' }), 300)
  setTimeout(() => showToast('Third toast', { color: 'warning' }), 600)
}

function showProgressStackToast() {
  const handle = showToast('Uploading file...', { progress: 0 })
  let value = 0
  const interval = setInterval(() => {
    value += 0.1
    if (value >= 1) {
      clearInterval(interval)
      handle.update({ message: 'Upload complete', icon: 'check', color: 'success' })
      setTimeout(() => handle.dismiss(), 2000)
      return
    }
    handle.update({ progress: value })
  }, 300)
}

function showDismissibleStackToast() {
  showToast('Dismissible toast 1', { dismissible: true, time: 0 })
  setTimeout(() => showToast('Dismissible toast 2', { dismissible: true, time: 0 }), 200)
}

function showMixedStackToasts() {
  showToast('Quick notification')
  setTimeout(() => showToast('Processing...', { busy: true, time: 5000 }), 200)
  setTimeout(() => showToast('Dismiss me!', { dismissible: true, time: 0, color: 'warning' }), 400)
}
</script>

<style scoped>
.demo-content {
  min-height: 140px;
}
</style>
