<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilBox</h1>
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
      A styled container with edges: a background and border from its variation or a shadow border, a highlighted state,
      interactive feedback and a disabled state. It sets no layout for its content; <code>UtensilCard</code> is a box
      with one. Use the <code>unstyled</code> variation for custom styling.
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
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pen'</code></td>
          <td>Theme color applied to the box background and text.</td>
        </tr>
        <tr>
          <td><code>variation</code></td>
          <td><code>UtensilUIVariation</code></td>
          <td><code>'unstyled'</code></td>
          <td>Visual style. See Variations below.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td><code>1</code></td>
          <td>Relative size scaling.</td>
        </tr>
        <tr>
          <td><code>highlighted</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Switches from pencil (muted) to pen (accent) colors across all variations, and gives a shadowed box a pen
            edge on the theme's highlight shadow border.
          </td>
        </tr>
        <tr>
          <td><code>interactive</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Hover, active and focus-ring feedback. It doesn't make the box focusable: render it as a
            <code>button</code> or link with <code>as</code>, make it <code>clickable</code>, or give it a role and
            keyboard handling of its own, as a radio card does.
          </td>
        </tr>
        <tr>
          <td><code>clickable</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            A box that acts as a button when it can't be one, e.g. because it holds block content: a
            <code>button</code> role, keyboard focus, and Enter or Space to click. As on a native button, Enter clicks
            when pressed and Space when released, unless focus moves off first. Implies <code>interactive</code>. Keys
            pressed in a control inside the box are left to the control.
          </td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Muted, without interactive feedback, and blocks clicks. Sets <code>disabled</code> on a native button and
            <code>aria-disabled</code> otherwise. A disabled link drops its <code>href</code>, so middle-click and "open
            in new tab" can't follow it; a router link component renders its own <code>href</code> from <code>to</code>,
            so render a plain box while it's unavailable.
          </td>
        </tr>
        <tr>
          <td><code>shadow</code></td>
          <td><code>1 | 2 | 3 | 4 | 5 | 6</code></td>
          <td>—</td>
          <td>
            Edges and elevation from the theme's <code>--shadow-border-n</code> scale, drawn over the variation's own
            border. An unstyled shadowed box gets a solid panel background. An interactive shadowed box rises two levels
            on hover, and its edge animates to the pen color.
          </td>
        </tr>
        <tr>
          <td><code>elevation</code></td>
          <td><code>1 | 2 | 3 | 4 | 5 | 6</code></td>
          <td>—</td>
          <td>
            Elevation from the theme's <code>--shadow-n</code> scale, without an edge, so the variation keeps its own
            border. Highlighted, it uses the theme's highlight shadows. An unstyled elevated box gets a solid panel
            background, and an interactive one rises two levels on hover. The box becomes a positioned stacking context.
          </td>
        </tr>
        <tr>
          <td><code>selected</code></td>
          <td><code>boolean</code></td>
          <td>—</td>
          <td>
            The chosen state of a box that toggles, in pen colors with the shared <code>.selected</code> styling. Sets
            <code>aria-pressed</code> on a <code>button</code> or <code>clickable</code> box when given.
          </td>
        </tr>
        <tr>
          <td><code>radiusScale</code></td>
          <td><code>RadiusScaleProp</code></td>
          <td>—</td>
          <td>Radius scale applied to the box and its content.</td>
        </tr>
        <tr>
          <td><code>wireframe</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Keeps outline backgrounds transparent on interaction.</td>
        </tr>
        <tr>
          <td><code>as</code></td>
          <td><code>string | Component</code></td>
          <td><code>'div'</code></td>
          <td>
            The element or component to render. An interactive box that acts should be a <code>button</code> (given
            <code>type="button"</code>) or a link (<code>a</code>, or a router link component); other attributes pass
            through to it.
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
          <td>Box content.</td>
        </tr>
      </tbody>
    </table>

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
          <td><code>--utensil-box-padding</code></td>
          <td><code>var(--space-4)</code></td>
          <td>Padding inside the box.</td>
        </tr>
      </tbody>
    </table>

    <h2>Variations</h2>
    <div class="text-ui ui-variations-reference">
      <UtensilBadge variation="solid" scale="giant">Solid</UtensilBadge>
      <UtensilBadge variation="soft" scale="giant">Soft</UtensilBadge>
      <UtensilBadge variation="surface" scale="giant">Surface</UtensilBadge>
      <UtensilBadge variation="outline" scale="giant">Outline</UtensilBadge>
      <UtensilBadge scale="giant">Unstyled</UtensilBadge>
    </div>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilBox variation="surface"&gt;
  &lt;p&gt;Grouped content goes here.&lt;/p&gt;
&lt;/UtensilBox&gt;</code></pre>

    <h3>Semantic Colors</h3>
    <pre><code>&lt;UtensilBox color="success" variation="soft"&gt;
  Operation completed.
&lt;/UtensilBox&gt;

&lt;UtensilBox color="error" variation="outline"&gt;
  Something went wrong.
&lt;/UtensilBox&gt;</code></pre>

    <h3>Highlighted</h3>
    <pre><code>&lt;UtensilBox variation="surface"&gt;
  Default pencil colors (muted).
&lt;/UtensilBox&gt;

&lt;UtensilBox variation="surface" highlighted&gt;
  Highlighted pen colors (accented).
&lt;/UtensilBox&gt;</code></pre>

    <h3>Interactive</h3>
    <pre><code>&lt;UtensilBox as="button" variation="surface" interactive @click="choose"&gt;
  Hoverable box with focus ring.
&lt;/UtensilBox&gt;

&lt;UtensilBox variation="surface" interactive highlighted&gt;
  Interactive and highlighted.
&lt;/UtensilBox&gt;</code></pre>

    <h3>As a Button or Link</h3>
    <pre><code>&lt;UtensilBox as="button" variation="surface" interactive @click="choose"&gt;
  Choose this option.
&lt;/UtensilBox&gt;

&lt;UtensilBox :as="RouterLink" to="/projects/42" variation="surface" interactive&gt;
  Open the project.
&lt;/UtensilBox&gt;</code></pre>

    <h3>Panel with a Shadow Border</h3>
    <pre><code>&lt;UtensilBox :shadow="2"&gt;
  Raised panel content.
&lt;/UtensilBox&gt;

&lt;UtensilBox :shadow="2" highlighted&gt;
  Selected panel, with a pen edge.
&lt;/UtensilBox&gt;</code></pre>

    <h3>Elevated, Keeping the Variation's Border</h3>
    <pre><code>&lt;UtensilBox variation="surface" :elevation="3"&gt;
  Floating content with the surface border.
&lt;/UtensilBox&gt;</code></pre>

    <h3>Toggling Box</h3>
    <pre><code>&lt;UtensilBox as="button" variation="surface" interactive :selected="chosen" @click="chosen = !chosen"&gt;
  Include captions
&lt;/UtensilBox&gt;</code></pre>

    <h3>Clickable Box</h3>
    <pre><code>&lt;UtensilBox clickable :shadow="2" :disabled="!available" @click="choose"&gt;
  &lt;h3&gt;Option&lt;/h3&gt;
  &lt;p&gt;Block content a button can't hold.&lt;/p&gt;
&lt;/UtensilBox&gt;</code></pre>

    <h3>Custom Styling with Unstyled</h3>
    <pre><code>&lt;UtensilBox variation="unstyled" style="box-shadow: var(--shadow-border-3)"&gt;
  Box with custom shadow only.
&lt;/UtensilBox&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
