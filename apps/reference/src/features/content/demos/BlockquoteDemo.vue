<template>
  <ReferenceComponentDemo
    title="Blockquote"
    anchor="blockquote"
    description="Displays a block-level quotation from another source with semantic HTML structure."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content blockquote-demo">
          <ReferenceBlockquote>
            Perfect typography is certainly the most elusive of all arts. Sculpture in stone alone comes near it in
            obstinacy.
          </ReferenceBlockquote>
        </div>
        <div class="demo-label">Basic Blockquote</div>
        <div class="demo-code">
          <code>&lt;UtensilBlockquote&gt;Quote text...&lt;/UtensilBlockquote&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content blockquote-demo">
          <ReferenceBlockquote color="success">
            The only way to do great work is to love what you do.
          </ReferenceBlockquote>
          <ReferenceBlockquote color="warning"> With great power comes great responsibility. </ReferenceBlockquote>
          <ReferenceBlockquote color="error"> To err is human; to forgive, divine. </ReferenceBlockquote>
        </div>
        <div class="demo-label">Semantic Colors</div>
        <div class="demo-code">
          <code>&lt;UtensilBlockquote color="success"&gt;...&lt;/UtensilBlockquote&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content blockquote-demo">
          <ReferenceBlockquote weight="light"> Light weight quotation text. </ReferenceBlockquote>
          <ReferenceBlockquote weight="regular"> Regular weight quotation text. </ReferenceBlockquote>
          <ReferenceBlockquote weight="medium"> Medium weight quotation text. </ReferenceBlockquote>
          <ReferenceBlockquote weight="bold"> Bold weight quotation text. </ReferenceBlockquote>
        </div>
        <div class="demo-label">Weight Variations</div>
        <div class="demo-code">
          <code>&lt;UtensilBlockquote weight="bold"&gt;...&lt;/UtensilBlockquote&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content blockquote-demo">
          <ReferenceBlockquote scale="small"> Small scale quotation. </ReferenceBlockquote>
          <ReferenceBlockquote> Normal scale quotation. </ReferenceBlockquote>
          <ReferenceBlockquote scale="large"> Large scale quotation. </ReferenceBlockquote>
        </div>
        <div class="demo-label">Scale Presets</div>
        <div class="demo-code">
          <code>&lt;UtensilBlockquote scale="large"&gt;...&lt;/UtensilBlockquote&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content blockquote-demo controlled-demo">
          <div class="demo">
            <ReferenceBlockquote :scale="scaleBlockquoteScale" color="success">
              Scalable blockquote component with reactive sizing.
            </ReferenceBlockquote>
          </div>
          <ReferenceRangeSlider class="control" v-model="scaleBlockquoteScale" :min="0.7" :max="1.5" :step="0.01" />
        </div>
        <div class="demo-label">Reactive Scale</div>
        <div class="demo-code">
          <code
            >&lt;UtensilBlockquote :scale="{{ scaleBlockquoteScale.toFixed(2) }}"&gt;...&lt;/UtensilBlockquote&gt;</code
          >
        </div>
      </div>
    </div>

    <template #api>
      <UtensilBlockquoteDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilBlockquoteDoc from '@gobistories/utensil-vue/components/blockquote/UtensilBlockquoteDoc.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { ReferenceBlockquote } from '@/theme/components/ReferenceBlockquote'
import { ReferenceRangeSlider } from '@/theme/components/ReferenceRangeSlider'

const scaleBlockquoteScale = ref(1)
</script>

<style scoped>
.demo-content.blockquote-demo {
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-4);
}
</style>
