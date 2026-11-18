<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilToolbar</h1>
      <UtensilPopoverPanel :offset="0">
        <template #trigger="{ toggle }">
          <UtensilBadge class="theme-props-badge" scale="large" @click="toggle">Theme Props</UtensilBadge>
        </template>
        <div class="theme-props-note">
          <span>Create a typed wrapper for your theme. See the Utensil Usage Guide.</span>
        </div>
      </UtensilPopoverPanel>
    </div>
    <p>
      A bar of related controls, such as an editor's insert and formatting buttons. Its buttons and links are one stop
      in the tab order: the arrow keys, Home and End move focus between them, and Tab returns to the one used last. A
      radio group is one of its stops. Fields that use the arrow keys themselves keep their own place in the tab order.
      Give it an
      <code>ariaLabel</code> naming what its controls do.
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
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>What the toolbar is for, read out by screen readers.</td>
        </tr>
        <tr>
          <td><code>orientation</code></td>
          <td><code>'horizontal' | 'vertical'</code></td>
          <td><code>'horizontal'</code></td>
          <td>
            The direction the controls run in, and so which arrow keys move between them: Left and Right, or Up and
            Down. A horizontal toolbar fills its width and wraps; a vertical one is as wide as its widest control, and
            stretches the rest to match.
          </td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pencil'</code></td>
          <td>Pen for the bar and the controls in it.</td>
        </tr>
        <tr>
          <td><code>variation</code></td>
          <td><code>'surface' | 'soft' | 'outline' | 'unstyled'</code></td>
          <td><code>'surface'</code></td>
          <td>Visual style of the bar. See Variations below.</td>
        </tr>
        <tr>
          <td><code>loop</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Whether the arrow keys wrap from the last control to the first, and back.</td>
        </tr>
      </tbody>
    </table>

    <h2>Variations</h2>
    <div class="text-ui ui-variations-reference">
      <UtensilBadge variation="surface" scale="giant">Surface</UtensilBadge>
      <UtensilBadge variation="soft" scale="giant">Soft</UtensilBadge>
      <UtensilBadge variation="outline" scale="giant">Outline</UtensilBadge>
      <UtensilBadge scale="giant">Unstyled</UtensilBadge>
    </div>
    <p>
      The <code>unstyled</code> variation draws no bar and drops the padding, for a toolbar laid into its own panel.
    </p>

    <h2>Slots</h2>
    <h3>#default</h3>
    <p>The toolbar's controls, and separators between groups of them.</p>
    <table>
      <thead>
        <tr>
          <th>Scope</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>orientation</code></td>
          <td><code>'horizontal' | 'vertical'</code></td>
          <td>The direction the controls run in.</td>
        </tr>
        <tr>
          <td><code>focusItem(item)</code></td>
          <td><code>(item: HTMLElement) =&gt; void</code></td>
          <td>Moves focus to one of the toolbar's controls, making it the one Tab returns to.</td>
        </tr>
      </tbody>
    </table>

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
          <td><code>focusItem(item)</code></td>
          <td><code>(item: HTMLElement) =&gt; void</code></td>
          <td>Moves focus to one of the toolbar's controls, making it the one Tab returns to.</td>
        </tr>
      </tbody>
    </table>

    <h2>CSS Cvars</h2>
    <table>
      <thead>
        <tr>
          <th>Variable</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>--utensil-toolbar-gap</code></td>
          <td><code>--space-1</code></td>
          <td>Gap between the controls.</td>
        </tr>
        <tr>
          <td><code>--utensil-toolbar-padding</code></td>
          <td><code>--space-1</code>, <code>0</code> when unstyled</td>
          <td>Padding inside the bar.</td>
        </tr>
        <tr>
          <td><code>--utensil-toolbar-radius</code></td>
          <td><code>--radius-3</code> + <code>--space-1</code></td>
          <td>Corner radius of the bar.</td>
        </tr>
        <tr>
          <td><code>--utensil-toolbar-separator-margin</code></td>
          <td><code>--space-1</code></td>
          <td>Space either side of a <code>UtensilToolbarSeparator</code>, along the direction it separates.</td>
        </tr>
      </tbody>
    </table>

    <h2>Child Participation</h2>
    <p>
      The toolbar finds its controls in the DOM rather than registering them, so any control in the default slot takes
      part, native or custom: buttons, links with an <code>href</code>, checkboxes, elements with a <code>button</code>,
      <code>checkbox</code> or <code>switch</code> role, and any element marked <code>data-focusable</code>. A control
      that is <code>disabled</code> or not rendered is skipped; one that is <code>aria-disabled="true"</code> stays a
      stop, so it can be found and its reason read. The toolbar keeps up as controls come and go, are enabled and
      disabled, or shown and hidden. Controls inside another control or inside another widget's content (a popover,
      dialog, menu, listbox, tab list or nested toolbar) are left to it.
    </p>
    <p>
      The toolbar manages its controls' <code>tabindex</code>: the one Tab returns to gets <code>0</code>, the rest
      <code>-1</code>. Fields that use the arrow keys themselves, such as text inputs, selects (a <code>combobox</code>,
      though its trigger is a button) and sliders, aren't among its controls: they keep their own place in the tab order
      and their arrow keys. Arrow keys pressed with a modifier, or during IME composition, are left alone.
    </p>
    <p>
      A radio group (<code>role="radiogroup"</code>, such as <code>UtensilRadioButtons</code>) is one stop of the arrow
      keys, at its checked radio, or its first while none is checked. The arrow keys along the toolbar, Home and End
      move past it; those across it (Up and Down in a horizontal toolbar, Left and Right in a vertical one) are the
      group's, moving between its radios and checking them.
    </p>
    <p>
      <code>UtensilToolbar</code> provides its <code>orientation</code> to children via
      <code>provide</code>/<code>inject</code>.
    </p>

    <h2>UtensilToolbarSeparator</h2>
    <p>
      A rule between groups of a toolbar's controls, across the direction they run in: vertical in a horizontal toolbar,
      horizontal in a vertical one, and drawn in the toolbar's pen. It is a <code>UtensilDivider</code>, with the
      <code>separator</code> role, and is not a stop for the arrow keys.
    </p>

    <h3>Props</h3>
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
          <td><code>orientation</code></td>
          <td><code>'horizontal' | 'vertical'</code></td>
          <td>Across the toolbar's</td>
          <td>The separator's own direction. Outside a toolbar it is vertical by default.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilToolbar ariaLabel="Formatting"&gt;
  &lt;UtensilButton icon="bold" iconOnly label="Bold" variation="text" /&gt;
  &lt;UtensilButton icon="italic" iconOnly label="Italic" variation="text" /&gt;
  &lt;UtensilToolbarSeparator /&gt;
  &lt;UtensilButton icon="link" iconOnly label="Link" variation="text" /&gt;
&lt;/UtensilToolbar&gt;</code></pre>

    <h3>With a Radio Group</h3>
    <pre v-pre><code>&lt;UtensilToolbar ariaLabel="Formatting"&gt;
  &lt;UtensilButton icon="bold" iconOnly label="Bold" variation="text" /&gt;
  &lt;UtensilToolbarSeparator /&gt;
  &lt;UtensilRadioButtons v-model="align" ariaLabel="Alignment"&gt;
    &lt;UtensilRadioButton value="left" icon="align-left" label="Left" /&gt;
    &lt;UtensilRadioButton value="center" icon="align-center" label="Center" /&gt;
  &lt;/UtensilRadioButtons&gt;
&lt;/UtensilToolbar&gt;</code></pre>

    <h3>Vertical, Without a Bar</h3>
    <pre><code>&lt;UtensilToolbar orientation="vertical" variation="unstyled" :loop="false" ariaLabel="Insert a block"&gt;
  &lt;UtensilButton v-for="block in blocks" :key="block.kind" :label="block.label" justify="start" /&gt;
&lt;/UtensilToolbar&gt;</code></pre>

    <h3>With Native and Custom Children</h3>
    <p>
      The custom switch takes part through its role: the toolbar gives it its <code>tabindex</code> and moves focus to
      it with the arrow keys. The width field keeps its own tab stop and its arrow keys.
    </p>
    <pre><code>&lt;UtensilToolbar ariaLabel="Image"&gt;
  &lt;UtensilButton icon="crop" iconOnly label="Crop" variation="text" /&gt;
  &lt;input v-model="width" type="number" aria-label="Width" /&gt;
  &lt;UtensilToolbarSeparator /&gt;
  &lt;div
    role="switch"
    :aria-checked="locked"
    @click="locked = !locked"
    @keydown.space.prevent="locked = !locked"
  &gt;Lock aspect&lt;/div&gt;
&lt;/UtensilToolbar&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
