<template>
  <ReferenceComponentDemo
    title="Confirm"
    anchor="confirm"
    description="Confirmation dialog component for user confirmations and destructive actions."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <UtensilConfirm
            title="Delete Item"
            message="Are you sure you want to delete this item? This action cannot be undone."
            ok-label="Delete Item"
            okVariation="solid"
            ok-color="error"
            @ok="handleConfirmOk"
            @cancel="handleConfirmCancel"
          >
            <template #default="{ confirm }">
              <UtensilButton color="error" @click="confirm()">Delete Item</UtensilButton>
            </template>
          </UtensilConfirm>
        </div>
        <div class="demo-label">Basic Confirmation</div>
        <div class="demo-code">
          <code
            >&lt;UtensilConfirm title="Delete" message="Are you
            sure?"&gt;&lt;UtensilButton&gt;Delete&lt;/UtensilButton&gt;&lt;/UtensilConfirm&gt;</code
          >
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilConfirm
            title="Save Changes"
            ok-label="Save"
            okVariation="solid"
            ok-color="success"
            @ok="handleSaveConfirm"
          >
            <template #default="{ confirm }">
              <UtensilButton color="success" @click="confirm()">Save Document</UtensilButton>
            </template>
            <template #message>
              <p>Do you want to save your changes before closing?</p>
              <p><strong>Unsaved changes will be lost.</strong></p>
            </template>
          </UtensilConfirm>
        </div>
        <div class="demo-label">Custom Message</div>
        <div class="demo-code">
          <code
            >&lt;UtensilConfirm&gt;&lt;template #message&gt;Custom content&lt;/template&gt;&lt;/UtensilConfirm&gt;</code
          >
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilConfirm
            title="Proceed?"
            message="This will start the process immediately."
            no-cancel
            ok-label="Proceed"
            size="small"
            @ok="handleProceed"
          >
            <template #default="{ confirm }">
              <UtensilButton @click="confirm()">Start Process</UtensilButton>
            </template>
          </UtensilConfirm>
        </div>
        <div class="demo-label">No Cancel Button</div>
        <div class="demo-code">
          <code>&lt;UtensilConfirm :no-cancel="true"&gt;...&lt;/UtensilConfirm&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <div class="bulk-actions-demo">
            <div class="selected-items">Selected: {{ selectedItems.length }} items</div>
            <div class="bulk-buttons">
              <UtensilConfirm
                title="Bulk Delete"
                :message="`Delete ${selectedItems.length} selected items?`"
                ok-label="Delete All"
                okVariation="solid"
                @ok="handleBulkDelete"
              >
                <template #default="{ confirm }">
                  <UtensilButton color="error" :disabled="selectedItems.length === 0" @click="confirm()">
                    Delete Selected
                  </UtensilButton>
                </template>
              </UtensilConfirm>
              <UtensilButton size="small" @click="toggleSelection">Toggle Selection</UtensilButton>
            </div>
          </div>
        </div>
        <div class="demo-label">Bulk Actions</div>
        <div class="demo-code">
          <code>&lt;UtensilConfirm :message="`Delete ${count} items?`"&gt;...&lt;/UtensilConfirm&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilConfirm
            title="Factory Reset"
            message="Are you sure you want to delete this item? This action cannot be undone."
            ok-label="Delete"
            okVariation="outline"
            cancel-label="Cancel"
            adopt-child-button
            size="small"
            @ok="handleConfirmOk"
            @cancel="handleConfirmCancel"
          >
            <template #default="{ confirm }">
              <UtensilButton variation="outline" @click="confirm">Factory Reset</UtensilButton>
            </template>
          </UtensilConfirm>
        </div>
        <div class="demo-label always-visible">Adopt Child Button</div>
        <div class="demo-code">
          <code
            >&lt;UtensilConfirm title="Factory Reset" message="Are you sure?"
            adopt-child-button&gt;&lt;UtensilButton&gt;Delete&lt;/UtensilButton&gt;&lt;/UtensilConfirm&gt;</code
          >
        </div>
      </div>
    </div>

    <template #api>
      <UtensilConfirmDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilConfirm from '@gobistories/utensil-vue/components/dialogs/UtensilConfirm.vue'
import UtensilConfirmDoc from '@gobistories/utensil-vue/components/dialogs/UtensilConfirmDoc.vue'
import UtensilButton from '@gobistories/utensil-vue/components/button/UtensilButton.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { toasts } from '@/app/reference-toast'

const { add: showToast } = toasts

const selectedItems = ref(['item1', 'item2'])

function handleConfirmOk() {
  showToast('Item deleted!')
}

function handleConfirmCancel() {
  showToast('Delete cancelled')
}

function handleSaveConfirm() {
  showToast('Document saved!')
}

function handleProceed() {
  showToast('Process started!')
}

function handleBulkDelete() {
  showToast(`Deleted ${selectedItems.value.length} items!`)
  selectedItems.value = []
}

function toggleSelection() {
  if (selectedItems.value.length > 0) {
    selectedItems.value = []
  } else {
    selectedItems.value = ['item1', 'item2', 'item3', 'item4', 'item5']
  }
}
</script>

<style scoped>
.demo-content {
  min-height: 140px;
}

.bulk-actions-demo {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  text-align: center;
}

.selected-items {
  font-weight: 500;
  color: var(--pencil-11);
}

.bulk-buttons {
  display: flex;
  gap: var(--space-2);
  justify-content: center;
  flex-wrap: wrap;
}
</style>
