<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilTableHeader</h1>
    </div>
    <p>
      The optional column header row of a <code>UtensilTable</code>, laid out on the table's column template so its
      cells line up with the rows below. Omit it for a table without headers. Its labels are small, uppercase and softer
      than the rows, above a separator.
    </p>

    <h2>Accessibility</h2>
    <p>
      The header is <code>role="row"</code> in the table's <code>role="table"</code>. Give each of its cells
      <code>role="columnheader"</code>, so each row's cells are read with their column's name. A column with no visible
      label, such as one of row actions, still needs a name: give its header cell an <code>aria-label</code>.
    </p>

    <h2>Slots</h2>
    <table>
      <thead>
        <tr>
          <th>Slot</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>default</code></td>
          <td>
            The header cells, one element per column, each with <code>role="columnheader"</code>. They sit on the row's
            bottom edge: a label that wraps in a narrow column grows upward, so its last line stays beside the other
            labels and directly above its column's values.
          </td>
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
          <td><code>--utensil-table-padding-block</code>, <code>--utensil-table-padding-inline</code></td>
          <td><code>--space-3</code>, <code>--space-4</code></td>
          <td>Padding of the row, shared with the table's rows.</td>
        </tr>
        <tr>
          <td><code>--utensil-table-header-separator</code></td>
          <td><code>--pencil-a4</code>, <code>--pencil-a8</code> in high contrast</td>
          <td>Color of the line under the header.</td>
        </tr>
        <tr>
          <td><code>--utensil-table-header-font-weight</code></td>
          <td><code>600</code></td>
          <td>Weight of the labels.</td>
        </tr>
        <tr>
          <td><code>--utensil-table-header-letter-spacing</code></td>
          <td><code>0.04em</code></td>
          <td>Letter spacing of the uppercase labels.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Column Headers</h3>
    <pre v-pre><code>&lt;UtensilTable :columns="['1fr', '96px', '48px']"&gt;
  &lt;UtensilTableHeader&gt;
    &lt;span role="columnheader"&gt;Story&lt;/span&gt;
    &lt;span role="columnheader"&gt;Views&lt;/span&gt;
    &lt;span role="columnheader" aria-label="Actions"&gt;&lt;/span&gt;
  &lt;/UtensilTableHeader&gt;
  &lt;UtensilTableRow v-for="story in stories" :key="story.id"&gt;
    &lt;span role="cell"&gt;{{ story.title }}&lt;/span&gt;
    &lt;span role="cell"&gt;{{ story.views }}&lt;/span&gt;
    &lt;span role="cell"&gt;&lt;StoryActions :story="story" /&gt;&lt;/span&gt;
  &lt;/UtensilTableRow&gt;
&lt;/UtensilTable&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component - no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
