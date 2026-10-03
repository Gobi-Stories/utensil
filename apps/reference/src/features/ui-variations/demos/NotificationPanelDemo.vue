<template>
  <div id="notification-panel" class="component-demo">
    <h3><a class="demo-anchor" href="#notification-panel">Notification Panel</a></h3>
    <p>
      Callout variations signal urgency: outline for important alerts, surface for contextual information, and soft for
      passive messages.
    </p>

    <div class="scene notifications-scene">
      <ReferenceCallout variation="outline" color="error" icon="exclamation-triangle">
        <strong>Upload failed.</strong> The file exceeded the 500 MB limit. Compress and try again.
      </ReferenceCallout>
      <ReferenceCallout variation="surface" color="warning" icon="info-circle">
        Your story is scheduled to publish on <strong>March 3</strong>. Edits will not be reflected until republished.
      </ReferenceCallout>
      <ReferenceCallout variation="soft" color="success" icon="check-circle">
        All assets have been processed. Your story is ready to preview.
      </ReferenceCallout>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ReferenceCallout } from '@/theme/components/ReferenceCallout'
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

.scene.notifications-scene {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-3);
}
</style>
