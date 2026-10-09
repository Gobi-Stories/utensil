<template>
  <ReferenceComponentDemo
    title="Dialog"
    anchor="dialog"
    description="Structured dialog component with header, body, and footer sections."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton @click="basicDialog = true">Open Dialog</UtensilButton>
          <UtensilDialog v-model="basicDialog" title="Sample Dialog" @ok="handleDialogOk" @cancel="handleDialogCancel">
            <p>This is a structured dialog with a title, body content, and action buttons.</p>
            <p>The OK and Cancel buttons are provided automatically.</p>
          </UtensilDialog>
        </div>
        <div class="demo-label">Basic Dialog</div>
        <div class="demo-code">
          <code>&lt;UtensilDialog v-model="show" title="Title"&gt;Content&lt;/UtensilDialog&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton @click="scrollingDialog = true">Scrollable Dialog</UtensilButton>
          <UtensilDialog
            v-model="scrollingDialog"
            title="Sample Dialog"
            :scrollable="true"
            @ok="handleDialogOk"
            @cancel="handleDialogCancel"
          >
            <template v-for="i in 20" :key="i">
              <p>This is a structured dialog with a title, body content, and action buttons.</p>
              <p>The OK and Cancel buttons are provided automatically.</p>
            </template>
          </UtensilDialog>
        </div>
        <div class="demo-label">Basic Dialog</div>
        <div class="demo-code">
          <code>&lt;UtensilDialog v-model="show" title="Title" scrollable&gt;Content&lt;/UtensilDialog&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton @click="customDialog = true">Custom Actions</UtensilButton>
          <UtensilDialog v-model="customDialog" title="Custom Actions">
            <p>This dialog has custom action buttons instead of the default OK/Cancel.</p>
            <template #actions="{ close }">
              <UtensilButton variation="text" @click="close()">Reset to Defaults</UtensilButton>
            </template>
            <template #footer="{ close }">
              <UtensilButton variation="outline" @click="close()">Maybe Later</UtensilButton>
              <UtensilButton color="success" @click="handleSave">Save Changes</UtensilButton>
              <UtensilButton color="error" @click="handleDelete">Delete</UtensilButton>
            </template>
          </UtensilDialog>
        </div>
        <div class="demo-label">Custom Footer</div>
        <div class="demo-code">
          <code
            >&lt;UtensilDialog :no-footer="true"&gt;&lt;template
            #footer&gt;...&lt;/template&gt;&lt;/UtensilDialog&gt;</code
          >
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton @click="loadingDialog = true">Loading Dialog</UtensilButton>
          <UtensilDialog
            v-model="loadingDialog"
            title="Processing..."
            ok-label="Process"
            :ok-loading="isProcessing"
            :ok-disabled="isProcessing || isProcessed"
            :no-close-on-ok="true"
            @ok="startProcessing"
            @closed="resetProcessing"
          >
            <p>Click "Process" to see the loading state in action.</p>
            <p v-if="isProcessed">Your request has been processed!</p>
            <p v-else-if="isProcessing">Processing your request, please wait...</p>
            <p v-else>Ready to process your request.</p>
          </UtensilDialog>
        </div>
        <div class="demo-label">Loading State</div>
        <div class="demo-code">
          <code>&lt;UtensilDialog :ok-loading="loading"&gt;...&lt;/UtensilDialog&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilButton @click="messageDialog = true">Footer Message</UtensilButton>
          <UtensilDialog
            v-model="messageDialog"
            title="Save changes"
            ok-label="Save"
            :ok-loading="isSaving"
            :no-close-on-ok="true"
            @ok="failToSave"
            @closed="saveError = ''"
          >
            <p>Saving always fails here, so the dialog stays open and reports it in the footer.</p>
            <template v-if="saveError" #message>
              <UtensilCallout color="pen" role="alert">{{ saveError }}</UtensilCallout>
            </template>
          </UtensilDialog>
        </div>
        <div class="demo-label">Footer Message</div>
        <div class="demo-code">
          <code
            >&lt;UtensilDialog no-close-on-ok&gt;&lt;template
            #message&gt;...&lt;/template&gt;&lt;/UtensilDialog&gt;</code
          >
        </div>
      </div>
    </div>

    <template #api>
      <UtensilDialogDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilDialog from '@gobistories/utensil-vue/components/dialogs/UtensilDialog.vue'
import UtensilDialogDoc from '@gobistories/utensil-vue/components/dialogs/UtensilDialogDoc.vue'
import UtensilButton from '@gobistories/utensil-vue/components/button/UtensilButton.vue'
import UtensilCallout from '@gobistories/utensil-vue/components/callout/UtensilCallout.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { toasts } from '@/app/reference-toast'

const basicDialog = ref(false)
const scrollingDialog = ref(false)
const customDialog = ref(false)
const loadingDialog = ref(false)
const isProcessing = ref(false)
const isProcessed = ref(false)
const messageDialog = ref(false)
const isSaving = ref(false)
const saveError = ref('')

const { add: showToast } = toasts

function handleDialogOk() {
  showToast('Dialog OK clicked!')
}

function handleDialogCancel() {
  showToast('Dialog cancelled')
}

function handleSave() {
  showToast('Changes saved!')
  customDialog.value = false
}

function handleDelete() {
  showToast('Item deleted!')
  customDialog.value = false
}

function startProcessing() {
  isProcessing.value = true
  setTimeout(() => {
    isProcessing.value = false
    isProcessed.value = true
  }, 3000)
}

function resetProcessing() {
  isProcessing.value = false
  isProcessed.value = false
}

function failToSave() {
  isSaving.value = true
  saveError.value = ''
  setTimeout(() => {
    isSaving.value = false
    saveError.value = 'The changes could not be saved — try again.'
  }, 1500)
}
</script>

<style scoped>
.demo-content {
  min-height: 140px;
}
</style>
