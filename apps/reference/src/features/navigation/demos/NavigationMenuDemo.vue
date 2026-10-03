<template>
  <ReferenceComponentDemo
    title="Navigation Menu"
    anchor="navigation-menu"
    description="Horizontal navigation with trigger items that open dropdown content panels, links with active state, disabled items, and custom slot items."
  >
    <div class="demo-grid">
      <div class="demo-item demo-item-wide">
        <div class="demo-content demo-content-start nav-menu-demo">
          <div class="nav-demo-area">
            <UtensilNavigationMenu class="demo-nav">
              <template #default="{ focusItem, cancelPendingOpen, toggle, isActive }">
                <UtensilNavigationMenuItem value="getting-started">
                  <template #trigger>Getting Started</template>
                  <template #content>
                    <div class="content-grid">
                      <div class="content-item">
                        <div class="content-item-title">Introduction</div>
                        <div class="content-item-description">Learn the basics and core concepts</div>
                      </div>
                      <div class="content-item">
                        <div class="content-item-title">Installation</div>
                        <div class="content-item-description">Step-by-step setup guide</div>
                      </div>
                    </div>
                  </template>
                </UtensilNavigationMenuItem>

                <UtensilNavigationMenuItem value="components">
                  <template #trigger>Components</template>
                  <template #content>
                    <div class="content-grid">
                      <div class="content-item">
                        <div class="content-item-title">Button</div>
                        <div class="content-item-description">Interactive button component</div>
                      </div>
                      <div class="content-item">
                        <div class="content-item-title">Dialog</div>
                        <div class="content-item-description">Modal dialogs and alerts</div>
                      </div>
                    </div>
                  </template>
                </UtensilNavigationMenuItem>

                <UtensilNavigationMenuItem value="docs">
                  <UtensilNavigationMenuLink href="#" active @select="handleLinkSelect"
                    >Documentation</UtensilNavigationMenuLink
                  >
                </UtensilNavigationMenuItem>

                <UtensilNavigationMenuItem value="disabled" disabled>
                  <template #trigger>Disabled</template>
                  <template #content>
                    <div class="content-simple">This content won't show</div>
                  </template>
                </UtensilNavigationMenuItem>

                <div
                  class="custom-nav-item"
                  :class="{ active: isActive('custom') }"
                  data-navigation-menu-item
                  data-value="custom"
                  @mouseenter="focusItem('custom', $event.currentTarget as HTMLElement)"
                  @mouseleave="cancelPendingOpen('custom')"
                >
                  <button class="custom-trigger" data-focusable type="button" @click="toggle('custom')">Custom</button>
                </div>
              </template>
            </UtensilNavigationMenu>
          </div>
        </div>
        <div class="demo-label">Triggers, Active Link, Disabled &amp; Custom Item</div>
      </div>
    </div>

    <template #api>
      <UtensilNavigationMenuDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import UtensilNavigationMenu from 'utensil-vue/components/navigation-menu/UtensilNavigationMenu.vue'
import UtensilNavigationMenuDoc from 'utensil-vue/components/navigation-menu/UtensilNavigationMenuDoc.vue'
import UtensilNavigationMenuItem from 'utensil-vue/components/navigation-menu/UtensilNavigationMenuItem.vue'
import UtensilNavigationMenuLink from 'utensil-vue/components/navigation-menu/UtensilNavigationMenuLink.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

function handleLinkSelect(event: Event) {
  event.preventDefault()
}
</script>

<style scoped>
.nav-menu-demo {
  min-height: 200px;
}

.nav-demo-area {
  width: 100%;
  padding: var(--space-4);
  background-color: var(--pencil-2);
  border-radius: var(--radius-3);
}

.demo-nav {
  background-color: var(--panel-solid);
  border-radius: var(--radius-3);
  padding: var(--space-2);
  box-shadow: var(--shadow-border-2);
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
  min-width: 280px;
}

.content-item {
  padding: var(--space-3);
  border-radius: var(--radius-2);
  cursor: pointer;
  transition: background-color 0.1s ease;
}

.content-item:hover {
  background-color: var(--pencil-a3);
}

.content-item-title {
  font-weight: 600;
  color: var(--pencil-12);
  margin-bottom: var(--space-1);
}

.content-item-description {
  font-size: var(--font-size-1);
  color: var(--pencil-11);
}

.content-simple {
  padding: var(--space-2);
  color: var(--pencil-11);
}

.custom-nav-item {
  position: relative;
}

.custom-trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  border: 1px dashed var(--pen-8);
  border-radius: var(--radius-2);
  background: var(--pen-a2);
  color: var(--pen-11);
  font-size: var(--font-size-2);
  font-weight: 500;
  line-height: var(--line-height-2);
  cursor: pointer;
  outline: 2px solid transparent;
  outline-offset: -2px;
  transition:
    background-color 0.1s ease,
    color 0.1s ease,
    outline-color 0.1s ease;
}

.custom-trigger:hover {
  background-color: var(--pen-a3);
  color: var(--pen-12);
}

.custom-trigger:focus-visible {
  outline-color: var(--pen-8);
}

.custom-nav-item.active .custom-trigger {
  background-color: var(--pen-a4);
  color: var(--pen-12);
}

.demo-content-start {
  align-items: flex-start;
  justify-content: flex-start;
}

.demo-item-wide {
  grid-column: 1 / -1;
}
</style>
