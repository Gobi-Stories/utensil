<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilRating</h1>
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
      A rating chosen on a scale, drawn as numbers, smilies or stars. Each point is outlined while it's above the rating
      and filled once it's at or below it, so the rating reads as how far along the scale it reaches. Pointing at a
      point fills up to it, as it would be once chosen. It's a radio group: arrow keys move the rating, and each point
      is read by its number, with the meaning of the scale's ends. Numbers are drawn as circles. With less room than its
      points' full size, each point shrinks to fit, never closer to the next than <code>--space-1</code>.
    </p>
    <p>
      Read-only, the rating may fall between two points, such as an average of 3.4: the point above it fills by the
      fraction it reaches, from the scale's start.
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
          <td><code>v-model</code></td>
          <td><code>number | undefined</code></td>
          <td>—</td>
          <td>
            The chosen rating, undefined until one is chosen. Read-only, it may fall between two points, partly filling
            the point above it.
          </td>
        </tr>
        <tr>
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td>required</td>
          <td>Names the rating for assistive technology.</td>
        </tr>
        <tr>
          <td><code>min</code></td>
          <td><code>number</code></td>
          <td><code>1</code></td>
          <td>The lowest rating.</td>
        </tr>
        <tr>
          <td><code>max</code></td>
          <td><code>number</code></td>
          <td><code>5</code></td>
          <td>The highest rating.</td>
        </tr>
        <tr>
          <td><code>ratingStyle</code></td>
          <td><code>'numbers' | 'smilies' | 'stars'</code></td>
          <td><code>'stars'</code></td>
          <td>
            How each point is drawn. Numbers are outlined above the rating and solid at or below it, and share the
            rating's width. Stars and smilies are outline icons above the rating and filled at or below it. Smilies run
            from very negative to very positive across a scale of any length.
          </td>
        </tr>
        <tr>
          <td><code>minLabel</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>What the lowest rating means, shown under it and read with it.</td>
        </tr>
        <tr>
          <td><code>maxLabel</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>What the highest rating means, shown under it and read with it.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp&lt;Theme&gt;</code></td>
          <td><code>'pen'</code></td>
          <td>Theme color of the filled points.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td>—</td>
          <td>Scale relative to the parent.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disables every point.</td>
        </tr>
        <tr>
          <td><code>readonly</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Shows the rating without letting it be chosen, read as one image: its value to a tenth, or the scale when
            there's none.
          </td>
        </tr>
        <tr>
          <td><code>compact</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Smaller points packed together, without the end labels, which are still read.</td>
        </tr>
        <tr>
          <td><code>wrap</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Points that would shrink below <code>--utensil-rating-min-point-size</code> wrap onto further rows instead,
            the rows as even as the scale allows, so each point stays big enough to choose easily. For a rating to
            answer in narrow places, such as a 0 to 10 scale on a phone.
          </td>
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
          <td><code>number</code></td>
          <td>A point was chosen.</td>
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
          <td><code>--utensil-rating-gap</code></td>
          <td><code>var(--space-1)</code></td>
          <td>Space between the points, never less than <code>var(--space-1)</code>.</td>
        </tr>
        <tr>
          <td><code>--utensil-rating-icon-size</code></td>
          <td><code>var(--font-size-6)</code>, compact <code>var(--font-size-5)</code></td>
          <td>Size of the stars and smilies, at full size.</td>
        </tr>
        <tr>
          <td><code>--utensil-rating-number-size</code></td>
          <td><code>var(--space-7)</code>, compact <code>var(--space-6)</code></td>
          <td>Diameter of the numbers' circles, at full size.</td>
        </tr>
        <tr>
          <td><code>--utensil-rating-min-point-size</code></td>
          <td><code>var(--space-6)</code></td>
          <td>With <code>wrap</code>, the smallest a point shrinks to before the points wrap.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Stars</h3>
    <pre><code>&lt;UtensilRating v-model="rating" label="Rate this story" /&gt;</code></pre>

    <h3>Smilies with the Scale's Meaning</h3>
    <pre><code>&lt;UtensilRating
  v-model="satisfaction"
  label="How satisfied are you?"
  rating-style="smilies"
  min-label="Very dissatisfied"
  max-label="Very satisfied"
/&gt;</code></pre>

    <h3>A Score in a List</h3>
    <pre><code>&lt;UtensilRating :model-value="answer.score" label="Score" readonly compact /&gt;</code></pre>

    <h3>An Average</h3>
    <pre><code>&lt;UtensilRating :model-value="3.4" label="Average score" readonly /&gt;</code></pre>

    <h3>Numbers from 0 to 10</h3>
    <pre><code>&lt;UtensilRating v-model="score" label="How likely are you to recommend us?" rating-style="numbers" :min="0" :max="10" /&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
