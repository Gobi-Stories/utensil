<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilSpinnerOverlay</h1>
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
      Wraps content with a loading spinner overlay. The overlay covers the slotted content with an absolutely positioned
      spinner, optionally adding a backdrop or blur effect. A configurable delay prevents the spinner from flashing
      during fast operations.
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
          <td><code>show</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Controls overlay visibility. The spinner appears after the <code>delay</code> elapses.</td>
        </tr>
        <tr>
          <td><code>delay</code></td>
          <td><code>number</code></td>
          <td><code>300</code></td>
          <td>Milliseconds to wait before showing the spinner. Set to <code>0</code> for immediate display.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td>—</td>
          <td>Theme color passed to the inner <code>UtensilSpinner</code>.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td><code>1</code></td>
          <td>Size scale passed to the inner <code>UtensilSpinner</code>.</td>
        </tr>
        <tr>
          <td><code>withBackdrop</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Adds a semi-transparent backdrop behind the spinner.</td>
        </tr>
        <tr>
          <td><code>blur</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Applies a backdrop blur filter over the content.</td>
        </tr>
        <tr>
          <td><code>lift</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Shifts the spinner slightly upward within the overlay area.</td>
        </tr>
        <tr>
          <td><code>vanish</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disables the fade-out transition so the spinner disappears instantly.</td>
        </tr>
        <tr>
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td><code>'Loading...'</code></td>
          <td>Accessible label for the overlay region, announced by screen readers.</td>
        </tr>
        <tr>
          <td><code>title</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Visible caption under the spinner naming the work in progress.</td>
        </tr>
      </tbody>
    </table>

    <!-- Slots -->
    <h2>Slots</h2>
    <table>
      <thead>
        <tr>
          <th>Slot</th>
          <th>Scope</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>default</code></td>
          <td>—</td>
          <td>Content to display underneath the overlay.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre v-pre><code>&lt;UtensilSpinnerOverlay :show="loading"&gt;
  &lt;div&gt;Content to cover while loading&lt;/div&gt;
&lt;/UtensilSpinnerOverlay&gt;</code></pre>

    <h3>Instant Display with Backdrop</h3>
    <pre v-pre><code>&lt;UtensilSpinnerOverlay :show="loading" :delay="0" with-backdrop&gt;
  &lt;div&gt;Protected content&lt;/div&gt;
&lt;/UtensilSpinnerOverlay&gt;</code></pre>

    <h3>With Blur Effect</h3>
    <pre v-pre><code>&lt;UtensilSpinnerOverlay :show="loading" blur&gt;
  &lt;div&gt;Blurred while loading&lt;/div&gt;
&lt;/UtensilSpinnerOverlay&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'

// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
