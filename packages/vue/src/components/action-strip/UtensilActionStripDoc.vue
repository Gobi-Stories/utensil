<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilActionStrip</h1>
    </div>
    <p>
      Vertical strip of icon actions that becomes a sheet at small widths. At wide widths it renders a fixed-width
      column of app chrome (like <code>UtensilSideMenu</code> but never collapsing); at or below the sheet breakpoint
      the column hides and the <code>v-model:open</code> boolean instead presents the same items as a full-viewport grid
      with room for sheet-only content. Compose with <code>UtensilActionStripItem</code> children in the default slot.
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
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td><code>undefined</code></td>
          <td>Accessible label for the navigation landmark and the sheet dialog.</td>
        </tr>
        <tr>
          <td><code>open</code></td>
          <td><code>boolean</code> (model)</td>
          <td><code>false</code></td>
          <td>
            Whether the sheet form is showing, bound with <code>v-model:open</code>. The consumer's launcher control
            (e.g. a header menu button shown at small widths) opens it; the close button, Escape, and leaving sheet
            widths write it back to <code>false</code>. Only presented at or below the sheet breakpoint.
          </td>
        </tr>
        <tr>
          <td><code>title</code></td>
          <td><code>string</code></td>
          <td><code>undefined</code></td>
          <td>Sheet header title. The brand slot replaces it with custom content.</td>
        </tr>
        <tr>
          <td><code>closeLabel</code></td>
          <td><code>string</code></td>
          <td><code>'Close'</code></td>
          <td>Accessible label for the sheet's close button.</td>
        </tr>
        <tr>
          <td><code>container</code></td>
          <td><code>HTMLElement</code></td>
          <td><code>undefined</code></td>
          <td>
            Reference element measured for the strip/sheet switch. Falls back to <code>window.innerWidth</code> when not
            provided.
          </td>
        </tr>
        <tr>
          <td><code>sheetBreakpoint</code></td>
          <td><code>number</code></td>
          <td><code>576</code></td>
          <td>Width (px) at or below which the strip renders as the sheet form.</td>
        </tr>
      </tbody>
    </table>

    <!-- Slots -->
    <h2>Slots</h2>
    <table>
      <thead>
        <tr>
          <th>Slot</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>default</code></td>
          <td>
            The action items (<code>UtensilActionStripItem</code> or custom elements). Rendered as the strip column at
            wide widths and as the sheet grid at sheet widths.
          </td>
        </tr>
        <tr>
          <td><code>header</code></td>
          <td>Brand mark / logo area at the top of the strip form. Rendered only when provided.</td>
        </tr>
        <tr>
          <td><code>footer</code></td>
          <td>
            Persistent actions pinned to the bottom of the strip form (e.g. compact support and user controls). Rendered
            only when provided.
          </td>
        </tr>
        <tr>
          <td><code>brand</code></td>
          <td>Replaces the title in the sheet header.</td>
        </tr>
        <tr>
          <td><code>sheet</code></td>
          <td>Sheet-only content below the item grid — a labelled user menu, support sections, and the like.</td>
        </tr>
      </tbody>
    </table>

    <!-- Cvars -->
    <h2>CSS Component Variables</h2>
    <table>
      <thead>
        <tr>
          <th>Cvar</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>--utensil-action-strip-width</code></td>
          <td><code>calc(var(--space-9) + var(--space-6))</code></td>
          <td>Width of the strip form (wider than a collapsed side menu).</td>
        </tr>
        <tr>
          <td><code>--utensil-action-strip-header-height</code></td>
          <td><code>var(--space-9)</code></td>
          <td>Height of the strip header and the sheet header.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>App Navigation</h3>
    <pre v-pre><code>&lt;UtensilActionStrip ariaLabel="Main navigation" title="Menu" v-model:open="menuOpen"&gt;
  &lt;template #header&gt;&lt;BrandMark /&gt;&lt;/template&gt;
  &lt;UtensilActionStripItem label="Stories" icon="film" selected /&gt;
  &lt;UtensilActionStripItem label="Assets" icon="images" /&gt;
  &lt;template #footer&gt;&lt;CompactUserMenu /&gt;&lt;/template&gt;
  &lt;template #sheet&gt;&lt;UserMenu /&gt;&lt;SupportLinks /&gt;&lt;/template&gt;
&lt;/UtensilActionStrip&gt;

&lt;!-- Launcher shown at sheet widths, e.g. in a page header --&gt;
&lt;button @click="menuOpen = true"&gt;Menu&lt;/button&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
