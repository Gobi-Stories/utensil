<template>
  <ReferenceComponentDemo
    title="Deck"
    anchor="deck"
    description="Keyed, animation-agnostic host that swaps presentational children. The active child is chosen by a string id; each child owns its transition and reports when it ends, so the deck keeps an outgoing child mounted until its animation completes. The built-in transition children are interchangeable."
  >
    <div id="onboarding-flow" class="component-demo">
      <h3><a class="demo-anchor" href="#onboarding-flow">Onboarding flow</a></h3>
      <p>Pick a transition, then step through. The outgoing panel stays mounted until its animation ends.</p>

      <div class="deck-transitions">
        <ReferenceButton
          v-for="option in deckTransitions"
          :key="option.id"
          :variation="deckTransition === option.id ? 'solid' : 'soft'"
          scale="small"
          @click="deckTransition = option.id"
        >
          {{ option.label }}
        </ReferenceButton>
      </div>

      <ReferenceStepper class="deck-stepper" :steps="deckStepTitles" :active-step="deckIndex" />

      <div class="deck-stage">
        <UtensilDeck :current="deckCurrentId" :reverse="deckReverse">
          <template #default="{ id, active, appear }">
            <!-- Composed push: a scale's entrance + a slide's exit, each owning one phase. -->
            <UtensilDeckSlide
              v-if="deckTransition === 'push'"
              :id="id"
              :key="`push-${id}`"
              :class="`deck-step-${id}`"
              :active="active"
              :appear="appear"
              transitions="leave"
              child-transitions="enter"
            >
              <UtensilDeckScale :active="active" :appear="appear" transitions="enter">
                <div class="deck-panel" :class="`deck-step-${id}`">
                  <div class="deck-panel-content text-content">
                    <h4>{{ deckStepById(id)?.title }}</h4>
                    <p>{{ deckStepById(id)?.body }}</p>
                  </div>
                </div>
              </UtensilDeckScale>
            </UtensilDeckSlide>

            <component v-else :is="deckTransitionComponent" :id="id" :key="id" :active="active" :appear="appear">
              <div class="deck-panel" :class="`deck-step-${id}`">
                <div class="deck-panel-content text-content">
                  <h4>{{ deckStepById(id)?.title }}</h4>
                  <p>{{ deckStepById(id)?.body }}</p>
                </div>
              </div>
            </component>
          </template>
        </UtensilDeck>
      </div>

      <div class="deck-nav">
        <ReferenceButton variation="soft" :disabled="deckIndex === 0" @click="deckPrev">Back</ReferenceButton>
        <ReferenceButton :disabled="deckIndex === deckSteps.length - 1" @click="deckNext">Next</ReferenceButton>
      </div>
    </div>

    <template #api>
      <UtensilDeckDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import UtensilDeck from 'utensil-vue/components/deck/UtensilDeck.vue'
import UtensilDeckDoc from 'utensil-vue/components/deck/UtensilDeckDoc.vue'
import UtensilDeckScale from 'utensil-vue/components/deck/UtensilDeckScale.vue'
import UtensilDeckSlide from 'utensil-vue/components/deck/UtensilDeckSlide.vue'
import UtensilDeckFade from 'utensil-vue/components/deck/UtensilDeckFade.vue'
import UtensilDeckFlip from 'utensil-vue/components/deck/UtensilDeckFlip.vue'
import UtensilDeckReveal from 'utensil-vue/components/deck/UtensilDeckReveal.vue'
import UtensilDeckInstant from 'utensil-vue/components/deck/UtensilDeckInstant.vue'
import { ReferenceButton } from '@/theme/components/ReferenceButton'
import { ReferenceStepper } from '@/theme/components/ReferenceStepper'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

const deckTransitions = [
  { id: 'scale', label: 'Scale' },
  { id: 'slide', label: 'Slide' },
  { id: 'fade', label: 'Fade' },
  { id: 'flip', label: 'Flip' },
  { id: 'reveal', label: 'Reveal' },
  { id: 'instant', label: 'Instant' },
  { id: 'push', label: 'Push (composed)' },
] as const

type DeckTransitionId = (typeof deckTransitions)[number]['id']

const deckTransitionComponents = {
  scale: UtensilDeckScale,
  slide: UtensilDeckSlide,
  fade: UtensilDeckFade,
  flip: UtensilDeckFlip,
  reveal: UtensilDeckReveal,
  instant: UtensilDeckInstant,
}

const deckSteps = [
  { id: 'account', title: 'Create your account', body: 'Tell us your email and choose a password to get started.' },
  { id: 'profile', title: 'Set up your profile', body: 'Add a name and avatar so your team can recognise you.' },
  { id: 'workspace', title: 'Name your workspace', body: 'Pick a name for the space where your stories will live.' },
  { id: 'done', title: "You're all set", body: 'Your workspace is ready — jump in and create your first story.' },
]

const deckStepTitles = deckSteps.map((step) => step.title)
const deckTransition = ref<DeckTransitionId>('scale')
const deckIndex = ref(0)
// Direction of the last navigation — children replay their animation backwards when rewinding.
const deckReverse = ref(false)
const deckCurrentId = computed(() => deckSteps[deckIndex.value].id)
const deckTransitionComponent = computed(
  () => deckTransitionComponents[deckTransition.value as keyof typeof deckTransitionComponents],
)

function deckStepById(id: string) {
  return deckSteps.find((step) => step.id === id)
}

function deckNext() {
  if (deckIndex.value >= deckSteps.length - 1) return
  deckReverse.value = false
  deckIndex.value++
}

function deckPrev() {
  if (deckIndex.value <= 0) return
  deckReverse.value = true
  deckIndex.value--
}
</script>

<style scoped>
.deck-transitions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-block-end: var(--space-4);
}

.deck-stepper {
  margin-block-end: var(--space-5);
}

.deck-stage {
  position: relative;
  height: 280px;
  border-radius: var(--radius-4);
  overflow: hidden;
  box-shadow: var(--shadow-border-2);
}

.deck-panel {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
}

/* Each step has a subtly different background. Solid (non-alpha) tokens so a sliding panel reads
   as opaque rather than letting the panel underneath show through. */
.deck-step-account {
  background: var(--pen-2);
}

.deck-step-profile {
  background: var(--pencil-3);
}

.deck-step-workspace {
  background: var(--pen-3);
}

.deck-step-done {
  background: var(--pen-4);
}

.deck-panel-content {
  max-width: 38ch;
  text-align: center;
}

.deck-nav {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-block-start: var(--space-4);
}
</style>
