<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilDropdownMenu</h1>
    </div>
    <p>
      A dropdown menu that anchors to a trigger element. Combines <code>UtensilPopover</code> and
      <code>UtensilMenu</code> to provide a positioned menu with keyboard navigation and light dismiss. Supports
      controlled mode via <code>v-model</code> or uncontrolled mode with exposed methods. For menus triggered by
      right-click, use <code>UtensilContextMenu</code> instead.
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
          <td><code>placement</code></td>
          <td><code>PopoverPlacement</code></td>
          <td><code>'bottom-start'</code></td>
          <td>Placement of the menu relative to the trigger element.</td>
        </tr>
        <tr>
          <td><code>offset</code></td>
          <td><code>number</code></td>
          <td><code>4</code></td>
          <td>Gap in pixels between the trigger and the menu.</td>
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
          <td><code>trigger</code></td>
          <td><code>toggle</code>, <code>isOpen</code>, <code>open</code>, <code>close</code></td>
          <td>The element that anchors and toggles the menu.</td>
        </tr>
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

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilDropdownMenu&gt;
  &lt;template #trigger="{ toggle }"&gt;
    &lt;UtensilButton @click="toggle"&gt;Open Menu&lt;/UtensilButton&gt;
  &lt;/template&gt;
  &lt;UtensilMenuItem label="Edit" @click="edit()" /&gt;
  &lt;UtensilMenuItem label="Delete" color="red" @click="remove()" /&gt;
&lt;/UtensilDropdownMenu&gt;</code></pre>

    <h3>With Custom Children</h3>
    <pre><code>&lt;UtensilDropdownMenu placement="bottom-end"&gt;
  &lt;template #trigger="{ toggle, isOpen }"&gt;
    &lt;UtensilButton @click="toggle"&gt;
      &#x7B;&#x7B; isOpen ? 'Close' : 'Actions' &#x7D;&#x7D; &#x25BE;
    &lt;/UtensilButton&gt;
  &lt;/template&gt;
  &lt;template #default="{ isFocused, focus, close }"&gt;
    &lt;UtensilMenuItem label="Copy" /&gt;
    &lt;UtensilMenuDivider /&gt;
    &lt;div
      data-focusable
      @mouseenter="focus($el)"
      @click="doCustomAction(); close()"
    &gt;Custom action&lt;/div&gt;
  &lt;/template&gt;
&lt;/UtensilDropdownMenu&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
