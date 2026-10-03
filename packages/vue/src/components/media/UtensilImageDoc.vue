<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilImage</h1>
    </div>
    <p>
      Renders an <code>&lt;img&gt;</code> element with built-in load, error, and click event forwarding. The image is
      non-draggable by default.
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
          <td><code>src</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Image source URL. Required.</td>
        </tr>
        <tr>
          <td><code>alt</code></td>
          <td><code>string</code></td>
          <td><code>undefined</code></td>
          <td>Alternative text describing the image for accessibility.</td>
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
          <td><code>load</code></td>
          <td><code>Event</code></td>
          <td>Fires when the image has finished loading.</td>
        </tr>
        <tr>
          <td><code>error</code></td>
          <td>—</td>
          <td>Fires when the image fails to load.</td>
        </tr>
        <tr>
          <td><code>click</code></td>
          <td><code>MouseEvent</code></td>
          <td>Fires when the image is clicked.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilImage src="/photos/hero.jpg" alt="Hero banner" /&gt;</code></pre>

    <h3>With Event Handling</h3>
    <pre><code>&lt;UtensilImage
  src="/photos/hero.jpg"
  alt="Hero banner"
  @load="onLoad"
  @error="onError"
  @click="openLightbox"
/&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
