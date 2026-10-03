<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilFontText</h1>
    </div>
    <p>
      Renders text in a specific font-family. A pure primitive with no layout, no font loading, and no scaling — assumes
      the supplied <code>fontFamily</code> is already available in the document. Compose with
      <code>UtensilFontPreview</code> for centred, fitted previews.
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
          <td><code>fontFamily</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>
            The CSS <code>font-family</code> value to apply. Required. Must already be loaded into the document — this
            component does not load fonts.
          </td>
        </tr>
        <tr>
          <td><code>text</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>The text to render. Used when no default slot content is provided.</td>
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
          <td>Content to render in the supplied font. Takes precedence over the <code>text</code> prop.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilFontText font-family="Merriweather" text="Aa" /&gt;</code></pre>

    <h3>With Slot Content</h3>
    <pre><code>&lt;UtensilFontText font-family="Inter"&gt;The quick brown fox&lt;/UtensilFontText&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
