<template>
  <div id="toggle-switch-labels" class="component-demo">
    <h3><a class="demo-anchor" href="#toggle-switch-labels">Toggle Switch Labels</a></h3>
    <p>
      Optional labels that can be placed in block or inline layout. Labels are automatically wired to the switch input
      via generated IDs.
    </p>
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <div class="toggle-switch-demo with-labels">
            <UtensilToggleSwitch v-model="switchLabelBlock" label="Notifications" />
          </div>
        </div>
        <div class="demo-label">Block Label (default)</div>
        <div class="demo-code">
          <code>&lt;UtensilToggleSwitch label="Notifications" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <div class="toggle-switch-demo">
            <UtensilToggleSwitch v-model="switchLabelInline" label="Dark mode" label-placement="inline" />
          </div>
        </div>
        <div class="demo-label">Inline Label</div>
        <div class="demo-code">
          <code>&lt;UtensilToggleSwitch label="Dark mode" label-placement="inline" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <div class="toggle-switch-demo stack">
            <UtensilToggleSwitch v-model="switchLabelInline2" label="Auto-save" label-placement="inline" />
            <UtensilToggleSwitch v-model="switchLabelInline3" label="Spell check" label-placement="inline" />
          </div>
        </div>
        <div class="demo-label">Inline Label Stack</div>
        <div class="demo-code">
          <code>&lt;UtensilToggleSwitch label="Auto-save" label-placement="inline" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <div class="toggle-switch-demo">
            <UtensilToggleSwitch :model-value="true" label="Enabled toggle" label-placement="inline" disabled />
          </div>
        </div>
        <div class="demo-label">Disabled with Label</div>
        <div class="demo-code">
          <code>&lt;UtensilToggleSwitch label="Enabled" label-placement="inline" disabled /&gt;</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilToggleSwitch from '@gobistories/utensil-vue/components/toggle-switch/UtensilToggleSwitch.vue'

const switchLabelBlock = ref(true)
const switchLabelInline = ref(false)
const switchLabelInline2 = ref(true)
const switchLabelInline3 = ref(false)
</script>

<style scoped>
.demo-content .toggle-switch-demo {
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);

  &.stack {
    align-items: flex-end;
  }
}
</style>
