<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilUploadProgressBar</h1>
    </div>
    <p>
      Specialized progress bar for file uploads that maps a transfer state and progress percentage to visual feedback.
      Wraps <code>UtensilProgressBar</code> internally: shows determinate progress while uploading, switches to an
      indeterminate pulsing bar once the upload reaches 100% or completes, displays a minimal idle bar while pending,
      and fills the bar in the warning color once the upload has failed.
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
          <td><code>progress</code></td>
          <td><code>number</code></td>
          <td>—</td>
          <td>Upload progress percentage (0–100).</td>
        </tr>
        <tr>
          <td><code>errored</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>The upload has failed. Takes precedence over <code>progress</code>.</td>
        </tr>
        <tr>
          <td><code>size</code></td>
          <td><code>'small' | 'medium' | 'large'</code></td>
          <td><code>'medium'</code></td>
          <td>Track height passed through to the underlying <code>UtensilProgressBar</code>.</td>
        </tr>
      </tbody>
    </table>

    <!-- Visual States -->
    <h2>Visual States</h2>
    <table>
      <thead>
        <tr>
          <th>Condition</th>
          <th>Behavior</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>errored</code></td>
          <td>Full bar in the warning color. Nothing is still running, so the bar does not pulse.</td>
        </tr>
        <tr>
          <td><code>progress</code> is <code>0</code></td>
          <td>Static bar at 1%, indicating an idle state.</td>
        </tr>
        <tr>
          <td><code>progress &lt; 100</code></td>
          <td>Determinate bar showing 1–99% (maps raw progress into the 1–100 visual range).</td>
        </tr>
        <tr>
          <td><code>progress &ge; 100</code></td>
          <td>Indeterminate pulsing bar at 100% indicating server-side processing.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre
      v-pre
    ><code>&lt;UtensilUploadProgressBar :progress="upload.progress" :errored="upload.failed" /&gt;</code></pre>

    <h3>Small Size in a File Card</h3>
    <pre v-pre><code>&lt;UtensilCard variation="soft"&gt;
  &lt;span&gt;document.pdf&lt;/span&gt;
  &lt;UtensilUploadProgressBar
    :progress="file.progress"
    :errored="file.failed"
    size="small"
  /&gt;
&lt;/UtensilCard&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
