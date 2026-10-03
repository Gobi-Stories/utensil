<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilProgressBar</h1>
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
      Horizontal bar that visualizes progress toward completion. Supports determinate (0–100) and indeterminate
      (pulsing) states, size variants, rounded corners, and theme colors. Renders with <code>role="progressbar"</code>
      and appropriate ARIA attributes for accessibility.
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
          <td><code>value</code></td>
          <td><code>number</code></td>
          <td><code>0</code></td>
          <td>Current progress percentage (0–100). Ignored when <code>indeterminate</code> is true.</td>
        </tr>
        <tr>
          <td><code>indeterminate</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Shows a pulsing animation instead of a fixed fill width.</td>
        </tr>
        <tr>
          <td><code>size</code></td>
          <td><code>'small' | 'medium' | 'large'</code></td>
          <td><code>'medium'</code></td>
          <td>Track height. Small and medium are 4px; large is 6px.</td>
        </tr>
        <tr>
          <td><code>rounded</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Applies rounded corners to the track and fill.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pen'</code></td>
          <td>Theme color applied to the fill bar.</td>
        </tr>
        <tr>
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td><code>'Progress'</code></td>
          <td>Accessible label for the progress bar.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre v-pre><code>&lt;UtensilProgressBar :value="50" /&gt;</code></pre>

    <h3>Indeterminate</h3>
    <pre v-pre><code>&lt;UtensilProgressBar indeterminate /&gt;</code></pre>

    <h3>Rounded with Color</h3>
    <pre v-pre><code>&lt;UtensilProgressBar :value="75" rounded color="success" /&gt;</code></pre>

    <h3>Large Size</h3>
    <pre v-pre><code>&lt;UtensilProgressBar :value="60" size="large" /&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'

// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
