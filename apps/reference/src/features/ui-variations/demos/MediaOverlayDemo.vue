<template>
  <div id="media-overlay" class="component-demo">
    <h3><a class="demo-anchor" href="#media-overlay">Media Overlay</a></h3>
    <p>Overlay variation uses a dark translucent backdrop to remain legible over unpredictable media content.</p>

    <div class="scene media-scene">
      <div class="media-surface">
        <div class="media-top-bar">
          <ReferenceBadge variation="overlay" label="4:32" icon="video" scale="small" />
          <ReferenceBadge variation="overlay" label="HD" scale="small" />
        </div>
        <div class="media-center">
          <ReferenceCircleButton variation="overlay" icon="circle-play" :scale="2" description="Play video" />
        </div>
        <div class="media-bottom-bar">
          <ReferenceButton variation="overlay" icon="heart" icon-only size="tiny">Favorite</ReferenceButton>
          <span class="media-title">Summer Campaign — Final Cut</span>
          <ReferenceButton variation="overlay" icon="share-alt" icon-only size="tiny">Share</ReferenceButton>
          <ReferenceButton variation="overlay" icon="download" icon-only size="tiny">Download</ReferenceButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ReferenceButton } from '@/theme/components/ReferenceButton'
import { ReferenceBadge } from '@/theme/components/ReferenceBadge'
import { ReferenceCircleButton } from '@/theme/components/ReferenceCircleButton'
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

.media-scene {
  max-width: 560px;
}

.media-surface {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 360px;
  max-width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-3);
  overflow: hidden;
  background: linear-gradient(135deg, #1a3a4a 0%, #2d6a5a 30%, #4a7a6a 50%, #3a5a7a 70%, #2a4a6a 100%);
}

.media-top-bar {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
}

.media-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.media-bottom-bar {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
}

.media-title {
  flex: 1;
  color: var(--white-a12);
  font-size: var(--font-size-2);
  font-weight: 500;
}
</style>
