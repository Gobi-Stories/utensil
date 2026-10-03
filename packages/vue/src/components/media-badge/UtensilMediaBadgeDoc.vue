<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilMediaBadge</h1>
    </div>
    <p>
      A specialized badge that displays a media type with an appropriate icon. Wraps <code>UtensilBadge</code> with the
      <code>overlay</code> variation and auto-selects an icon based on the media type.
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
            The media type to display. Recognized values are <code>'image'</code>, <code>'video'</code>,
            <code>'font'</code>, and <code>'music'</code>. Other values show a generic file icon.
          </td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td><code>1</code></td>
          <td>Relative size scaling.</td>
        </tr>
        <tr>
          <td><code>radiusScale</code></td>
          <td><code>RadiusScaleProp</code></td>
          <td>—</td>
          <td>Override the border radius scale independently from size.</td>
        </tr>
        <tr>
          <td><code>rounded</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Fully rounded (pill) corners.</td>
        </tr>
        <tr>
          <td><code>squared</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Squared corners.</td>
        </tr>
      </tbody>
    </table>

    <h2>Slots</h2>
    <table>
      <thead>
        <tr>
          <th>Slot</th>
          <th>Scope</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>default</code></td>
          <td>—</td>
          <td>Content after the icon. Overrides the auto-generated capitalized media type label.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilMediaBadge media-type="video" /&gt;

&lt;UtensilMediaBadge media-type="image" scale="large" /&gt;</code></pre>

    <h3>Custom Content</h3>
    <pre><code>&lt;UtensilMediaBadge media-type="video"&gt;
  MP4
&lt;/UtensilMediaBadge&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
