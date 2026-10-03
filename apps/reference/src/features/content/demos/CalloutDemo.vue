<template>
  <ReferenceComponentDemo
    title="Callout"
    anchor="callout"
    description="Displays a short message to attract user attention. Used for notifications, warnings, and important information."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content callout-demo">
          <ReferenceCallout icon="info-circle"> This is a default callout message. </ReferenceCallout>
        </div>
        <div class="demo-label">Basic Callout</div>
        <div class="demo-code">
          <code>&lt;UtensilCallout icon="info-circle"&gt;Message&lt;/UtensilCallout&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content callout-demo">
          <ReferenceCallout variation="soft" icon="info-circle"> Soft variation callout. </ReferenceCallout>
          <ReferenceCallout variation="surface" icon="info-circle"> Surface variation callout. </ReferenceCallout>
          <ReferenceCallout variation="outline" icon="info-circle"> Outline variation callout. </ReferenceCallout>
        </div>
        <div class="demo-label">Style Variations</div>
        <div class="demo-code">
          <code>&lt;UtensilCallout variation="surface"&gt;...&lt;/UtensilCallout&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content callout-demo">
          <ReferenceCallout color="success" icon="check-circle"> Operation completed successfully. </ReferenceCallout>
          <ReferenceCallout color="warning" icon="exclamation-triangle">
            Please review before continuing.
          </ReferenceCallout>
          <ReferenceCallout color="error" icon="exclamation-circle">
            An error occurred. Please try again.
          </ReferenceCallout>
        </div>
        <div class="demo-label">Semantic Colors</div>
        <div class="demo-code">
          <code>&lt;UtensilCallout color="success"&gt;...&lt;/UtensilCallout&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content callout-demo">
          <ReferenceCallout scale="small" icon="info-circle"> Small scale callout. </ReferenceCallout>
          <ReferenceCallout icon="info-circle"> Normal scale callout. </ReferenceCallout>
          <ReferenceCallout scale="large" icon="info-circle"> Large scale callout. </ReferenceCallout>
        </div>
        <div class="demo-label">Scale Presets</div>
        <div class="demo-code">
          <code>&lt;UtensilCallout scale="large"&gt;...&lt;/UtensilCallout&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content callout-demo">
          <ReferenceCallout variation="surface" color="warning" icon="exclamation-triangle">
            Surface variation with warning color.
          </ReferenceCallout>
          <ReferenceCallout variation="outline" color="success" icon="check-circle">
            Outline variation with success color.
          </ReferenceCallout>
        </div>
        <div class="demo-label">Combined Variations</div>
        <div class="demo-code">
          <code>&lt;UtensilCallout variation="surface" color="warning"&gt;...&lt;/UtensilCallout&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content callout-demo">
          <ReferenceCallout>
            This is a callout without an icon. It still works perfectly fine for displaying important messages.
          </ReferenceCallout>
        </div>
        <div class="demo-label">Without Icon</div>
        <div class="demo-code">
          <code>&lt;UtensilCallout&gt;Message without icon&lt;/UtensilCallout&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content callout-demo">
          <ReferenceCallout role="alert" color="error" icon="exclamation-circle">
            This urgent message uses role="alert" for screen reader announcement.
          </ReferenceCallout>
        </div>
        <div class="demo-label">Accessible Alert</div>
        <div class="demo-code">
          <code>&lt;UtensilCallout role="alert" color="error"&gt;...&lt;/UtensilCallout&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content callout-demo controlled-demo">
          <div class="demo">
            <ReferenceCallout :scale="scaleCalloutScale" color="success" icon="check-circle">
              Scalable callout component.
            </ReferenceCallout>
          </div>
          <ReferenceRangeSlider class="contorl" v-model="scaleCalloutScale" :min="0.7" :max="1.5" :step="0.01" />
        </div>
        <div class="demo-label">Reactive Scale</div>
        <div class="demo-code">
          <code>&lt;UtensilCallout :scale="{{ scaleCalloutScale.toFixed(2) }}"&gt;...&lt;/UtensilCallout&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilCalloutDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilCalloutDoc from 'utensil-vue/components/callout/UtensilCalloutDoc.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { ReferenceCallout } from '@/theme/components/ReferenceCallout'
import { ReferenceRangeSlider } from '@/theme/components/ReferenceRangeSlider'

const scaleCalloutScale = ref(1)
</script>

<style scoped>
.demo-content.callout-demo {
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-3);
}
</style>
