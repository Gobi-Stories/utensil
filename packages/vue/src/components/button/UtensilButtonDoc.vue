<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilButton</h1>
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
      An interactive button element for triggering actions. Supports icons, loading states, toggle states, and multiple
      visual variations.
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
          <td>Button text. Overridden by default slot.</td>
        </tr>
        <tr>
          <td><code>variation</code></td>
          <td><code>UtensilUIVariation</code></td>
          <td><code>'solid'</code></td>
          <td>Visual style. See Variations below.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pen'</code></td>
          <td>Theme color applied to the button.</td>
        </tr>
        <tr>
          <td><code>icon</code></td>
          <td><code>IconProp</code></td>
          <td>—</td>
          <td>Icon to display alongside or instead of the label.</td>
        </tr>
        <tr>
          <td><code>iconPosition</code></td>
          <td><code>'start' | 'end'</code></td>
          <td><code>'start'</code></td>
          <td>Where to place the icon relative to the label.</td>
        </tr>
        <tr>
          <td><code>iconOnly</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Show only the icon. The label becomes screen-reader text.</td>
        </tr>
        <tr>
          <td><code>round</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Circular shape. Only applies when <code>iconOnly</code> is true.</td>
        </tr>
        <tr>
          <td><code>pressed</code></td>
          <td><code>'pressed' | 'checked' | 'unchecked' | false</code></td>
          <td><code>false</code></td>
          <td>Toggle or checkbox state. Sets <code>aria-pressed</code> or <code>aria-checked</code>.</td>
        </tr>
        <tr>
          <td><code>busy</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Show a spinner and disable interaction.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disable the button.</td>
        </tr>
        <tr>
          <td><code>ariaDisabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Draw the button disabled and set <code>aria-disabled</code>, but keep it focusable and clickable. Use it for
            an action that isn't available yet, where pressing it should say why. It doesn't submit a form.
          </td>
        </tr>
        <tr>
          <td><code>autofocus</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Focus the button on mount.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td><code>1</code></td>
          <td>Relative size scaling.</td>
        </tr>
        <tr>
          <td><code>justify</code></td>
          <td><code>'start' | 'center' | 'end' | 'space-between'</code></td>
          <td><code>'center'</code></td>
          <td>Content alignment within the button.</td>
        </tr>
        <tr>
          <td><code>block</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Expand to full width of the parent.</td>
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
          <td><code>click</code></td>
          <td><code>MouseEvent</code></td>
          <td>
            Fires on click. Suppressed when <code>disabled</code> or <code>busy</code>, but not when
            <code>ariaDisabled</code>.
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
          <td>—</td>
          <td>Button label content. Overrides the <code>label</code> prop.</td>
        </tr>
      </tbody>
    </table>

    <h2>Variations</h2>
    <div class="text-ui ui-variations-reference">
      <UtensilBadge variation="solid" scale="giant">Solid</UtensilBadge>
      <UtensilBadge variation="soft" scale="giant">Soft</UtensilBadge>
      <UtensilBadge variation="text" scale="giant">Text</UtensilBadge>
      <UtensilBadge variation="outline" scale="giant">Outline</UtensilBadge>
      <UtensilBadge variation="surface" scale="giant">Surface</UtensilBadge>
      <UtensilBadge variation="overlay" scale="giant">Overlay</UtensilBadge>
    </div>

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
          <td><code>--utensil-button-font-size</code></td>
          <td><code>--font-size-2</code></td>
          <td>Override the button's font size.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilButton label="Save" /&gt;

&lt;UtensilButton color="error" variation="soft"&gt;
  Delete
&lt;/UtensilButton&gt;</code></pre>

    <h3>Icon Button</h3>
    <pre><code>&lt;UtensilButton icon="pencil" iconOnly label="Edit" /&gt;

&lt;UtensilButton icon="arrow-right" iconPosition="end"&gt;
  Continue
&lt;/UtensilButton&gt;</code></pre>

    <h3>Toggle Button</h3>
    <pre><code>&lt;UtensilButton
  :pressed="isActive ? 'pressed' : false"
  variation="text"
  icon="bold"
  iconOnly
  label="Bold"
  @click="isActive = !isActive"
/&gt;</code></pre>

    <h3>Not Ready Yet</h3>
    <pre><code>&lt;UtensilButton
  label="Continue"
  :aria-disabled="!ready"
  @click="ready ? next() : explainWhy()"
/&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
