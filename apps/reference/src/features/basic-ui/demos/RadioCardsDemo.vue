<template>
  <ReferenceComponentDemo
    title="Radio Cards"
    anchor="radio-cards"
    description="Radio group with card-based options. Supports rich content with configurable radio indicator positions."
  >
    <div class="demo-grid radio-cards">
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceRadioCards v-model="cardBasic" aria-label="Select plan">
            <ReferenceRadioCard value="free" label="Free" />
            <ReferenceRadioCard value="pro" label="Pro" />
            <ReferenceRadioCard value="enterprise" label="Enterprise" />
          </ReferenceRadioCards>
        </div>
        <div class="demo-label">Basic</div>
        <div class="demo-code">
          <code>&lt;UtensilRadioCards v-model="value"&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceRadioCards v-model="cardSurface" variation="surface" aria-label="Surface variation">
            <ReferenceRadioCard value="standard" label="Standard" />
            <ReferenceRadioCard value="premium" label="Premium" />
            <ReferenceRadioCard value="custom" label="Custom" />
          </ReferenceRadioCards>
        </div>
        <div class="demo-label">Surface Variation</div>
        <div class="demo-code">
          <code>&lt;UtensilRadioCards variation="surface"&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceRadioCards v-model="cardSoft" variation="soft" aria-label="Surface variation">
            <ReferenceRadioCard value="standard" label="Standard" />
            <ReferenceRadioCard value="premium" label="Premium" />
            <ReferenceRadioCard value="custom" label="Custom" />
          </ReferenceRadioCards>
        </div>
        <div class="demo-label">Surface Variation</div>
        <div class="demo-code">
          <code>&lt;UtensilRadioCards variation="surface"&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceRadioCards v-model="cardText" variation="text" aria-label="Surface variation">
            <ReferenceRadioCard value="standard" label="Standard" />
            <ReferenceRadioCard value="premium" label="Premium" />
            <ReferenceRadioCard value="custom" label="Custom" />
          </ReferenceRadioCards>
        </div>
        <div class="demo-label">Surface Variation</div>
        <div class="demo-code">
          <code>&lt;UtensilRadioCards variation="surface"&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceRadioCards v-model="cardColor" color="favorite" aria-label="Color demo">
            <ReferenceRadioCard value="monthly" label="Monthly" />
            <ReferenceRadioCard value="yearly" label="Yearly" />
          </ReferenceRadioCards>
        </div>
        <div class="demo-label">Color</div>
        <div class="demo-code">
          <code>&lt;UtensilRadioCards color="blue"&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceRadioCards v-model="cardDisabled" disabled aria-label="Disabled demo">
            <ReferenceRadioCard value="active" label="Active" />
            <ReferenceRadioCard value="inactive" label="Inactive" />
          </ReferenceRadioCards>
        </div>
        <div class="demo-label">Disabled</div>
        <div class="demo-code">
          <code>&lt;UtensilRadioCards disabled&gt;</code>
        </div>
      </div>
    </div>

    <div class="component-demo" id="indicator-positions">
      <h3><a class="demo-anchor" href="#indicator-positions">Indicator Positions</a></h3>
      <p>The radio indicator can be positioned at different corners or center-aligned at the start or end.</p>
      <div class="demo-grid">
        <div class="demo-item">
          <div class="demo-content">
            <ReferenceRadioCards
              v-model="cardPosition"
              class="indicators flex-block flex-stretch"
              indicator-position="start-start"
              aria-label="Start-start position"
            >
              <ReferenceRadioCard value="indicator-a" indicatorPosition="start">
                <strong>Start</strong>
                <p style="margin: 0; color: var(--pencil-11); font-size: var(--font-size-1)">
                  Radio is positioned at the left center of the card
                </p>
              </ReferenceRadioCard>
              <ReferenceRadioCard value="indicator-b" indicatorPostion="start-start">
                <strong>Start Start</strong>
                <p style="margin: 0; color: var(--pencil-11); font-size: var(--font-size-1)">
                  Radio is positioned at the top left corner of the card
                </p>
              </ReferenceRadioCard>
              <ReferenceRadioCard value="indicator-c" indicatorPosition="start-end">
                <strong>Start End</strong>
                <p style="margin: 0; color: var(--pencil-11); font-size: var(--font-size-1)">
                  Radio is positioned at the bottom left corner of the card
                </p>
              </ReferenceRadioCard>
              <ReferenceRadioCard value="indicator-d" indicatorPosition="end">
                <strong>End</strong>
                <p style="margin: 0; color: var(--pencil-11); font-size: var(--font-size-1)">
                  Radio is positioned at the right center of the card
                </p>
              </ReferenceRadioCard>
              <ReferenceRadioCard value="indicator-e" indicatorPosition="end-start">
                <strong>End Start</strong>
                <p style="margin: 0; color: var(--pencil-11); font-size: var(--font-size-1)">
                  Radio is positioned at the top right corner of the card
                </p>
              </ReferenceRadioCard>
              <ReferenceRadioCard value="indicator-f" indicatorPosition="end-end">
                <strong>End End</strong>
                <p style="margin: 0; color: var(--pencil-11); font-size: var(--font-size-1)">
                  Radio is positioned at the bottom right corner of the card
                </p>
              </ReferenceRadioCard>
            </ReferenceRadioCards>
          </div>
          <div class="demo-label always-visible">start-start</div>
        </div>
      </div>
    </div>

    <div class="component-demo" id="rich-content">
      <h3><a class="demo-anchor" href="#rich-content">Rich Content</a></h3>
      <p>
        Cards support rich content via the default slot. With <code>wireframe</code> prop that disables background
        changes on outline variation and <code>thick</code> that applies thicker borders on active and selected.
      </p>
      <div class="demo-grid">
        <div class="demo-item">
          <div class="demo-content">
            <ReferenceRadioCards
              v-model="cardRichContent"
              class="flex-column flex-block flex-stretch"
              indicator-position="start"
              variation="outline"
              aria-label="Select plan type"
              wireframe
              thick
            >
              <ReferenceRadioCard value="individual">
                <div>
                  <strong style="font-size: var(--font-size-3)">Individual</strong>
                  <p style="margin: var(--space-1) 0 0; color: var(--pencil-11); font-size: var(--font-size-2)">
                    For solo creators and freelancers.
                  </p>
                </div>
              </ReferenceRadioCard>
              <ReferenceRadioCard value="team">
                <div>
                  <strong style="font-size: var(--font-size-3)">Team</strong>
                  <p style="margin: var(--space-1) 0 0; color: var(--pencil-11); font-size: var(--font-size-2)">
                    For small teams collaborating together.
                  </p>
                </div>
              </ReferenceRadioCard>
              <ReferenceRadioCard value="organization">
                <div>
                  <strong style="font-size: var(--font-size-3)">Organization</strong>
                  <p style="margin: var(--space-1) 0 0; color: var(--pencil-11); font-size: var(--font-size-2)">
                    For large organizations with advanced needs.
                  </p>
                </div>
              </ReferenceRadioCard>
            </ReferenceRadioCards>
          </div>
        </div>
      </div>
    </div>

    <div class="component-demo" id="custom-indicators">
      <h3><a class="demo-anchor" href="#custom-indicators">Custom Indicators</a></h3>
      <p>The radio indicator can be hidden or replaced with custom content via the <code>#indicator</code> slot.</p>
      <div class="demo-grid">
        <div class="demo-item">
          <div class="demo-content">
            <ReferenceRadioCards v-model="cardNoIndicator" :indicator="false" aria-label="No indicator demo">
              <ReferenceRadioCard value="light" label="Light" />
              <ReferenceRadioCard value="dark" label="Dark" />
              <ReferenceRadioCard value="system" label="System" />
            </ReferenceRadioCards>
          </div>
          <div class="demo-label">No Indicator</div>
          <div class="demo-code">
            <code>&lt;UtensilRadioCards :indicator="false"&gt;</code>
          </div>
        </div>
        <div class="demo-item">
          <div class="demo-content">
            <ReferenceRadioCards
              v-model="cardCustomIndicator"
              indicator-icon="check-circle"
              aria-label="Indicator icon demo"
            >
              <ReferenceRadioCard value="check-a" label="Option A" />
              <ReferenceRadioCard value="check-b" label="Option B" />
              <ReferenceRadioCard value="check-c" label="Option C" />
            </ReferenceRadioCards>
          </div>
          <div class="demo-label">Indicator Icon</div>
          <div class="demo-code">
            <code>&lt;UtensilRadioCards indicator-icon="check-circle"&gt;</code>
          </div>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilRadioCardsDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilRadioCardsDoc from '@gobistories/utensil-vue/components/radio-cards/UtensilRadioCardsDoc.vue'
import { ReferenceRadioCards } from '@/theme/components/ReferenceRadioCards'
import { ReferenceRadioCard } from '@/theme/components/ReferenceRadioCard'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

const cardBasic = ref('pro')
const cardSurface = ref('standard')
const cardSoft = ref('premium')
const cardText = ref('custom')
const cardColor = ref('monthly')
const cardPosition = ref('indicator-b')
const cardRichContent = ref('team')
const cardDisabled = ref('active')
const cardNoIndicator = ref('light')
const cardCustomIndicator = ref('check-a')
</script>

<style scoped>
.demo-content {
  min-height: 80px;
}

.indicators {
  .utensil-box {
    flex-grow: 1;
  }
}

.radio-cards {
  .utensil-radio-cards {
    justify-content: center;
  }
}
</style>
