<template>
  <ReferenceComponentDemo
    title="Header"
    anchor="header"
    description="A simple header with a title and optional actions area. Text styling is inherited from the text theme."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content header-demo">
          <UtensilHeader title="Page Title" />
        </div>
        <div class="demo-label">Basic</div>
      </div>
      <div class="demo-item">
        <div class="demo-content header-demo">
          <UtensilHeader title="Settings">
            <template #actions>
              <ReferenceButton variation="soft" scale="small">Save</ReferenceButton>
            </template>
          </UtensilHeader>
        </div>
        <div class="demo-label">With Actions</div>
      </div>
      <div class="demo-item">
        <div class="demo-content header-demo">
          <UtensilHeader element="h2"> Custom <em>Slot</em> Content </UtensilHeader>
        </div>
        <div class="demo-label always-visible">Custom Title Slot</div>
      </div>
      <div class="demo-item">
        <div class="demo-content header-demo">
          <UtensilHeader element="h1" title="Heading 1" />
          <UtensilHeader element="h2" title="Heading 2" />
          <UtensilHeader title="Heading 3" />
          <UtensilHeader element="h4" title="Heading 4" />
          <UtensilHeader element="h5" title="Heading 5" />
          <UtensilHeader element="h6" title="Heading 6" />
        </div>
        <div class="demo-label">Heading Levels</div>
      </div>
    </div>

    <template #api>
      <UtensilHeaderDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import UtensilHeader from 'utensil-vue/components/header/UtensilHeader.vue'
import UtensilHeaderDoc from 'utensil-vue/components/header/UtensilHeaderDoc.vue'
import { ReferenceButton } from '@/theme/components/ReferenceButton'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
</script>

<style scoped>
.demo-content.header-demo {
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-3);
  min-height: auto;
}
</style>
