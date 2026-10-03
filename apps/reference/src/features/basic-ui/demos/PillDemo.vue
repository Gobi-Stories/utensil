<template>
  <ReferenceComponentDemo
    title="Pill"
    anchor="pill"
    description="Pill-shaped components for tags, filters, and labels with optional counts and edit functionality."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <ReferencePill label="Solid" />
          <ReferencePill variation="soft" label="Soft" />
          <ReferencePill variation="surface" label="Surface" />
          <ReferencePill variation="outline" label="Outline" />
          <ReferencePill variation="text" label="Text" />
          <ReferencePill variation="overlay" label="Overlay" />
        </div>
        <div class="demo-label">Style Variations</div>
        <div class="demo-code">
          <code>&lt;UtensilPill label="Solid" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferencePill label="Primary" />
          <ReferencePill color="pencil" label="Secondary" />
          <ReferencePill color="success" label="Success" />
          <ReferencePill color="warning" label="Warning" />
          <ReferencePill color="error" label="Danger" />
        </div>
        <div class="demo-label">Color Pills</div>
        <div class="demo-code">
          <code>&lt;UtensilPill color="success" label="Tag" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferencePill variation="soft" label="Primary" />
          <ReferencePill variation="soft" color="pencil" label="Secondary" />
          <ReferencePill variation="soft" color="success" label="Success" />
          <ReferencePill variation="soft" color="warning" label="Warning" />
          <ReferencePill variation="soft" color="error" label="Danger" />
        </div>
        <div class="demo-label">Soft Pills with Colors</div>
        <div class="demo-code">
          <code>&lt;UtensilPill variation="soft" color="success" label="Tag" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferencePill variation="soft" color="pencil" :count="5" label="Photos" />
          <ReferencePill :count="12" label="Videos" />
          <ReferencePill color="success" :count="3" label="Published" />
          <ReferencePill variation="outline" :count="0" label="Drafts" />
        </div>
        <div class="demo-label">With Count</div>
        <div class="demo-code">
          <code>&lt;UtensilPill :count="12" label="Videos" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content pill-tags">
          <ReferencePill
            v-for="tag in demoTags"
            :key="tag"
            variation="outline"
            removable
            :aria-label="tag"
            :label="tag"
            @removed="removeTag"
          />
          <div v-if="demoTags.length === 0" class="reset-notice">
            <small
              >All tags removed!
              <ReferenceButton variation="text" size="tiny" @click="resetTags">Reset</ReferenceButton></small
            >
          </div>
        </div>
        <div class="demo-label">Removable</div>
        <div class="demo-code">
          <code
            >&lt;UtensilPill removable aria-label="JavaScript"
            @removed="handleRemove"&gt;JavaScript&lt;/UtensilPill&gt;</code
          >
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferencePill color="success" removable aria-label="Success" label="Success" />
          <ReferencePill color="warning" removable aria-label="Warning" label="Warning" />
          <ReferencePill color="error" removable aria-label="Error" label="Error" />
        </div>
        <div class="demo-label">Colored Removable Pills</div>
        <div class="demo-code">
          <code>&lt;UtensilPill color="success" removable label="Success" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferencePill style="max-width: 180px" label="Long text that gets truncated with ellipsis" />
          <ReferencePill
            variation="soft"
            color="pencil"
            removable
            aria-label="Very long tag name"
            style="max-width: 150px"
            label="Very long tag name that also truncates"
          />
        </div>
        <div class="demo-label always-visible">Text Overflow</div>
        <div class="demo-code">
          <code>&lt;UtensilPill style="max-width: 150px;" label="Long text..." /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferencePill icon="circle" color="success" removable aria-label="Active" label="Active" />
          <ReferencePill icon="exclamation-triangle" color="warning" :count="2" label="Warnings" />
          <ReferencePill icon="star" variation="soft" label="Featured" />
          <ReferencePill icon="tag" variation="outline" label="Tagged" />
        </div>
        <div class="demo-label">Icon Prop</div>
        <div class="demo-code">
          <code>&lt;UtensilPill icon="star" label="Featured" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferencePill scale="tiny" label="Tiny" />
          <ReferencePill scale="small" label="Small" />
          <ReferencePill scale="normal" label="Normal" />
          <ReferencePill scale="large" label="Large" />
        </div>
        <div class="demo-label">Scale Presets</div>
        <div class="demo-code">
          <code>&lt;UtensilPill scale="large" label="Pill" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content controlled-demo">
          <div class="demo flex row center gap-4">
            <ReferencePill :scale="scalePillScale" :label="`Scale: ${scalePillScale.toFixed(2)}`" />
            <ReferencePill :scale="scalePillScale" color="success" :count="5" label="Items" />
          </div>
          <ReferenceRangeSlider
            v-model="scalePillScale"
            label="Scale"
            label-placement="inline"
            :min="0.7"
            :max="1.5"
            :step="0.01"
            class="control"
          />
        </div>
        <div class="demo-label">Reactive Scale</div>
        <div class="demo-code">
          <code>&lt;UtensilPill :scale="{{ scalePillScale.toFixed(2) }}"&gt;Pill&lt;/UtensilPill&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferencePill variation="surface" rounded label="Rounded" />
          <ReferencePill variation="surface" label="Normal" />
          <ReferencePill variation="surface" squared label="Squared" />
        </div>
        <div class="demo-label">Rounded and Squared</div>
        <div class="demo-code">
          <code>&lt;UtensilPill rounded label="Pill" /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilPillDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilPillDoc from 'utensil-vue/components/pill/UtensilPillDoc.vue'
import { ReferencePill } from '@/theme/components/ReferencePill'
import { ReferenceButton } from '@/theme/components/ReferenceButton'
import { ReferenceRangeSlider } from '@/theme/components/ReferenceRangeSlider'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

const demoTags = ref(['JavaScript', 'Vue.js', 'TypeScript', 'CSS'])
const scalePillScale = ref(1)

function removeTag(tagName: string | undefined) {
  if (tagName) {
    const index = demoTags.value.indexOf(tagName)
    if (index > -1) {
      demoTags.value.splice(index, 1)
    }
  }
}

function resetTags() {
  demoTags.value = ['JavaScript', 'Vue.js', 'TypeScript', 'CSS']
}
</script>

<style scoped>
.demo-content:not(.controlled-demo) {
  min-height: 80px;
}

.demo-content.pill-tags {
  flex-wrap: wrap;
}

.reset-notice {
  width: 100%;
  text-align: center;
  color: var(--pencil-12);
  margin-top: 8px;
}
</style>
