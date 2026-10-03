<template>
  <ReferenceComponentDemo
    title="Toast"
    anchor="toast"
    description="Non-blocking feedback notification that appears briefly at the bottom of the viewport."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton variation="overlay" @click="showToast('Hello from UtensilToast!')">Default</UtensilButton>
        </div>
        <div class="demo-label">Default</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton @click="showToast('Hello from UtensilToast!', { color: 'pen' })">Pen</UtensilButton>
        </div>
        <div class="demo-label">Default</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceButton color="primary" @click="showToast('Say it with passion!', { color: 'primary' })">
            <span>Primary</span>
          </ReferenceButton>
        </div>
        <div class="demo-label">Primary</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton color="success" @click="showToast('Changes saved!', { color: 'success' })"
            >Success</UtensilButton
          >
        </div>
        <div class="demo-label">Success</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton color="warning" @click="showToast('Proceed with caution', { color: 'warning' })"
            >Warning</UtensilButton
          >
        </div>
        <div class="demo-label">Warning</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton
            color="error"
            @click="
              showToast('Something went wrong', {
                color: 'error',
                action: { label: 'Retry', onAction: () => null },
              })
            "
          >
            <span>Error</span>
          </UtensilButton>
        </div>
        <div class="demo-label">Error</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceButton color="favorite" @click="showToast('New version available', { color: 'favorite' })">
            <span>Favorite</span>
          </ReferenceButton>
        </div>
        <div class="demo-label">Favorite</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceButton
            color="warning"
            @click="showToast('What\'s that coming over the hill?', { color: 'warning', scale: 'giant' })"
          >
            <span>B.F.G</span>
          </ReferenceButton>
        </div>
        <div class="demo-label">Large</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton @click="showToast('Processing...', { busy: true, time: 3000 })">Busy</UtensilButton>
        </div>
        <div class="demo-label">Busy</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton @click="showProgressToast">Progress</UtensilButton>
        </div>
        <div class="demo-label">Progress</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton @click="showToast('Dismissible toast', { dismissible: true, time: 0 })"
            >Dismissible</UtensilButton
          >
        </div>
        <div class="demo-label">Dismissible</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton color="success" @click="showToast('Changes saved!', { color: 'success', icon: 'check' })">
            With Icon
          </UtensilButton>
        </div>
        <div class="demo-label">With Icon</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton
            @click="
              showToast('Item deleted', {
                action: { label: 'Undo', onAction: () => showToast('Undone!') },
                time: 5000,
              })
            "
          >
            With Action
          </UtensilButton>
        </div>
        <div class="demo-label">With Action</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton @click="showToast('This toast persists', { time: 0, dismissible: true })"
            >Persistent</UtensilButton
          >
        </div>
        <div class="demo-label">Persistent</div>
      </div>
    </div>

    <template #api>
      <UtensilToastDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import UtensilToastDoc from 'utensil-vue/components/toast/UtensilToastDoc.vue'
import UtensilButton from 'utensil-vue/components/button/UtensilButton.vue'
import { ReferenceButton } from '@/theme/components/ReferenceButton'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { toasts } from '@/app/reference-toast'

const { add: showToast } = toasts

function showProgressToast() {
  const handle = showToast('Uploading...', { progress: 0 })
  let value = 0
  const interval = setInterval(() => {
    value += 0.1
    if (value >= 1) {
      clearInterval(interval)
      handle.update({ message: 'Upload complete!', color: 'success', icon: 'check' })
      setTimeout(() => handle.dismiss(), 2000)
      return
    }
    handle.update({ progress: value })
  }, 300)
}
</script>

<style scoped>
.demo-content {
  min-height: 140px;
}
</style>
