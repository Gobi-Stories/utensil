<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilContextMenuArea</h1>
    </div>
    <p>
      Wraps a region that opens a context menu on right-click (or left-click). Internally uses
      <code>UtensilContextMenu</code> which positions a <code>UtensilMenu</code> at the cursor location with
      light-dismiss behavior.
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
          <td><code>button</code></td>
          <td><code>'right' | 'left'</code></td>
          <td><code>'right'</code></td>
          <td>
            Which mouse button triggers the menu. <code>'right'</code> uses contextmenu, <code>'left'</code> uses click.
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
          <td><code>default</code></td>
          <td>—</td>
          <td>The content area that triggers the context menu on interaction.</td>
        </tr>
        <tr>
          <td><code>menu</code></td>
          <td><code>isFocused</code>, <code>focus</code>, <code>close</code></td>
          <td>The menu content. Receives scope from <code>UtensilMenu</code> for keyboard navigation and dismissal.</td>
        </tr>
      </tbody>
    </table>

    <!-- Exposed -->
    <h2>Exposed</h2>
    <table>
      <thead>
        <tr>
          <th>Member</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>open()</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Opens the menu.</td>
        </tr>
        <tr>
          <td><code>close()</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Closes the menu.</td>
        </tr>
        <tr>
          <td><code>toggle()</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Toggles the menu open or closed.</td>
        </tr>
        <tr>
          <td><code>forceOpen()</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Force-opens the menu, even if a light-dismiss just closed it in the same event.</td>
        </tr>
        <tr>
          <td><code>isOpen</code></td>
          <td><code>boolean</code></td>
          <td>Whether the menu is currently open.</td>
        </tr>
      </tbody>
    </table>

    <!-- Child Participation -->
    <h2>Child Participation</h2>
    <p>
      The <code>menu</code> slot renders inside a <code>UtensilMenu</code>, so built-in children like
      <code>UtensilMenuItem</code> and <code>UtensilMenuDivider</code> work automatically. Custom children participate
      via slot scope and data attributes.
    </p>

    <h3>Slots for Children</h3>
    <p>The <code>menu</code> slot exposes:</p>
    <ul>
      <li><code>isFocused(element)</code> — check if an element is keyboard-focused</li>
      <li><code>focus(element)</code> — focus an element for keyboard navigation</li>
      <li><code>close()</code> — close the menu</li>
    </ul>

    <h3>Data Attributes</h3>
    <table>
      <thead>
        <tr>
          <th>Attribute</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>data-focusable</code></td>
          <td>Add to custom children so keyboard navigation discovers them.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Basic Right-Click Menu</h3>
    <pre><code>&lt;UtensilContextMenuArea&gt;
  &lt;div class="target-area"&gt;Right-click here&lt;/div&gt;
  &lt;template #menu="{ close }"&gt;
    &lt;UtensilMenuItem label="Edit" @click="edit()" /&gt;
    &lt;UtensilMenuItem label="Delete" color="red" @click="remove()" /&gt;
  &lt;/template&gt;
&lt;/UtensilContextMenuArea&gt;</code></pre>

    <h3>With Custom Children</h3>
    <pre><code>&lt;UtensilContextMenuArea&gt;
  &lt;div class="target-area"&gt;Right-click here&lt;/div&gt;
  &lt;template #menu="{ isFocused, focus, close }"&gt;
    &lt;UtensilMenuItem label="Copy" /&gt;
    &lt;UtensilMenuDivider /&gt;
    &lt;div
      data-focusable
      @mouseenter="focus($el)"
      @click="doCustomAction(); close()"
    &gt;Custom action&lt;/div&gt;
  &lt;/template&gt;
&lt;/UtensilContextMenuArea&gt;</code></pre>

    <h3>Left-Click Trigger</h3>
    <pre><code>&lt;UtensilContextMenuArea button="left"&gt;
  &lt;UtensilButton&gt;Click for menu&lt;/UtensilButton&gt;
  &lt;template #menu&gt;
    &lt;UtensilMenuItem label="Option A" /&gt;
    &lt;UtensilMenuItem label="Option B" /&gt;
  &lt;/template&gt;
&lt;/UtensilContextMenuArea&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
