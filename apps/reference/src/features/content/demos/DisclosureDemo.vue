<template>
  <ReferenceComponentDemo
    title="Disclosure"
    anchor="disclosure"
    description="Inline expand/collapse toggle revealing its content below. Content unmounts while closed."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content disclosure-demo">
          <UtensilDisclosure label="Details">
            <p class="disclosure-demo-copy">The revealed content renders below the toggle row.</p>
          </UtensilDisclosure>
        </div>
        <div class="demo-label">Uncontrolled</div>
        <div class="demo-code">
          <code>&lt;UtensilDisclosure label="Details"&gt;...&lt;/UtensilDisclosure&gt;</code>
        </div>
      </div>

      <div class="demo-item">
        <div class="demo-content disclosure-demo">
          <UtensilDisclosure label="Shown from the start" defaultOpen>
            <p class="disclosure-demo-copy">Starts expanded, still collapsible.</p>
          </UtensilDisclosure>
        </div>
        <div class="demo-label">Default Open</div>
        <div class="demo-code">
          <code>&lt;UtensilDisclosure label="..." defaultOpen&gt;...&lt;/UtensilDisclosure&gt;</code>
        </div>
      </div>

      <div class="demo-item">
        <div class="demo-content disclosure-demo">
          <UtensilDisclosure v-model:open="disclosureOpen" label="Controlled">
            <p class="disclosure-demo-copy">Open state lives in the parent: {{ disclosureOpen }}</p>
          </UtensilDisclosure>
        </div>
        <div class="demo-label">v-model:open</div>
        <div class="demo-code">
          <code>&lt;UtensilDisclosure v-model:open="open" label="Controlled"&gt;...&lt;/UtensilDisclosure&gt;</code>
        </div>
      </div>

      <div class="demo-item">
        <div class="demo-content disclosure-demo">
          <UtensilDisclosure label="Indented content" style="--utensil-disclosure-content-indent: var(--space-5)">
            <p class="disclosure-demo-copy">Content nests under the label via the indent cvar.</p>
          </UtensilDisclosure>
        </div>
        <div class="demo-label">Indented Content</div>
        <div class="demo-code">
          <code>style="--utensil-disclosure-content-indent: var(--space-5)"</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilDisclosureDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilDisclosure from 'utensil-vue/components/disclosure/UtensilDisclosure.vue'
import UtensilDisclosureDoc from 'utensil-vue/components/disclosure/UtensilDisclosureDoc.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

const disclosureOpen = ref(false)
</script>

<style scoped>
.demo-content.disclosure-demo {
  flex-direction: column;
  align-items: stretch;
}

.disclosure-demo-copy {
  margin: 0;
  color: var(--pencil-a11);
  font-size: var(--font-size-2);
}
</style>
