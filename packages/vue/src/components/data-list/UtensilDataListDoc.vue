<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilDataList</h1>
    </div>
    <p>
      Displays structured key-value pairs using semantic definition list markup. Supports horizontal and vertical
      orientations. Use with <code>UtensilDataListItem</code> children.
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
          <td><code>orientation</code></td>
          <td><code>'horizontal' | 'vertical'</code></td>
          <td><code>'horizontal'</code></td>
          <td>Layout direction. Horizontal uses a two-column grid; vertical stacks labels above values.</td>
        </tr>
        <tr>
          <td><code>block</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Expand to full width. In horizontal mode, values align to the end.</td>
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
          <td>Container for <code>UtensilDataListItem</code> children.</td>
        </tr>
      </tbody>
    </table>

    <h2>CSS Cvars</h2>
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
          <td><code>--data-list-label-width</code></td>
          <td><code>auto</code></td>
          <td>Width of the label column in horizontal orientation.</td>
        </tr>
      </tbody>
    </table>

    <h2>Child Participation</h2>
    <p>
      <code>UtensilDataListItem</code> children receive <code>orientation</code> and <code>block</code> from the parent
      via <code>provide</code>/<code>inject</code>. No manual prop forwarding is needed.
    </p>

    <hr />

    <h1>UtensilDataListItem</h1>
    <p>A single key-value entry within a <code>UtensilDataList</code>.</p>

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
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Text label for the definition term. Overridden by the <code>label</code> slot.</td>
        </tr>
        <tr>
          <td><code>alignment</code></td>
          <td><code>'baseline' | 'start' | 'center' | 'end'</code></td>
          <td>—</td>
          <td>Cross-axis alignment between label and value in horizontal mode.</td>
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
          <td>Value content for the definition description.</td>
        </tr>
        <tr>
          <td><code>label</code></td>
          <td>—</td>
          <td>Custom label content. Overrides the <code>label</code> prop.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Horizontal</h3>
    <pre><code>&lt;UtensilDataList&gt;
  &lt;UtensilDataListItem label="Name"&gt;Sofia Chen&lt;/UtensilDataListItem&gt;
  &lt;UtensilDataListItem label="Email"&gt;sofia.chen@example.com&lt;/UtensilDataListItem&gt;
  &lt;UtensilDataListItem label="Role"&gt;Administrator&lt;/UtensilDataListItem&gt;
&lt;/UtensilDataList&gt;</code></pre>

    <h3>Vertical Layout</h3>
    <pre><code>&lt;UtensilDataList orientation="vertical"&gt;
  &lt;UtensilDataListItem label="Description"&gt;
    A longer description that benefits from the full width.
  &lt;/UtensilDataListItem&gt;
&lt;/UtensilDataList&gt;</code></pre>

    <h3>Block Mode with Alignment</h3>
    <pre><code>&lt;UtensilDataList block&gt;
  &lt;UtensilDataListItem label="Status" alignment="center"&gt;
    &lt;UtensilBadge variation="soft" color="success"&gt;Active&lt;/UtensilBadge&gt;
  &lt;/UtensilDataListItem&gt;
  &lt;UtensilDataListItem label="Format"&gt;video/mp4&lt;/UtensilDataListItem&gt;
&lt;/UtensilDataList&gt;</code></pre>

    <h3>Custom Label Slot</h3>
    <pre><code>&lt;UtensilDataListItem&gt;
  &lt;template #label&gt;
    &lt;UtensilIcon icon="envelope" /&gt; Email
  &lt;/template&gt;
  sofia.chen@example.com
&lt;/UtensilDataListItem&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
