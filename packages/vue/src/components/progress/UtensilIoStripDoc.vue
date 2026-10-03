<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilIoStrip</h1>
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
      Slim strip indicating io activity such as page loads and saves, driven by a single <code>active</code> boolean.
      While active, the fill grows out quickly to about 30% of the width and then creeps slowly as a fallback for slow
      io; when the io ends it shoots to the far end and fades away. Io that knows how far along it is reports a
      <code>progress</code> instead, and the fill follows it. Designed to sit between an app header and the main
      content, or overlay a viewport edge. Renders with <code>role="progressbar"</code> and is marked
      <code>aria-hidden</code> while idle.
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
          <td><code>active</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Starts the grow animation when true; completes and fades out when it returns to false.</td>
        </tr>
        <tr>
          <td><code>progress</code></td>
          <td><code>number</code></td>
          <td>—</td>
          <td>
            How far along the io is, 0–1. While set the fill follows it instead of creeping, and it holds the last value
            if the reports stop before the io ends. Exposed as <code>aria-valuenow</code>.
          </td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pen'</code></td>
          <td>Theme color applied to the fill bar; the start color when <code>endColor</code> is set.</td>
        </tr>
        <tr>
          <td><code>endColor</code></td>
          <td><code>ColorProp</code></td>
          <td><code>color</code></td>
          <td>Second gradient color. The fill runs from <code>color</code> to <code>endColor</code>.</td>
        </tr>
        <tr>
          <td><code>gradientMode</code></td>
          <td><code>'always' | 'progressive'</code></td>
          <td><code>'always'</code></td>
          <td>
            <code>'always'</code> lays the gradient along the full strip so progress reveals more of it;
            <code>'progressive'</code> renders a solid fill that blends from <code>color</code> to
            <code>endColor</code> as progress increases.
          </td>
        </tr>
        <tr>
          <td><code>settleMs</code></td>
          <td><code>number</code></td>
          <td><code>0</code></td>
          <td>
            Grace period after <code>active</code> drops before the finish sweep starts. Io resuming within it continues
            the current animation, so a burst of requests reads as one operation.
          </td>
        </tr>
        <tr>
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td><code>'Loading'</code></td>
          <td>Accessible label for the progress bar.</td>
        </tr>
      </tbody>
    </table>

    <!-- Cvars -->
    <h2>CSS Component Variables</h2>
    <table>
      <thead>
        <tr>
          <th>Cvar</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>--utensil-io-strip-height</code></td>
          <td><code>calc(var(--space-1) * 0.75)</code></td>
          <td>Height of the strip (3px at normal scale).</td>
        </tr>
        <tr>
          <td><code>--utensil-io-strip-track-background</code></td>
          <td><code>transparent</code></td>
          <td>Background of the track behind the fill.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Route Loading</h3>
    <pre v-pre><code>&lt;UtensilIoStrip :active="routeLoading" ariaLabel="Loading page" /&gt;</code></pre>

    <h3>Saving</h3>
    <pre v-pre><code>&lt;UtensilIoStrip :active="saving" color="success" ariaLabel="Saving changes" /&gt;</code></pre>

    <h3>Reported Progress</h3>
    <pre
      v-pre
    ><code>&lt;UtensilIoStrip :active="processing" :progress="done / total" ariaLabel="Processing" /&gt;</code></pre>

    <h3>Gradient</h3>
    <pre v-pre><code>&lt;UtensilIoStrip :active="busy" color="primary" endColor="favorite" /&gt;
&lt;UtensilIoStrip :active="busy" color="primary" endColor="favorite" gradientMode="progressive" /&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'

// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
