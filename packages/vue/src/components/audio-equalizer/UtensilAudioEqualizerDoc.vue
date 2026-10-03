<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilAudioEqualizer</h1>
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
      A vertical slider equalizer for adjusting audio frequency bands. Each band renders as a vertical range input with
      a custom track, fill, and thumb. Supports configurable band labels, value range, step size, and a custom value
      formatter.
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
          <td><code>number[]</code></td>
          <td>—</td>
          <td>Array of band values (v-model binding). One entry per band. Required.</td>
        </tr>
        <tr>
          <td><code>bands</code></td>
          <td><code>AudioBand[]</code></td>
          <td><code>[Bass, Low, Mid, High, Treble]</code></td>
          <td>Band definitions. Each band has a <code>label</code> string shown below the slider.</td>
        </tr>
        <tr>
          <td><code>min</code></td>
          <td><code>number</code></td>
          <td><code>-12</code></td>
          <td>Minimum value for all band sliders.</td>
        </tr>
        <tr>
          <td><code>max</code></td>
          <td><code>number</code></td>
          <td><code>12</code></td>
          <td>Maximum value for all band sliders.</td>
        </tr>
        <tr>
          <td><code>step</code></td>
          <td><code>number</code></td>
          <td><code>1</code></td>
          <td>Step increment for each slider.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disable all sliders.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pen'</code></td>
          <td>Theme color for the fill and thumb.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td>—</td>
          <td>Relative scale override for sizing.</td>
        </tr>
        <tr>
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td><code>'Audio equalizer'</code></td>
          <td>Accessible label for the equalizer group.</td>
        </tr>
        <tr>
          <td><code>formatValue</code></td>
          <td><code>(value: number) =&gt; string</code></td>
          <td>—</td>
          <td>
            Custom formatter for band value display. Defaults to showing a sign prefix (e.g. <code>+3</code>,
            <code>-5</code>).
          </td>
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
          <td><code>number[]</code></td>
          <td>Fires when any band value changes (v-model binding). Emits the full array with the updated value.</td>
        </tr>
      </tbody>
    </table>

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
          <td><code>--utensil-audio-equalizer-slider-height</code></td>
          <td><code>140px</code></td>
          <td>Height of each vertical slider track.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilAudioEqualizer v-model="bands" /&gt;

&lt;UtensilAudioEqualizer
  v-model="bands"
  color="primary"
  :min="-24"
  :max="24"
  :step="0.5"
/&gt;</code></pre>

    <h3>Custom Bands and Formatter</h3>
    <pre><code>&lt;UtensilAudioEqualizer
  v-model="bands"
  :bands="[
    { label: '60Hz' },
    { label: '250Hz' },
    { label: '1kHz' },
    { label: '4kHz' },
    { label: '16kHz' },
  ]"
  :format-value="v =&gt; \`\${v} dB\`"
/&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
