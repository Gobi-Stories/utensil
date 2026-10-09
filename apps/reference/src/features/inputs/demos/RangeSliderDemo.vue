<template>
  <ReferenceComponentDemo
    title="Range Slider"
    anchor="range-slider"
    description="Range slider input with customizable track, label, and formatting."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceRangeSlider v-model="rangeBasic" />
          <div class="input-value">Value: {{ rangeBasic }}</div>
        </div>
        <div class="demo-label">Basic Slider</div>
        <div class="demo-code">
          <code>&lt;UtensilRangeSlider v-model="value" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceRangeSlider v-model="rangeLabel" showValue />
          <div class="input-value">Value: {{ rangeLabel }}</div>
        </div>
        <div class="demo-label">With Label</div>
        <div class="demo-code">
          <code>&lt;UtensilRangeSlider v-model="value" label /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceRangeSlider
            v-model="rangeFormatted"
            :min="0"
            :max="1"
            :step="0.01"
            showValue
            :formatValue="(v: number) => `${Math.round(v * 100)}%`"
          />
          <div class="input-value">Value: {{ rangeFormatted }}</div>
        </div>
        <div class="demo-label">Formatted Label</div>
        <div class="demo-code">
          <code>&lt;UtensilRangeSlider :format-label="v =&gt; \`\${v}%\`" label /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceRangeSlider v-model="rangeStep" :min="0" :max="20" :step="2" showValue />
          <div class="input-value">Value: {{ rangeStep }}</div>
        </div>
        <div class="demo-label">Stepped</div>
        <div class="demo-code">
          <code>&lt;UtensilRangeSlider :min="0" :max="10" :step="2" label /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceRangeSlider v-model="rangeBadge" label="Bubble size" :min="75" :max="250" unit="px" valueBadge />
          <div class="input-value">Value: {{ rangeBadge }}</div>
        </div>
        <div class="demo-label">Badged Value with Unit</div>
        <div class="demo-code">
          <code>&lt;UtensilRangeSlider label unit="px" valueBadge /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceRangeSlider v-model="rangeColor1" color="success" showValue />
          <ReferenceRangeSlider v-model="rangeColor2" color="warning" showValue />
          <ReferenceRangeSlider v-model="rangeColor3" color="error" showValue />
        </div>
        <div class="demo-label">Color Variants</div>
        <div class="demo-code">
          <code>&lt;UtensilRangeSlider color="success" label /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceRangeSlider v-model="rangeDisabled" showValue disabled />
          <div class="input-value">Disabled state</div>
        </div>
        <div class="demo-label">Disabled</div>
        <div class="demo-code">
          <code>&lt;UtensilRangeSlider disabled /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceRangeSlider v-model="rangeSlot" :min="0" :max="100" :step="5">
            <template #value="{ value }">
              <ReferenceBadge variation="soft">{{ value }}px</ReferenceBadge>
            </template>
          </ReferenceRangeSlider>
          <div class="input-value">Value: {{ rangeSlot }}px</div>
        </div>
        <div class="demo-label">Custom Label</div>
        <div class="demo-code">
          <code
            >&lt;UtensilRangeSlider&gt;&lt;template #label="{ value
            }"&gt;...&lt;/template&gt;&lt;/UtensilRangeSlider&gt;</code
          >
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceRangeSlider v-model="rangeRounded" rounded />
          <div class="input-value">Value: {{ rangeRounded }}</div>
        </div>
        <div class="demo-label always-visible">Rounded</div>
        <div class="demo-code">
          <code>&lt;UtensilRangeSlider rounded /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <div class="vertical-slider-frame flex justify-center">
            <ReferenceRangeSlider v-model="rangeVertical" vertical showValue ariaLabel="Vertical slider" />
          </div>
          <div class="input-value">Value: {{ rangeVertical }}</div>
        </div>
        <div class="demo-label always-visible">Vertical</div>
        <div class="demo-code">
          <code>&lt;UtensilRangeSlider vertical /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <div class="slider-media-frame" :style="{ backgroundImage: `url('${sampleLandscape}')` }">
            <div class="slider-media-panel">
              <ReferenceRangeSlider v-model="rangeOverMedia" label="Size" unit="%" showValue visibleWhileInteracting />
            </div>
          </div>
        </div>
        <div class="demo-label always-visible">Panel Hides While Adjusting</div>
        <div class="demo-code">
          <code>&lt;UtensilRangeSlider visibleWhileInteracting /&gt;</code>
        </div>
      </div>
    </div>
    <template #api>
      <UtensilRangeSliderDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import sampleLandscape from '@/features/assets/sample-landscape.svg'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import UtensilRangeSliderDoc from '@gobistories/utensil-vue/components/range-slider/UtensilRangeSliderDoc.vue'
import { ReferenceRangeSlider } from '@/theme/components/ReferenceRangeSlider'
import { ReferenceBadge } from '@/theme/components/ReferenceBadge'

const rangeBasic = ref(50)
const rangeLabel = ref(75)
const rangeFormatted = ref(0.5)
const rangeStep = ref(10)
const rangeBadge = ref(180)
const rangeColor1 = ref(60)
const rangeColor2 = ref(40)
const rangeColor3 = ref(80)
const rangeDisabled = ref(30)
const rangeSlot = ref(50)
const rangeRounded = ref(50)
const rangeVertical = ref(50)
const rangeOverMedia = ref(60)
</script>

<style scoped>
.demo-content.input-demo {
  flex-direction: column;
  align-items: stretch;
}

.vertical-slider-frame {
  height: calc(var(--space-9) * 2);
}

/* The panel gets out of the way while its slider adjusts; the opted-in track
   stays visible over the media */
.slider-media-frame {
  padding: var(--space-4);
  border-radius: var(--radius-3);
  background-size: cover;
  background-position: center;
}

.slider-media-frame:has(.utensil-range-slider.interacting) .slider-media-panel {
  visibility: hidden;
}

.slider-media-panel {
  padding: var(--space-3);
  border-radius: var(--radius-3);
  background-color: var(--panel-solid);
  box-shadow: var(--shadow-border-3);
}

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
</style>
