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
          <td>Shows a pulsing animation instead of a fixed fill width. Leaving it shows <code>value</code> at once.</td>
        </tr>
        <tr>
          <td><code>indeterminateFill</code></td>
          <td><code>'full' | 'none'</code></td>
          <td><code>'full'</code></td>
          <td>
            What the indeterminate pulse runs over: the full fill, for a bar finalizing after reaching 100%, or the
            empty track, for a wait before anything has progressed.
          </td>
        </tr>
        <tr>
          <td><code>size</code></td>
          <td><code>'small' | 'medium' | 'large'</code></td>
          <td><code>'medium'</code></td>
          <td>
            Track height: 2px, 4px or 6px, times <code>--scale</code>.
            <code>--utensil-progress-bar-thickness</code> overrides it.
          </td>
        </tr>
        <tr>
          <td><code>rounded</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>The theme's rounded corners (<code>--radius-rounded</code>) on the track and fill.</td>
        </tr>
        <tr>
          <td><code>squared</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>The theme's squared corners (<code>--radius-squared</code>), slightly rounded.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pen'</code></td>
          <td>Pen for the fill, drawn in its <code>--pen-track</code>.</td>
        </tr>
        <tr>
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td><code>'Progress'</code></td>
          <td>Accessible label for the progress bar.</td>
        </tr>
      </tbody>
    </table>

    <h2>Values</h2>
    <p>
      <code>value</code> is the percent complete. One below 0 or above 100 is clamped to the range, for the fill and
      <code>aria-valuenow</code> alike, and one that isn't a number shows as 0.
    </p>

    <h2>Motion and Contrast</h2>
    <p>
      The indeterminate segment sweeps from the start edge, so it runs right to left in a right-to-left layout. Under
      reduced motion the fill jumps to a new value, and the indeterminate segment fades in place across the whole bar
      instead of sweeping. In high contrast the track and the segment over a full fill are drawn stronger.
    </p>

    <h2>CSS Cvars</h2>
    <table>
      <thead>
        <tr>
          <th>Variable</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>--utensil-progress-bar-thickness</code></td>
          <td>From <code>size</code></td>
          <td>Height of the track.</td>
        </tr>
        <tr>
          <td><code>--utensil-progress-bar-track</code></td>
          <td><code>--pencil-a3</code>, <code>--pencil-a6</code> in high contrast</td>
          <td>Color of the empty track.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre v-pre><code>&lt;UtensilProgressBar :value="50" /&gt;</code></pre>

    <h3>Indeterminate</h3>
    <pre v-pre><code>&lt;UtensilProgressBar indeterminate /&gt;</code></pre>

    <h3>Indeterminate Over the Empty Track</h3>
    <pre v-pre><code>&lt;UtensilProgressBar indeterminate indeterminateFill="none" /&gt;</code></pre>

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
