<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilNavigationMenu</h1>
    </div>
    <p>
      A composite navigation menu with hover-to-open dropdown content panels, link items with active state, keyboard
      navigation, and directional animation. Supports both controlled and uncontrolled modes.
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
          <td>&#8212;</td>
          <td>Active item value for controlled mode (v-model binding).</td>
        </tr>
        <tr>
          <td><code>defaultValue</code></td>
          <td><code>string</code></td>
          <td>&#8212;</td>
          <td>Initial active item value for uncontrolled mode.</td>
        </tr>
        <tr>
          <td><code>delayDuration</code></td>
          <td><code>number</code></td>
          <td><code>200</code></td>
          <td>Delay in milliseconds before showing content on hover.</td>
        </tr>
        <tr>
          <td><code>skipDelayDuration</code></td>
          <td><code>number</code></td>
          <td><code>300</code></td>
          <td>Duration in milliseconds to skip delay after a recent interaction.</td>
        </tr>
        <tr>
          <td><code>orientation</code></td>
          <td><code>'horizontal' | 'vertical'</code></td>
          <td><code>'horizontal'</code></td>
          <td>Menu layout direction. Affects keyboard navigation and flex direction.</td>
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
          <td><code>string | undefined</code></td>
          <td>Fires when the active item changes (v-model binding). Emits <code>undefined</code> when closed.</td>
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
          <td>
            <code
              >{ activeValue, open, close, toggle, focusItem, cancelPendingOpen, cancelClose, setFocused, isActive
              }</code
            >
          </td>
          <td>Menu items. Scope props enable custom items to participate in menu behavior.</td>
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
          <td><code>close()</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Close the currently open content panel programmatically.</td>
        </tr>
      </tbody>
    </table>

    <h2>Child Participation</h2>
    <p>
      Built-in children (<code>UtensilNavigationMenuItem</code>, <code>UtensilNavigationMenuLink</code>) use
      <code>provide</code>/<code>inject</code> to communicate with the menu. Custom children participate via slot scope
      and data attributes.
    </p>

    <h3>Slots for Children</h3>
    <p>The <code>default</code> slot exposes these functions for custom items:</p>
    <ul>
      <li><code>activeValue</code> &#8212; the currently active item value</li>
      <li><code>open(value)</code> &#8212; open a specific item's content panel</li>
      <li><code>close(value?)</code> &#8212; close a specific item, or all if no value given</li>
      <li><code>toggle(value)</code> &#8212; toggle an item's content panel</li>
      <li><code>focusItem(value, el?)</code> &#8212; focus an item and begin delayed open</li>
      <li><code>cancelPendingOpen(value)</code> &#8212; cancel a pending delayed open</li>
      <li><code>cancelClose()</code> &#8212; cancel the pending close timeout</li>
      <li><code>setFocused(el)</code> &#8212; set keyboard focus on an element</li>
      <li><code>isActive(value)</code> &#8212; check if an item is currently active</li>
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
          <td><code>data-navigation-menu-item</code></td>
          <td>Add to custom item root elements so the menu can discover them for keyboard navigation ordering.</td>
        </tr>
        <tr>
          <td><code>data-value</code></td>
          <td>Set on items with the item's unique value string. Used for DOM-order resolution.</td>
        </tr>
        <tr>
          <td><code>data-focusable</code></td>
          <td>Add to the focusable trigger element inside custom items so keyboard navigation can focus them.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage with Trigger Items and Links</h3>
    <pre><code>&lt;UtensilNavigationMenu&gt;
  &lt;template #default&gt;
    &lt;UtensilNavigationMenuItem value="products"&gt;
      &lt;template #trigger&gt;Products&lt;/template&gt;
      &lt;template #content&gt;
        &lt;div&gt;Product content panel&lt;/div&gt;
      &lt;/template&gt;
    &lt;/UtensilNavigationMenuItem&gt;

    &lt;UtensilNavigationMenuItem value="docs"&gt;
      &lt;UtensilNavigationMenuLink href="/docs" active&gt;
        Documentation
      &lt;/UtensilNavigationMenuLink&gt;
    &lt;/UtensilNavigationMenuItem&gt;
  &lt;/template&gt;
&lt;/UtensilNavigationMenu&gt;</code></pre>

    <h3>With Custom Children</h3>
    <pre><code>&lt;UtensilNavigationMenu&gt;
  &lt;template #default="{ focusItem, cancelPendingOpen, toggle, isActive }"&gt;
    &lt;UtensilNavigationMenuItem value="products"&gt;
      &lt;template #trigger&gt;Products&lt;/template&gt;
      &lt;template #content&gt;...&lt;/template&gt;
    &lt;/UtensilNavigationMenuItem&gt;

    &lt;div
      data-navigation-menu-item
      data-value="custom"
      :class="{ active: isActive('custom') }"
      @mouseenter="focusItem('custom', $event.currentTarget)"
      @mouseleave="cancelPendingOpen('custom')"
    &gt;
      &lt;button data-focusable @click="toggle('custom')"&gt;
        Custom Item
      &lt;/button&gt;
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/UtensilNavigationMenu&gt;</code></pre>

    <hr />

    <div class="doc-header">
      <h1>UtensilNavigationMenuItem</h1>
    </div>
    <p>
      An item within a <code>UtensilNavigationMenu</code>. When a <code>#content</code> slot is provided, renders as a
      trigger button with a dropdown content panel. Otherwise, renders the default slot directly (typically a
      <code>UtensilNavigationMenuLink</code>).
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
          <td><code>value</code></td>
          <td><code>string</code></td>
          <td>&#8212;</td>
          <td>Unique identifier for this item. Required.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disable the item, preventing hover and click interactions.</td>
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
          <td><code>trigger</code></td>
          <td>&#8212;</td>
          <td>Label content for the trigger button. Only rendered when <code>#content</code> is also provided.</td>
        </tr>
        <tr>
          <td><code>content</code></td>
          <td>&#8212;</td>
          <td>Dropdown content panel. When present, the item becomes a trigger with a chevron icon.</td>
        </tr>
        <tr>
          <td><code>default</code></td>
          <td>&#8212;</td>
          <td>
            Direct content when no <code>#content</code> slot is provided (e.g., a
            <code>UtensilNavigationMenuLink</code>).
          </td>
        </tr>
      </tbody>
    </table>

    <hr />

    <div class="doc-header">
      <h1>UtensilNavigationMenuLink</h1>
    </div>
    <p>
      A navigation link used inside <code>UtensilNavigationMenuItem</code>. Renders as an anchor element with active
      page indication and keyboard support.
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
          <td><code>href</code></td>
          <td><code>string</code></td>
          <td>&#8212;</td>
          <td>Link URL.</td>
        </tr>
        <tr>
          <td><code>active</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Whether this link represents the current page. Sets <code>aria-current="page"</code>.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disable the link, preventing click and keyboard interactions.</td>
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
          <td><code>select</code></td>
          <td><code>Event</code></td>
          <td>Fires when the link is clicked. Use to handle SPA navigation or prevent default behavior.</td>
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
          <td>&#8212;</td>
          <td>Link label content.</td>
        </tr>
      </tbody>
    </table>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component.
</script>

<style src="../../utensil-docs.css"></style>
