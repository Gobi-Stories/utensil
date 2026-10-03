<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilInfoStripItem</h1>
    </div>
    <p>
      A single stat within a <code>UtensilInfoStrip</code>: a prominent value (default slot) with a small label.
      Alignment and label placement are inherited from the parent strip, so an item needs no layout configuration of its
      own.
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
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Text label for the value. Use the <code>label</code> slot for richer content.</td>
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
          <td>The value shown prominently.</td>
        </tr>
        <tr>
          <td><code>label</code></td>
          <td>Custom label content, overriding the <code>label</code> prop.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Basic</h3>
    <pre v-pre><code>&lt;UtensilInfoStripItem label="Stories"&gt;5&lt;/UtensilInfoStripItem&gt;</code></pre>

    <h3>Rich value and label</h3>
    <pre v-pre><code>&lt;UtensilInfoStripItem&gt;
  &lt;template #label&gt;Status&lt;/template&gt;
  &lt;UtensilBadge color="success" variation="soft"&gt;Active&lt;/UtensilBadge&gt;
&lt;/UtensilInfoStripItem&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
