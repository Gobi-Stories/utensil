<template>
  <ReferenceComponentDemo
    title="Button"
    anchor="button"
    description="Flexible button component with variations, sizes, and states."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceButton>Solid</ReferenceButton>
          <ReferenceButton variation="outline">Outline</ReferenceButton>
          <ReferenceButton variation="surface">Surface</ReferenceButton>
          <ReferenceButton variation="soft">Soft</ReferenceButton>
          <ReferenceButton variation="text">Text</ReferenceButton>
          <ReferenceButton variation="unstyled">Unstyled</ReferenceButton>
        </div>
        <div class="demo-label">Style Variations</div>
        <div class="demo-code">
          <code>&lt;UtensilButton variation="solid"&gt;Button&lt;/UtensilButton&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceButton>Primary</ReferenceButton>
          <ReferenceButton color="success">Success</ReferenceButton>
          <ReferenceButton color="warning">Warning</ReferenceButton>
          <ReferenceButton color="error">Danger</ReferenceButton>
          <ReferenceButton color="favorite">Favorite</ReferenceButton>
        </div>
        <div class="demo-label">Color Buttons</div>
        <div class="demo-code">
          <code>&lt;UtensilButton color="error"&gt;Delete&lt;/UtensilButton&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceButton variation="outline">Primary</ReferenceButton>
          <ReferenceButton variation="outline" color="success">Success</ReferenceButton>
          <ReferenceButton variation="outline" color="warning">Warning</ReferenceButton>
          <ReferenceButton variation="outline" color="error">Danger</ReferenceButton>
          <ReferenceButton variation="outline" color="favorite">Favorite</ReferenceButton>
        </div>
        <div class="demo-label">Outline Buttons with Colors</div>
        <div class="demo-code">
          <code>&lt;UtensilButton variation="outline" color="success"&gt;Success&lt;/UtensilButton&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceButton variation="surface">Primary</ReferenceButton>
          <ReferenceButton variation="surface" color="success">Success</ReferenceButton>
          <ReferenceButton variation="surface" color="warning">Warning</ReferenceButton>
          <ReferenceButton variation="surface" color="error">Danger</ReferenceButton>
          <ReferenceButton variation="surface" color="favorite">Favorite</ReferenceButton>
        </div>
        <div class="demo-label">Surface Buttons with Colors</div>
        <div class="demo-code">
          <code>&lt;UtensilButton variation="surface" color="error"&gt;Delete&lt;/UtensilButton&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceButton variation="soft">Primary</ReferenceButton>
          <ReferenceButton variation="soft" color="success">Success</ReferenceButton>
          <ReferenceButton variation="soft" color="warning">Warning</ReferenceButton>
          <ReferenceButton variation="soft" color="error">Danger</ReferenceButton>
          <ReferenceButton variation="soft" color="favorite">Favorite</ReferenceButton>
        </div>
        <div class="demo-label">Soft Buttons with Colors</div>
        <div class="demo-code">
          <code>&lt;UtensilButton variation="soft" color="favorite"&gt;Delete&lt;/UtensilButton&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceButton variation="text">Primary</ReferenceButton>
          <ReferenceButton variation="text" color="success">Success</ReferenceButton>
          <ReferenceButton variation="text" color="warning">Warning</ReferenceButton>
          <ReferenceButton variation="text" color="error">Danger</ReferenceButton>
          <ReferenceButton variation="text" color="favorite">Favorite</ReferenceButton>
        </div>
        <div class="demo-label">Text Buttons with Colors</div>
        <div class="demo-code">
          <code>&lt;UtensilButton variation="text" color="success"&gt;Save&lt;/UtensilButton&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content button-sizes">
          <ReferenceButton scale="tiny">Tiny</ReferenceButton>
          <ReferenceButton scale="small">Small</ReferenceButton>
          <ReferenceButton scale="normal">Normal</ReferenceButton>
          <ReferenceButton scale="large">Large</ReferenceButton>
        </div>
        <div class="demo-label">Sizes by Preset</div>
        <div class="demo-code">
          <code>&lt;UtensilButton scale="large"&gt;Button&lt;/UtensilButton&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content controlled-demo">
          <div class="demo">
            <ReferenceButton :scale="scaleButtonScale">Scale: {{ scaleButtonScale.toFixed(2) }}</ReferenceButton>
          </div>
          <ReferenceRangeSlider
            class="control"
            v-model="scaleButtonScale"
            label="Scale"
            label-placement="inline"
            :min="0.5"
            :max="1.5"
            :step="0.01"
          />
        </div>
        <div class="demo-label">Reactive Scale</div>
        <div class="demo-code">
          <code>&lt;UtensilButton :scale="{{ scaleButtonScale.toFixed(2) }}"&gt;Button&lt;/UtensilButton&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceButton icon="star">With Icon</ReferenceButton>
          <ReferenceButton icon="download" icon-only>Download</ReferenceButton>
          <ReferenceButton icon="heart" icon-only round>Like</ReferenceButton>
        </div>
        <div class="demo-label">With Icons</div>
        <div class="demo-code">
          <code>&lt;UtensilButton icon="star"&gt;Button&lt;/UtensilButton&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceButton :busy="busyDemo" @click="toggleBusy" class="fixed-width-demo" icon="star">
            Click me
          </ReferenceButton>
          <ReferenceButton variation="overlay">Overlay</ReferenceButton>
          <ReferenceButton disabled>Disabled</ReferenceButton>
        </div>
        <div class="demo-label always-visible">Busy, Overlay &amp; Disabled</div>
        <div class="demo-code">
          <code>&lt;UtensilButton :busy="loading"&gt;Save&lt;/UtensilButton&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceButton icon="check" icon-only>Accept</ReferenceButton>
          <ReferenceButton variation="outline" color="pencil" icon="search" icon-only>Search</ReferenceButton>
          <ReferenceButton variation="surface" color="pencil" icon="cloud-upload-alt" icon-only>Search</ReferenceButton>
          <ReferenceButton variation="soft" color="pencil" icon="bars" icon-only>Menu</ReferenceButton>
          <ReferenceButton variation="text" color="pencil" icon="cog" icon-only>Settings</ReferenceButton>
        </div>
        <div class="demo-label">Icon Only</div>
        <div class="demo-code">
          <code>&lt;UtensilButton variation="text" icon="cog" icon-only&gt;Settings&lt;/UtensilButton&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content block-demo">
          <ReferenceButton block>Continue</ReferenceButton>
          <ReferenceButton block variation="outline">Save as Draft</ReferenceButton>
          <ReferenceButton block variation="soft" color="pencil">Cancel</ReferenceButton>
        </div>
        <div class="demo-label">Block</div>
        <div class="demo-code">
          <code>&lt;UtensilButton block&gt;Full Width&lt;/UtensilButton&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilButtonDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilButtonDoc from 'utensil-vue/components/button/UtensilButtonDoc.vue'
import { ReferenceButton } from '@/theme/components/ReferenceButton'
import { ReferenceRangeSlider } from '@/theme/components/ReferenceRangeSlider'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

const busyDemo = ref(false)
const scaleButtonScale = ref(1)

function toggleBusy() {
  busyDemo.value = true
  setTimeout(() => {
    busyDemo.value = false
  }, 2000)
}
</script>

<style scoped>
.demo-content:not(.controlled-demo) {
  min-height: 80px;
}

.demo-content.block-demo {
  flex-direction: column;
  gap: var(--space-3);
}

.fixed-width-demo {
  min-width: 100px;
}
</style>
