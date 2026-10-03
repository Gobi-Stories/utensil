<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilSpinner</h1>
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
      Animated loading spinner that indicates an ongoing process. Renders a circular spinning arc with
      <code>role="status"</code> and <code>aria-live="polite"</code> for accessibility.
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
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td>—</td>
          <td>Theme color applied to the spinning arc.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td><code>1</code></td>
          <td>Relative size scale of the spinner.</td>
        </tr>
        <tr>
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td><code>'Loading...'</code></td>
          <td>
            Accessible label announced by screen readers. Set to an empty string to hide from assistive technology.
          </td>
        </tr>
        <tr>
          <td><code>soft</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Uses a softer, more transparent arc color.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre v-pre><code>&lt;UtensilSpinner /&gt;</code></pre>

    <h3>Colored and Scaled</h3>
    <pre v-pre><code>&lt;UtensilSpinner color="primary" scale="super" /&gt;</code></pre>

    <h3>Soft Appearance</h3>
    <pre v-pre><code>&lt;UtensilSpinner soft /&gt;</code></pre>

    <h3>Custom Aria Label</h3>
    <pre v-pre><code>&lt;UtensilSpinner aria-label="Saving changes..." /&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'

// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
