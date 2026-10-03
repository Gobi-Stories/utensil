<template>
  <div id="editor-toolbar" class="component-demo">
    <h3><a class="demo-anchor" href="#editor-toolbar">Editor Toolbar</a></h3>
    <p>
      Text variation removes visual chrome so toolbar actions rely on the container for definition. Toggle buttons use
      soft when active, blending naturally with grouped controls.
    </p>

    <ReferenceTheme pen="pencil" class="toolbar">
      <div class="toolbar-group">
        <ReferenceToggleButton variation="text" icon="bold" :pressed="true" size="tiny">Bold</ReferenceToggleButton>
        <ReferenceToggleButton variation="text" icon="italic" size="tiny">Italic</ReferenceToggleButton>
        <ReferenceToggleButton variation="text" icon="underline" size="tiny">Underline</ReferenceToggleButton>
      </div>
      <div class="toolbar-separator"></div>
      <div class="toolbar-group">
        <ReferenceRadioButtons variation="text">
          <ReferenceRadioButton value="align-left" icon="align-left" icon-only size="tiny" />
          <ReferenceRadioButton value="align-center" icon="align-center" icon-only size="tiny" />
          <ReferenceRadioButton value="align-right" icon="align-right" icon-only size="tiny" />
        </ReferenceRadioButtons>
      </div>
      <div class="toolbar-separator"></div>
      <div class="toolbar-group">
        <ReferenceButton variation="text" icon="image" icon-only size="tiny">Image</ReferenceButton>
        <ReferenceButton variation="text" icon="video" icon-only size="tiny">Video</ReferenceButton>
        <ReferenceButton variation="text" icon="music" icon-only size="tiny">Audio</ReferenceButton>
      </div>
    </ReferenceTheme>
  </div>
</template>

<script setup lang="ts">
import { ReferenceTheme } from '@/theme/ReferenceTheme'
import { ReferenceButton } from '@/theme/components/ReferenceButton'
import { ReferenceToggleButton } from '@/theme/components/ReferenceToggleButton'
import { ReferenceRadioButtons } from '@/theme/components/ReferenceRadioButtons'
import { ReferenceRadioButton } from '@/theme/components/ReferenceRadioButton'
</script>

<style scoped>
.component-demo {
  display: flex;
  flex-direction: column;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  width: fit-content;
  padding: var(--space-2);
  background-color: var(--pen-2);
  border: 1px solid var(--pencil-a6);
  border-radius: var(--radius-3);
}

.toolbar-group {
  display: flex;
  gap: var(--space-1);
}

.toolbar-separator {
  width: 1px;
  height: 20px;
  background-color: var(--pencil-a6);
  margin: 0 var(--space-2);
}
</style>
