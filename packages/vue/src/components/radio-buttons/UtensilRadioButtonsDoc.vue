<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilRadioButtons</h1>
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
      A composite radio group that manages single-selection across child <code>UtensilRadioButton</code> items. Provides
      keyboard navigation (arrow keys, Home, End) and roving tabindex. Uses <code>v-model</code> for the selected value.
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
          <td><code>modelValue</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Selected value. Use with <code>v-model</code>.</td>
        </tr>
        <tr>
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Accessible label for the radio group.</td>
        </tr>
        <tr>
          <td><code>variation</code></td>
          <td><code>UtensilUIVariation</code></td>
          <td><code>'soft'</code></td>
          <td>Visual style applied to all child buttons. Excludes <code>solid</code>.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pen'</code></td>
          <td>Theme color applied to all child buttons.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td><code>1</code></td>
          <td>Relative size scaling for all child buttons.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disables the entire group.</td>
        </tr>
        <tr>
          <td><code>round</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Circular button shape for all child buttons.</td>
        </tr>
        <tr>
          <td><code>loop</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Whether keyboard navigation wraps from last to first and vice versa.</td>
        </tr>
        <tr>
          <td><code>showLabels</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Show text labels on child buttons.</td>
        </tr>
      </tbody>
    </table>

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
          <td><code>string</code></td>
          <td>Fires when the selected value changes. Use with <code>v-model</code>.</td>
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
          <td><code>{ value: string, setValue: (v: string) =&gt; void }</code></td>
          <td>Container for <code>UtensilRadioButton</code> children. Scope exposes the current value and a setter.</td>
        </tr>
      </tbody>
    </table>

    <h2>Variations</h2>
    <div class="text-ui ui-variations-reference">
      <UtensilBadge variation="soft" scale="giant">Soft</UtensilBadge>
      <UtensilBadge variation="text" scale="giant">Text</UtensilBadge>
      <UtensilBadge variation="outline" scale="giant">Outline</UtensilBadge>
      <UtensilBadge variation="surface" scale="giant">Surface</UtensilBadge>
      <UtensilBadge variation="overlay" scale="giant">Overlay</UtensilBadge>
    </div>
    <p>The <code>solid</code> variation is excluded from radio buttons.</p>

    <h2>Child Participation</h2>
    <p>
      <code>UtensilRadioButtons</code> provides context to child <code>UtensilRadioButton</code> components via
      <code>provide</code>/<code>inject</code>. Group-level props (variation, color, scale, disabled, round) are
      inherited by children but can be overridden per-button.
    </p>

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
          <td><code>data-value</code></td>
          <td>Set on each radio button. Used by the parent for keyboard navigation and value selection.</td>
        </tr>
      </tbody>
    </table>

    <h3>CSS Cvars from Parent</h3>
    <table>
      <thead>
        <tr>
          <th>Variable</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>--utensil-radio-button-label-display</code></td>
          <td>
            Controls label visibility in child buttons. Set to <code>block</code> when <code>showLabels</code> is true.
          </td>
        </tr>
      </tbody>
    </table>

    <h2>UtensilRadioButton</h2>
    <p>
      Individual radio button child. Must be placed inside <code>UtensilRadioButtons</code>. Renders as an icon-only
      button with an optional text label.
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
          <td><code>value</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Required. The value this button represents.</td>
        </tr>
        <tr>
          <td><code>icon</code></td>
          <td><code>IconProp</code></td>
          <td>—</td>
          <td>Required. Icon to display.</td>
        </tr>
        <tr>
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Optional text label displayed next to the button.</td>
        </tr>
        <tr>
          <td><code>labelPosition</code></td>
          <td><code>'start' | 'end'</code></td>
          <td><code>'start'</code></td>
          <td>Where to place the label relative to the icon button.</td>
        </tr>
        <tr>
          <td><code>variation</code></td>
          <td><code>UtensilUIVariation</code></td>
          <td>—</td>
          <td>Override the group variation for this button. Excludes <code>solid</code>.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pen'</code></td>
          <td>Override the group color for this button.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td>—</td>
          <td>Override the group scale for this button.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disable this specific button.</td>
        </tr>
        <tr>
          <td><code>round</code></td>
          <td><code>boolean</code></td>
          <td>—</td>
          <td>Override the group round for this button.</td>
        </tr>
      </tbody>
    </table>

    <h3>Slots</h3>
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
          <td>Overrides the inner button content. Defaults to <code>label</code> or <code>value</code>.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilRadioButtons v-model="alignment" aria-label="Text alignment"&gt;
  &lt;UtensilRadioButton value="left" icon="align-left" /&gt;
  &lt;UtensilRadioButton value="center" icon="align-center" /&gt;
  &lt;UtensilRadioButton value="right" icon="align-right" /&gt;
&lt;/UtensilRadioButtons&gt;</code></pre>

    <h3>With Labels</h3>
    <pre><code>&lt;UtensilRadioButtons v-model="alignment" aria-label="Alignment" showLabels&gt;
  &lt;UtensilRadioButton value="left" icon="align-left" label="Left" label-position="end" /&gt;
  &lt;UtensilRadioButton value="center" icon="align-center" label="Center" label-position="end" /&gt;
  &lt;UtensilRadioButton value="right" icon="align-right" label="Right" label-position="end" /&gt;
&lt;/UtensilRadioButtons&gt;</code></pre>

    <h3>Custom Variation and Color</h3>
    <pre><code>&lt;UtensilRadioButtons v-model="priority" variation="outline" color="success" round&gt;
  &lt;UtensilRadioButton value="low" icon="arrow-down" /&gt;
  &lt;UtensilRadioButton value="medium" icon="minus" /&gt;
  &lt;UtensilRadioButton value="high" icon="arrow-up" /&gt;
&lt;/UtensilRadioButtons&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
