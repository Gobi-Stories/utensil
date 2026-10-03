<template>
  <article class="text-code utensil-api-doc">
    <h1>UtensilCloseButton</h1>
    <p>
      A specialized close button that wraps <code>UtensilCircleButton</code> with a fixed "times" icon and
      <code>pencil</code> color. Use it for dismissing dialogs, panels, and overlays.
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
          <td><code>description</code></td>
          <td><code>string</code></td>
          <td><code>'Close'</code></td>
          <td>Screen-reader accessible label.</td>
        </tr>
        <tr>
          <td><code>variation</code></td>
          <td><code>'soft' | 'overlay'</code></td>
          <td><code>'soft'</code></td>
          <td>Visual style. Use <code>'overlay'</code> on top of media or dark backgrounds.</td>
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
          <td><code>click</code></td>
          <td><code>MouseEvent</code></td>
          <td>Fires when the button is clicked.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilCloseButton @click="close" /&gt;

&lt;UtensilCloseButton description="Close modal" @click="close" /&gt;</code></pre>

    <h3>Overlay on Media</h3>
    <pre><code>&lt;UtensilCloseButton variation="overlay" @click="close" /&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
