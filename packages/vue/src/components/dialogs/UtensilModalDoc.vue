<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilModal</h1>
    </div>
    <p>
      A base modal component built on the native <code>&lt;dialog&gt;</code> element. Provides backdrop, sizing presets,
      and positioning. Use directly for fully custom modal layouts, or use UtensilDialog for a structured dialog with
      header, body, and footer.
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
          <td>Controls modal visibility (v-model binding).</td>
        </tr>
        <tr>
          <td><code>closeOnBackdrop</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Allow closing the modal by clicking the backdrop.</td>
        </tr>
        <tr>
          <td><code>closeOnEscape</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Allow closing the modal by pressing Escape.</td>
        </tr>
        <tr>
          <td><code>appendToDom</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Move the dialog element to the UtensilModalHost to avoid stacking context issues.</td>
        </tr>
        <tr>
          <td><code>fullscreenOnMobile</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Expand the modal to fill the viewport on small screens (below 656px).</td>
        </tr>
        <tr>
          <td><code>size</code></td>
          <td><code>'small' | 'medium' | 'large'</code></td>
          <td><code>'large'</code></td>
          <td>Size preset controlling max width and height of the modal container.</td>
        </tr>
        <tr>
          <td><code>expand</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Expand the modal container to its maximum height.</td>
        </tr>
        <tr>
          <td><code>addHistory</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Push a browser history entry when opened, so the back button closes the modal.</td>
        </tr>
        <tr>
          <td><code>blur</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Blur the page behind the backdrop. Level set by <code>--utensil-modal-backdrop-blur</code>.</td>
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
          <td>Fires when the modal opens or closes (v-model binding).</td>
        </tr>
        <tr>
          <td><code>opened</code></td>
          <td>—</td>
          <td>Fires after the modal has been shown.</td>
        </tr>
        <tr>
          <td><code>closing</code></td>
          <td><code>Event</code></td>
          <td>Fires before closing. Call <code>event.preventDefault()</code> to cancel.</td>
        </tr>
        <tr>
          <td><code>closed</code></td>
          <td>—</td>
          <td>Fires after the modal has fully closed.</td>
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
          <td><code>{ close }</code></td>
          <td>
            Modal content. The <code>close</code> function accepts an optional <code>force</code> boolean to bypass the
            closing event.
          </td>
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
          <td><code>(force?: boolean) =&gt; void</code></td>
          <td>
            Close the modal programmatically. Pass <code>true</code> to force close without triggering the closing
            event.
          </td>
        </tr>
      </tbody>
    </table>

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
          <td><code>--utensil-modal-radius</code></td>
          <td><code>0</code></td>
          <td>Border radius of the modal container.</td>
        </tr>
        <tr>
          <td><code>--utensil-modal-backdrop-blur</code></td>
          <td><code>4px</code></td>
          <td>Backdrop blur amount applied while the <code>blur</code> prop is enabled.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilModal v-model="showModal"&gt;
  &lt;template #default="{ close }"&gt;
    &lt;div class="my-modal-content"&gt;
      &lt;h3&gt;Custom Modal&lt;/h3&gt;
      &lt;p&gt;Build your own layout inside the modal.&lt;/p&gt;
      &lt;UtensilButton @click="close()"&gt;Close&lt;/UtensilButton&gt;
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/UtensilModal&gt;</code></pre>

    <h3>Size and Expand</h3>
    <pre><code>&lt;UtensilModal v-model="showModal" size="medium" :expand="true"&gt;
  &lt;div class="scrollable-content"&gt;
    &lt;!-- Content fills the full modal height --&gt;
  &lt;/div&gt;
&lt;/UtensilModal&gt;</code></pre>

    <h3>Preventing Close</h3>
    <pre><code>&lt;UtensilModal
  v-model="showModal"
  :close-on-backdrop="false"
  @closing="onClosing"
&gt;
  &lt;!-- Call event.preventDefault() in onClosing to keep the modal open --&gt;
&lt;/UtensilModal&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
