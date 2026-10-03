<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilImageProgress</h1>
    </div>
    <p>
      Progress rendered on an image. The image at full color shows the completed portion, and a copy rendered through a
      CSS filter covers the remainder. Because <code>filter</code> processes only the copy's own pixels (unlike
      <code>backdrop-filter</code>), the image's transparency is preserved — whatever the component sits over shows
      through untouched. Suited to media playback surfaces such as audio waveforms.
    </p>
    <p>
      The component fills its parent (<code>width: 100%; height: 100%</code>) and stretches the image to fit — the
      parent controls the size, corner radius, and any overall opacity.
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
          <td><code>src</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>URL of the image. Transparent regions stay transparent in both the completed and remaining portions.</td>
        </tr>
        <tr>
          <td><code>value</code></td>
          <td><code>number</code></td>
          <td><code>0</code></td>
          <td>Percent complete, 0–100. Values outside the range are clamped.</td>
        </tr>
        <tr>
          <td><code>remainingFilter</code></td>
          <td><code>string</code></td>
          <td><code>'saturate(0.1) brightness(1.15)'</code></td>
          <td>
            CSS filter rendering the incomplete portion of the image. The default washes the color out so progress reads
            as the image coloring in.
          </td>
        </tr>
        <tr>
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td><code>'Progress'</code></td>
          <td>Accessible label for the progressbar role.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Audio Waveform Playback</h3>
    <pre v-pre><code>&lt;div class="waveform-frame"&gt;
  &lt;UtensilImageProgress :src="track.waveformUrl" :value="playedPercent" :ariaLabel="`${track.title} playback`" /&gt;
&lt;/div&gt;

&lt;style&gt;
.waveform-frame {
  height: var(--space-6);
  border-radius: var(--radius-1);
  overflow: hidden;
}
&lt;/style&gt;</code></pre>

    <h3>Custom Remaining Filter</h3>
    <pre
      v-pre
    ><code>&lt;UtensilImageProgress :src="imageUrl" :value="60" remainingFilter="grayscale(1) brightness(1.3)" /&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
