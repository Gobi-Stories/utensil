<template>
  <ReferenceComponentDemo
    title="Scroller"
    anchor="scroller"
    description="Scrollable container with optional envelope indicators to show when content extends beyond the visible area."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content scroller-demo">
          <UtensilScroller class="demo-scroller vertical">
            <div class="scroll-content">
              <div v-for="i in 20" :key="i" class="scroll-item">Item {{ i }}</div>
            </div>
          </UtensilScroller>
        </div>
        <div class="demo-label">Basic Vertical Scroll</div>
        <div class="demo-code">
          <code>&lt;UtensilScroller&gt;&lt;div&gt;Content&lt;/div&gt;&lt;/UtensilScroller&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content scroller-demo">
          <UtensilScroller class="demo-scroller vertical" envelope>
            <div class="scroll-content">
              <div v-for="i in 20" :key="i" class="scroll-item">Item {{ i }}</div>
            </div>
          </UtensilScroller>
        </div>
        <div class="demo-label always-visible">With Envelope</div>
        <div class="demo-code">
          <code>&lt;UtensilScroller :envelope="true"&gt;...&lt;/UtensilScroller&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content scroller-demo">
          <UtensilScroller class="demo-scroller-horizontal" :horizontal="true">
            <div class="scroll-content-horizontal">
              <div v-for="i in 20" :key="i" class="scroll-item-horizontal">Item {{ i }}</div>
            </div>
          </UtensilScroller>
        </div>
        <div class="demo-code">
          <code>&lt;UtensilScroller :horizontal="true"&gt;...&lt;/UtensilScroller&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content scroller-demo">
          <div class="scroller-label">Horizontal + Envelope</div>
          <UtensilScroller class="demo-scroller-horizontal" :horizontal="true" :envelope="true">
            <div class="scroll-content-horizontal">
              <div v-for="i in 20" :key="i" class="scroll-item-horizontal">Item {{ i }}</div>
            </div>
          </UtensilScroller>
        </div>
        <div class="demo-label always-visible">Horizontal with Envelope</div>
        <div class="demo-code">
          <code>&lt;UtensilScroller :horizontal="true" :envelope="true"&gt;...&lt;/UtensilScroller&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilScrollerDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import UtensilScroller from 'utensil-vue/components/scroller/UtensilScroller.vue'
import UtensilScrollerDoc from 'utensil-vue/components/scroller/UtensilScrollerDoc.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
</script>

<style scoped>
.demo-content {
  min-height: 200px;
}

.demo-content.scroller-demo {
  flex-direction: column;
  align-items: stretch;
  padding: var(--space-3);
}

.scroller-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--pencil-11);
  margin-bottom: var(--space-2);
  text-align: center;
}

.demo-scroller {
  height: 240px;
  overflow-y: auto;
}

.demo-scroller-horizontal {
  display: flex;
  max-width: 100%;
  overflow-x: auto;
}

.scroll-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-2);
}

.scroll-content-horizontal {
  display: flex;
  padding: var(--space-2);
  gap: var(--space-2);
}

.scroll-item {
  width: 50%;
  padding: var(--space-2) var(--space-3);
  background-color: var(--pen-8);
  border-radius: var(--radius-2);
  margin-bottom: var(--space-2);
  color: var(--pencil-contrast);
  text-align: center;
}

.scroll-item-horizontal {
  padding: var(--space-2) var(--space-3);
  background-color: var(--pen-a6);
  border-radius: var(--radius-2);
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 80px;
  text-align: center;
}
</style>
