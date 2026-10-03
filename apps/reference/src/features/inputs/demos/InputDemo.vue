<template>
  <ReferenceComponentDemo
    title="Input"
    anchor="input"
    description="Flexible input component with icon support and various input types."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilInput v-model="surfaceInput" placeholder="Surface input" variation="surface" />
          <UtensilInput v-model="softInput" placeholder="Soft input" variation="soft" />
          <UtensilInput v-model="outlineInput" placeholder="Outline input" variation="outline" />
        </div>
        <div class="demo-label">Style Variations</div>
        <div class="demo-code">
          <code>&lt;UtensilInput variation="outline" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilSearch v-model="iconStartInput" placeholder="Search..." blur-on-enter-key />
          <div class="input-value">Value: "{{ iconStartInput }}"</div>
        </div>
        <div class="demo-label">Icon Start</div>
        <div class="demo-code">
          <code>&lt;UtensilInput icon="search" icon-position="start" blur-on-enter-key /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilPassword v-model="iconEndInput" placeholder="Enter password" />
          <div class="input-value">Value: "{{ iconEndInput }}"</div>
        </div>
        <div class="demo-label">Icon End</div>
        <div class="demo-code">
          <code>&lt;UtensilInput icon="lock" icon-position="end" type="password" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilInput v-model="emailInput" placeholder="Enter email" type="email" icon="envelope" />
          <div class="input-value">Value: "{{ emailInput }}"</div>
        </div>
        <div class="demo-label">Email Type</div>
        <div class="demo-code">
          <code>&lt;UtensilInput type="email" icon="envelope" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilInput
            v-model="numberInput"
            placeholder="Enter number"
            type="number"
            icon="hashtag"
            min="0"
            max="100"
          />
          <div class="input-value">Value: "{{ numberInput }}"</div>
        </div>
        <div class="demo-label">Number Type</div>
        <div class="demo-code">
          <code>&lt;UtensilInput type="number" min="0" max="100" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilInput placeholder="Disabled input" disabled icon="ban" />
          <div class="input-value">Disabled state</div>
        </div>
        <div class="demo-label">Disabled</div>
        <div class="demo-code">
          <code>&lt;UtensilInput disabled /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilInput v-model="largeInput" placeholder="Large input" height="large" />
          <UtensilInput v-model="largeSoftInput" placeholder="Large soft" variation="soft" height="large" />
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
import { ref } from 'vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import UtensilInput from 'utensil-vue/components/input/UtensilInput.vue'
import UtensilInputDoc from 'utensil-vue/components/input/UtensilInputDoc.vue'
import UtensilSearch from 'utensil-vue/components/input/UtensilSearch.vue'
import UtensilPassword from 'utensil-vue/components/input/UtensilPassword.vue'

const surfaceInput = ref('')
const softInput = ref('')
const outlineInput = ref('')
const largeInput = ref('')
const largeSoftInput = ref('')
const iconStartInput = ref('')
const iconEndInput = ref('')
const emailInput = ref('')
const numberInput = ref('')
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
