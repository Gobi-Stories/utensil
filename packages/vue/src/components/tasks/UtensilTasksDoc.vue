<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilTasks</h1>
    </div>
    <p>
      Compact background-task indicator. Shows a trigger button summarising in-flight work (count + aggregate progress +
      optional label). Clicking the trigger opens a popover panel listing individual tasks (typically
      <code>UtensilTask</code>
      children) provided via the default slot. The list is scrollable.
    </p>
    <p>
      <code>UtensilTasks</code> is purely presentational — count, progress, and label are passed in by the consumer who
      already owns the source of truth. Children bubble their <code>click</code> events through an injected context;
      <code>UtensilTasks</code> re-emits them on its own <code>click</code> event with the child's payload so the host
      can handle the click (e.g. open a related view).
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
          <td><code>count</code></td>
          <td><code>number</code></td>
          <td>—</td>
          <td>Number of running tasks.</td>
        </tr>
        <tr>
          <td><code>progress</code></td>
          <td><code>number</code></td>
          <td>—</td>
          <td>Aggregate progress of running tasks (0–100). Consumer is responsible for any weighting.</td>
        </tr>
        <tr>
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Optional short description shown alongside the trigger.</td>
        </tr>
        <tr>
          <td><code>labelPlacement</code></td>
          <td><code>'inline' | 'block'</code></td>
          <td><code>'inline'</code></td>
          <td>
            <code>'inline'</code> renders the label inside the trigger next to the count and progress bar.
            <code>'block'</code> renders the label as a heading stacked vertically above the trigger — use this when the
            label is a stable description of what the indicator represents (e.g. <code>"Uploads"</code>).
          </td>
        </tr>
        <tr>
          <td><code>errorCount</code></td>
          <td><code>number</code></td>
          <td><code>0</code></td>
          <td>Number of errored tasks. Counted into the trigger badge and styles the trigger as errored.</td>
        </tr>
        <tr>
          <td><code>placement</code></td>
          <td><code>PopoverPlacement</code></td>
          <td><code>'bottom-end'</code></td>
          <td>Popover placement relative to the trigger.</td>
        </tr>
        <tr>
          <td><code>alwaysVisible</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Render the trigger even when there are no tasks. Default behaviour is to hide.</td>
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
          <td>Emitted when a child task is clicked. Carries the child's payload.</td>
        </tr>
        <tr>
          <td><code>update:open</code></td>
          <td><code>boolean</code></td>
          <td>Emitted when the popover opens or closes.</td>
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
          <td>Task list contents — typically a series of <code>UtensilTask</code> components.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>
    <pre v-pre><code>&lt;UtensilTasks
  :count="uploads.status?.count ?? 0"
  :progress="uploads.status?.progress"
  :error-count="uploads.errored.value.length"
  :label="currentLabel"
  @click="onTaskClick"
&gt;
  &lt;UtensilTask
    v-for="upload in uploads.unfinalized.value"
    :key="upload.id"
    :title="upload.name"
    :state="formatStatus(upload)"
    :progress="upload.uploadProgress"
    :errored="upload.state === 'error'"
    :payload="upload"
  /&gt;
&lt;/UtensilTasks&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
