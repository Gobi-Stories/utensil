<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilColorPicker</h1>
    </div>
    <p>
      Color input backed by the browser's native color picker. By default it renders a clickable swatch with a hex text
      input beside it. Passing <code>colors</code> switches it to a swatch grid of predefined options — with the browser
      picker last as a palette icon — for pickers that offer curated choices (brand colors) while still allowing any
      color. A value picked outside the presets shows on its own swatch before the palette icon.
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
          <td>—</td>
          <td>
            The current color as <code>#rrggbb</code> or <code>#rrggbbaa</code> hex. An alpha pair survives native
            picks.
          </td>
        </tr>
        <tr>
          <td><code>colors</code></td>
          <td><code>ColorPickerOption[]</code></td>
          <td>—</td>
          <td>
            Predefined colors (<code>{ value, name? }</code>). When non-empty, renders the swatch grid instead of the
            swatch and hex input.
          </td>
        </tr>
        <tr>
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Label rendered above the picker, associated with the color input.</td>
        </tr>
        <tr>
          <td><code>showInput</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Shows the hex text input beside the swatch. Not applicable in grid mode.</td>
        </tr>
        <tr>
          <td><code>placeholder</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Placeholder for the hex text input.</td>
        </tr>
        <tr>
          <td><code>size</code></td>
          <td><code>'small' | 'normal'</code></td>
          <td><code>'normal'</code></td>
          <td>Swatch size.</td>
        </tr>
        <tr>
          <td><code>id</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Id for the color input. Generated when omitted.</td>
        </tr>
        <tr>
          <td><code>name</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Form name for the color input.</td>
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
          <td><code>string</code></td>
          <td>Fires with the new hex color on a swatch click, native pick, or hex input change.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilColorPicker v-model="color" label="Color" /&gt;

&lt;UtensilColorPicker v-model="color" :show-input="false" /&gt;</code></pre>

    <h3>Predefined Colors</h3>
    <pre><code>const brandColors = [
  { value: '#2664eb', name: 'Primary' },
  { value: '#10b981', name: 'Secondary' },
]

&lt;UtensilColorPicker v-model="color" :colors="brandColors" label="Color" /&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component.
</script>

<style src="../../utensil-docs.css"></style>
