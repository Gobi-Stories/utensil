<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilDeck</h1>
    </div>
    <p>
      Keyed, animation-agnostic host that swaps a set of presentational children. The active child is chosen by a string
      <code>current</code> id; each child owns its own transition and reports when it has finished. The deck keeps an
      outgoing child mounted until its leave transition ends, so the host never needs to know how a child animates —
      only when it has settled. This decouples <em>which</em> child is shown (business logic) from <em>how</em> it
      animates (the child).
    </p>
    <p>
      The deck derives the mounted set purely from <code>current</code> plus any children still animating out — it does
      not need the full list of children up front. The active child renders first (underneath) and outgoing children
      render last (on top), so a typical push/slide reads correctly without z-index.
    </p>

    <UtensilCallout icon="exclamation-triangle">
      Ensure you set a solid background on the root slide so that the entering slide does not show through during it's
      transition.
    </UtensilCallout>

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
          <td><code>current</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Required. Id of the active child. Changing it transitions to the new child.</td>
        </tr>
        <tr>
          <td><code>appear</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Animate the initially-active child's entrance on first render.</td>
        </tr>
        <tr>
          <td><code>reverse</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Play transitions backwards (rewind). Provided to children via context, so a consumer sets it once on the
            deck rather than on every child. A child may still override with its own
            <code>reverse</code> prop. Drive it from the navigation direction (e.g. <code>true</code>
            when stepping back).
          </td>
        </tr>
        <tr>
          <td><code>transitions</code></td>
          <td><code>'both' | 'enter' | 'leave'</code></td>
          <td><code>'both'</code></td>
          <td>
            Default for children's <code>transitions</code> (see Composition). Standalone children leave this at
            <code>both</code>; it is set per-child when composing layers.
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
          <td><code>{ id, active, appear, reverse, transitions, transitionEnded }</code></td>
          <td>
            Rendered once per mounted id. Pass <code>id</code> and <code>active</code> / <code>appear</code> to a
            transition child; it reports back to the deck automatically through context. A custom (non-built-in) child
            can instead call <code>transitionEnded</code> from slot scope when it has finished. <code>reverse</code> /
            <code>transitions</code> expose the deck's current settings.
          </td>
        </tr>
      </tbody>
    </table>

    <h2>Emits</h2>
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
          <td><code>entered</code></td>
          <td><code>id: string</code></td>
          <td>A child finished transitioning in and is now the active child.</td>
        </tr>
        <tr>
          <td><code>left</code></td>
          <td><code>id: string</code></td>
          <td>A child finished transitioning out and has been unmounted.</td>
        </tr>
      </tbody>
    </table>

    <h2>Child Contract</h2>
    <p>
      Any component can be a deck child — built-in or custom — by following one small contract. The built-in children
      below all implement it via the <code>useDeckTransition</code> composable. A child
      <strong>reports completion by calling the injected <code>transitionEnd(id)</code> callback</strong> rather than
      emitting an event: the deck provides one keyed by id, and a layer re-provides its own wrapper for its children —
      so a layer can't tell whether it is reporting to the deck or to a parent layer, and composition just works.
    </p>
    <table>
      <thead>
        <tr>
          <th>Requirement</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>active: boolean</code> prop</td>
          <td>Animate in when it becomes <code>true</code>, out when it becomes <code>false</code>.</td>
        </tr>
        <tr>
          <td><code>appear?: boolean</code> prop</td>
          <td>Whether to animate the entrance the first time it is shown.</td>
        </tr>
        <tr>
          <td><code>id?: string</code> prop</td>
          <td>
            Passed to <code>transitionEnd</code> so the deck settles the right child.
            <strong>Required on direct deck children</strong>; nested layers leave it unset (a layer reports its own id,
            ignoring the child's).
          </td>
        </tr>
        <tr>
          <td><code>reverse?: boolean</code> prop</td>
          <td>
            Optional. Play the transition backwards. Resolves as
            <em>prop → deck <code>reverse</code> context → <code>false</code></em
            >. Symmetric (fade) and instant children ignore it.
          </td>
        </tr>
        <tr>
          <td><code>transitions?: 'both' | 'enter' | 'leave'</code> prop</td>
          <td>
            Which phases this layer animates (the rest it leaves to a nested child). Resolves as
            <em>prop → deck <code>transitions</code> context → <code>both</code></em
            >. Pairs with <code>reverse</code>: the owned identity is constant across directions. Standalone children
            stay <code>both</code>.
          </td>
        </tr>
        <tr>
          <td><code>childTransitions?: 'both' | 'enter' | 'leave'</code> prop</td>
          <td>
            Declares which phases the <em>nested</em> child animates, so this layer waits for it on a phase it doesn't
            animate itself. Set it on the parent layer when composing (see Composition).
          </td>
        </tr>
      </tbody>
    </table>

    <h2>Built-in Transition Children</h2>
    <p>All are interchangeable — swap one for another without touching the deck or the consumer logic.</p>
    <table>
      <thead>
        <tr>
          <th>Component</th>
          <th>Animation</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>UtensilDeckScale</code></td>
          <td>Symmetric zoom — the incoming scales up from underneath while the outgoing scales back down.</td>
        </tr>
        <tr>
          <td><code>UtensilDeckSlide</code></td>
          <td>Horizontal slide — enters from the end edge, leaves toward the start edge.</td>
        </tr>
        <tr>
          <td><code>UtensilDeckFade</code></td>
          <td>Crossfade (slideshow / gallery).</td>
        </tr>
        <tr>
          <td><code>UtensilDeckFlip</code></td>
          <td>3D card flip around the vertical axis.</td>
        </tr>
        <tr>
          <td><code>UtensilDeckReveal</code></td>
          <td>Incoming child wipes over the outgoing one with an expanding circular reveal.</td>
        </tr>
        <tr>
          <td><code>UtensilDeckInstant</code></td>
          <td>No animation — swaps immediately. Tab-like switching and the reduced-motion baseline.</td>
        </tr>
      </tbody>
    </table>

    <h2>Composition</h2>
    <p>
      Transition children nest. Give each layer a <code>transitions</code> so it owns a phase, and tell the outer layer
      what the inner one does with <code>child-transitions</code>. This composes two primitives into an asymmetric
      effect — e.g. an onboarding push is a scale's entrance with a slide's exit:
    </p>
    <pre
      v-pre
    ><code>&lt;UtensilDeckScale :id="id" :active="active" :appear="appear" transitions="enter" child-transitions="leave"&gt;
  &lt;UtensilDeckSlide :active="active" transitions="leave"&gt;
    &lt;StepContent /&gt;
  &lt;/UtensilDeckSlide&gt;
&lt;/UtensilDeckScale&gt;</code></pre>
    <p>
      A phase settles by priority: the layer's own transition gates it when the layer animates that phase; otherwise the
      child it declares via <code>child-transitions</code> does; otherwise it settles immediately (so a suppressed phase
      with no declared child is instant — no stuck panel). A layer that delegates its exit stays mounted,
      animation-free, until the child reports; a layer that animates its own exit settles on its own (a longer inner
      animation is then truncated — a composition mistake). <code>reverse</code> applies throughout. Only the outermost
      layer needs <code>:id</code>.
    </p>

    <h2>Examples</h2>

    <h3>Onboarding flow</h3>
    <pre v-pre><code>&lt;UtensilDeck :current="steps[index].id"&gt;
  &lt;template #default="{ id, active, appear }"&gt;
    &lt;UtensilDeckScale :id="id" :active="active" :appear="appear"&gt;
      &lt;WelcomeForm v-if="id === 'welcome'" /&gt;
      &lt;DetailsForm v-else-if="id === 'details'" /&gt;
      &lt;ConfirmForm v-else-if="id === 'confirm'" /&gt;
    &lt;/UtensilDeckScale&gt;
  &lt;/template&gt;
&lt;/UtensilDeck&gt;</code></pre>

    <h3>Custom child via slot scope</h3>
    <pre v-pre><code>&lt;UtensilDeck :current="current"&gt;
  &lt;template #default="{ id, active, transitionEnded }"&gt;
    &lt;!-- A non-built-in child can report via slot scope instead of the id prop --&gt;
    &lt;MyCustomTransition :active="active" @done="transitionEnded"&gt;...&lt;/MyCustomTransition&gt;
  &lt;/template&gt;
&lt;/UtensilDeck&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilCallout from '../callout/UtensilCallout.vue'

// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
