<template>
  <div id="story-card" class="component-demo">
    <h3><a class="demo-anchor" href="#story-card">Story Card</a></h3>
    <p>
      Surface cards contain content, solid buttons drive primary actions, soft pills tag metadata, and text buttons
      handle secondary actions.
    </p>

    <div class="scene">
      <ReferenceCard class="story-card">
        <div class="story-card-header">
          <div class="story-card-meta">
            <ReferenceAvatar fallback="AL" color="primary" scale="large" />
            <div class="story-card-meta-text">
              <span class="story-card-author">Alex Lindgren</span>
              <span class="story-card-date">Feb 18, 2026</span>
            </div>
          </div>
          <ReferenceBadge
            class="self-start margin-block-1"
            variation="solid"
            color="success"
            label="Published"
            icon="check"
          />
        </div>
        <div class="story-card-body">
          <h4 class="story-card-title">Product Launch Recap</h4>
          <p class="story-card-description">
            A behind-the-scenes look at our latest release, featuring team interviews and customer reactions.
          </p>
        </div>
        <div class="story-card-tags">
          <ReferencePill variation="soft" label="Marketing" color="primary" rounded />
          <ReferencePill variation="soft" label="Video" color="pencil" rounded />
          <ReferencePill variation="soft" label="Featured" color="favorite" rounded />
        </div>
        <div class="story-card-actions">
          <ReferenceButton variation="solid" icon="edit">Edit Story</ReferenceButton>
          <ReferenceButton variation="soft" color="pencil" icon="copy">Duplicate</ReferenceButton>
          <ReferenceButton variation="text" color="pencil" icon="share-alt" class="story-card-push-end"
            >Share</ReferenceButton
          >
        </div>
      </ReferenceCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ReferenceButton } from '@/theme/components/ReferenceButton'
import { ReferenceCard } from '@/theme/components/ReferenceCard'
import { ReferenceBadge } from '@/theme/components/ReferenceBadge'
import { ReferencePill } from '@/theme/components/ReferencePill'
import { ReferenceAvatar } from '@/theme/components/ReferenceAvatar'
</script>

<style scoped>
.component-demo {
  display: flex;
  flex-direction: column;
}

.scene {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-items: center;
  align-self: center;
  max-width: 560px;
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

.story-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.story-card-meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.story-card-meta-text {
  display: flex;
  flex-direction: column;
}

.story-card-author {
  font-weight: 500;
  font-size: var(--font-size-2);
  color: var(--pencil-12);
}

.story-card-date {
  font-size: var(--font-size-1);
  color: var(--pencil-11);
}

.story-card-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.story-card-title {
  font-size: var(--font-size-4);
  color: var(--pencil-12);
  margin: 0;
}

.story-card-description {
  font-size: var(--font-size-2);
  color: var(--pencil-11);
  line-height: 1.5;
  margin: 0;
}

.story-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.story-card-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding-top: var(--space-2);
  border-top: 1px solid var(--pencil-a4);
}

.story-card-push-end {
  margin-inline-start: auto;
}
</style>
