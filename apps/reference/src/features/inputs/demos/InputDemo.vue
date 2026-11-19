<template>
  <ReferenceComponentDemo
    title="Input"
    anchor="input"
    description="Flexible input component with icon support and various input types."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceInput
            v-for="variation in inputVariations"
            :key="variation"
            v-model="variationInputs[variation]"
            :label="labelFor(variation)"
            placeholder="Type here..."
            :variation="variation"
          />
        </div>
        <div class="demo-label">Style Variations</div>
        <div class="demo-code">
          <code>&lt;UtensilInput variation="outline" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilSearch v-model="iconStartInput" label="Search" placeholder="Search..." blur-on-enter-key />
          <div class="input-value">Value: "{{ iconStartInput }}"</div>
        </div>
        <div class="demo-label">Icon Start</div>
        <div class="demo-code">
          <code>&lt;UtensilInput icon="search" icon-position="start" blur-on-enter-key /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilPassword v-model="iconEndInput" label="Password" />
          <div class="input-value">Value: "{{ iconEndInput }}"</div>
        </div>
        <div class="demo-label">Icon End</div>
        <div class="demo-code">
          <code>&lt;UtensilInput icon="lock" icon-position="end" type="password" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceInput
            v-model="emailInput"
            label="Email"
            placeholder="sam@example.com"
            type="email"
            icon="envelope"
          />
          <div class="input-value">Value: "{{ emailInput }}"</div>
        </div>
        <div class="demo-label">Email Type</div>
        <div class="demo-code">
          <code>&lt;UtensilInput type="email" icon="envelope" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceInput v-model="numberInput" label="Quantity" type="number" icon="hashtag" min="0" max="100" />
          <div class="input-value">Value: "{{ numberInput }}"</div>
        </div>
        <div class="demo-label">Number Type</div>
        <div class="demo-code">
          <code>&lt;UtensilInput type="number" min="0" max="100" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceInput
            label="Account ID"
            model-value="ACC-20418"
            description="Set when the account was made."
            disabled
            icon="ban"
          />
        </div>
        <div class="demo-label">Disabled</div>
        <div class="demo-code">
          <code>&lt;UtensilInput disabled /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceInput
            v-model="invalidEmailInput"
            label="Email"
            type="email"
            icon="envelope"
            :aria-invalid="!!invalidEmailError"
            :description="invalidEmailError || 'We send the receipt here.'"
          />
        </div>
        <div class="demo-label always-visible">Invalid</div>
        <div class="demo-code">
          <code>&lt;UtensilInput :aria-invalid="!!error" :description="error" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceInput
            v-model="websiteInput"
            label="Website"
            reserve-description
            :aria-invalid="!!websiteError"
            :description="websiteError"
            @blur="checkWebsite"
            @input="websiteError = ''"
          />
          <ReferenceInput v-model="firstNameInput" label="First name" :maxlength="20" reserve-description />
        </div>
        <div class="demo-label always-visible">An error on leaving the field, its line reserved</div>
        <div class="demo-code">
          <code>&lt;UtensilInput reserve-description :description="error" @blur="check" :maxlength="20" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceInput v-model="largeInput" label="Headline" height="large" />
          <ReferenceInput v-model="largeSoftInput" label="Subheading" variation="soft" height="large" />
        </div>
        <div class="demo-label always-visible">Large Size</div>
        <div class="demo-code">
          <code>&lt;UtensilInput height="large" /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilInputDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { UtensilFieldVariation } from '@gobistories/utensil-vue/theme/utensil-theme'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { ReferenceInput } from '@/theme/components/ReferenceInput'
import UtensilInputDoc from '@gobistories/utensil-vue/components/input/UtensilInputDoc.vue'
import UtensilSearch from '@gobistories/utensil-vue/components/input/UtensilSearch.vue'
import UtensilPassword from '@gobistories/utensil-vue/components/input/UtensilPassword.vue'

const inputVariations = ['surface', 'soft', 'outline', 'unstyled'] as const
const variationInputs = reactive<Record<UtensilFieldVariation, string>>({
  surface: '',
  soft: '',
  outline: '',
  unstyled: '',
})
const labelFor = (variation: UtensilFieldVariation) => variation[0].toUpperCase() + variation.slice(1)
const largeInput = ref('')
const largeSoftInput = ref('')
const iconStartInput = ref('')
const iconEndInput = ref('')
const emailInput = ref('')
const numberInput = ref('')
const websiteInput = ref('example')
const websiteError = ref('')
const firstNameInput = ref('')

function checkWebsite() {
  websiteError.value = /^\S+\.\S+$/.test(websiteInput.value) ? '' : 'Enter a web address like example.com.'
}

const invalidEmailInput = ref('sam@')
const invalidEmailError = computed(() =>
  /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(invalidEmailInput.value) ? '' : 'Enter an email address like sam@example.com.',
)
</script>

<style scoped>
.demo-content.input-demo {
  flex-direction: column;
  align-items: stretch;
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
