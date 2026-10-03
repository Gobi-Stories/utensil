<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilMedia</h1>
    </div>
    <p>
      Unified media component that renders an image or video based on <code>mediaType</code>, with an underlying
      placeholder that shows while the media loads. Supports fade-in transitions and object-fit control.
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
          <td><code>undefined</code></td>
          <td>Media source URL. When absent, only the placeholder is shown.</td>
        </tr>
        <tr>
          <td><code>alt</code></td>
          <td><code>string</code></td>
          <td><code>''</code></td>
          <td>Alternative text for image accessibility. Ignored for video.</td>
        </tr>
        <tr>
          <td><code>fade</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Enable a fade-in transition when media finishes loading.</td>
        </tr>
        <tr>
          <td><code>mediaType</code></td>
          <td><code>string</code></td>
          <td><code>undefined</code></td>
          <td>
            Type of media to render. Use <code>'image'</code> or <code>'video'</code>. Also determines the placeholder
            icon.
          </td>
        </tr>
        <tr>
          <td><code>placeholderMediaType</code></td>
          <td><code>string</code></td>
          <td><code>undefined</code></td>
          <td>Override the placeholder icon independently of the rendered media type.</td>
        </tr>
        <tr>
          <td><code>fit</code></td>
          <td><code>'cover' | 'contain'</code></td>
          <td><code>'cover'</code></td>
          <td>CSS object-fit strategy for the rendered media.</td>
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
          <td>—</td>
          <td>Fires when the underlying image or video has finished loading.</td>
        </tr>
        <tr>
          <td><code>error</code></td>
          <td><code>MediaError | null | undefined</code></td>
          <td>Fires when the media fails to load. Includes the native <code>MediaError</code> for videos.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Image</h3>
    <pre><code>&lt;UtensilMedia
  src="/photos/hero.jpg"
  media-type="image"
  alt="Hero banner"
/&gt;</code></pre>

    <h3>Video with Fade</h3>
    <pre><code>&lt;UtensilMedia
  src="/clips/intro.mp4"
  media-type="video"
  :fade="true"
/&gt;</code></pre>

    <h3>Placeholder Only</h3>
    <pre><code>&lt;UtensilMedia media-type="image" /&gt;</code></pre>

    <h3>Contain Fit with Events</h3>
    <pre><code>&lt;UtensilMedia
  src="/photos/portrait.jpg"
  media-type="image"
  fit="contain"
  @load="onLoad"
  @error="onError"
/&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
