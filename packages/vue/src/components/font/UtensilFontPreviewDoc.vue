<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilFontPreview</h1>
    </div>
    <p>
      Centred, auto-scaled text preview for a font. Parallel to <code>UtensilMedia</code> in role — fits within the
      parent container and lets the consumer control sizing via container size or the
      <code>--font-preview-size</code> CSS variable.
    </p>

    <p>
      Composes <code>UtensilFontText</code> for the actual rendering. Does not load fonts — the supplied
      <code>fontFamily</code> must already be available in the document.
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
          <td>The CSS <code>font-family</code> value to apply. Required.</td>
        </tr>
        <tr>
          <td><code>text</code></td>
          <td><code>string</code></td>
          <td><code>'Aa'</code></td>
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

    <h2>CSS Variables</h2>
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
          <td><code>--font-preview-size</code></td>
          <td><code>clamp(0.875rem, 14cqi, 2.5rem)</code></td>
          <td>
            Override the auto-scaled font size. The default scales with container inline size, clamped between
            <code>0.875rem</code> and <code>2.5rem</code>.
          </td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;div style="width: 200px; height: 240px"&gt;
  &lt;UtensilFontPreview font-family="Merriweather" /&gt;
&lt;/div&gt;</code></pre>

    <h3>With Custom Text</h3>
    <pre><code>&lt;UtensilFontPreview font-family="Inter" text="Roboto Bold" /&gt;</code></pre>

    <h3>Fixed Size Override</h3>
    <pre><code>&lt;UtensilFontPreview
  font-family="Plus Jakarta Sans"
  text="Aa"
  style="--font-preview-size: 3rem"
/&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
