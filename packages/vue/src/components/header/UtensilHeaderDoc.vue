<template>
  <article class="text-code utensil-api-doc">
    <h1>UtensilHeader</h1>
    <p>
      A simple header component that displays a title with an optional actions area. Uses flexbox with space-between
      layout. Text styling is inherited from the current text theme.
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
          <td>Header text. Overridden by the default slot.</td>
        </tr>
        <tr>
          <td><code>element</code></td>
          <td><code>'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'</code></td>
          <td><code>'h3'</code></td>
          <td>The heading HTML element to render.</td>
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
          <td>Title content. Overrides the <code>title</code> prop.</td>
        </tr>
        <tr>
          <td><code>actions</code></td>
          <td>—</td>
          <td>Right-aligned actions area (buttons, links, etc.).</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilHeader title="Page Title" /&gt;

&lt;UtensilHeader title="Section" element="h2" /&gt;</code></pre>

    <h3>With Actions</h3>
    <pre><code>&lt;UtensilHeader title="Settings"&gt;
  &lt;template #actions&gt;
    &lt;UtensilButton&gt;Save&lt;/UtensilButton&gt;
  &lt;/template&gt;
&lt;/UtensilHeader&gt;</code></pre>

    <h3>Custom Title Content</h3>
    <pre><code>&lt;UtensilHeader element="h1"&gt;
  &lt;UtensilBadge&gt;New&lt;/UtensilBadge&gt; Dashboard
&lt;/UtensilHeader&gt;</code></pre>
  </article>
</template>

<style src="../../utensil-docs.css"></style>
