<template>
  <ReferenceComponentDemo
    title="Checkbox"
    anchor="checkbox"
    description="Checkbox component with theme color support, indeterminate state, and label positioning."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <div class="checkbox-demo demo-stack">
            <ReferenceCheckbox v-model="checkBasic" label="Accept terms" />
          </div>
        </div>
        <div class="demo-label">Basic Checkbox</div>
        <div class="demo-code">
          <code>&lt;UtensilCheckbox v-model="checked" label="Accept terms" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <div class="checkbox-demo demo-stack">
            <ReferenceCheckbox v-model="checkStart" label="Label start" label-position="start" />
            <ReferenceCheckbox v-model="checkEnd" label="Label end" />
          </div>
        </div>
        <div class="demo-label">Label Position</div>
        <div class="demo-code">
          <code>&lt;UtensilCheckbox label="Label start" label-position="start" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <div class="checkbox-demo demo-stack align-start">
            <ReferenceCheckbox v-model="checkSuccess" label="Published" color="success" />
            <ReferenceCheckbox v-model="checkWarning" label="Draft" color="warning" />
            <ReferenceCheckbox v-model="checkError" label="Flagged" color="error" />
          </div>
        </div>
        <div class="demo-label">Color Variants</div>
        <div class="demo-code">
          <code>&lt;UtensilCheckbox color="success" label="Published" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <div class="checkbox-demo demo-stack">
            <ReferenceCheckbox :model-value="true" label="Checked" disabled />
            <ReferenceCheckbox :model-value="false" label="Unchecked" disabled />
          </div>
        </div>
        <div class="demo-label">Disabled</div>
        <div class="demo-code">
          <code>&lt;UtensilCheckbox disabled /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <div class="checkbox-demo demo-stack align-start">
            <ReferenceCheckbox v-model="checkParent" :indeterminate="isIndeterminate" label="Select all" />
            <div class="checkbox-group">
              <ReferenceCheckbox v-model="checkChild1" label="Option A" />
              <ReferenceCheckbox v-model="checkChild2" label="Option B" />
              <ReferenceCheckbox v-model="checkChild3" label="Option C" />
            </div>
          </div>
        </div>
        <div class="demo-label">Indeterminate (Select All)</div>
        <div class="demo-code">
          <code>&lt;UtensilCheckbox :indeterminate="partial" label="Select all" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <div class="checkbox-demo demo-stack">
            <ReferenceCheckbox v-model="checkSlot">
              <span class="custom-label">Custom <strong>slot</strong> content</span>
            </ReferenceCheckbox>
          </div>
        </div>
        <div class="demo-label">Slot Content</div>
        <div class="demo-code">
          <code>&lt;UtensilCheckbox&gt;Custom content&lt;/UtensilCheckbox&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilCheckboxDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import UtensilCheckboxDoc from 'utensil-vue/components/checkbox/UtensilCheckboxDoc.vue'
import { ReferenceCheckbox } from '@/theme/components/ReferenceCheckbox'

const checkBasic = ref(false)
const checkStart = ref(true)
const checkEnd = ref(false)
const checkSuccess = ref(true)
const checkWarning = ref(false)
const checkError = ref(true)
const checkSlot = ref(false)

// Indeterminate demo
const checkChild1 = ref(true)
const checkChild2 = ref(false)
const checkChild3 = ref(false)

const allChecked = computed(() => checkChild1.value && checkChild2.value && checkChild3.value)
const noneChecked = computed(() => !checkChild1.value && !checkChild2.value && !checkChild3.value)
const isIndeterminate = computed(() => !allChecked.value && !noneChecked.value)
const checkParent = ref(false)

watch(allChecked, (value) => {
  if (!isIndeterminate.value) {
    checkParent.value = value
  }
})

watch(noneChecked, (value) => {
  if (!isIndeterminate.value) {
    checkParent.value = !value
  }
})

watch(checkParent, (val) => {
  checkChild1.value = val
  checkChild2.value = val
  checkChild3.value = val
})
</script>

<style scoped>
.demo-content .checkbox-demo {
  align-self: center;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding-left: var(--space-5);
}

.custom-label {
  font-size: var(--font-size-2);
  color: var(--pencil-11);
}
</style>
