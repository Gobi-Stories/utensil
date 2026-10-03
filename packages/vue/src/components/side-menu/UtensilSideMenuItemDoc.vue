<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilSideMenuItem</h1>
    </div>
    <p>
      A menu item for use within UtensilSideMenu. Displays an icon and title, with tooltip support when the menu is
      collapsed. Adapts styling based on the parent menu's open/closed state via CSS custom properties.
    </p>

    <!-- Props -->
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
          <td>Label text displayed next to the icon.</td>
        </tr>
        <tr>
          <td><code>icon</code></td>
          <td><code>IconProp&lt;Theme&gt;</code></td>
          <td>—</td>
          <td>Icon displayed in the item.</td>
        </tr>
        <tr>
          <td><code>iconColor</code></td>
          <td><code>ColorProp&lt;Theme&gt;</code></td>
          <td>—</td>
          <td>Override color for the icon.</td>
        </tr>
        <tr>
          <td><code>selected</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Highlights the item as the current selection.</td>
        </tr>
        <tr>
          <td><code>highlighted</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Applies accent color to the item text.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Dims the item and prevents interaction.</td>
        </tr>
        <tr>
          <td><code>muted</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Reduces opacity when not selected.</td>
        </tr>
        <tr>
          <td><code>closeOnClick</code></td>
          <td><code>boolean</code></td>
          <td>—</td>
          <td>
            Close the (floating) menu when this item is clicked. Unset inherits the menu's
            <code>closeOnClick</code> default.
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Slots -->
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
          <td><code>badge</code></td>
          <td><code>{ selected: boolean }</code></td>
          <td>Optional badge content displayed after the title.</td>
        </tr>
      </tbody>
    </table>

    <!-- Accessibility -->
    <h2>Accessibility</h2>
    <table>
      <thead>
        <tr>
          <th>Attribute</th>
          <th>Value</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>role</code></td>
          <td><code>"button"</code></td>
          <td>Identifies the element as an interactive button.</td>
        </tr>
        <tr>
          <td><code>tabindex</code></td>
          <td><code>"0"</code></td>
          <td>Makes the element focusable via keyboard.</td>
        </tr>
        <tr>
          <td><code>aria-pressed</code></td>
          <td>Bound to <code>selected</code></td>
          <td>Indicates the pressed/selected state.</td>
        </tr>
        <tr>
          <td><code>aria-disabled</code></td>
          <td>Bound to <code>disabled</code></td>
          <td>Indicates the disabled state.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Basic Item</h3>
    <pre v-pre><code>&lt;UtensilSideMenuItem title="Dashboard" icon="home" @click="navigate" /&gt;</code></pre>

    <h3>Selected with Badge</h3>
    <pre v-pre><code>&lt;UtensilSideMenuItem title="Inbox" icon="envelope" :selected="true"&gt;
  &lt;template #badge&gt;&lt;UtensilBadge&gt;3&lt;/UtensilBadge&gt;&lt;/template&gt;
&lt;/UtensilSideMenuItem&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
