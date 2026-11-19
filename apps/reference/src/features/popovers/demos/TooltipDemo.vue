<template>
  <ReferenceComponentDemo
    title="Tooltip"
    anchor="tooltip"
    description="A short text hint shown on hover and keyboard focus. Opaque and inverted, so it contrasts with the page in both modes, or translucent and dark over media."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <UtensilTooltip text="Delete story" placement="top">
            <ReferenceCircleButton icon="trash" variation="soft" color="pencil" description="Delete story" />
          </UtensilTooltip>
        </div>
        <div class="demo-label always-visible">An icon button's hint</div>
        <div class="demo-code">
          <code>&lt;UtensilTooltip text="Delete story" placement="top"&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilTooltip text="Only owners can delete a story." placement="top">
            <template #default="{ tooltipId }">
              <ReferenceButton color="error" aria-disabled="true" :aria-describedby="tooltipId">Delete</ReferenceButton>
            </template>
          </UtensilTooltip>
        </div>
        <div class="demo-label always-visible">Describes its trigger</div>
        <div class="demo-code">
          <code>&lt;template #default="{ tooltipId }"&gt; ... :aria-describedby="tooltipId"</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilTooltip text="Of everyone who visited the page, the share who signed up." placement="top" multiline>
            <template #default="{ tooltipId }">
              <button type="button" class="tooltip-term" :aria-describedby="tooltipId">Conversion rate</button>
            </template>
          </UtensilTooltip>
        </div>
        <div class="demo-label always-visible">Multiline, for a longer explanation</div>
        <div class="demo-code">
          <code>&lt;UtensilTooltip :text="explanation" multiline&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <div class="tooltip-media">
            <UtensilTooltip :text="mediaTitle" placement="top" variation="overlay">
              <template #default="{ tooltipId }">
                <button type="button" class="tooltip-media-label" :aria-describedby="tooltipId">
                  {{ mediaTitle }}
                </button>
              </template>
            </UtensilTooltip>
          </div>
        </div>
        <div class="demo-label always-visible">Overlay, over media</div>
        <div class="demo-code">
          <code>&lt;UtensilTooltip :text="title" variation="overlay"&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilTooltipDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import UtensilTooltip from '@gobistories/utensil-vue/components/tooltip/UtensilTooltip.vue'
import UtensilTooltipDoc from '@gobistories/utensil-vue/components/tooltip/UtensilTooltipDoc.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { ReferenceButton } from '@/theme/components/ReferenceButton'
import { ReferenceCircleButton } from '@/theme/components/ReferenceCircleButton'

const mediaTitle = 'Behind the scenes of the spring launch shoot'
</script>

<style scoped>
/* Buttons drawn as text, so the explained term and the clipped title can take focus */
.tooltip-term,
.tooltip-media-label {
  border: none;
  font: inherit;
  text-transform: inherit;
  letter-spacing: inherit;
  text-align: start;
}

.tooltip-term {
  padding: 0;
  background: none;
  color: inherit;
  text-decoration: underline dotted var(--pencil-a8);
  text-underline-offset: 3px;
  cursor: help;
}

.tooltip-media {
  display: flex;
  align-items: flex-end;
  width: 220px;
  aspect-ratio: 16 / 9;
  padding: var(--space-2);
  border-radius: var(--radius-3);
  background: linear-gradient(135deg, var(--pen-7), var(--pen-11));
}

.tooltip-media-label {
  display: block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-2);
  background-color: var(--black-a9);
  color: var(--white-a12);
  font-size: var(--font-size-1);
}
</style>
