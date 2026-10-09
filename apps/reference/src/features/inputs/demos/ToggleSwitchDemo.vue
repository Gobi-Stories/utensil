<template>
  <ReferenceComponentDemo
    title="Toggle Switch"
    anchor="toggle-switch"
    description="Toggle switch for binary on/off settings with custom on/off values."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <div class="toggle-switch-demo">
            <UtensilToggleSwitch v-model="switchBasic" />
            <div class="input-value">{{ switchBasic ? 'on' : 'off' }}</div>
          </div>
        </div>
        <div class="demo-label">Basic Toggle</div>
        <div class="demo-code">
          <code>&lt;UtensilToggleSwitch v-model="on" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <div class="toggle-switch-demo">
            <UtensilToggleSwitch v-model="switchCustom" onValue="active" offValue="inactive" />
            <div class="input-value">{{ switchCustom }}</div>
          </div>
        </div>
        <div class="demo-label">Custom Values</div>
        <div class="demo-code">
          <code>&lt;UtensilToggleSwitch onValue="active" offValue="inactive" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <div class="toggle-switch-demo">
            <UtensilToggleSwitch :model-value="true" disabled />
            <UtensilToggleSwitch :model-value="false" disabled />
          </div>
        </div>
        <div class="demo-label">Disabled</div>
        <div class="demo-code">
          <code>&lt;UtensilToggleSwitch disabled /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilToggleSwitchDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import UtensilToggleSwitch from '@gobistories/utensil-vue/components/toggle-switch/UtensilToggleSwitch.vue'
import UtensilToggleSwitchDoc from '@gobistories/utensil-vue/components/toggle-switch/UtensilToggleSwitchDoc.vue'

const switchBasic = ref(true)
const switchCustom = ref<string>('inactive')
</script>

<style scoped>
.input-value {
  margin-top: var(--space-2);
  padding: var(--space-1) var(--space-2);
  background-color: var(--pencil-3);
  border-radius: var(--radius-2);
  font-size: 0.85rem;
  color: var(--pencil-11);
  text-align: center;
  font-family: ui-monospace, monospace;
}

.demo-content .toggle-switch-demo {
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}
</style>
