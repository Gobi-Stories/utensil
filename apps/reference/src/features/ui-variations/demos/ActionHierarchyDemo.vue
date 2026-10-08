<template>
  <div id="action-hierarchy" class="component-demo">
    <h3><a class="demo-anchor" href="#action-hierarchy">Action Hierarchy</a></h3>
    <p>
      Variations establish visual weight. Solid commands attention for primary actions, soft and outline provide
      secondary options, and text recedes for tertiary controls.
    </p>

    <div class="scene-row">
      <ReferenceBox class="story-card hierarchy-card">
        <h4 class="hierarchy-card-title">Publish Settings</h4>
        <p class="hierarchy-card-description">Review your story before publishing to all channels.</p>
        <div class="hierarchy-card-status">
          <ReferencePill variation="outline" label="Draft" color="warning" icon="edit" scale="small" />
          <ReferencePill variation="outline" label="3 Slides" color="pencil" icon="layer-group" scale="small" />
        </div>
        <div class="hierarchy-card-actions">
          <ReferenceButton variation="text" color="pencil">Cancel</ReferenceButton>
          <ReferenceButton variation="soft" color="pencil">Save Draft</ReferenceButton>
          <ReferenceButton variation="solid" color="pen">Publish</ReferenceButton>
        </div>
      </ReferenceBox>

      <ReferenceBox class="story-card hierarchy-card">
        <h4 class="hierarchy-card-title">Delete Story</h4>
        <p class="hierarchy-card-description">
          This action cannot be undone. All slides and associated analytics will be permanently removed.
        </p>
        <ReferenceCallout variation="soft" color="error" icon="exclamation-triangle" scale="small">
          2 active embeds reference this story and will stop working.
        </ReferenceCallout>
        <div class="hierarchy-card-actions">
          <ReferenceButton variation="soft" color="pencil">Cancel</ReferenceButton>
          <ReferenceButton variation="solid" color="error" icon="trash">Delete Story</ReferenceButton>
        </div>
      </ReferenceBox>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ReferenceButton } from '@/theme/components/ReferenceButton'
import { ReferenceBox } from '@/theme/components/ReferenceBox'
import { ReferencePill } from '@/theme/components/ReferencePill'
import { ReferenceCallout } from '@/theme/components/ReferenceCallout'
</script>

<style scoped>
.component-demo {
  display: flex;
  flex-direction: column;
}

.scene-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-5);
  margin-top: var(--space-3);
}

.story-card {
  box-shadow: var(--shadow-border-2);
  background-color: var(--paper-2);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.dark-mode .story-card {
  background-color: var(--pencil-a2);
}

.hierarchy-card {
  box-shadow: var(--shadow-border-3);
  gap: var(--space-4);
}

.hierarchy-card-title {
  font-size: var(--font-size-4);
  color: var(--pencil-12);
  margin: 0;
}

.hierarchy-card-description {
  font-size: var(--font-size-2);
  color: var(--pencil-11);
  line-height: 1.5;
  margin: 0;
}

.hierarchy-card-status {
  display: flex;
  gap: var(--space-2);
}

.hierarchy-card-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--pencil-a4);
}
</style>
