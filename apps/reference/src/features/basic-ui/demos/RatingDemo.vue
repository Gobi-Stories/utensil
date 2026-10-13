<template>
  <ReferenceComponentDemo
    title="Rating"
    anchor="rating"
    description="A rating chosen on a scale, drawn as stars, smilies or numbers: filled at or below the rating, outlined above it."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceRating v-model="stars" label="Rate this story" />
        </div>
        <div class="demo-label">Stars (rating: {{ stars ?? 'none' }})</div>
        <div class="demo-code">
          <code>&lt;UtensilRating v-model="rating" label="Rate this story" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceRating
            v-model="smilies"
            label="How satisfied are you?"
            rating-style="smilies"
            min-label="Very dissatisfied"
            max-label="Very satisfied"
          />
        </div>
        <div class="demo-label always-visible">Smilies with end labels</div>
        <div class="demo-code">
          <code>&lt;UtensilRating rating-style="smilies" min-label="…" max-label="…" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceRating v-model="numbers" label="How easy was it?" rating-style="numbers" color="success" />
        </div>
        <div class="demo-label">Numbers, colored</div>
        <div class="demo-code">
          <code>&lt;UtensilRating rating-style="numbers" color="success" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceRating
            v-model="recommend"
            label="How likely are you to recommend us?"
            rating-style="numbers"
            :min="0"
            :max="10"
            min-label="Not at all likely"
            max-label="Extremely likely"
            wrap
          />
        </div>
        <div class="demo-label always-visible">0 to 10, wrapping when narrow</div>
        <div class="demo-code">
          <code>&lt;UtensilRating rating-style="numbers" :min="0" :max="10" wrap /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceRating :model-value="4" label="Score" readonly />
        </div>
        <div class="demo-label always-visible">Read-only</div>
        <div class="demo-code">
          <code>&lt;UtensilRating :model-value="4" readonly /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceRating :model-value="3" label="Score" rating-style="smilies" readonly compact />
        </div>
        <div class="demo-label always-visible">Compact, read-only</div>
        <div class="demo-code">
          <code>&lt;UtensilRating rating-style="smilies" readonly compact /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceRating v-model="disabled" label="Rate this story" disabled />
        </div>
        <div class="demo-label always-visible">Disabled</div>
        <div class="demo-code">
          <code>&lt;UtensilRating disabled /&gt;</code>
        </div>
      </div>
    </div>

    <div id="rating-average" class="component-demo">
      <h3><a class="demo-anchor" href="#rating-average">An Average</a></h3>
      <p>
        Read-only, a rating may fall between two points, such as an average: the point above it fills by the fraction it
        reaches.
      </p>
      <div class="demo-grid">
        <div class="demo-item">
          <div class="demo-content">
            <ReferenceRating :model-value="3.4" label="Average score" readonly />
          </div>
          <div class="demo-label always-visible">Stars, 3.4</div>
          <div class="demo-code">
            <code>&lt;UtensilRating :model-value="3.4" readonly /&gt;</code>
          </div>
        </div>
        <div class="demo-item">
          <div class="demo-content">
            <ReferenceRating :model-value="2.7" label="Average satisfaction" rating-style="smilies" readonly />
          </div>
          <div class="demo-label always-visible">Smilies, 2.7</div>
          <div class="demo-code">
            <code>&lt;UtensilRating :model-value="2.7" rating-style="smilies" readonly /&gt;</code>
          </div>
        </div>
        <div class="demo-item">
          <div class="demo-content">
            <ReferenceRating :model-value="3.5" label="Average ease" rating-style="numbers" readonly compact />
          </div>
          <div class="demo-label always-visible">Numbers, 3.5, compact</div>
          <div class="demo-code">
            <code>&lt;UtensilRating :model-value="3.5" rating-style="numbers" readonly compact /&gt;</code>
          </div>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilRatingDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilRatingDoc from '@gobistories/utensil-vue/components/rating/UtensilRatingDoc.vue'
import { ReferenceRating } from '@/theme/components/ReferenceRating'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

const stars = ref<number>()
const smilies = ref<number>(4)
const numbers = ref<number>(3)
const recommend = ref<number>()
const disabled = ref<number>(2)
</script>

<style scoped>
.demo-content {
  min-height: 80px;
}
</style>
