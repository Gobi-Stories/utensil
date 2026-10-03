<template>
  <div id="overlays" class="component-demo">
    <h3><a class="demo-anchor" href="#overlays">Overlays</a></h3>
    <p>These scales are designed for overlays and don't change across light and dark theme.</p>

    <div class="alpha-scale-container">
      <!-- Step numbers header -->
      <div class="alpha-labels-wrapper">
        <div class="alpha-labels-spacer"></div>
        <div class="alpha-step-numbers">
          <div class="alpha-step-number">1</div>
          <div class="alpha-step-number">2</div>
          <div class="alpha-step-number">3</div>
          <div class="alpha-step-number">4</div>
          <div class="alpha-step-number">5</div>
          <div class="alpha-step-number">6</div>
          <div class="alpha-step-number">7</div>
          <div class="alpha-step-number">8</div>
          <div class="alpha-step-number">9</div>
          <div class="alpha-step-number">10</div>
          <div class="alpha-step-number">11</div>
          <div class="alpha-step-number">12</div>
        </div>
      </div>

      <!-- Black Alpha row -->
      <div class="alpha-scale-group">
        <div class="alpha-scale-label">Black Alpha</div>
        <div class="alpha-scale-row utensil-checkered-background">
          <div class="alpha-swatch" :style="{ backgroundColor: 'var(--black-a1)' }"></div>
          <div class="alpha-swatch" :style="{ backgroundColor: 'var(--black-a2)' }"></div>
          <div class="alpha-swatch" :style="{ backgroundColor: 'var(--black-a3)' }"></div>
          <div class="alpha-swatch" :style="{ backgroundColor: 'var(--black-a4)' }"></div>
          <div class="alpha-swatch" :style="{ backgroundColor: 'var(--black-a5)' }"></div>
          <div class="alpha-swatch" :style="{ backgroundColor: 'var(--black-a6)' }"></div>
          <div class="alpha-swatch" :style="{ backgroundColor: 'var(--black-a7)' }"></div>
          <div class="alpha-swatch" :style="{ backgroundColor: 'var(--black-a8)' }"></div>
          <div class="alpha-swatch" :style="{ backgroundColor: 'var(--black-a9)' }"></div>
          <div class="alpha-swatch" :style="{ backgroundColor: 'var(--black-a10)' }"></div>
          <div class="alpha-swatch" :style="{ backgroundColor: 'var(--black-a11)' }"></div>
          <div class="alpha-swatch" :style="{ backgroundColor: 'var(--black-a12)' }"></div>
        </div>
      </div>

      <!-- White Alpha row -->
      <div class="alpha-scale-group">
        <div class="alpha-scale-label">White Alpha</div>
        <div class="alpha-scale-row utensil-checkered-background">
          <div class="alpha-swatch" :style="{ backgroundColor: 'var(--white-a1)' }"></div>
          <div class="alpha-swatch" :style="{ backgroundColor: 'var(--white-a2)' }"></div>
          <div class="alpha-swatch" :style="{ backgroundColor: 'var(--white-a3)' }"></div>
          <div class="alpha-swatch" :style="{ backgroundColor: 'var(--white-a4)' }"></div>
          <div class="alpha-swatch" :style="{ backgroundColor: 'var(--white-a5)' }"></div>
          <div class="alpha-swatch" :style="{ backgroundColor: 'var(--white-a6)' }"></div>
          <div class="alpha-swatch" :style="{ backgroundColor: 'var(--white-a7)' }"></div>
          <div class="alpha-swatch" :style="{ backgroundColor: 'var(--white-a8)' }"></div>
          <div class="alpha-swatch" :style="{ backgroundColor: 'var(--white-a9)' }"></div>
          <div class="alpha-swatch" :style="{ backgroundColor: 'var(--white-a10)' }"></div>
          <div class="alpha-swatch" :style="{ backgroundColor: 'var(--white-a11)' }"></div>
          <div class="alpha-swatch" :style="{ backgroundColor: 'var(--white-a12)' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alpha-scale-container {
  margin-top: var(--space-4);
}

.alpha-labels-wrapper {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 12px;
  margin-bottom: var(--space-2);
}

.alpha-step-numbers {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 4px;
}

.alpha-step-number {
  font-size: 0.75rem;
  color: var(--pencil-12);
  text-align: center;
  padding: var(--space-1) 0;
}

.alpha-scale-group {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 12px;
  align-items: center;
  margin-bottom: 4px;
}

.alpha-scale-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--pencil-11);
  text-align: right;
  padding-right: 8px;
}

.alpha-scale-row {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 4px;
  padding: 8px;
  border-radius: 4px;
}

.alpha-swatch {
  aspect-ratio: 1;
  border-radius: 4px;
  border: 1px solid var(--pen-a6);
}

@container size-container (max-width: 551px) {
  .alpha-labels-wrapper {
    grid-template-columns: 1fr;
  }

  .alpha-scale-group {
    grid-template-columns: 1fr;
  }

  .alpha-scale-label {
    display: none;
  }
}
</style>
