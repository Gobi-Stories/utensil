<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilInfoStrip</h1>
    </div>
    <p>
      A non-interactive strip of labelled values — a compact row (or column) of stats, each a prominent value with a
      small label. Compose it with <code>UtensilInfoStripItem</code> children (or any custom children). Built on
      semantic definition-list markup (<code>&lt;dl&gt;</code>).
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
          <td><code>variation</code></td>
          <td><code>'soft' | 'surface' | 'outline' | 'unstyled'</code></td>
          <td><code>'surface'</code></td>
          <td>
            Surface treatment of the container box. <code>unstyled</code> drops the box (no padding, background or
            border).
          </td>
        </tr>
        <tr>
          <td><code>orientation</code></td>
          <td><code>'horizontal' | 'vertical'</code></td>
          <td><code>'horizontal'</code></td>
          <td>Lay items out in a row or stacked in a column.</td>
        </tr>
        <tr>
          <td><code>align</code></td>
          <td><code>'center' | 'start'</code></td>
          <td><code>'center'</code></td>
          <td>How each item aligns its value and label.</td>
        </tr>
        <tr>
          <td><code>labelPlacement</code></td>
          <td><code>'top' | 'bottom'</code></td>
          <td><code>'top'</code></td>
          <td>Whether the label sits above or below the value.</td>
        </tr>
        <tr>
          <td><code>dividers</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Draw a separator between items.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp&lt;Theme&gt;</code></td>
          <td>—</td>
          <td>Theme colour for the strip. Defaults to the neutral pencil palette.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td>—</td>
          <td>Relative scale applied to the whole strip.</td>
        </tr>
      </tbody>
    </table>

    <!-- Slots -->
    <h2>Slots</h2>
    <table>
      <thead>
        <tr>
          <th>Slot</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>default</code></td>
          <td>The strip items — typically <code>UtensilInfoStripItem</code> elements.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Basic</h3>
    <pre v-pre><code>&lt;UtensilInfoStrip&gt;
  &lt;UtensilInfoStripItem label="Stories"&gt;5&lt;/UtensilInfoStripItem&gt;
  &lt;UtensilInfoStripItem label="Teams"&gt;1&lt;/UtensilInfoStripItem&gt;
  &lt;UtensilInfoStripItem label="Members"&gt;∞&lt;/UtensilInfoStripItem&gt;
&lt;/UtensilInfoStrip&gt;</code></pre>

    <h3>Vertical with dividers</h3>
    <pre v-pre><code>&lt;UtensilInfoStrip orientation="vertical" dividers label-placement="bottom"&gt;
  &lt;UtensilInfoStripItem label="Views"&gt;12,480&lt;/UtensilInfoStripItem&gt;
  &lt;UtensilInfoStripItem label="Completes"&gt;9,213&lt;/UtensilInfoStripItem&gt;
&lt;/UtensilInfoStrip&gt;</code></pre>

    <h3>Coloured, chrome-less</h3>
    <pre v-pre><code>&lt;UtensilInfoStrip variation="unstyled" color="success"&gt;
  &lt;UtensilInfoStripItem label="Uptime"&gt;99.9%&lt;/UtensilInfoStripItem&gt;
&lt;/UtensilInfoStrip&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
