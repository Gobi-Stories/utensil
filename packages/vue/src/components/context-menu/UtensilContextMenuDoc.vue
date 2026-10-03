<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilContextMenu</h1>
    </div>
    <p>
      A positioned context menu that renders a <code>UtensilMenu</code> inside a <code>UtensilPopoverPositioned</code>.
      Opens at a specific <code>{ x, y }</code> coordinate (or legacy <code>{ top, left }</code>). Supports controlled
      mode via <code>v-model</code> or uncontrolled mode with exposed methods. For right-click areas, prefer
      <code>UtensilContextMenuArea</code> which handles mouse events automatically.
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
          <td><code>modelValue</code></td>
          <td><code>boolean</code></td>
          <td><code>undefined</code></td>
          <td>Whether the menu is open. When provided, the component runs in controlled mode.</td>
        </tr>
        <tr>
          <td><code>position</code></td>
          <td><code>{ x, y } | { top, left }</code></td>
          <td><code>{ x: 0, y: 0 }</code></td>
          <td>Screen coordinates where the menu appears. Accepts modern or legacy format.</td>
        </tr>
      </tbody>
    </table>

    <!-- Events -->
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
          <td><code>update:modelValue</code></td>
          <td><code>boolean</code></td>
          <td>Emitted when the open state changes in controlled mode.</td>
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
          <td><code>close</code>, <code>isFocused</code>, <code>focus</code></td>
          <td>Menu content. Receives scope from <code>UtensilMenu</code> for keyboard navigation and dismissal.</td>
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
          <td>
            Force-opens the menu, even if a light-dismiss just closed it in the same event. Use for re-triggering on
            right-click.
          </td>
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
      The default slot renders inside a <code>UtensilMenu</code>, so built-in children like
      <code>UtensilMenuItem</code> and <code>UtensilMenuDivider</code> work automatically. Custom children participate
      via slot scope and data attributes.
    </p>

    <h3>Slots for Children</h3>
    <p>The <code>default</code> slot exposes:</p>
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

    <h3>Controlled Mode (v-model)</h3>
    <pre><code>&lt;UtensilContextMenu v-model="isOpen" :position="{ x: 100, y: 200 }"&gt;
  &lt;UtensilMenuItem label="Edit" @click="edit()" /&gt;
  &lt;UtensilMenuItem label="Delete" color="red" @click="remove()" /&gt;
&lt;/UtensilContextMenu&gt;</code></pre>

    <h3>Programmatic Control</h3>
    <pre><code>&lt;UtensilContextMenu ref="menuRef" :position="menuPosition"&gt;
  &lt;template #default="{ close }"&gt;
    &lt;UtensilMenuItem label="Copy" /&gt;
    &lt;UtensilMenuDivider /&gt;
    &lt;div
      data-focusable
      @click="doCustomAction(); close()"
    &gt;Custom action&lt;/div&gt;
  &lt;/template&gt;
&lt;/UtensilContextMenu&gt;

&lt;!-- Open from code --&gt;
&lt;script setup&gt;
const menuRef = ref()
const menuPosition = ref({ x: 0, y: 0 })

function onRightClick(event) {
  menuPosition.value = { x: event.clientX, y: event.clientY }
  menuRef.value.forceOpen()
}
&lt;/script&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
