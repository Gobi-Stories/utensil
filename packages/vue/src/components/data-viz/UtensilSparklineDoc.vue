<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilSparkline</h1>
    </div>
    <p>
      A single series drawn as a line stretched to fill its box, without axes, for how a figure moved rather than what
      it measured: in stat cards, table cells and other tight spaces. The line runs from its lowest point to its highest
      with a little room above and below, and a series whose values are all equal runs through the middle. Its size is
      the box it's given, so size it with CSS.
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
          <td><code>values</code></td>
          <td><code>number[]</code></td>
          <td>—</td>
          <td>The series, drawn left to right.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp&lt;Theme&gt;</code></td>
          <td><code>'pen'</code></td>
          <td>The pen the line is drawn in (its step 9), and its fill in a light step of the same pen.</td>
        </tr>
        <tr>
          <td><code>fill</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>A soft fill under the line.</td>
        </tr>
        <tr>
          <td><code>width</code></td>
          <td><code>number</code></td>
          <td><code>120</code></td>
          <td>The viewBox width. The sparkline stretches to its box, and its stroke keeps its width either way.</td>
        </tr>
        <tr>
          <td><code>height</code></td>
          <td><code>number</code></td>
          <td><code>36</code></td>
          <td>The viewBox height.</td>
        </tr>
        <tr>
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td><code>'Trend'</code></td>
          <td>The accessible name of its <code>img</code> role. Describe the trend where it matters.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>In a Stat Card</h3>
    <pre v-pre><code>&lt;div class="stat"&gt;
  &lt;span&gt;1,240 views&lt;/span&gt;
  &lt;UtensilSparkline class="trend" :values="[820, 940, 1010, 980, 1150, 1240]" fill /&gt;
&lt;/div&gt;

.trend {
  height: var(--space-7);
}</code></pre>

    <h3>In a Table Cell, Colored by Direction</h3>
    <pre v-pre><code>&lt;UtensilSparkline
  :values="trend"
  :color="trend[trend.length - 1] &gt;= trend[0] ? 'success' : 'warning'"
  aria-label="Weekly signups, falling"
/&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component - no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
