<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilDrawer</h1>
    </div>
    <p>
      A collapsible side panel that supports responsive overlaying, inline flow, light dismiss, configurable
      transitions, and optional mobile bottom or full sheet modes. Open state is available as a
      <code>v-model:open</code> boolean — every internal change (methods, light dismiss, exclusivity) writes back
      through the model — with imperative methods exposed as an alternative. With <code>exclusive</code>, the drawer
      joins the surrounding <code>provideExclusiveView()</code> context so only one member shows at a time.
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
          <td>
            Reference element used to measure container width for responsive breakpoints. Falls back to
            <code>window.innerWidth</code> when not provided.
          </td>
        </tr>
        <tr>
          <td><code>position</code></td>
          <td><code>'start' | 'end'</code></td>
          <td><code>'start'</code></td>
          <td>Which side of the container the drawer appears on (inline start or end).</td>
        </tr>
        <tr>
          <td><code>overlay</code></td>
          <td><code>'responsive' | 'always'</code></td>
          <td><code>'responsive'</code></td>
          <td>
            <code>'responsive'</code> takes inline space at wide viewports and overlays at narrow viewports.
            <code>'always'</code> always overlays without taking inline space.
          </td>
        </tr>
        <tr>
          <td><code>width</code></td>
          <td><code>string</code></td>
          <td><code>'260px'</code></td>
          <td>Width of the drawer when open. Sets the <code>--utensil-drawer-width</code> CSS cvar.</td>
        </tr>
        <tr>
          <td><code>collapsedWidth</code></td>
          <td><code>string</code></td>
          <td><code>'0px'</code></td>
          <td>
            Width of the drawer when collapsed (closed in responsive mode). Sets the
            <code>--utensil-drawer-collapsed-width</code> CSS cvar.
          </td>
        </tr>
        <tr>
          <td><code>startClosed</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>When <code>true</code>, the drawer initializes in the closed state instead of responsive.</td>
        </tr>
        <tr>
          <td><code>overlayBreakpoint</code></td>
          <td><code>number</code></td>
          <td><code>818</code></td>
          <td>Container width (px) below which the responsive overlay behaviour activates.</td>
        </tr>
        <tr>
          <td><code>hiddenBreakpoint</code></td>
          <td><code>number</code></td>
          <td><code>576</code></td>
          <td>Container width (px) below which the drawer is fully hidden in responsive mode.</td>
        </tr>
        <tr>
          <td><code>open</code></td>
          <td><code>boolean</code> (model)</td>
          <td>—</td>
          <td>
            Reactive open state, bound with <code>v-model:open</code>. Drives the drawer when set, and receives every
            internal state change. When never provided the drawer manages state internally as before.
          </td>
        </tr>
        <tr>
          <td><code>exclusive</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Joins the surrounding exclusive view context (see <code>provideExclusiveView()</code>): opening this drawer
            closes the other members, and another member opening closes this drawer. Requires a provided context.
          </td>
        </tr>
        <tr>
          <td><code>inline</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Replaces the overlay mechanic: the drawer participates in the layout flow, pushing sibling content while
            open and clipping to zero width when closed. Combine with <code>fullSheet</code> for a mobile sheet form.
          </td>
        </tr>
        <tr>
          <td><code>mobileSheet</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>When <code>true</code>, renders as a bottom sheet at narrow container widths instead of a side panel.</td>
        </tr>
        <tr>
          <td><code>fullSheet</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Mobile sheet that covers the entire viewport instead of the standard partial-height bottom sheet.</td>
        </tr>
        <tr>
          <td><code>transition</code></td>
          <td><code>'open' | 'close' | 'always' | 'none'</code></td>
          <td><code>'close'</code></td>
          <td>Controls when slide/width transitions animate. <code>'none'</code> disables all transitions.</td>
        </tr>
        <tr>
          <td><code>slide</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Only meaningful with <code>overlay="responsive"</code>. When <code>true</code>, the drawer keeps the panel
            at its full width when closing — the outer container reduces to <code>0</code> and the panel is clipped via
            <code>overflow: hidden</code>, so panel content never reflows. At narrow viewports it falls back to a true
            overlay (transform-based slide off-screen) so it doesn't squeeze sibling content.
          </td>
        </tr>
        <tr>
          <td><code>lightDismiss</code></td>
          <td><code>'never' | 'overlay' | 'always'</code></td>
          <td><code>'overlay'</code></td>
          <td>
            Controls when an outside press closes the drawer. <code>'never'</code> disables outside-click dismissal.
            <code>'overlay'</code> closes only while the drawer is overlaying (always for <code>overlay="always"</code>;
            for <code>overlay="responsive"</code> only at container widths at or below <code>overlayBreakpoint</code>).
            <code>'always'</code> closes on any outside press while open, including when the drawer is taking inline
            space. A dismissing press only ever dismisses — its events are swallowed so the element under the pointer is
            not activated; the next click interacts with the page normally. A press inside an open dialog the drawer
            isn't part of belongs to that higher layer and never dismisses.
          </td>
        </tr>
        <tr>
          <td><code>lightDismissThrough</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Lets a dismissing press through to the page instead of swallowing it — the press that closes the drawer also
            acts on the element underneath, so an interaction like a drag can start on the same press.
          </td>
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
          <td><code>closeOnEscape</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Escape pressed anywhere within the open drawer closes it, fields included. A key an inner element handles
            first (a menu or select closing) and an open popover inside keep their Escape.
          </td>
        </tr>
        <tr>
          <td><code>focusOnOpen</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Opening (or mounting open) moves focus to the drawer's panel unless focus is already inside, so the keyboard
            carries on in the drawer the user just opened: the next Tab reaches its first control.
          </td>
        </tr>
        <tr>
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>
            Accessible label for the drawer, which makes it a region landmark. A drawer closed out of sight is inert —
            out of the tab order and the accessibility tree — while a collapsed strip stays usable.
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
          <td><code>default</code></td>
          <td><code>{ open, close, toggle, mode, everOpened }</code></td>
          <td>
            Content rendered inside the drawer panel. <code>everOpened</code> is <code>true</code> from the first open
            onward — gate heavy content on it to mount lazily but keep state across closes.
          </td>
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
          <td><code>() => void</code></td>
          <td>
            Toggles the drawer. From responsive state, opens at narrow viewports or closes at wide viewports based on
            the overlay breakpoint.
          </td>
        </tr>
        <tr>
          <td><code>open()</code></td>
          <td><code>() => void</code></td>
          <td>Opens the drawer.</td>
        </tr>
        <tr>
          <td><code>close()</code></td>
          <td><code>() => void</code></td>
          <td>Closes the drawer. The closed state persists across viewport changes.</td>
        </tr>
        <tr>
          <td><code>mode</code></td>
          <td><code>Ref&lt;'open' | 'closed' | 'responsive'&gt;</code></td>
          <td>Reactive reference to the current drawer state.</td>
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
          <td><code>--utensil-drawer-width</code></td>
          <td><code>260px</code></td>
          <td>Width of the drawer when open.</td>
        </tr>
        <tr>
          <td><code>--utensil-drawer-collapsed-width</code></td>
          <td><code>0px</code></td>
          <td>Width of the drawer when collapsed.</td>
        </tr>
        <tr>
          <td><code>--utensil-drawer-z-index</code></td>
          <td><code>100</code></td>
          <td>Z-index of the drawer panel when overlaying.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Basic Side Drawer</h3>
    <pre v-pre><code>&lt;UtensilDrawer ref="drawer" aria-label="Navigation"&gt;
  &lt;nav&gt;Menu content&lt;/nav&gt;
&lt;/UtensilDrawer&gt;

&lt;button @click="drawer.toggle()"&gt;Toggle&lt;/button&gt;</code></pre>

    <h3>Always Overlay</h3>
    <pre v-pre><code>&lt;UtensilDrawer overlay="always" width="300px"&gt;
  &lt;aside&gt;Overlay panel&lt;/aside&gt;
&lt;/UtensilDrawer&gt;</code></pre>

    <h3>With Collapsed Strip</h3>
    <pre v-pre><code>&lt;UtensilDrawer collapsed-width="48px" start-closed&gt;
  &lt;UtensilSideMenu&gt;...&lt;/UtensilSideMenu&gt;
&lt;/UtensilDrawer&gt;</code></pre>

    <h3>Modeled Exclusive Surfaces</h3>
    <pre v-pre><code>// An ancestor provides the context: provideExclusiveView()
&lt;UtensilDrawer v-model:open="stickersOpen" exclusive overlay="always" fullSheet&gt;...&lt;/UtensilDrawer&gt;
&lt;UtensilDrawer v-model:open="musicOpen" exclusive overlay="always" fullSheet&gt;...&lt;/UtensilDrawer&gt;</code></pre>

    <h3>Inline Panel, Full Sheet on Mobile</h3>
    <pre v-pre><code>&lt;UtensilDrawer v-model:open="editorOpen" inline fullSheet transition="always" width="40%"&gt;
  &lt;section&gt;Editor panel&lt;/section&gt;
&lt;/UtensilDrawer&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
