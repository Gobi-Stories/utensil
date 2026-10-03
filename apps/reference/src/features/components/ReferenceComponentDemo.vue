<template>
  <UtensilTabs :id="anchor" class="reference-component-demo" default-value="demo">
    <div class="component-demo-header">
      <div class="title">
        <h3>
          <a v-if="anchor" class="demo-anchor" :href="`#${anchor}`">{{ title }}</a>
          <template v-else>{{ title }}</template>
        </h3>
        <p v-if="description">{{ description }}</p>
      </div>
      <ReferenceTabsList size="2" color="pen">
        <UtensilTabsTrigger value="demo">Demo</UtensilTabsTrigger>
        <UtensilTabsTrigger v-if="hasApi" value="api">API</UtensilTabsTrigger>
      </ReferenceTabsList>
    </div>

    <UtensilTabsContent value="demo">
      <slot />
    </UtensilTabsContent>

    <UtensilTabsContent v-if="hasApi" value="api">
      <ReferenceTheme text="code">
        <div class="component-demo-api">
          <slot name="api" />
        </div>
      </ReferenceTheme>
    </UtensilTabsContent>
  </UtensilTabs>
</template>

<script setup lang="ts">
import { useSlots } from 'vue'
import UtensilTabs from 'utensil-vue/components/tabs/UtensilTabs.vue'
import UtensilTabsTrigger from 'utensil-vue/components/tabs/UtensilTabsTrigger.vue'
import UtensilTabsContent from 'utensil-vue/components/tabs/UtensilTabsContent.vue'
import { ReferenceTabsList } from '@/theme/components/ReferenceTabsList'
import { ReferenceTheme } from '@/theme/ReferenceTheme'

interface Props {
  title: string
  description?: string
  // Local anchor id for linking directly to this demo (e.g. /dialogs#confirm)
  anchor?: string
}

defineProps<Props>()

const slots = useSlots()
const hasApi = !!slots.api
</script>

<style scoped>
.reference-component-demo {
  margin-bottom: var(--space-5);
}

.reference-component-demo:last-child {
  margin-bottom: 0;
}

.component-demo-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  min-height: 56px;
  margin-bottom: var(--space-3);

  .title {
    flex: 1;
    min-width: 0;

    & > h3 {
      margin-top: 0;
      margin-bottom: var(--space-1);
    }

    p {
      color: var(--pencil-a11);
      line-height: var(--line-height-2);
      margin-bottom: 0;
    }
  }
}

.component-demo-api {
  padding: var(--space-4);
  background-color: var(--pencil-2);
  border: 1px solid var(--pencil-6);
  border-radius: var(--radius-2);
  overflow-x: auto;
}

.light-mode .component-demo-api {
  background-color: var(--pencil-a1);
}
</style>
