<template>
  <ReferenceComponentDemo
    title="Text Area"
    anchor="text-area"
    description="Multi-line text input with resize support and style variations."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilTextArea v-model="textAreaSurface" placeholder="Surface text area..." variation="surface" :rows="5" />
        </div>
        <div class="demo-label">Surface Variation</div>
        <div class="demo-code">
          <code>&lt;UtensilTextArea variation="surface" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilTextArea v-model="textAreaSoft" placeholder="Soft text area..." variation="soft" :rows="5" />
        </div>
        <div class="demo-label">Soft Variation</div>
        <div class="demo-code">
          <code>&lt;UtensilTextArea variation="soft" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilTextArea placeholder="Outline text area..." variation="outline" :rows="5" />
        </div>
        <div class="demo-label">Outline Variation</div>
        <div class="demo-code">
          <code>&lt;UtensilTextArea variation="outline" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilTextArea v-model="textAreaLabel" label="Description" placeholder="Enter a description..." :rows="4" />
        </div>
        <div class="demo-label">With Label</div>
        <div class="demo-code">
          <code>&lt;UtensilTextArea label="Description" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilTextArea v-model="textAreaNoResize" placeholder="Cannot resize" resize="none" />
        </div>
        <div class="demo-label">No Resize</div>
        <div class="demo-code">
          <code>&lt;UtensilTextArea resize="none" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilTextArea placeholder="Disabled text area" disabled />
          <div class="input-value">Disabled state</div>
        </div>
        <div class="demo-label">Disabled</div>
        <div class="demo-code">
          <code>&lt;UtensilTextArea disabled /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilTextArea
            v-model="textAreaInvalid"
            label="Message"
            :rows="3"
            :aria-invalid="textAreaInvalid.length < 20"
            aria-described-by="text-area-invalid-error"
          />
          <p id="text-area-invalid-error" class="text-area-message">
            {{
              textAreaInvalid.length < 20
                ? `Write at least 20 characters (${textAreaInvalid.length} so far).`
                : 'Ready to send.'
            }}
          </p>
        </div>
        <div class="demo-label always-visible">Invalid</div>
        <div class="demo-code">
          <code>&lt;UtensilTextArea :aria-invalid="tooShort" aria-described-by="error-id" /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilTextAreaDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import UtensilTextArea from 'utensil-vue/components/text-area/UtensilTextArea.vue'
import UtensilTextAreaDoc from 'utensil-vue/components/text-area/UtensilTextAreaDoc.vue'

const textAreaSurface = ref('')
const textAreaSoft = ref('')
const textAreaLabel = ref('')
const textAreaNoResize = ref('')
const textAreaInvalid = ref('Too short')
</script>

<style scoped>
.demo-content.input-demo {
  flex-direction: column;
  align-items: stretch;
}

.text-area-message {
  margin: var(--space-1) 0 0;
  font-size: var(--font-size-1);
  color: var(--pencil-a11);
}

.input-value {
  margin-top: var(--space-2);
  padding: var(--space-1) var(--space-2);
  background-color: var(--pencil-3);
  border-radius: var(--radius-2);
  font-size: 0.85rem;
  color: var(--pencil-11);
  text-align: center;
  font-family: ui-monospace, monospace;
}
</style>
