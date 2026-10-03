<template>
  <div id="understanding-the-scale" class="component-demo">
    <h3><a class="demo-anchor" href="#understanding-the-scale">Understanding the Scale</a></h3>
    <p>Each color scale follows a consistent pattern optimized for UI design:</p>

    <div class="scale-documentation">
      <div class="scale-doc-section">
        <h4>Steps 1–2: Backgrounds</h4>
        <div class="scale-doc-steps">
          <div class="scale-doc-swatch-group">
            <div class="scale-doc-swatch" style="background-color: var(--pen-1)">1</div>
            <div class="scale-doc-swatch" style="background-color: var(--pen-2)">2</div>
          </div>
        </div>
        <ul>
          <li><strong>Step 1:</strong> App background</li>
          <li><strong>Step 2:</strong> Subtle background</li>
        </ul>
        <p class="scale-doc-note">
          Steps 1 and 2 are designed for app backgrounds and subtle component backgrounds. Step 1 is the lightest and is
          typically used for the main app background. Step 2 is slightly more prominent for nested backgrounds.
        </p>
      </div>

      <div class="scale-doc-section">
        <h4>Steps 3–5: Component Backgrounds</h4>
        <div class="scale-doc-steps">
          <div class="scale-doc-swatch-group">
            <div class="scale-doc-swatch" style="background-color: var(--pen-3)">3</div>
            <div class="scale-doc-swatch" style="background-color: var(--pen-4)">4</div>
            <div class="scale-doc-swatch" style="background-color: var(--pen-5)">5</div>
          </div>
        </div>
        <ul>
          <li><strong>Step 3:</strong> UI element background</li>
          <li><strong>Step 4:</strong> Hovered UI element background</li>
          <li><strong>Step 5:</strong> Active / Selected UI element background</li>
        </ul>
        <p class="scale-doc-note">
          Steps 3, 4, and 5 are designed for UI component backgrounds. These steps are useful for components such as
          buttons (secondary), inputs, checkboxes, and switch controls.
        </p>
      </div>

      <div class="scale-doc-section">
        <h4>Steps 6–8: Borders</h4>
        <div class="scale-doc-steps">
          <div class="scale-doc-swatch-group">
            <div
              class="scale-doc-swatch border-swatch"
              style="background-color: var(--pen-1); border: 2px solid var(--pen-6)"
            >
              6
            </div>
            <div
              class="scale-doc-swatch border-swatch"
              style="background-color: var(--pen-1); border: 2px solid var(--pen-7)"
            >
              7
            </div>
            <div
              class="scale-doc-swatch border-swatch"
              style="background-color: var(--pen-1); border: 2px solid var(--pen-8)"
            >
              8
            </div>
          </div>
        </div>
        <ul>
          <li><strong>Step 6:</strong> Subtle borders and separators</li>
          <li><strong>Step 7:</strong> UI element border and focus rings</li>
          <li><strong>Step 8:</strong> Hovered UI element border</li>
        </ul>
        <p class="scale-doc-note">
          Steps 6, 7, and 8 are designed for borders. Step 6 is designed for subtle borders on components that are not
          intended to have high contrast. Steps 7 and 8 are designed for stronger borders on interactive components.
        </p>
      </div>

      <div class="scale-doc-section">
        <h4>Steps 9–10: Solid Backgrounds</h4>
        <div class="scale-doc-steps">
          <div class="scale-doc-swatch-group">
            <div class="scale-doc-swatch solid-swatch" style="background-color: var(--pen-9)">9</div>
            <div class="scale-doc-swatch solid-swatch" style="background-color: var(--pen-10)">10</div>
          </div>
        </div>
        <ul>
          <li><strong>Step 9:</strong> Solid backgrounds</li>
          <li><strong>Step 10:</strong> Hovered solid backgrounds</li>
        </ul>
        <p class="scale-doc-note">
          Steps 9 and 10 are designed for solid backgrounds. Step 9 has the highest chroma of all steps in the scale and
          is the step you'd typically use for primary buttons. Step 10 is designed for hovered solid backgrounds.
        </p>
      </div>

      <div class="scale-doc-section">
        <h4>Steps 11–12: Text</h4>
        <div class="scale-doc-steps">
          <div class="scale-doc-text-group">
            <div class="scale-doc-text">
              <div class="text-number">11</div>
              <div class="text-example" style="color: var(--pen-11)">The quick brown fox jumps over the lazy dog</div>
            </div>
            <div class="scale-doc-text">
              <div class="text-number">12</div>
              <div class="text-example" style="color: var(--pen-12)">The quick brown fox jumps over the lazy dog</div>
            </div>
          </div>
        </div>
        <ul>
          <li><strong>Step 11:</strong> Low-contrast text</li>
          <li><strong>Step 12:</strong> High-contrast text</li>
        </ul>
        <p class="scale-doc-note">
          Steps 11 and 12 are designed for text. Step 11 is designed for low-contrast text that can be used for
          secondary content. Step 12 is designed for high-contrast text with maximum readability.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scale-documentation {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.scale-doc-section h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--pencil-11);
  margin-bottom: var(--space-3);
}

.scale-doc-steps {
  margin-bottom: var(--space-3);
}

.scale-doc-swatch-group {
  display: flex;
  gap: 4px;
}

.scale-doc-swatch {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--pencil-11);
}

.scale-doc-swatch.solid-swatch {
  color: var(--pen-contrast);
}

.scale-doc-swatch.border-swatch {
  color: var(--pencil-12);
}

.scale-doc-section ul {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-3) 0;
}

.scale-doc-section li {
  padding: var(--space-2) 0;
  color: var(--pencil-11);
}

.scale-doc-section li strong {
  font-weight: 600;
}

.scale-doc-note {
  color: var(--pencil-12);
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
}

.scale-doc-text-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.scale-doc-text {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background-color: var(--surface);
  border-radius: var(--radius-3);
}

.text-number {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--pencil-12);
  min-width: 30px;
}

.text-example {
  font-size: 1rem;
  font-weight: 500;
}
</style>
