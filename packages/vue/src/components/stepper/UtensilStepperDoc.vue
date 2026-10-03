<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilStepper</h1>
      <UtensilPopoverPanel :offset="0">
        <template #trigger="{ toggle }">
          <UtensilBadge class="theme-props-badge" scale="large" @click="toggle">Theme Props</UtensilBadge>
        </template>
        <div class="theme-props-note">
          <span>Use a typed wrapper to use your theme values. See the Usage Guide.</span>
        </div>
      </UtensilPopoverPanel>
    </div>
    <p>
      Horizontal stepper for multi-step workflows. Each step displays a circular indicator with an optional inline
      label, connected by lines to the next step. A progress bar beneath reflects overall completion. Steps can be
      completed, active, or upcoming.
    </p>

    <h2>Variations</h2>
    <div class="text-ui ui-variations-reference">
      <UtensilBadge variation="solid" scale="giant">Solid</UtensilBadge>
      <UtensilBadge variation="soft" scale="giant">Soft</UtensilBadge>
      <UtensilBadge variation="outline" scale="giant">Outline</UtensilBadge>
      <UtensilBadge variation="surface" scale="giant">Surface</UtensilBadge>
    </div>

    <!-- Props -->
    <h2>Props</h2>
    <table>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>steps</code></td>
          <td><code>string[] | number</code></td>
          <td>—</td>
          <td>Array of step labels, or a number for unlabelled steps.</td>
        </tr>
        <tr>
          <td><code>activeStep</code></td>
          <td><code>number</code></td>
          <td><code>0</code></td>
          <td>Zero-based index of the currently active step. Steps before this index are marked as completed.</td>
        </tr>
        <tr>
          <td><code>progressBar</code></td>
          <td><code>StepperProgressBar</code></td>
          <td><code>'connected'</code></td>
          <td>
            Progress display style. <code>'connected'</code> shows connector lines between step indicators.
            <code>'underline'</code> shows a progress bar beneath the steps.
          </td>
        </tr>
        <tr>
          <td><code>variation</code></td>
          <td><code>StepperVariation</code></td>
          <td><code>'solid'</code></td>
          <td>Visual style of the step indicator circle for active and completed steps.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pen'</code></td>
          <td>Theme color applied to active/completed indicators and the progress bar.</td>
        </tr>
        <tr>
          <td><code>completedColor</code></td>
          <td><code>ColorProp</code></td>
          <td>—</td>
          <td>
            Theme color applied to completed step indicators, connectors, and labels. Overrides the main color for
            completed steps only.
          </td>
        </tr>
        <tr>
          <td><code>completedIcon</code></td>
          <td><code>IconProp</code></td>
          <td>—</td>
          <td>Icon shown inside completed step indicators instead of the step number.</td>
        </tr>
        <tr>
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td><code>'Progress steps'</code></td>
          <td>Accessible label for the stepper group.</td>
        </tr>
      </tbody>
    </table>

    <!-- Types -->
    <h2>Types</h2>
    <h3>StepperProgressBar</h3>
    <pre v-pre><code>type StepperProgressBar = 'connected' | 'underline'</code></pre>

    <h3>StepperVariation</h3>
    <pre v-pre><code>type StepperVariation = 'solid' | 'outline' | 'surface' | 'soft'</code></pre>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre v-pre><code>&lt;UtensilStepper
  :steps="['Details', 'Review', 'Confirm']"
  :active-step="1"
/&gt;</code></pre>

    <h3>Underline Progress</h3>
    <pre v-pre><code>&lt;UtensilStepper
  :steps="['Details', 'Review', 'Confirm']"
  :active-step="1"
  progress-bar="underline"
/&gt;</code></pre>

    <h3>Outline Variation</h3>
    <pre v-pre><code>&lt;UtensilStepper
  :steps="['Details', 'Review', 'Confirm']"
  :active-step="1"
  variation="outline"
/&gt;</code></pre>

    <h3>Without Labels</h3>
    <pre v-pre><code>&lt;UtensilStepper :steps="4" :active-step="2" /&gt;</code></pre>

    <h3>With Completed Color</h3>
    <pre v-pre><code>&lt;UtensilStepper
  :steps="['Details', 'Review', 'Confirm']"
  :active-step="2"
  completed-color="success"
  completed-icon="check"
/&gt;</code></pre>

    <h3>With Completed Icon</h3>
    <pre v-pre><code>&lt;UtensilStepper
  :steps="steps"
  :active-step="2"
  completed-icon="check-circle"
/&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
