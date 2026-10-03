<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilSideMenu</h1>
    </div>
    <p>
      A responsive navigation side menu built on top of UtensilDrawer. Provides a collapsible menu with logo, scrollable
      content area, and footer slot. Children receive the current drawer mode via slot scope and CSS custom properties.
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
          <td><code>container</code></td>
          <td><code>HTMLElement</code></td>
          <td>—</td>
          <td>Reference element passed to the underlying UtensilDrawer for responsive breakpoint measurement.</td>
        </tr>
        <tr>
          <td><code>startClosed</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>When <code>true</code>, the menu initializes in the closed (collapsed) state.</td>
        </tr>
        <tr>
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Accessible label for the <code>&lt;nav&gt;</code> element.</td>
        </tr>
        <tr>
          <td><code>overlayBreakpoint</code></td>
          <td><code>number</code></td>
          <td><code>818</code></td>
          <td>Container width (px) below which the menu overlays instead of pushing content.</td>
        </tr>
        <tr>
          <td><code>hiddenBreakpoint</code></td>
          <td><code>number</code></td>
          <td><code>576</code></td>
          <td>Container width (px) below which the menu is fully hidden in responsive mode.</td>
        </tr>
        <tr>
          <td><code>ignoreOutsideClickOn</code></td>
          <td><code>string[]</code></td>
          <td><code>[]</code></td>
          <td>
            A set of CSS selectors for elements that should not trigger a light dismiss. Particularly useful for an
            external toggle button that opens and closes the menu, to prevent light dismiss running when the button is
            clicked resulting in a close before the toggle.
          </td>
        </tr>
        <tr>
          <td><code>closeOnClick</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Default for items: close the menu when an item is clicked. Only applies while the menu floats over content
            (at or below <code>overlayBreakpoint</code>) — an inline menu stays open. Individual items can override with
            their own <code>closeOnClick</code>.
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
          <td><code>logo</code></td>
          <td>—</td>
          <td>Logo content displayed in the menu header, next to the toggle button.</td>
        </tr>
        <tr>
          <td><code>default</code></td>
          <td><code>{ mode: SideMenuMode }</code></td>
          <td>Main scrollable menu content. Receives the current drawer mode.</td>
        </tr>
        <tr>
          <td><code>footer</code></td>
          <td><code>{ mode: SideMenuMode }</code></td>
          <td>Footer content pinned below the scrollable area.</td>
        </tr>
      </tbody>
    </table>

    <!-- Exposed -->
    <h2>Exposed API</h2>
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
          <td><code>toggle()</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Toggles the menu open or closed.</td>
        </tr>
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
      </tbody>
    </table>

    <!-- CSS Cvars -->
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
          <td><code>--side-menu-width</code></td>
          <td><code>260px</code></td>
          <td>Width of the menu when open.</td>
        </tr>
        <tr>
          <td><code>--side-menu-collapsed-width</code></td>
          <td><code>57px</code></td>
          <td>Width of the menu when collapsed.</td>
        </tr>
        <tr>
          <td><code>--side-menu-z-index</code></td>
          <td><code>100</code></td>
          <td>Z-index of the menu when overlaying.</td>
        </tr>
        <tr>
          <td><code>--side-menu-padding</code></td>
          <td><code>var(--space-3)</code></td>
          <td>Horizontal padding for menu sections.</td>
        </tr>
        <tr>
          <td><code>--side-menu-header-height</code></td>
          <td><code>var(--space-9)</code></td>
          <td>Height of the menu header area.</td>
        </tr>
        <tr>
          <td><code>--side-menu-header-margin</code></td>
          <td><code>var(--space-2)</code></td>
          <td>Bottom margin of the menu header.</td>
        </tr>
        <tr>
          <td><code>--side-menu-section-margin</code></td>
          <td><code>var(--space-7)</code></td>
          <td>Bottom margin between menu sections.</td>
        </tr>
        <tr>
          <td><code>--side-menu-content-opacity</code></td>
          <td><code>1</code></td>
          <td>Opacity of text and badges. Set to <code>0</code> when collapsed.</td>
        </tr>
        <tr>
          <td><code>--side-menu-icon-opacity</code></td>
          <td><code>1</code></td>
          <td>Opacity of item icons. Set to <code>0</code> when hidden.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Basic Side Menu</h3>
    <pre v-pre><code>&lt;UtensilSideMenu :container="containerRef" aria-label="Main navigation"&gt;
  &lt;template #logo&gt;&lt;img src="logo.svg" /&gt;&lt;/template&gt;
  &lt;template #default="{ mode }"&gt;
    &lt;UtensilSideMenuItem title="Dashboard" icon="home" /&gt;
    &lt;UtensilSideMenuItem title="Settings" icon="gear" /&gt;
  &lt;/template&gt;
&lt;/UtensilSideMenu&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
