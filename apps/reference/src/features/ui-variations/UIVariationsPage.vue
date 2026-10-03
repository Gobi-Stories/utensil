<template>
  <div class="ui-variations-section demo-page">
    <StoryCardDemo />
    <NotificationPanelDemo />
    <MediaOverlayDemo />
    <EditorToolbarDemo />
    <ActionHierarchyDemo />
    <StatusDashboardDemo />
  </div>
</template>

<script setup lang="ts">
import StoryCardDemo from './demos/StoryCardDemo.vue'
import NotificationPanelDemo from './demos/NotificationPanelDemo.vue'
import MediaOverlayDemo from './demos/MediaOverlayDemo.vue'
import EditorToolbarDemo from './demos/EditorToolbarDemo.vue'
import ActionHierarchyDemo from './demos/ActionHierarchyDemo.vue'
import StatusDashboardDemo from './demos/StatusDashboardDemo.vue'
</script>

<style scoped>
.ui-variations-section .component-demo:not(.first-child):not(.utensil-tabs-content .component-demo) {
  margin-top: 0;
}
</style>
