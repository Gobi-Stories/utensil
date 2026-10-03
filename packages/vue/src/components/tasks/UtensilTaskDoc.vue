<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilTask</h1>
    </div>
    <p>
      A single task row used inside <code>UtensilTasks</code>. Shows a title, optional state label, progress bar, and an
      optional row of action buttons. Clicking the row emits <code>click</code> with the configured payload and bubbles
      it through the parent <code>UtensilTasks</code> context. Action buttons are isolated with
      <code>@click.stop</code> so they do not bubble the row click.
    </p>
    <p>
      <code>UtensilTask</code> falls back to safe defaults when no <code>UtensilTasks</code> ancestor is present and is
      usable standalone.
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
          <td><code>title</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Primary label for the task.</td>
        </tr>
        <tr>
          <td><code>icon</code></td>
          <td><code>IconProp&lt;Theme&gt;</code></td>
          <td>—</td>
          <td>Optional icon rendered before the title (e.g. a media-type indicator).</td>
        </tr>
        <tr>
          <td><code>state</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Optional state label rendered to the right of the title (e.g. <code>'Uploading...'</code>).</td>
        </tr>
        <tr>
          <td><code>progress</code></td>
          <td><code>number</code></td>
          <td>—</td>
          <td>Progress percentage (0–100). Renders an indeterminate bar at 100 (processing).</td>
        </tr>
        <tr>
          <td><code>errored</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Render in error state. Replaces the progress bar with an error indicator.</td>
        </tr>
        <tr>
          <td><code>payload</code></td>
          <td><code>unknown</code></td>
          <td>—</td>
          <td>Value passed to the <code>click</code> event when the row is activated.</td>
        </tr>
      </tbody>
    </table>

    <h2>Emits</h2>
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
          <td><code>unknown</code></td>
          <td>The configured <code>payload</code>.</td>
        </tr>
      </tbody>
    </table>

    <h2>Slots</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>default</code></td>
          <td>Optional supplementary content shown under the title.</td>
        </tr>
        <tr>
          <td><code>actions</code></td>
          <td>Action buttons row (e.g. retry / remove). Clicks inside this slot do not bubble the row click.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>
    <pre v-pre><code>&lt;UtensilTask
  title="Upload: photo.jpg"
  icon="image"
  state="Uploading..."
  :progress="42"
  :payload="upload"
  @click="open(upload)"
&gt;
  &lt;template #actions&gt;
    &lt;UtensilButton size="tiny" icon="redo" @click="retry"&gt;Retry&lt;/UtensilButton&gt;
    &lt;UtensilButton size="tiny" icon="times" color="error" @click="remove"&gt;Remove&lt;/UtensilButton&gt;
  &lt;/template&gt;
&lt;/UtensilTask&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
