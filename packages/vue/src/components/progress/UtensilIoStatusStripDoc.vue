<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilIoStatusStrip</h1>
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
      One <code>UtensilIoStrip</code> for an app's io state. Loading and saving share the strip: it runs while either is
      active, saving wins the color and label while both run, and an error overrides the color of whatever is showing.
      The finish sweep keeps the color of the operation that just completed, and bursts of requests read as one
      operation via the strip's settle window.
    </p>

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
          <td><code>loading</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Read activity. Runs the strip in <code>loadingColor</code> unless saving is also active.</td>
        </tr>
        <tr>
          <td><code>saving</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Write activity. Wins the color and label while loading and saving overlap.</td>
        </tr>
        <tr>
          <td><code>progress</code></td>
          <td><code>number</code></td>
          <td>—</td>
          <td>How far along the showing operation is, 0–1. Forwarded to the strip, whose fill follows it.</td>
        </tr>
        <tr>
          <td><code>error</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Overrides the strip color with <code>errorColor</code> while true — set while a request has failed.</td>
        </tr>
        <tr>
          <td><code>loadingColor</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pen'</code></td>
          <td>Strip color while loading.</td>
        </tr>
        <tr>
          <td><code>loadingEndColor</code></td>
          <td><code>ColorProp</code></td>
          <td><code>loadingColor</code></td>
          <td>Second gradient color while loading is showing; ignored for saving and errors.</td>
        </tr>
        <tr>
          <td><code>savingColor</code></td>
          <td><code>ColorProp</code></td>
          <td><code>loadingColor</code></td>
          <td>Strip color while saving.</td>
        </tr>
        <tr>
          <td><code>errorColor</code></td>
          <td><code>ColorProp</code></td>
          <td><code>loadingColor</code></td>
          <td>Strip color while <code>error</code> is set.</td>
        </tr>
        <tr>
          <td><code>loadingLabel</code></td>
          <td><code>string</code></td>
          <td><code>'Loading'</code></td>
          <td>Accessible label while loading.</td>
        </tr>
        <tr>
          <td><code>savingLabel</code></td>
          <td><code>string</code></td>
          <td><code>'Saving changes'</code></td>
          <td>Accessible label while saving.</td>
        </tr>
        <tr>
          <td><code>settleMs</code></td>
          <td><code>number</code></td>
          <td><code>300</code></td>
          <td>Forwarded to the strip so a burst of requests reads as one operation.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>App io indicator</h3>
    <pre v-pre><code>&lt;UtensilIoStatusStrip
  :loading="loading"
  :saving="saving"
  :progress="savingProgress"
  :error="saveFailed"
  savingColor="success"
  errorColor="error"
/&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'

// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
