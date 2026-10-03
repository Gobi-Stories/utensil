<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilPlaceholder</h1>
    </div>
    <p>
      Displays an SVG icon representing a media type. Useful as a fallback when no actual media source is available. The
      icon fades in after a short delay to avoid flashing during fast loads.
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
          <td><code>mediaType</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>
            The type of media to represent. Recognized values are <code>'video'</code>, <code>'image'</code>,
            <code>'audio'</code>, <code>'music'</code>, and <code>'font'</code>. Any other value shows a generic file
            icon.
          </td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilPlaceholder media-type="image" /&gt;</code></pre>

    <h3>Generic File Fallback</h3>
    <pre><code>&lt;!-- Unrecognized or omitted type shows a file icon --&gt;
&lt;UtensilPlaceholder /&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
