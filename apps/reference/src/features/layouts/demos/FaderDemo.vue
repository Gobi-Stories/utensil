<template>
  <ReferenceComponentDemo
    title="Fader"
    anchor="fader"
    description="Fade transition component for smooth show/hide animations."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content fader-demo">
          <div class="fader-controls">
            <UtensilButton size="small" @click="faderDemo = !faderDemo"
              >{{ faderDemo ? 'Hide' : 'Show' }} Content</UtensilButton
            >
          </div>
          <div class="fader-content-area">
            <UtensilFader :show="faderDemo">
              <div class="demo-fade-content">
                <span>This content fades in and out smoothly!</span>
              </div>
            </UtensilFader>
          </div>
        </div>
        <div class="demo-label">Basic Fade</div>
      </div>
      <div class="demo-item">
        <div class="demo-content fader-demo">
          <div class="fader-controls">
            <UtensilButton size="small" @click="remountInDelayDemo">Remount &amp; Show</UtensilButton>
          </div>
          <div class="fader-content-area">
            <UtensilFader v-if="inDelayMounted" :show="inDelayDemo" :in-delay="500">
              <div class="demo-fade-content">
                <span>No fade if shown within 500ms of mount</span>
              </div>
            </UtensilFader>
          </div>
        </div>
        <div class="demo-label">inDelay (500ms)</div>
      </div>
      <div class="demo-item">
        <div class="demo-content fader-demo">
          <div class="fader-controls">
            <UtensilButton size="small" @click="outDelayDemo = !outDelayDemo"
              >{{ outDelayDemo ? 'Hide' : 'Show' }} Content</UtensilButton
            >
          </div>
          <div class="fader-content-area">
            <UtensilFader :show="outDelayDemo" :out-delay="1000">
              <div class="demo-fade-content">
                <span>Stays visible 1s before fading out</span>
              </div>
            </UtensilFader>
          </div>
        </div>
        <div class="demo-label">outDelay (1s)</div>
      </div>
    </div>

    <template #api>
      <UtensilFaderDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilFader from '@gobistories/utensil-vue/components/fader/UtensilFader.vue'
import UtensilFaderDoc from '@gobistories/utensil-vue/components/fader/UtensilFaderDoc.vue'
import UtensilButton from '@gobistories/utensil-vue/components/button/UtensilButton.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

const faderDemo = ref(false)
const inDelayDemo = ref(false)
const inDelayMounted = ref(true)
const outDelayDemo = ref(false)

function remountInDelayDemo() {
  inDelayMounted.value = false
  inDelayDemo.value = false
  setTimeout(() => {
    inDelayMounted.value = true
    inDelayDemo.value = true
  }, 0)
}
</script>

<style scoped>
.demo-fade-content {
  padding: var(--space-3);
  background-color: var(--pen-a3);
  border-radius: var(--radius-2);
  text-align: center;
}

.demo-content.fader-demo {
  position: relative;
  flex-direction: column;
  align-items: stretch;
  min-height: 208px;
}

.fader-controls {
  position: absolute;
  top: var(--space-3);
  align-self: center;
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-3);
}

.fader-content-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
}
</style>
