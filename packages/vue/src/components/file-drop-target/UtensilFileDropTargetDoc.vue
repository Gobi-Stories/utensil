<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilFileDropTarget</h1>
    </div>
    <p>
      A drag-and-drop file upload zone with a themed overlay that appears when files are dragged over the target area.
      Displays decorative corner markers and a centered upload prompt. Wraps arbitrary content and emits dropped files.
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
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disables file drop handling. The overlay still appears on drag but dropped files are ignored.</td>
        </tr>
        <tr>
          <td><code>sizeMode</code></td>
          <td><code>'container' | 'viewport'</code></td>
          <td><code>'viewport'</code></td>
          <td>
            Controls how the overlay sizes itself. Use <code>'container'</code> to constrain the overlay to the
            component bounds, or <code>'viewport'</code> for full-viewport coverage.
          </td>
        </tr>
        <tr>
          <td><code>rounded</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Apply rounded corners to the backdrop overlay.</td>
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
          <td><code>drop</code></td>
          <td><code>FileList</code></td>
          <td>Fires when files are dropped onto the target. Not emitted when <code>disabled</code> is true.</td>
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
          <td><code>{ active: boolean }</code></td>
          <td>
            Content displayed inside the drop zone. The <code>active</code> scope prop is <code>true</code> while a file
            is being dragged over the target.
          </td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilFileDropTarget @drop="handleFiles" rounded&gt;
  &lt;div class="upload-area"&gt;
    Drag files here to upload
  &lt;/div&gt;
&lt;/UtensilFileDropTarget&gt;</code></pre>

    <h3>Reactive Active State</h3>
    <pre v-pre><code>&lt;UtensilFileDropTarget @drop="handleFiles"&gt;
  &lt;template #default="{ active }"&gt;
    &lt;div :class="{ highlighted: active }"&gt;
      {{ active ? 'Release to upload' : 'Drag files here' }}
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/UtensilFileDropTarget&gt;</code></pre>

    <h3>Disabled State</h3>
    <pre><code>&lt;UtensilFileDropTarget disabled&gt;
  &lt;div class="upload-area"&gt;
    Uploads are currently disabled
  &lt;/div&gt;
&lt;/UtensilFileDropTarget&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
