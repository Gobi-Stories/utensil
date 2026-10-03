<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilReorderableList</h1>
    </div>
    <p>
      Drag-and-drop reordering for arbitrary direct child elements. The list detects the drag, shows placeholders and
      drop markers mid-flight, and reports the outcome through events — the consumer owns the data and re-renders the
      children in the new order. Works with mouse (drag on press and move), touch (long press arms the grab, so taps and
      pans pass through untouched), and keyboard (grab via the slot function, exposed methods, or the opt-in
      <code>keyboardGrab</code> prop). The insertion geometry is row-based, so vertical lists, horizontal lists, and
      wrapped grids all work.
    </p>
    <p>
      Items are identified by a <code>data-reorderable-id</code> attribute on the direct child, falling back to the
      0-based child index. Avoid mixing the two in one list — an explicit id like <code>"3"</code> is indistinguishable
      from the index of an id-less child. Children with <code>draggable="false"</code> cannot be grabbed. Items can be
      dragged between lists that share a group (see <code>UtensilReorderableListGroup</code> or
      <code>provideReorderableGroup()</code>) and a matching <code>namespace</code> — cross-list items must carry an
      explicit id.
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
          <td><code>hideMarkers</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Hides the built-in drop markers. Markers are absolutely positioned overlays and never shift items; near the
            item's own slot they stay hidden until a marker has shown elsewhere in the same flight.
          </td>
        </tr>
        <tr>
          <td><code>noHomeMarkers</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Never marks the item's own slot, even mid-flight. Pair with the home-placeholder slot's
            <code>targeted</code> scope to highlight the home space as the drop target instead.
          </td>
        </tr>
        <tr>
          <td><code>targetPlaceholder</code></td>
          <td><code>boolean | 'animated'</code></td>
          <td><code>false</code></td>
          <td>
            Moves the home placeholder to the drop target instead of showing markers: the vacated space collapses and an
            item-sized placeholder (the home-placeholder slot) opens at the target position, following the drag into
            other group lists. Set it on every list of a group — each list renders its own home-placeholder slot for
            incoming drags. <code>'animated'</code> glides the gaps — the old space shrinks shut while the new one
            grows, so siblings part smoothly (grid row wraps still jump; respects reduced motion). Marker props and
            <code>targetBefore</code>/<code>targetAfter</code> don't apply in this mode.
          </td>
        </tr>
        <tr>
          <td><code>clone</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Ghosts a clone of the grabbed item instead of the moving-placeholder slot (which is ignored). The clone is
            taken after the moving state renders, so classes the consumer derives from <code>state(id)</code> — and the
            <code>data-reorderable-state="moving"</code> attribute — are on it; style the ghost through them.
          </td>
        </tr>
        <tr>
          <td><code>noGrabStyle</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Skips the built-in animated scale-down (inset) styling of the grabbed item.</td>
        </tr>
        <tr>
          <td><code>namespace</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>
            Cross-list compatibility key. Lists in the same group with the same namespace accept each other's items.
          </td>
        </tr>
        <tr>
          <td><code>keyboardGrab</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Grabs a focused item on Enter/Space. Opt-in because it takes those keys over from the item — leave it off
            when items have their own activation behavior and wire the slot's <code>grab</code> function instead.
          </td>
        </tr>
        <tr>
          <td><code>confined</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Keeps the drag on this list when the pointer leaves it — the nearest position is targeted instead of the
            drag reading as invalid. For a list that is the only place to drop, such as a single row the pointer can
            wander above or below.
          </td>
        </tr>
        <tr>
          <td><code>targetItems</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Targets whole items instead of the gaps between them: the item under the pointer takes the drop wherever the
            pointer sits within it, and the grabbed item lands in its place. Pair with <code>hideMarkers</code> and the
            slot's <code>targetOver</code> for rows of tiles, where a line between items doesn't read.
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Events -->
    <h2>Events</h2>
    <p>
      All payloads are <code>{ id, index }</code>. Every <code>grabbed</code> closes with exactly one terminal event:
      <code>dropped</code> (moved within this list), <code>removed</code> + <code>added</code> (moved to another list),
      or <code>canceled</code> (no change).
    </p>
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
          <td><code>grabbed</code></td>
          <td><code>{ id, index }</code></td>
          <td>An item was grabbed; <code>index</code> is its current position.</td>
        </tr>
        <tr>
          <td><code>moving</code></td>
          <td><code>{ id, index }</code></td>
          <td>
            The drop target changed; <code>index</code> is where the item would land if released now. Emitted by the
            list currently under the pointer — during a cross-list drag that is the destination, not the source.
          </td>
        </tr>
        <tr>
          <td><code>dropped</code></td>
          <td><code>{ id, index }</code></td>
          <td>
            The item was dropped at a new position in the same list. Only fires when the position actually changed;
            <code>index</code> is the item's final index after the move.
          </td>
        </tr>
        <tr>
          <td><code>removed</code></td>
          <td><code>{ id, index }</code></td>
          <td>
            The item left this list for another; <code>index</code> is its original position. Fires before
            <code>added</code>.
          </td>
        </tr>
        <tr>
          <td><code>added</code></td>
          <td><code>{ id, index }</code></td>
          <td>An item from another list was dropped into this one at <code>index</code>.</td>
        </tr>
        <tr>
          <td><code>canceled</code></td>
          <td><code>{ id, index }</code></td>
          <td>
            The grab ended without a change — Escape, released at home, or released outside any compatible list.
            <code>index</code> is the item's unchanged position.
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
          <td><code>{ state, targetBefore, targetAfter, targetOver, targetHome, grab }</code></td>
          <td>
            The list items, as direct children. <code>state(id)</code> returns
            <code>'home' | 'grabbed' | 'moving' | 'invalid'</code> for styling (<code>invalid</code> means the item is
            outside every compatible list). <code>targetBefore(id)</code> / <code>targetAfter(id)</code> report whether
            the drop marker sits directly before/after the item, for rendering custom markers.
            <code>targetOver(id)</code> reports whether the drop would take the item's place, for highlighting the
            target item where markers between items don't read. <code>targetHome</code> is true while the drop would
            land the grabbed item back where it came from, for showing its vacated space as the landing spot.
            <code>grab(id)</code> starts a keyboard session. All are reactive.
          </td>
        </tr>
        <tr>
          <td><code>home-placeholder</code></td>
          <td><code>{ targeted }</code></td>
          <td>
            Rendered in the space the item is moving from. Defaults to an empty gap of the item's size. The consumer
            provides content appropriate to the moving item. <code>targeted</code> is true while the current drop target
            is the item's own position — style the placeholder as the target with it (see <code>noHomeMarkers</code>).
          </td>
        </tr>
        <tr>
          <td><code>moving-placeholder</code></td>
          <td>—</td>
          <td>
            Follows the pointer, sized to the item. Defaults to a <code>UtensilSkeleton</code> box of the item's size.
            Ignored when the <code>clone</code> prop is set — the grabbed item's clone takes its place.
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Exposed -->
    <h2>Exposed</h2>
    <table>
      <thead>
        <tr>
          <th>Method</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>grab(id)</code></td>
          <td>Starts a keyboard session for the item (also available in the default slot scope).</td>
        </tr>
        <tr>
          <td><code>drop()</code></td>
          <td>Finishes the active session at the current target.</td>
        </tr>
        <tr>
          <td><code>cancel()</code></td>
          <td>Cancels the active session without a change.</td>
        </tr>
      </tbody>
    </table>

    <h2>Keyboard</h2>
    <p>
      Once an item is grabbed, arrow keys move the drop marker (Up/Down step rows, keeping the horizontal position in
      grids, and cross into neighboring group lists at the edges), Enter or Space drops, and Escape cancels. Escape also
      cancels pointer drags. The list announces these keys to screen readers via
      <code>aria-describedby</code>. After a drop, focus returns to the item if it had focus when grabbed, once the
      consumer has re-rendered, so it can be moved again straight away; this needs a <code>data-reorderable-id</code>,
      as the item's element may have been replaced.
    </p>

    <h2>Touch</h2>
    <p>
      A finger held still for the system long press (500ms) grabs the item; one that moves first pans, one that lifts
      first taps. The browser's own contextmenu is held back during the hold, and a hold lifted without dragging replays
      it on the item at the finger — so a context menu wired to <code>contextmenu</code> opens on a touch long press
      too, after the release and never under a drag.
    </p>

    <h2>Dragging Between Lists</h2>
    <p>
      Wrap the lists in <code>UtensilReorderableListGroup</code> (or call <code>provideReorderableGroup()</code> in a
      common ancestor) and give compatible lists the same <code>namespace</code>. Items need an explicit
      <code>data-reorderable-id</code>. On a cross-list drop the source emits <code>removed</code> and the destination
      emits <code>added</code>; resolving the data move is up to the consumer.
    </p>

    <h2>Scrolling</h2>
    <p>
      Dragging near the edge of a scroll container — the list itself, any scrollable ancestor, or the page —
      auto-scrolls it, innermost first, and keyboard moves keep the marker in view.
    </p>

    <h2>CSS Cvars</h2>
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
          <td><code>--utensil-reorderable-marker-size</code></td>
          <td><code>2px</code> (<code>3px</code> in high contrast)</td>
          <td>Thickness of the built-in drop markers.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Basic Reorder</h3>
    <pre v-pre><code>&lt;UtensilReorderableList @dropped="reorder"&gt;
  &lt;template #default="{ state }"&gt;
    &lt;div
      v-for="item in items"
      :key="item.id"
      :data-reorderable-id="item.id"
      :class="{ lifted: state(item.id) === 'grabbed' }"
    &gt;
      {{ item.label }}
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/UtensilReorderableList&gt;

function reorder({ id, index }: ReorderableEvent) {
  const from = items.value.findIndex((item) =&gt; item.id === id)
  const [moved] = items.value.splice(from, 1)
  items.value.splice(index, 0, moved)
}</code></pre>

    <h3>Custom Placeholders</h3>
    <pre v-pre><code>&lt;UtensilReorderableList @grabbed="active = $event.id" @dropped="reorder"&gt;
  &lt;template #default&gt;...&lt;/template&gt;
  &lt;template #home-placeholder&gt;
    &lt;div class="dashed-outline" /&gt;
  &lt;/template&gt;
  &lt;template #moving-placeholder&gt;
    &lt;ItemCard :item="itemById(active)" /&gt;
  &lt;/template&gt;
&lt;/UtensilReorderableList&gt;</code></pre>

    <h3>Kanban Columns</h3>
    <pre v-pre><code>&lt;UtensilReorderableListGroup&gt;
  &lt;UtensilReorderableList
    v-for="column in columns"
    :key="column.id"
    namespace="cards"
    @dropped="reorderWithin(column, $event)"
    @removed="take(column, $event)"
    @added="place(column, $event)"
  &gt;
    &lt;div v-for="card in column.cards" :key="card.id" :data-reorderable-id="card.id"&gt;...&lt;/div&gt;
  &lt;/UtensilReorderableList&gt;
&lt;/UtensilReorderableListGroup&gt;</code></pre>

    <h3>Custom Markers</h3>
    <pre v-pre><code>&lt;UtensilReorderableList hide-markers&gt;
  &lt;template #default="{ targetBefore, targetAfter }"&gt;
    &lt;div
      v-for="item in items"
      :key="item.id"
      :data-reorderable-id="item.id"
      :class="{ 'drop-before': targetBefore(item.id), 'drop-after': targetAfter(item.id) }"
    &gt;
      {{ item.label }}
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/UtensilReorderableList&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
