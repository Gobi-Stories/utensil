<template>
  <ReferenceComponentDemo
    title="Modal"
    anchor="modal"
    description="Base modal component with backdrop, sizing, and positioning capabilities."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton @click="basicModal = true">Open Basic Modal</UtensilButton>
          <UtensilModal v-model="basicModal" class="modal-demo">
            <div class="modal-content-demo">
              <h3>Basic Modal</h3>
              <p>This is a basic modal without any built-in structure.</p>
              <p>You can put any content here and handle the layout yourself.</p>
              <div class="modal-actions">
                <UtensilButton @click="basicModal = false">Close</UtensilButton>
              </div>
            </div>
          </UtensilModal>
        </div>
        <div class="demo-label">Basic Modal</div>
        <div class="demo-code">
          <code>&lt;UtensilModal v-model="showModal"&gt;Content&lt;/UtensilModal&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <div class="modal-size-buttons">
            <UtensilButton size="small" @click="openSizeModal('small')">Small</UtensilButton>
            <UtensilButton size="small" @click="openSizeModal('medium')">Medium</UtensilButton>
            <UtensilButton size="small" @click="openSizeModal('large')">Large</UtensilButton>
          </div>
          <UtensilModal v-model="sizeModal.show" :size="sizeModal.size" class="modal-demo">
            <div class="modal-content-demo">
              <h3>{{ ucfirst(sizeModal.size) }} Modal</h3>
              <p>This modal demonstrates the {{ sizeModal.size }} size variant.</p>
              <div class="modal-actions">
                <UtensilButton @click="sizeModal.show = false">Close</UtensilButton>
              </div>
            </div>
          </UtensilModal>
        </div>
        <div class="demo-label">Size Variants</div>
        <div class="demo-code">
          <code>&lt;UtensilModal size="medium"&gt;...&lt;/UtensilModal&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton @click="blurModal = true">Blurred Backdrop</UtensilButton>
          <UtensilModal v-model="blurModal" blur size="small" class="modal-demo">
            <div class="modal-content-demo">
              <h3>Blurred Backdrop</h3>
              <p>The page behind the backdrop is blurred. Tune the level with --utensil-modal-backdrop-blur.</p>
              <div class="modal-actions">
                <UtensilButton @click="blurModal = false">Close</UtensilButton>
              </div>
            </div>
          </UtensilModal>
        </div>
        <div class="demo-label always-visible">Blurred Backdrop</div>
        <div class="demo-code">
          <code>&lt;UtensilModal blur&gt;...&lt;/UtensilModal&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton @click="scrollableModal = true">Scrollable Content</UtensilButton>
          <UtensilModal v-model="scrollableModal" :expand="true" size="medium" class="modal-demo">
            <div class="modal-content-demo scrollable">
              <h3>Scrollable Modal</h3>
              <p>This modal has a lot of content that demonstrates scrolling behavior.</p>
              <div v-for="i in 20" :key="i" class="content-block">
                <p>
                  Content block {{ i }}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <div class="modal-actions">
                <UtensilButton @click="scrollableModal = false">Close</UtensilButton>
              </div>
            </div>
          </UtensilModal>
        </div>
        <div class="demo-label">Scrollable Modal</div>
        <div class="demo-code">
          <code>&lt;UtensilModal :expand="true"&gt;...&lt;/UtensilModal&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilModalDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilModal from 'utensil-vue/components/dialogs/UtensilModal.vue'
import UtensilModalDoc from 'utensil-vue/components/dialogs/UtensilModalDoc.vue'
import UtensilButton from 'utensil-vue/components/button/UtensilButton.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

const basicModal = ref(false)
const blurModal = ref(false)
const scrollableModal = ref(false)
const sizeModal = ref<{ show: boolean; size: 'small' | 'medium' | 'large' }>({ show: false, size: 'medium' })

function openSizeModal(size: 'small' | 'medium' | 'large') {
  sizeModal.value = { show: true, size }
}

function ucfirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<style scoped>
.demo-content {
  min-height: 140px;
}

.modal-demo {
  --utensil-modal-radius: var(--radius-5);
}

.modal-content-demo {
  background-color: var(--pencil-1);
  border-radius: var(--radius-5);
  padding: var(--space-6);
  margin: 0 auto;

  &.scrollable {
    height: 100%;
    border-radius: 0;
    overflow-y: auto;
  }
}

.modal-content-demo h3 {
  margin-top: 0;
  color: var(--pencil-12);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  margin-top: var(--space-5);
}

.modal-size-buttons {
  display: flex;
  gap: var(--space-2);
  justify-content: center;
  flex-wrap: wrap;
}

.content-block {
  margin-bottom: var(--space-3);
  padding: var(--space-2);
  background-color: var(--pencil-3);
  border-radius: var(--radius-2);
}
</style>
