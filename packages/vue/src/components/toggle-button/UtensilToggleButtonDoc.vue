<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilToggleButton</h1>
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
      An icon-only toggle button with an optional text label. Wraps UtensilButton with built-in toggle state management
      via
      <code>v-model</code>.
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
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Toggle state. Use with <code>v-model</code>.</td>
        </tr>
        <tr>
          <td><code>icon</code></td>
          <td><code>IconProp</code></td>
          <td>—</td>
          <td>Required. Icon to display in the button.</td>
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
          <td><code>'soft'</code></td>
          <td>
            Visual style for both states. When <code>solid</code>, toggles between <code>solid</code> (on) and
            <code>text</code> (off).
          </td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pen'</code></td>
          <td>Theme color applied to the button in both states.</td>
        </tr>
        <tr>
          <td><code>onVariation</code></td>
          <td><code>UtensilUIVariation</code></td>
          <td>—</td>
          <td>Visual style while on. Falls back to <code>variation</code>.</td>
        </tr>
        <tr>
          <td><code>offVariation</code></td>
          <td><code>UtensilUIVariation</code></td>
          <td>—</td>
          <td>Visual style while off. Falls back to <code>variation</code>.</td>
        </tr>
        <tr>
          <td><code>onColor</code></td>
          <td><code>ColorProp</code></td>
          <td>—</td>
          <td>Theme color while on. Falls back to <code>color</code>.</td>
        </tr>
        <tr>
          <td><code>offColor</code></td>
          <td><code>ColorProp</code></td>
          <td>—</td>
          <td>Theme color while off. Falls back to <code>color</code>.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td><code>1</code></td>
          <td>Relative size scaling.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disable the button and label. Prevents toggling.</td>
        </tr>
        <tr>
          <td><code>round</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Circular button shape.</td>
        </tr>
        <tr>
          <td><code>autofocus</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Focus the button on mount.</td>
        </tr>
        <tr>
          <td><code>role</code></td>
          <td><code>'button' | 'radio'</code></td>
          <td><code>'button'</code></td>
          <td>
            Controls ARIA semantics. <code>button</code> uses <code>aria-pressed</code>, <code>radio</code> uses
            <code>role="radio"</code> with <code>aria-checked</code>.
          </td>
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
          <td><code>boolean</code></td>
          <td>Fires when the toggle state changes. Use with <code>v-model</code>.</td>
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
          <td>Overrides the inner button content. Defaults to <code>label</code> or "Toggle".</td>
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
    <p>
      The <code>solid</code> variation has special behavior: when toggled on, it renders as <code>solid</code>; when
      off, it renders as <code>text</code>. Set <code>onVariation</code>, <code>offVariation</code>,
      <code>onColor</code> and <code>offColor</code> to style each state independently.
    </p>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilToggleButton v-model="bold" icon="bold" /&gt;

&lt;UtensilToggleButton v-model="on" icon="star" label="Favorite" /&gt;</code></pre>

    <h3>Label Position</h3>
    <pre><code>&lt;UtensilToggleButton
  v-model="on"
  icon="bold"
  label="Bold"
  label-position="end"
/&gt;</code></pre>

    <h3>Solid Toggle</h3>
    <pre><code>&lt;UtensilToggleButton
  v-model="liked"
  icon="heart"
  color="error"
  variation="solid"
  round
/&gt;</code></pre>

    <h3>Distinct On and Off States</h3>
    <pre><code>&lt;UtensilToggleButton
  v-model="starred"
  icon="star"
  label="Starred"
  on-variation="solid"
  on-color="pen"
  off-variation="outline"
  off-color="pencil"
/&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
