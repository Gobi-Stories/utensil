<template>
  <ReferenceComponentDemo
    title="Digit Input"
    anchor="digit-input"
    description="One box per digit for numeric codes: one-time passwords and 2FA confirmations."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceDigitInput v-model="digitCode" ariaLabel="Demo code" />
          <div class="input-value">Value: "{{ digitCode }}"</div>
        </div>
        <div class="demo-label">Basic Code</div>
        <div class="demo-code">
          <code>&lt;UtensilDigitInput v-model="code" @complete="verify" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceDigitInput v-model="digitPin" :length="4" ariaLabel="Demo PIN" />
          <div class="input-value">Value: "{{ digitPin }}"</div>
        </div>
        <div class="demo-label">Four-Digit PIN</div>
        <div class="demo-code">
          <code>&lt;UtensilDigitInput v-model="pin" :length="4" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceDigitInput v-model="digitInvalid" invalid color="error" ariaLabel="Demo invalid code" />
          <div class="input-value">Value: "{{ digitInvalid }}"</div>
        </div>
        <div class="demo-label">Invalid</div>
        <div class="demo-code">
          <code>&lt;UtensilDigitInput invalid color="error" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceDigitInput modelValue="12" disabled ariaLabel="Demo disabled code" />
          <div class="input-value">Disabled state</div>
        </div>
        <div class="demo-label">Disabled</div>
        <div class="demo-code">
          <code>&lt;UtensilDigitInput disabled /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilDigitInputDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import UtensilDigitInputDoc from '@gobistories/utensil-vue/components/input/UtensilDigitInputDoc.vue'
import { ReferenceDigitInput } from '@/theme/components/ReferenceDigitInput'

const digitCode = ref('')
const digitPin = ref('')
const digitInvalid = ref('123456')
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
