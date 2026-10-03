<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilStage</h1>
    </div>
    <p>
      Viewport-filling presentation surface for media-focused viewing. Renders as a modal
      <code>&lt;dialog&gt;</code> in the browser top layer with a native focus trap, and fades in on mount. Opens
      automatically on mount and emits <code>close</code> when dismissed (Escape or programmatic close).
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
          <td><code>fadeIn</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Whether to fade the stage in on mount.</td>
        </tr>
      </tbody>
    </table>

    <h2>Emits</h2>
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
          <td><code>close</code></td>
          <td>—</td>
          <td>
            Emitted when the dialog closes (Escape key or any programmatic close). Parents should unmount the stage in
            response.
          </td>
        </tr>
      </tbody>
    </table>

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
          <td>The stage's content.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre v-pre><code>&lt;UtensilStage v-if="open" @close="open = false"&gt;
  &lt;img class="centered" :src="imageUrl" /&gt;
&lt;/UtensilStage&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
