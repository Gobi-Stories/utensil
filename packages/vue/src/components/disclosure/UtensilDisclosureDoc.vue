<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilDisclosure</h1>
    </div>
    <p>
      An inline expand/collapse toggle: a borderless labelled row with a chevron that reveals its content below. The
      content unmounts while closed. Works uncontrolled (with <code>defaultOpen</code>) or controlled via
      <code>v-model:open</code>.
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
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Text for the toggle row. The <code>label</code> slot overrides it.</td>
        </tr>
        <tr>
          <td><code>defaultOpen</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Initial state when the <code>open</code> model is not bound.</td>
        </tr>
      </tbody>
    </table>

    <h2>Model</h2>
    <table>
      <thead>
        <tr>
          <th>Model</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>open</code></td>
          <td><code>boolean</code></td>
          <td>
            Bind with <code>v-model:open</code> to control the expanded state. Leave unbound for uncontrolled use.
          </td>
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
          <td><code>{ close }</code></td>
          <td>The revealed content. <code>close</code> collapses the disclosure.</td>
        </tr>
        <tr>
          <td><code>label</code></td>
          <td>—</td>
          <td>Custom toggle row content, replacing the <code>label</code> prop text.</td>
        </tr>
      </tbody>
    </table>

    <h2>CSS Cvars</h2>
    <table>
      <thead>
        <tr>
          <th>Cvar</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>--utensil-disclosure-content-indent</code></td>
          <td><code>0px</code></td>
          <td>Inline-start padding on the revealed content, to nest it under the label.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Uncontrolled</h3>
    <pre><code>&lt;UtensilDisclosure label="Theme"&gt;
  &lt;ThemeControls /&gt;
&lt;/UtensilDisclosure&gt;</code></pre>

    <h3>Controlled</h3>
    <pre><code>&lt;UtensilDisclosure label="Browse icons" v-model:open="iconBrowserOpen"&gt;
  &lt;IconBrowser /&gt;
&lt;/UtensilDisclosure&gt;</code></pre>

    <h3>Indented content</h3>
    <pre><code>&lt;UtensilDisclosure label="Advanced" style="--utensil-disclosure-content-indent: var(--space-5)"&gt;
  &lt;AdvancedSettings /&gt;
&lt;/UtensilDisclosure&gt;</code></pre>
  </article>
</template>

<style src="../../utensil-docs.css"></style>
