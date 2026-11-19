<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilHintLabel</h1>
    </div>
    <p>
      A label with a dotted underline that reveals a plain-language explanation on hover, keyboard focus or a press. For
      explaining metric names, column headers, and technical terms. Composes
      <code>UtensilTooltip</code> in multiline mode.
    </p>

    <h2>Accessibility</h2>
    <p>
      The label is a button drawn as text, so its hint shows from the keyboard and on a press, where a touch screen has
      no hover. It is described by the hint (<code>aria-describedby</code>), so a screen reader reads the explanation
      with it. Without a <code>hint</code> it is only the label, with no tab stop. Being a button, a hint label can't
      sit inside another button, a <code>&lt;label&gt;</code> or a <code>&lt;summary&gt;</code>: put it beside them.
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
          <td><code>text</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>The label text.</td>
        </tr>
        <tr>
          <td><code>hint</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>The explanation shown in the tooltip. Without one, the label is plain text.</td>
        </tr>
        <tr>
          <td><code>placement</code></td>
          <td><code>'top' | 'bottom' | 'left' | 'right'</code></td>
          <td><code>'top'</code></td>
          <td>Preferred tooltip placement.</td>
        </tr>
        <tr>
          <td><code>wrap</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Wraps the label onto more lines where it has too little room, such as a narrow table column, instead of
            truncating it with an ellipsis.
          </td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Metric Label</h3>
    <pre><code>&lt;UtensilHintLabel
  text="Active users"
  hint="How many people opened the app at least once in the last 30 days."
/&gt;</code></pre>

    <h3>Column Header</h3>
    <pre><code>&lt;UtensilHintLabel
  text="Watched to the end"
  hint="Of all the times a video was played, the share that played to its end."
  wrap
/&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component - no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
