<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilCard</h1>
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
      A <code>UtensilBox</code> with a layout for its content: media, a header with an icon, title and description, the
      content, and a footer with actions. Every part is optional and only rendered when given, so boxed content needs no
      layout of its own. In a grid of cards the footer stays at the bottom of each card.
    </p>

    <UtensilCallout icon="exclamation-triangle">
      A card that acts as a whole should be <code>clickable</code>: a button can only hold inline content, and a
      clickable card can't contain other controls either. Give it no actions, or keep the card static and give it a
      stretched link (see below), so the card links as a whole while its actions stay clickable.
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
          <td><code>title</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Heading shown in the header.</td>
        </tr>
        <tr>
          <td><code>titleElement</code></td>
          <td><code>'h1' … 'h6' | 'div'</code></td>
          <td><code>'div'</code></td>
          <td>
            The title's element. Use the heading level that fits the page's outline; a clickable card's title stays a
            <code>div</code>, since a button's content isn't read as headings.
          </td>
        </tr>
        <tr>
          <td><code>description</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Supporting text under the title.</td>
        </tr>
        <tr>
          <td><code>icon</code></td>
          <td><code>IconProp</code></td>
          <td>—</td>
          <td>Icon shown at the start of the header, on a tinted square.</td>
        </tr>
        <tr>
          <td><code>iconColor</code></td>
          <td><code>ColorProp</code></td>
          <td>card's pen</td>
          <td>Color of the header icon.</td>
        </tr>
        <tr>
          <td><code>variation</code></td>
          <td><code>UtensilUIVariation</code></td>
          <td><code>'surface'</code></td>
          <td>Visual style of the box.</td>
        </tr>
        <tr>
          <td><code>mediaBleed</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Media reaches the card's top and side edges, rounded with the card's top corners, instead of sitting inside
            its padding. For image-led cards.
          </td>
        </tr>
        <tr>
          <td><code>footerDivider</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>A divider between the content and the footer, e.g. above metadata.</td>
        </tr>
        <tr>
          <td>
            <code>color</code>, <code>scale</code>, <code>radiusScale</code>, <code>shadow</code>,
            <code>elevation</code>, <code>highlighted</code>, <code>selected</code>, <code>interactive</code>,
            <code>clickable</code>, <code>disabled</code>, <code>wireframe</code>, <code>as</code>
          </td>
          <td colspan="3">As <code>UtensilBox</code>.</td>
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
          <td><code>media</code></td>
          <td>—</td>
          <td>
            Image or video above the header, inset within the card's padding with rounded corners, or to the card's
            edges with <code>mediaBleed</code>. A direct <code>img</code>, <code>video</code> or
            <code>picture</code> fills its width.
          </td>
        </tr>
        <tr>
          <td><code>header</code></td>
          <td>—</td>
          <td>Replaces the icon, title and description.</td>
        </tr>
        <tr>
          <td><code>title</code></td>
          <td>—</td>
          <td>Replaces the title's text inside its element, e.g. with a stretched link.</td>
        </tr>
        <tr>
          <td><code>header-end</code></td>
          <td>—</td>
          <td>Content at the end of the header, such as a badge, a picker or a menu.</td>
        </tr>
        <tr>
          <td><code>default</code></td>
          <td>—</td>
          <td>Card content.</td>
        </tr>
        <tr>
          <td><code>footer</code></td>
          <td>—</td>
          <td>Content at the start of the footer, such as metadata.</td>
        </tr>
        <tr>
          <td><code>actions</code></td>
          <td>—</td>
          <td>Buttons at the end of the footer.</td>
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
          <td><code>--utensil-card-padding</code></td>
          <td><code>var(--space-5)</code></td>
          <td>Padding inside the card.</td>
        </tr>
        <tr>
          <td><code>--utensil-card-radius</code></td>
          <td><code>var(--radius-2)</code></td>
          <td>Corner radius. Content is less round than controls (<code>--radius-3</code>).</td>
        </tr>
        <tr>
          <td><code>--utensil-card-gap</code></td>
          <td><code>var(--space-4)</code></td>
          <td>Space between the media, header, content and footer.</td>
        </tr>
        <tr>
          <td><code>--utensil-card-heading-min-width</code></td>
          <td><code>16rem</code></td>
          <td>Narrowest the title and description get before <code>header-end</code> wraps below them.</td>
        </tr>
        <tr>
          <td><code>--utensil-card-icon-size</code></td>
          <td><code>var(--space-7)</code></td>
          <td>Size of the header icon's square.</td>
        </tr>
        <tr>
          <td><code>--utensil-card-title-size</code></td>
          <td><code>var(--font-size-3)</code></td>
          <td>Font size of the title, for denser or more prominent cards without a scale change.</td>
        </tr>
        <tr>
          <td><code>--utensil-card-title-weight</code></td>
          <td><code>600</code></td>
          <td>Font weight of the title.</td>
        </tr>
        <tr>
          <td><code>--utensil-card-description-size</code></td>
          <td><code>var(--font-size-2)</code></td>
          <td>Font size of the description.</td>
        </tr>
      </tbody>
    </table>

    <h2>Stretched Link</h2>
    <p>
      Give a link in the card the <code>utensil-card-link</code> class, usually in the <code>title</code> slot, and the
      whole card follows it, while the controls in its <code>header-end</code>, content, <code>footer</code> and
      <code>actions</code> stay clickable above it. Any link works, router links included, so middle-click and "open in
      new tab" do too. The link's text names it for assistive technology, and the card shows its focus ring. Add
      <code>interactive</code> for hover feedback. Media sits under the link, so the whole image follows it; content
      positioned after the link stacks above it. A disabled card doesn't follow its link, but the link stays focusable:
      drop it while the card is unavailable.
    </p>

    <h2>Examples</h2>

    <h3>Section</h3>
    <pre><code>&lt;UtensilCard icon="users" title="Members" title-element="h2" description="Who can see this project."&gt;
  &lt;template #header-end&gt;&lt;RolePicker /&gt;&lt;/template&gt;
  &lt;MemberList /&gt;
&lt;/UtensilCard&gt;</code></pre>

    <h3>Choice</h3>
    <pre><code>&lt;UtensilCard
  clickable
  :shadow="2"
  :highlighted="chosen"
  icon="upload"
  icon-color="primary"
  title="Import a file"
  description="Start from a spreadsheet you already have."
  @click="startImport"
&gt;
  &lt;template #footer&gt;Takes a minute&lt;/template&gt;
&lt;/UtensilCard&gt;</code></pre>

    <h3>Linked Card</h3>
    <pre><code>&lt;UtensilCard interactive title-element="h3" description="8 pages" media-bleed footer-divider&gt;
  &lt;template #media&gt;&lt;img :src="cover" alt="" /&gt;&lt;/template&gt;
  &lt;template #title&gt;
    &lt;RouterLink class="utensil-card-link" :to="reportRoute"&gt;Quarterly report&lt;/RouterLink&gt;
  &lt;/template&gt;
  &lt;template #footer&gt;Updated today&lt;/template&gt;
  &lt;template #actions&gt;&lt;UtensilButton icon="share" icon-only label="Share" @click="share" /&gt;&lt;/template&gt;
&lt;/UtensilCard&gt;</code></pre>

    <h3>Media and Actions</h3>
    <pre><code>&lt;UtensilCard title="Quarterly report" title-element="h3" description="8 pages"&gt;
  &lt;template #media&gt;&lt;img :src="cover" alt="" /&gt;&lt;/template&gt;
  &lt;template #actions&gt;
    &lt;UtensilButton label="Open" @click="open" /&gt;
  &lt;/template&gt;
&lt;/UtensilCard&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilCallout from '../callout/UtensilCallout.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
