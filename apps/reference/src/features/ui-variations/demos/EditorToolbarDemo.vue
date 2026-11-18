<template>
  <div id="editor-toolbar" class="component-demo">
    <h3><a class="demo-anchor" href="#editor-toolbar">Editor Toolbar</a></h3>
    <p>
      Text variation removes visual chrome so toolbar actions rely on the container for definition. Toggle buttons use
      soft when active, blending naturally with grouped controls.
    </p>

    <ReferenceToolbar aria-label="Formatting" class="editor-toolbar">
      <ReferenceToggleButton v-model="bold" variation="text" icon="bold" size="tiny">Bold</ReferenceToggleButton>
      <ReferenceToggleButton v-model="italic" variation="text" icon="italic" size="tiny">Italic</ReferenceToggleButton>
      <ReferenceToggleButton v-model="underline" variation="text" icon="underline" size="tiny">
        Underline
      </ReferenceToggleButton>
      <UtensilToolbarSeparator />
      <ReferenceRadioButtons v-model="align" variation="text" aria-label="Alignment">
        <ReferenceRadioButton value="align-left" icon="align-left" icon-only size="tiny"
          >Align left</ReferenceRadioButton
        >
        <ReferenceRadioButton value="align-center" icon="align-center" icon-only size="tiny"
          >Align center</ReferenceRadioButton
        >
        <ReferenceRadioButton value="align-right" icon="align-right" icon-only size="tiny"
          >Align right</ReferenceRadioButton
        >
      </ReferenceRadioButtons>
      <UtensilToolbarSeparator />
      <ReferenceButton variation="text" icon="image" icon-only size="tiny">Image</ReferenceButton>
      <ReferenceButton variation="text" icon="video" icon-only size="tiny">Video</ReferenceButton>
      <ReferenceButton variation="text" icon="music" icon-only size="tiny">Audio</ReferenceButton>
    </ReferenceToolbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilToolbarSeparator from '@gobistories/utensil-vue/components/toolbar/UtensilToolbarSeparator.vue'
import { ReferenceToolbar } from '@/theme/components/ReferenceToolbar'
import { ReferenceButton } from '@/theme/components/ReferenceButton'
import { ReferenceToggleButton } from '@/theme/components/ReferenceToggleButton'
import { ReferenceRadioButtons } from '@/theme/components/ReferenceRadioButtons'
import { ReferenceRadioButton } from '@/theme/components/ReferenceRadioButton'

const bold = ref(true)
const italic = ref(false)
const underline = ref(false)
const align = ref('align-left')
</script>

<style scoped>
.component-demo {
  display: flex;
  flex-direction: column;
}

.editor-toolbar {
  width: fit-content;
}
</style>
