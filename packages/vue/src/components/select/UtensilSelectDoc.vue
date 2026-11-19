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

    <h2>Accessibility</h2>
    <p>
      The trigger is a select-only combobox: <code>role="combobox"</code>, named by the visible <code>label</code> (or
      <code>ariaLabel</code> without one), with the chosen option's text, or the placeholder, as its value. It sets
      <code>aria-expanded</code>, <code>aria-controls</code> to the listbox, and, while open,
      <code>aria-activedescendant</code> to the option the arrow keys are on. DOM focus stays on the trigger.
    </p>
    <p>
      Each option has an id, <code>aria-selected</code>, and <code>tabindex="-1"</code> so it appears in the
      accessibility tree and can be pressed through it; pressing one leaves focus on the trigger. In
      <code>multiple</code> mode the listbox is <code>aria-multiselectable</code>.
    </p>
    <h3>Keyboard</h3>
    <ul>
      <li>Down, Up, Enter or Space opens the list on the chosen option, or the first.</li>
      <li>While open, Down and Up move through the options, Home and End go to the first and last.</li>
      <li>Enter or Space chooses the option and closes the list; in <code>multiple</code> mode it stays open.</li>
      <li>
        Typing jumps to the next option whose text starts with what is typed, opening the list if it's closed. Typing
        one character again moves on through the options that start with it.
      </li>
      <li>
        Tab chooses the option the arrow keys are on, closes the list and moves focus on as usual. In
        <code>multiple</code> mode it closes the list without choosing.
      </li>
      <li>Escape closes the list without choosing.</li>
    </ul>

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
          <td><code>description</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Text under the select, such as a hint, that describes it.</td>
        </tr>
        <tr>
          <td><code>reserveDescription</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Holds the description's line while there is none, so a message that comes and goes doesn't move what
            follows, and a form can hold every field's line the same way.
          </td>
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
          <td><code>selection</code></td>
          <td><code>string[]</code></td>
          <td><code>[]</code></td>
          <td>The chosen values in <code>multiple</code> mode, bound with <code>v-model:selection</code>.</td>
        </tr>
        <tr>
          <td><code>placeholder</code></td>
          <td><code>string</code></td>
          <td><code>'Select an option...'</code></td>
          <td>Placeholder text shown when no value is selected.</td>
        </tr>
        <tr>
          <td><code>variation</code></td>
          <td><code>'surface' | 'soft' | 'outline' | 'unstyled'</code></td>
          <td><code>'surface'</code></td>
          <td>Visual style of the trigger. See Variations below.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disables the select. Drawn muted, with its label, icon and description.</td>
        </tr>
        <tr>
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>
            Names the select where there is no visible <code>label</code>. Ignored when <code>label</code> is set.
          </td>
        </tr>
        <tr>
          <td><code>icon</code></td>
          <td><code>IconProp</code></td>
          <td>—</td>
          <td>Icon at the start of the trigger, shown whatever is chosen, in place of the chosen option's icon.</td>
        </tr>
        <tr>
          <td><code>full</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Shows every option, however many, rather than scrolling past the list's maximum height. For a short, fixed
            list whose last options shouldn't hide behind a scroll.
          </td>
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
          <td><code>value</code></td>
          <td><code>option</code>, <code>display</code></td>
          <td>
            The trigger's value, in place of the chosen option's label: <code>option</code> is the chosen
            <code>SelectOption</code> (or <code>null</code>), <code>display</code> the text it would show.
          </td>
        </tr>
        <tr>
          <td><code>option</code></td>
          <td><code>option</code></td>
          <td>Each option's content, in place of its label.</td>
        </tr>
        <tr>
          <td><code>description</code></td>
          <td>—</td>
          <td>Replaces the description's text, e.g. with a link.</td>
        </tr>
        <tr>
          <td><code>prepend</code></td>
          <td>
            <code>value</code>, <code>selection</code>, <code>select</code>, <code>focusedValue</code>,
            <code>setFocusedValue</code>, <code>isOpen</code>, <code>close</code>
          </td>
          <td>Content inserted before the options list.</td>
        </tr>
        <tr>
          <td><code>append</code></td>
          <td>
            <code>value</code>, <code>selection</code>, <code>select</code>, <code>focusedValue</code>,
            <code>setFocusedValue</code>, <code>isOpen</code>, <code>close</code>
          </td>
          <td>Content inserted after the options list. Useful for custom actions like "Manage items...".</td>
        </tr>
      </tbody>
    </table>

    <!-- Variations -->
    <h2>CSS Custom Properties</h2>
    <table>
      <thead>
        <tr>
          <th>Property</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>--utensil-listbox-max-height</code></td>
          <td><code>240px</code> × <code>--scale</code></td>
          <td>
            The height the open list scrolls past. Set it on the select or an ancestor; <code>full</code> overrides it.
          </td>
        </tr>
      </tbody>
    </table>

    <h2>Sizing</h2>
    <p>
      The trigger is as wide as its widest option, as a native <code>&lt;select&gt;</code> is, so the list, which
      matches the trigger's width, shows every label in full and the trigger keeps its width as the selection changes. A
      trigger given a narrower width truncates its value.
    </p>

    <h2>Variations</h2>
    <div class="text-ui ui-variations-reference">
      <UtensilBadge variation="surface" scale="giant">Surface</UtensilBadge>
      <UtensilBadge variation="soft" scale="giant">Soft</UtensilBadge>
      <UtensilBadge variation="outline" scale="giant">Outline</UtensilBadge>
      <UtensilBadge scale="giant">Unstyled</UtensilBadge>
    </div>
    <p>
      The variations are the ones buttons and boxes take: <code>surface</code> is filled and edged, <code>soft</code> is
      tinted in the pen, <code>outline</code> is an edge over whatever is behind it, and <code>unstyled</code> draws no
      fill or edge, for a field laid into a panel of its own. Each keeps its padding and the focus ring.
    </p>

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
      <li><code>selection</code> — the selected values in <code>multiple</code> mode</li>
      <li>
        <code>select(value)</code> — select a value and close the dropdown; in <code>multiple</code> mode, toggle it in
        the selection and leave the dropdown open
      </li>
      <li><code>focusedValue</code> — the currently keyboard-focused value</li>
      <li><code>setFocusedValue(value)</code> — set the focused value for keyboard navigation</li>
      <li><code>isOpen</code> — whether the dropdown is open</li>
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
        <tr>
          <td><code>id</code>, <code>role="option"</code>, <code>tabindex="-1"</code></td>
          <td>
            Give custom elements these too, with <code>aria-selected="false"</code> and <code>@mousedown.prevent</code>,
            so they read as options in the listbox, the trigger can point at them while they're focused, and pressing
            one keeps focus on the trigger.
          </td>
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
    &lt;div
      id="manage-folders"
      role="option"
      aria-selected="false"
      tabindex="-1"
      data-focusable
      @mousedown.prevent
      @click="manageFolders(); close()"
    &gt;
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
