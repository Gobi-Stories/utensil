<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilDigitInput</h1>
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
      One input box per digit for numeric codes (one-time passwords, 2FA). Typing a digit advances the focus, backspace
      walks it back, and focusing a box clears it and everything after it so the code can be retyped from any point.
      Pasting a full code — or an OTP autofill landing in the first box — fills every box and completes in one go. Uses
      <code>v-model</code> for the code as typed.
    </p>

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
          <td><code>modelValue</code></td>
          <td><code>string</code></td>
          <td><code>''</code></td>
          <td>The code as typed so far. Use with <code>v-model</code>.</td>
        </tr>
        <tr>
          <td><code>length</code></td>
          <td><code>number</code></td>
          <td><code>6</code></td>
          <td>How many digits the code has.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disables every box.</td>
        </tr>
        <tr>
          <td><code>invalid</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Marks the boxes with the pen color. Pair with an error <code>color</code> for failed codes.</td>
        </tr>
        <tr>
          <td><code>autofocus</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Focus the first box on mount.</td>
        </tr>
        <tr>
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td><code>'Code'</code></td>
          <td>Accessible name for the code; each box appends its position.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td>—</td>
          <td>Theme pen color for focus and invalid states.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td>—</td>
          <td>Relative size scaling.</td>
        </tr>
      </tbody>
    </table>

    <h2>Events</h2>
    <table>
      <thead>
        <tr>
          <th>Event</th>
          <th>Payload</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>update:modelValue</code></td>
          <td><code>string</code></td>
          <td>Fires on every change with the code as typed so far.</td>
        </tr>
        <tr>
          <td><code>complete</code></td>
          <td><code>string</code></td>
          <td>Fires once every digit is filled.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilDigitInput v-model="code" autofocus @complete="verify" /&gt;</code></pre>

    <h3>Failed Code</h3>
    <pre><code>&lt;UtensilDigitInput v-model="code" :invalid="!!error" :color="error ? 'error' : 'primary'" /&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
