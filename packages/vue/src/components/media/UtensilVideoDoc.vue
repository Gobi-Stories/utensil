<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilVideo</h1>
    </div>
    <p>
      Renders a <code>&lt;video&gt;</code> element with fade-in support, error handling, and automatic resource cleanup
      on unmount. The video is muted and plays inline. Preloads metadata by default, or fully when
      <code>autoplay</code> is set.
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
          <td>Video source URL. Required.</td>
        </tr>
        <tr>
          <td><code>fade</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>When true, the video fades in after loading.</td>
        </tr>
        <tr>
          <td><code>autoplay</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>When true, the video starts playing as soon as enough data is available.</td>
        </tr>
        <tr>
          <td><code>loop</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>When true, playback loops back to the start when it reaches the end.</td>
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
          <td>Fires when the video is ready to play.</td>
        </tr>
        <tr>
          <td><code>error</code></td>
          <td><code>MediaError | null</code></td>
          <td>
            Fires when the video fails to load. The payload contains the native <code>MediaError</code> with a
            <code>code</code> property.
          </td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilVideo src="/clips/intro.mp4" /&gt;</code></pre>

    <h3>With Fade and Error Handling</h3>
    <pre><code>&lt;UtensilVideo
  src="/clips/intro.mp4"
  :fade="true"
  @load="onLoad"
  @error="onError"
/&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
