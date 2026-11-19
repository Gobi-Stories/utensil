<template>
  <ReferenceComponentDemo
    title="Text Area"
    anchor="text-area"
    description="Multi-line text input with resize support and style variations."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilTextArea
            v-model="textAreaSurface"
            label="Surface"
            placeholder="Type here..."
            variation="surface"
            :rows="5"
          />
        </div>
        <div class="demo-label">Surface Variation</div>
        <div class="demo-code">
          <code>&lt;UtensilTextArea variation="surface" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilTextArea v-model="textAreaSoft" label="Soft" placeholder="Type here..." variation="soft" :rows="5" />
        </div>
        <div class="demo-label">Soft Variation</div>
        <div class="demo-code">
          <code>&lt;UtensilTextArea variation="soft" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilTextArea label="Outline" placeholder="Type here..." variation="outline" :rows="5" />
        </div>
        <div class="demo-label">Outline Variation</div>
        <div class="demo-code">
          <code>&lt;UtensilTextArea variation="outline" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilTextArea label="Unstyled" placeholder="Type here..." variation="unstyled" :rows="5" />
        </div>
        <div class="demo-label">Unstyled Variation</div>
        <div class="demo-code">
          <code>&lt;UtensilTextArea variation="unstyled" /&gt;</code>
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
          <UtensilTextArea
            v-model="textAreaBio"
            label="Bio"
            :rows="3"
            reserve-description
            :aria-invalid="!!textAreaBioError"
            :description="textAreaBioError"
            @blur="checkBio"
            @input="textAreaBioError = ''"
          />
        </div>
        <div class="demo-label always-visible">An error on leaving the field, its line reserved</div>
        <div class="demo-code">
          <code>&lt;UtensilTextArea reserve-description :description="error" @blur="check" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilTextArea
            v-model="textAreaInline"
            label="Notes"
            label-placement="inline"
            description="Only your team sees these."
            :rows="3"
          />
        </div>
        <div class="demo-label always-visible">Inline label with a description</div>
        <div class="demo-code">
          <code>&lt;UtensilTextArea label="Notes" label-placement="inline" description="..." /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilTextArea v-model="textAreaNoResize" label="Summary" resize="none" />
        </div>
        <div class="demo-label">No Resize</div>
        <div class="demo-code">
          <code>&lt;UtensilTextArea resize="none" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilTextArea
            label="Archived note"
            model-value="Moved to the new workspace in March."
            description="Archived notes can't be edited."
            :rows="3"
            disabled
          />
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
import UtensilTextArea from '@gobistories/utensil-vue/components/text-area/UtensilTextArea.vue'
import UtensilTextAreaDoc from '@gobistories/utensil-vue/components/text-area/UtensilTextAreaDoc.vue'

const textAreaBio = ref('Hi')
const textAreaBioError = ref('')
const textAreaInline = ref('')

function checkBio() {
  textAreaBioError.value = textAreaBio.value.trim().length >= 10 ? '' : 'Write at least 10 characters.'
}

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
</style>
