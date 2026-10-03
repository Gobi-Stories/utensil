<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilUserProfileCard</h1>
      <UtensilPopoverPanel :offset="0">
        <template #trigger="{ toggle }">
          <UtensilBadge class="theme-props-badge" scale="large" @click="toggle">Theme Props</UtensilBadge>
        </template>
        <div class="theme-props-note">
          <span>Create a typed wrapper for your theme. See the Usage Guide.</span>
        </div>
      </UtensilPopoverPanel>
    </div>
    <p>
      A horizontal identity card: an avatar beside the person's name and email, with room for extra content underneath.
      Borderless it doubles as a header inside popovers and panels.
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
          <td><code>name</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>The person's display name. Required.</td>
        </tr>
        <tr>
          <td><code>email</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Email address shown under the name.</td>
        </tr>
        <tr>
          <td><code>src</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Avatar image URL.</td>
        </tr>
        <tr>
          <td><code>alt</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Alt text for the avatar image. Defaults to <code>name</code>.</td>
        </tr>
        <tr>
          <td><code>fallback</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Avatar fallback text when the image is unavailable. Typically initials.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pen'</code></td>
          <td>Theme color applied to the card and avatar.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td><code>1</code></td>
          <td>Relative size scaling.</td>
        </tr>
        <tr>
          <td><code>bordered</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Renders as a <code>surface</code> card. Set <code>false</code> for an unstyled, chrome-free layout.</td>
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
          <td><code>avatar</code></td>
          <td>—</td>
          <td>
            Replaces the built-in avatar entirely. Overrides the <code>src</code>, <code>alt</code>, and
            <code>fallback</code> props.
          </td>
        </tr>
        <tr>
          <td><code>default</code></td>
          <td>—</td>
          <td>Extra content rendered beneath the name and email, such as badges or actions.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilUserProfileCard
  name="Jane Doe"
  email="jane@example.com"
  src="/photo.jpg"
  fallback="JD"
/&gt;</code></pre>

    <h3>Borderless Header with Extra Content</h3>
    <pre><code>&lt;UtensilUserProfileCard name="Jane Doe" email="jane@example.com" :bordered="false"&gt;
  &lt;UtensilBadge color="success"&gt;Admin&lt;/UtensilBadge&gt;
&lt;/UtensilUserProfileCard&gt;</code></pre>

    <h3>Custom Avatar</h3>
    <pre><code>&lt;UtensilUserProfileCard name="Deploy Bot" email="bot@example.com"&gt;
  &lt;template #avatar&gt;
    &lt;UtensilAvatar icon="robot" variation="solid" /&gt;
  &lt;/template&gt;
&lt;/UtensilUserProfileCard&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
