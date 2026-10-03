<template>
  <div id="scale-semantics" class="component-demo scale-semantics scale-doc-section">
    <h3><a class="demo-anchor" href="#scale-semantics">Scale Semantics</a></h3>
    <div class="text-scale-doc-note">
      There are a few scale specific semantic variables. The semantic variables are in the format
      <code>--[instrument]-[semantic]</code>, ie <code>--pen-contrast</code> or <code>--pencil-track</code>
    </div>
    <div class="scale-semantics">
      <h4>contrast</h4>
      <p class="text-scale-doc-note">
        A color guaranteed to contrast with the step 9 color providing contrast for button labels and other controls
        that use a <code>solid</code> UI variation.
      </p>
      <h4>surface</h4>
      <p class="text-scale-doc-note">
        Used by components that implement a <code>surface</code> UI variation which typically consists of a soft
        background and border detail.
      </p>
      <h4>indicator</h4>
      <p class="text-scale-doc-note">
        Clear contrasting indicator used for checked boxes and radios, highlighted tabs and notification dots.
      </p>
      <h4>track</h4>
      <p class="text-scale-doc-note">Used for the track of a slider, progress bar or video scrubber.</p>
      <h4>brand</h4>
      <p class="text-scale-doc-note">
        Used for the brand color of the application. This is the exact color that the generated color scale was based
        on. May be needed to meet brancing guidelines for logo SVGs, etc.
      </p>
    </div>
  </div>
</template>

<style scoped>
.scale-doc-section h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--pencil-11);
  margin-bottom: var(--space-3);
}

.scale-doc-section > .scale-semantics {
  margin-top: var(--space-3);
}
</style>
