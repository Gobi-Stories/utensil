<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilSelect</h1>
      <UtensilPopoverPanel :offset="0">
        <template #trigger="{ toggle }">
          <UtensilBadge class="theme-props-badge" scale="large" @click="toggle">Theme Props</UtensilBadge>
        </template>
        <div class="theme-props-note">
          <span>Use a typed wrapper to use your theme values. See the Usage Guide.</span>
        </div>
      </UtensilPopoverPanel>
    </div>
    <p>
      A fully-featured dropdown select component with keyboard navigation, icons, disabled options, and style
      variations. Wraps <code>UtensilSelectBase</code> which provides popover positioning, listbox semantics, and
      keyboard handling.
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
          <td><code>string | null</code></td>
          <td><code>null</code></td>
          <td>The selected value (v-model).</td>
        </tr>
        <tr>
          <td><code>options</code></td>
          <td><code>SelectOption[]</code></td>
          <td>—</td>
          <td>
            The list of options to display. Each option has <code>value</code>, <code>label</code>, and optional
            <code>icon</code> and <code>disabled</code> fields.
          </td>
        </tr>
        <tr>
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Visible label rendered above the trigger and associated with it.</td>
        </tr>
        <tr>
          <td><code>multiple</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Selects multiple values. The list stays open while picking and the selected values bind via
            <code>v-model:selection</code> (<code>string[]</code>); the trigger shows the joined labels.
          </td>
        </tr>
        <tr>
          <td><code>placeholder</code></td>
          <td><code>string</code></td>
          <td><code>'Select an option...'</code></td>
          <td>Placeholder text shown when no value is selected.</td>
        </tr>
        <tr>
          <td><code>variation</code></td>
          <td><code>'surface' | 'soft'</code></td>
          <td><code>'surface'</code></td>
          <td>Visual style variation for the trigger button.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disables the select entirely.</td>
        </tr>
        <tr>
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Accessible label for screen readers.</td>
        </tr>
        <tr>
          <td><code>icon</code></td>
          <td><code>IconProp</code></td>
          <td>—</td>
          <td>Icon to display when an option is selected (overrides option icon).</td>
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
          <td><code>string | null</code></td>
          <td>Fires when the selected value changes (v-model).</td>
        </tr>
        <tr>
          <td><code>change</code></td>
          <td><code>string</code></td>
          <td>
            Fires when a new option is selected. Unlike <code>update:modelValue</code>, always carries a string value.
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
          <td><code>prepend</code></td>
          <td>
            <code>value</code>, <code>select</code>, <code>focusedValue</code>, <code>setFocusedValue</code>,
            <code>close</code>
          </td>
          <td>Content inserted before the options list.</td>
        </tr>
        <tr>
          <td><code>append</code></td>
          <td>
            <code>value</code>, <code>select</code>, <code>focusedValue</code>, <code>setFocusedValue</code>,
            <code>close</code>
          </td>
          <td>Content inserted after the options list. Useful for custom actions like "Manage items...".</td>
        </tr>
      </tbody>
    </table>

    <!-- Variations -->
    <h2>Variations</h2>
    <div class="text-ui ui-variations-reference">
      <UtensilBadge variation="surface" scale="giant">Surface</UtensilBadge>
      <UtensilBadge variation="soft" scale="giant">Soft</UtensilBadge>
    </div>

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
          <td>Opens the dropdown popover.</td>
        </tr>
        <tr>
          <td><code>close()</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Closes the dropdown popover.</td>
        </tr>
        <tr>
          <td><code>toggle()</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Toggles the dropdown open/closed.</td>
        </tr>
        <tr>
          <td><code>isOpen</code></td>
          <td><code>boolean</code></td>
          <td>Whether the dropdown is currently open.</td>
        </tr>
      </tbody>
    </table>

    <!-- Child Participation -->
    <h2>Child Participation</h2>
    <p>
      Options are rendered using built-in <code>UtensilSelectOption</code> children. Custom elements can be added via
      the <code>prepend</code> and <code>append</code> slots.
    </p>

    <h3>Slots for Children</h3>
    <p>The <code>prepend</code> and <code>append</code> slots expose:</p>
    <ul>
      <li><code>value</code> — the currently selected value</li>
      <li><code>select(value)</code> — select a value and close the dropdown</li>
      <li><code>focusedValue</code> — the currently keyboard-focused value</li>
      <li><code>setFocusedValue(value)</code> — set the focused value for keyboard navigation</li>
      <li><code>close()</code> — close the dropdown without selecting</li>
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
          <td>Add to custom elements in prepend/append slots so keyboard navigation discovers them.</td>
        </tr>
      </tbody>
    </table>

    <!-- SelectOption -->
    <h2>SelectOption Interface</h2>
    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Required</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>value</code></td>
          <td><code>string</code></td>
          <td>Yes</td>
          <td>The value emitted when this option is selected.</td>
        </tr>
        <tr>
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td>Yes</td>
          <td>The display label for this option.</td>
        </tr>
        <tr>
          <td><code>icon</code></td>
          <td><code>IconProp</code></td>
          <td>No</td>
          <td>Optional icon to display before the label.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td>No</td>
          <td>Whether this option is disabled and cannot be selected.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilSelect v-model="value" :options="options" /&gt;

&lt;UtensilSelect
  v-model="value"
  :options="options"
  variation="soft"
  placeholder="Choose a fruit..."
/&gt;</code></pre>

    <h3>With Icons</h3>
    <pre><code>&lt;UtensilSelect
  v-model="fileType"
  :options="[
    { value: 'image', label: 'Image', icon: 'image' },
    { value: 'video', label: 'Video', icon: 'video' },
  ]"
/&gt;</code></pre>

    <h3>With Append Slot</h3>
    <pre><code>&lt;UtensilSelect v-model="folder" :options="folderOptions"&gt;
  &lt;template #append="{ close }"&gt;
    &lt;div data-focusable @click="manageFolders(); close()"&gt;
      Manage folders...
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/UtensilSelect&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
