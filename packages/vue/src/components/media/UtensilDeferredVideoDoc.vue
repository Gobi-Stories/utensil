<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilDeferredVideo</h1>
    </div>
    <p>
      Shows a still image and lazy-mounts a muted, looping video on hover. The video is only attached to the DOM while
      the pointer is over the component, fades in once it can play, and is destroyed on mouse out. Useful for grids of
      videos where mounting every player up front would be wasteful.
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
          <td><code>imgSrc</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Image shown by default and underneath the video. Required.</td>
        </tr>
        <tr>
          <td><code>videoSrc</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Video source URL, mounted on mouse enter. Required.</td>
        </tr>
        <tr>
          <td><code>alt</code></td>
          <td><code>string</code></td>
          <td><code>''</code></td>
          <td>Alt text for the image.</td>
        </tr>
        <tr>
          <td><code>fit</code></td>
          <td><code>'cover' | 'contain'</code></td>
          <td><code>'cover'</code></td>
          <td>How the image and video fill the container.</td>
        </tr>
        <tr>
          <td><code>hovered</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            External hover signal, combined with the component's own pointer detection. Pass this when another element
            covers the media and receives the pointer events — e.g. a card's stretched link.
          </td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilDeferredVideo
  :imgSrc="asset.previewUrl"
  :videoSrc="asset.url"
  :alt="asset.title"
/&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
