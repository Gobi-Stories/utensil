<template>
  <ReferenceComponentDemo
    title="Toolbar"
    anchor="toolbar"
    description="A bar of related controls, one stop in the tab order. The arrow keys, Home and End move between its buttons, a radio group is one of its stops, and fields keep their own."
  >
    <div class="demo-grid">
      <div v-for="variation in variations" :key="variation" class="demo-item toolbar-demo-item">
        <div class="demo-content toolbar-demo">
          <ReferenceToolbar :variation="variation" :aria-label="`Formatting, ${variation}`">
            <ReferenceToggleButton v-model="bold" variation="text" icon="bold" icon-only size="tiny">
              Bold
            </ReferenceToggleButton>
            <ReferenceToggleButton v-model="italic" variation="text" icon="italic" icon-only size="tiny">
              Italic
            </ReferenceToggleButton>
            <ReferenceToggleButton v-model="underline" variation="text" icon="underline" icon-only size="tiny">
              Underline
            </ReferenceToggleButton>
            <UtensilToolbarSeparator />
            <ReferenceRadioButtons v-model="align" variation="text" aria-label="Alignment">
              <ReferenceRadioButton value="left" icon="align-left" icon-only size="tiny"
                >Align left</ReferenceRadioButton
              >
              <ReferenceRadioButton value="center" icon="align-center" icon-only size="tiny"
                >Align center</ReferenceRadioButton
              >
              <ReferenceRadioButton value="right" icon="align-right" icon-only size="tiny"
                >Align right</ReferenceRadioButton
              >
            </ReferenceRadioButtons>
            <UtensilToolbarSeparator />
            <ReferenceButton variation="text" icon="code" icon-only size="tiny">Code</ReferenceButton>
            <ReferenceButton variation="text" icon="list" icon-only size="tiny">List</ReferenceButton>
          </ReferenceToolbar>
        </div>
        <div class="demo-label always-visible">Horizontal &middot; {{ variation }}</div>
        <div class="demo-code">
          <code>&lt;UtensilToolbar variation="{{ variation }}" ariaLabel="Formatting"&gt;</code>
        </div>
      </div>
      <div v-for="variation in variations" :key="`vertical-${variation}`" class="demo-item">
        <div class="demo-content">
          <ReferenceToolbar
            orientation="vertical"
            :variation="variation"
            :loop="false"
            :aria-label="`Insert a block, ${variation}`"
          >
            <ReferenceButton
              v-for="block in blocks"
              :key="block.label"
              variation="text"
              :icon="block.icon"
              size="tiny"
              justify="start"
            >
              {{ block.label }}
            </ReferenceButton>
            <UtensilToolbarSeparator />
            <ReferenceButton variation="text" icon="trash" size="tiny" justify="start">Delete</ReferenceButton>
          </ReferenceToolbar>
        </div>
        <div class="demo-label always-visible">Vertical &middot; {{ variation }}</div>
        <div class="demo-code">
          <code>&lt;UtensilToolbar orientation="vertical" variation="{{ variation }}"&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilToolbarDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilToolbarSeparator from '@gobistories/utensil-vue/components/toolbar/UtensilToolbarSeparator.vue'
import UtensilToolbarDoc from '@gobistories/utensil-vue/components/toolbar/UtensilToolbarDoc.vue'
import type { ToolbarVariation } from '@gobistories/utensil-vue/components/toolbar/utensil-toolbar'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { ReferenceToolbar } from '@/theme/components/ReferenceToolbar'
import { ReferenceButton } from '@/theme/components/ReferenceButton'
import { ReferenceToggleButton } from '@/theme/components/ReferenceToggleButton'
import { ReferenceRadioButtons } from '@/theme/components/ReferenceRadioButtons'
import { ReferenceRadioButton } from '@/theme/components/ReferenceRadioButton'
import type { ReferenceIcon } from '@/theme/reference-icons'

const variations: ToolbarVariation[] = ['surface', 'soft', 'outline', 'unstyled']

const bold = ref(true)
const italic = ref(false)
const underline = ref(false)
const align = ref('left')

const blocks: { label: string; icon: ReferenceIcon }[] = [
  { label: 'Text', icon: 'edit' },
  { label: 'Code', icon: 'code' },
  { label: 'Table', icon: 'table-cells' },
  { label: 'Chart', icon: 'chart-column' },
]
</script>

<style scoped>
.toolbar-demo-item {
  grid-column: span 2;
}

.demo-content.toolbar-demo {
  align-items: center;
}
</style>
