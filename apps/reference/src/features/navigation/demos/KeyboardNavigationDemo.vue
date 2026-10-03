<template>
  <div id="keyboard-navigation" class="component-demo">
    <h3><a class="demo-anchor" href="#keyboard-navigation">Keyboard Navigation</a></h3>
    <p>Full keyboard support for accessibility:</p>
    <ul class="keyboard-hints">
      <li><kbd>Tab</kbd> - Move focus to/from the tab list</li>
      <li><kbd>Arrow Left/Right</kbd> - Navigate between tabs (horizontal)</li>
      <li><kbd>Arrow Up/Down</kbd> - Navigate between tabs (vertical)</li>
      <li><kbd>Home</kbd> - Focus first tab</li>
      <li><kbd>End</kbd> - Focus last tab</li>
      <li><kbd>Enter/Space</kbd> - Activate focused tab (manual mode)</li>
    </ul>
  </div>
</template>

<style scoped>
.keyboard-hints {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.keyboard-hints li {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--pencil-11);
}

.keyboard-hints kbd {
  display: inline-block;
  padding: var(--space-1) var(--space-2);
  font-family: ui-monospace, monospace;
  font-size: var(--font-size-1);
  background-color: var(--pencil-3);
  border: 1px solid var(--pencil-6);
  border-radius: var(--radius-2);
  color: var(--pencil-12);
}
</style>
