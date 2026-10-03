<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilDataViz</h1>
    </div>
    <p>
      An SVG chart component supporting 8 chart types with animated transitions, built-in legends, and screen reader
      descriptions. Delegates rendering to specialized sub-components per chart type.
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
          <td><code>type</code></td>
          <td>
            <code>'line' | 'bar' | 'area' | 'donut' | 'radar' | 'scatter' | 'stacked-bar' | 'horizontal-bar'</code>
          </td>
          <td><code>'line'</code></td>
          <td>Chart type to render.</td>
        </tr>
        <tr>
          <td><code>series</code></td>
          <td><code>DataSeries[]</code></td>
          <td>—</td>
          <td>
            Data series to display. Each series has a <code>label</code>, <code>values</code> array, and optional
            <code>xValues</code> array (used by scatter charts).
          </td>
        </tr>
        <tr>
          <td><code>labels</code></td>
          <td><code>string[]</code></td>
          <td>—</td>
          <td>Axis labels. Used by all chart types except donut.</td>
        </tr>
        <tr>
          <td><code>title</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Chart title displayed above the visualization.</td>
        </tr>
        <tr>
          <td><code>showLegend</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Show a color-coded legend below the chart.</td>
        </tr>
        <tr>
          <td><code>showGrid</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Show grid lines. Applies to line, bar, area, scatter, stacked-bar, and horizontal-bar types.</td>
        </tr>
        <tr>
          <td><code>showValues</code></td>
          <td><code>boolean</code></td>
          <td>—</td>
          <td>
            Display numeric values on data points. Applies to line, bar, area, stacked-bar, and horizontal-bar types.
          </td>
        </tr>
        <tr>
          <td><code>animate</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Enable entry animations for chart elements.</td>
        </tr>
        <tr>
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td><code>'Data visualization'</code></td>
          <td>Accessible label for the chart's <code>figure</code> role container.</td>
        </tr>
      </tbody>
    </table>

    <h2>DataSeries Interface</h2>
    <table>
      <thead>
        <tr>
          <th>Property</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td>Display name shown in the legend.</td>
        </tr>
        <tr>
          <td><code>values</code></td>
          <td><code>number[]</code></td>
          <td>Data values. For scatter charts with <code>xValues</code>, these become y-coordinates.</td>
        </tr>
        <tr>
          <td><code>xValues</code></td>
          <td><code>number[]</code></td>
          <td>Optional x-axis values for scatter charts.</td>
        </tr>
      </tbody>
    </table>

    <h2>Chart Types</h2>
    <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Supports Grid</th>
          <th>Supports Values</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>line</code></td>
          <td>Yes</td>
          <td>Yes</td>
          <td>Connected data points with line paths.</td>
        </tr>
        <tr>
          <td><code>bar</code></td>
          <td>Yes</td>
          <td>Yes</td>
          <td>Vertical bar chart with grouped series.</td>
        </tr>
        <tr>
          <td><code>area</code></td>
          <td>Yes</td>
          <td>Yes</td>
          <td>Line chart with filled area beneath.</td>
        </tr>
        <tr>
          <td><code>donut</code></td>
          <td>No</td>
          <td>No</td>
          <td>
            Circular proportional chart. Ignores <code>labels</code>, <code>showGrid</code>, and
            <code>showValues</code>.
          </td>
        </tr>
        <tr>
          <td><code>radar</code></td>
          <td>No</td>
          <td>No</td>
          <td>Multi-axis polygon chart for comparing series across categories.</td>
        </tr>
        <tr>
          <td><code>scatter</code></td>
          <td>Yes</td>
          <td>No</td>
          <td>X/Y scatter plot. Use <code>xValues</code> in series data for positioning.</td>
        </tr>
        <tr>
          <td><code>stacked-bar</code></td>
          <td>Yes</td>
          <td>Yes</td>
          <td>Vertical bars with series stacked on top of each other.</td>
        </tr>
        <tr>
          <td><code>horizontal-bar</code></td>
          <td>Yes</td>
          <td>Yes</td>
          <td>Horizontal bar chart with grouped series.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Line Chart</h3>
    <pre><code>&lt;UtensilDataViz
  type="line"
  :series="[{ label: 'Revenue', values: [12, 19, 14, 25, 22, 30] }]"
  :labels="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']"
  title="Monthly Revenue"
/&gt;</code></pre>

    <h3>Donut Chart</h3>
    <pre><code>&lt;UtensilDataViz
  type="donut"
  :series="[
    { label: 'Direct', values: [42] },
    { label: 'Organic', values: [28] },
    { label: 'Referral', values: [18] },
  ]"
  title="Traffic Sources"
/&gt;</code></pre>

    <h3>Scatter Chart with X Values</h3>
    <pre><code>&lt;UtensilDataViz
  type="scatter"
  :series="[{
    label: 'Group A',
    values: [15, 28, 42, 35],
    xValues: [10, 25, 35, 40],
  }]"
  title="Correlation"
/&gt;</code></pre>

    <h3>Minimal Configuration</h3>
    <pre><code>&lt;UtensilDataViz
  type="bar"
  :series="data"
  :labels="labels"
  :show-grid="false"
  :show-legend="false"
  :animate="false"
  show-values
/&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component - no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
