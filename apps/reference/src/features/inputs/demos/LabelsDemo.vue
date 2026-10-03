<template>
  <div id="labels" class="component-demo">
    <h3><a class="demo-anchor" href="#labels">Labels</a></h3>
    <p>
      Optional labels that can be placed in block or inline layout. Labels are automatically wired to the slider input
      via generated IDs.
    </p>
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceRangeSlider v-model="rangeLabelBlock" label="Volume" showValue />
        </div>
        <div class="demo-label">Block Label (default)</div>
        <div class="demo-code">
          <code>&lt;UtensilRangeSlider label="Volume" showValue /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceRangeSlider v-model="rangeLabelInline" label="Brightness" label-placement="inline" showValue />
        </div>
        <div class="demo-label">Inline Label</div>
        <div class="demo-code">
          <code>&lt;UtensilRangeSlider label="Brightness" label-placement="inline" showValue /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceRangeSlider
            v-model="rangeLabelFormatted"
            label="Opacity"
            :min="0"
            :max="1"
            :step="0.01"
            showValue
            :formatValue="(v: number) => `${Math.round(v * 100)}%`"
          />
        </div>
        <div class="demo-label">Label with Formatted Value</div>
        <div class="demo-code">
          <code>&lt;UtensilRangeSlider label="Opacity" :format-value="v =&gt; \`\${v}%\`" showValue /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceRangeSlider
            v-model="rangeLabelColor"
            label="Quality"
            label-placement="inline"
            color="success"
            showValue
          />
        </div>
        <div class="demo-label">Inline Label with Color</div>
        <div class="demo-code">
          <code>&lt;UtensilRangeSlider label="Quality" label-placement="inline" color="success" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content input-demo">
          <ReferenceRangeSlider
            v-model="rangeValuesInLabel"
            :steps="[0.25, 0.5, 1, 1.5, 2, 3]"
            label="Speed"
            label-placement="inline"
            show-values-in-label
            :formatValue="(v: number) => `${v}x`"
          />
        </div>
        <div class="demo-label">Show Values in Label</div>
        <div class="demo-code">
          <code
            >&lt;UtensilRangeSlider label="Speed" show-values-in-label :format-value="v =&gt; \`\${v}x\`" /&gt;</code
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ReferenceRangeSlider } from '@/theme/components/ReferenceRangeSlider'

const rangeLabelBlock = ref(60)
const rangeLabelInline = ref(70)
const rangeLabelFormatted = ref(0.75)
const rangeLabelColor = ref(80)
const rangeValuesInLabel = ref(1)
</script>

<style scoped>
.demo-content.input-demo {
  flex-direction: column;
  align-items: stretch;
}
</style>
