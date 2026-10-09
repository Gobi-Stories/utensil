<template>
  <div id="width-matching" class="component-demo">
    <h3><a class="demo-anchor" href="#width-matching">Width Matching</a></h3>
    <p>The popover can match the width of its anchor element.</p>
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <UtensilPopoverPanel width="anchor">
            <template #trigger="{ toggle }">
              <UtensilButton style="width: 200px" @click="toggle">Match Anchor Width</UtensilButton>
            </template>
            <div class="popover-content">
              <p>This popover matches the trigger width.</p>
            </div>
          </UtensilPopoverPanel>
        </div>
        <div class="demo-label">Matched Width to Button</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilPopoverPanel :offset="20">
            <template #trigger="{ toggle }">
              <UtensilButton @click="toggle">Custom Offset</UtensilButton>
            </template>
            <div class="popover-content">
              <p>This popover has a larger gap from the trigger.</p>
            </div>
          </UtensilPopoverPanel>
        </div>
        <div class="demo-label">Custom Offset</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UtensilPopoverPanel from '@gobistories/utensil-vue/components/popover/UtensilPopoverPanel.vue'
import UtensilButton from '@gobistories/utensil-vue/components/button/UtensilButton.vue'
</script>

<style scoped>
.popover-content {
  padding: var(--space-2);
}
</style>
