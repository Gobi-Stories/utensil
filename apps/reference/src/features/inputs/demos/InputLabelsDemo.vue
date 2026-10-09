<template>
  <div id="input-labels" class="component-demo">
    <h3><a class="demo-anchor" href="#input-labels">Input Labels</a></h3>
    <p>
      Optional labels that can be placed in block or inline layout. Labels are automatically wired to inputs via
      generated IDs.
    </p>
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilInput v-model="labelBlockInput" label="Full name" placeholder="Enter your name" variation="surface" />
        </div>
        <div class="demo-label">Block Label (default)</div>
        <div class="demo-code">
          <code>&lt;UtensilInput label="Full name" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilInput
            v-model="labelInlineInput"
            label="Email"
            label-placement="inline"
            placeholder="Enter your email"
            variation="surface"
            icon="envelope"
          />
        </div>
        <div class="demo-label">Inline Label</div>
        <div class="demo-code">
          <code>&lt;UtensilInput label="Email" label-placement="inline" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilPassword
            v-model="labelPasswordInput"
            label="Password"
            placeholder="Create a password"
            variation="surface"
          />
        </div>
        <div class="demo-label">Password with Label</div>
        <div class="demo-code">
          <code>&lt;UtensilPassword label="Password" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilSearch v-model="labelSearchInput" label="Search" placeholder="Search items..." variation="soft" />
        </div>
        <div class="demo-label">Search with Label</div>
        <div class="demo-code">
          <code>&lt;UtensilSearch label="Search" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilInput
            id="custom-id"
            v-model="labelCustomIdInput"
            label="Custom ID"
            placeholder="Uses provided id"
            variation="surface"
          />
        </div>
        <div class="demo-label">Custom ID</div>
        <div class="demo-code">
          <code>&lt;UtensilInput id="custom-id" label="Custom ID" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <UtensilInput v-model="labelSoftInput" label="Notes" placeholder="Add notes..." variation="soft" />
        </div>
        <div class="demo-label">Soft Variation with Label</div>
        <div class="demo-code">
          <code>&lt;UtensilInput label="Notes" variation="soft" /&gt;</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilInput from '@gobistories/utensil-vue/components/input/UtensilInput.vue'
import UtensilSearch from '@gobistories/utensil-vue/components/input/UtensilSearch.vue'
import UtensilPassword from '@gobistories/utensil-vue/components/input/UtensilPassword.vue'

const labelBlockInput = ref('')
const labelInlineInput = ref('')
const labelPasswordInput = ref('')
const labelSearchInput = ref('')
const labelCustomIdInput = ref('')
const labelSoftInput = ref('')
</script>

<style scoped>
.demo-content.input-demo {
  flex-direction: column;
  align-items: stretch;
}
</style>
