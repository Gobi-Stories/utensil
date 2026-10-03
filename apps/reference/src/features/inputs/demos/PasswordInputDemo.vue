<template>
  <ReferenceComponentDemo
    title="Password Input"
    anchor="password-input"
    description="Password input with toggle visibility functionality."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilPassword v-model="passwordBasic" placeholder="Enter password" blurOnEnterKey />
          <div class="input-value">Value: "{{ passwordBasic }}"</div>
        </div>
        <div class="demo-label">Basic Password</div>
        <div class="demo-code">
          <code>&lt;UtensilPasswordInput v-model="password" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilPassword placeholder="Disabled password" disabled />
          <div class="input-value">Disabled state</div>
        </div>
        <div class="demo-label">Disabled</div>
        <div class="demo-code">
          <code>&lt;UtensilPasswordInput disabled /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilPassword v-model="passwordReadonly" value="readonly123" readonly />
          <div class="input-value">Value: "{{ passwordReadonly }}"</div>
        </div>
        <div class="demo-label">Read-only</div>
        <div class="demo-code">
          <code>&lt;UtensilPasswordInput readonly /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilPasswordDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import UtensilPassword from 'utensil-vue/components/input/UtensilPassword.vue'
import UtensilPasswordDoc from 'utensil-vue/components/input/UtensilPasswordDoc.vue'

const passwordBasic = ref('')
const passwordReadonly = ref('readonly123')
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
