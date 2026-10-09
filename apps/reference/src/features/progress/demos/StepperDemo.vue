<template>
  <ReferenceComponentDemo
    title="Stepper"
    anchor="stepper"
    description="Horizontal stepper for multi-step workflows with inline labels and progress bar."
  >
    <div class="stepper-demos">
      <div class="demo-item">
        <div class="demo-content stepper-demo">
          <ReferenceStepper :steps="['Details', 'Review', 'Confirm']" :active-step="1" />
        </div>
        <div class="demo-label always-visible">Connected</div>
      </div>
      <div class="demo-item">
        <div class="demo-content stepper-demo">
          <ReferenceStepper :steps="['Details', 'Review', 'Confirm']" :active-step="1" progress-bar="underline" />
        </div>
        <div class="demo-label always-visible">Underline</div>
      </div>
      <div class="demo-item">
        <div class="demo-content stepper-demo">
          <ReferenceStepper
            :steps="['Details', 'Review', 'Confirm']"
            :active-step="1"
            variation="outline"
            completed-icon="check"
          />
        </div>
        <div class="demo-label always-visible">Outline</div>
      </div>
      <div class="demo-item">
        <div class="demo-content stepper-demo">
          <ReferenceStepper
            :steps="['Details', 'Review', 'Confirm']"
            :active-step="1"
            variation="surface"
            completed-icon="check"
          />
        </div>
        <div class="demo-label always-visible">Surface</div>
      </div>
      <div class="demo-item">
        <div class="demo-content stepper-demo">
          <ReferenceStepper
            :steps="['Details', 'Review', 'Confirm']"
            :active-step="1"
            variation="soft"
            completed-icon="check"
          />
        </div>
        <div class="demo-label always-visible">Soft</div>
      </div>
      <div class="demo-item">
        <div class="demo-content stepper-demo">
          <ReferenceStepper
            :steps="['Details', 'Review', 'Confirm']"
            :active-step="2"
            completed-color="success"
            completed-icon="check"
          />
        </div>
        <div class="demo-label always-visible">Completed Color</div>
      </div>
      <div class="demo-item">
        <div class="demo-content stepper-demo">
          <ReferenceStepper :steps="['', '', '', '']" :active-step="2" />
        </div>
        <div class="demo-label">Without Labels</div>
      </div>
      <div class="demo-item">
        <div class="demo-content stepper-demo">
          <ReferenceStepper :steps="['Details', 'Review', 'Confirm']" :active-step="2" completed-icon="check" />
        </div>
        <div class="demo-label">Completed Icon</div>
      </div>
      <div class="demo-item">
        <div class="demo-content stepper-demo controlled-demo">
          <div class="demo">
            <ReferenceStepper
              :steps="stepperSteps"
              :active-step="stepperActiveStep"
              completed-icon="check"
              progressSize="large"
            />
          </div>
          <div class="control flex gap-2 justify-center margin-block-6">
            <UtensilButton
              scale="small"
              variation="outline"
              :disabled="stepperActiveStep <= 0"
              @click="stepperActiveStep--"
            >
              Back
            </UtensilButton>
            <UtensilButton
              scale="small"
              :disabled="stepperActiveStep >= stepperSteps.length - 1"
              @click="stepperActiveStep++"
            >
              Next
            </UtensilButton>
          </div>
        </div>
        <div class="demo-label always-visible">Interactive</div>
      </div>
    </div>

    <template #api>
      <UtensilStepperDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { ReferenceStepper } from '@/theme/components/ReferenceStepper'
import UtensilStepperDoc from '@gobistories/utensil-vue/components/stepper/UtensilStepperDoc.vue'
import UtensilButton from '@gobistories/utensil-vue/components/button/UtensilButton.vue'

const stepperSteps = ['Account', 'Profile', 'Settings', 'Review']
const stepperActiveStep = ref(0)
</script>

<style scoped>
.demo-content {
  min-height: 200px;
}

.stepper-demos {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  margin-bottom: var(--space-5);
}

.demo-content.stepper-demo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  min-height: 100px;
  padding-inline: var(--space-4);
}
</style>
