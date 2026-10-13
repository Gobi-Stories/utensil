<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilTableRow</h1>
    </div>
    <p>
      A data row inside <code>UtensilTable</code>. It lays its cells out on the table's column template, so they line up
      with <code>UtensilTableHeader</code> and the other rows.
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
          <td><code>variant</code></td>
          <td><code>'default' | 'muted' | 'clustered'</code></td>
          <td><code>'default'</code></td>
          <td>
            <code>muted</code> softens the text. <code>clustered</code> tightens the padding, and makes the text smaller
            and softer, for rows that belong together, such as log entries from one author.
          </td>
        </tr>
        <tr>
          <td><code>interactive</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Makes the row a focusable control that emits <code>click</code>, with hover feedback. For a row that goes
            somewhere, use a row link instead.
          </td>
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
          <td><code>Event</code></td>
          <td>An <code>interactive</code> row was clicked, or activated with Enter or Space while it has focus.</td>
        </tr>
      </tbody>
    </table>

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
            The row's cells, one element per column, each with <code>role="cell"</code> so the table reads as one.
          </td>
        </tr>
      </tbody>
    </table>

    <h2>Row Links</h2>
    <p>
      Give a link in the row the <code>utensil-table-row-link</code> class, usually on the cell that names the row, and
      the whole row follows it. Any link works, router links included, so middle-click and "open in new tab" do too. The
      link's text names it for assistive technology, the row shows its focus ring and hover feedback, and other controls
      in the row stay clickable above it.
    </p>

    <h2>Examples</h2>

    <h3>Rows That Link</h3>
    <pre v-pre><code>&lt;UtensilTable :columns="['1fr', '120px']"&gt;
  &lt;UtensilTableHeader&gt;
    &lt;span role="columnheader"&gt;Story&lt;/span&gt;
    &lt;span role="columnheader"&gt;Views&lt;/span&gt;
  &lt;/UtensilTableHeader&gt;
  &lt;UtensilTableRow v-for="story in stories" :key="story.uuid"&gt;
    &lt;span role="cell"&gt;
      &lt;RouterLink class="utensil-table-row-link" :to="storyRoute(story)"&gt;{{ story.title }}&lt;/RouterLink&gt;
    &lt;/span&gt;
    &lt;span role="cell"&gt;{{ story.views }}&lt;/span&gt;
  &lt;/UtensilTableRow&gt;
&lt;/UtensilTable&gt;</code></pre>

    <h3>Rows That Act</h3>
    <pre v-pre><code>&lt;UtensilTableRow interactive @click="select(member)"&gt;
  &lt;span role="cell"&gt;{{ member.name }}&lt;/span&gt;
  &lt;span role="cell"&gt;{{ member.role }}&lt;/span&gt;
&lt;/UtensilTableRow&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
