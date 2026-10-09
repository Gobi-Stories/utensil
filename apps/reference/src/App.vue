<template>
  <ReferenceThemeRoot
    :radius-scale="radiusScale"
    :mode="themeMode"
    :contrast="contrast"
    :reduced-motion="reducedMotion"
  >
    <div v-if="!isBarePage" ref="containerRef" class="utensil-reference-app">
      <ReferenceIoStrip
        class="app-io-strip"
        :active="routeLoad.loading.value"
        color="primary"
        endColor="favorite"
        ariaLabel="Loading page"
      />
      <UtensilSideMenu
        v-if="containerRef"
        ref="sideMenuRef"
        :container="containerRef!"
        aria-label="Design system navigation"
        start-closed
      >
        <template #logo>
          <span class="logo-text brand-pen">Studio</span>
        </template>

        <div v-for="group in menuGroups" :key="group.name" class="menu-section">
          <h3 class="section-title">{{ group.name }}</h3>
          <ReferenceSideMenuItem
            v-for="page in group.pages"
            :key="page.path"
            :title="page.menuTitle ?? page.title"
            :icon="page.icon"
            :selected="route.path === page.path"
            @click="navigate(page)"
          />
        </div>
      </UtensilSideMenu>

      <div class="page-content size-container">
        <header class="topbar">
          <ReferenceButton
            class="menu-toggle"
            variation="text"
            color="pencil"
            icon="bars"
            @click="sideMenuRef?.open()"
            iconOnly
            aria-label="Open menu"
          />
          <h1 class="topbar-title">{{ pageTitle }}</h1>
          <div class="topbar-actions">
            <ThemeEditor
              v-model:pen="penColor"
              v-model:pencil="pencilColor"
              v-model:paper="paperColor"
              v-model:radius-scale="radiusScale"
              v-model:paper-options="paperOptions"
              :presets="referenceColorPresets"
              :primary-colors="referencePrimaryColors"
              :persist="themePersist"
              :showInputs="false"
              @copied="(label) => toasts.add(`Copied ${label}`, { color: 'pen' })"
            />
          </div>
        </header>

        <UtensilScroller ref="scrollerRef" class="content-scroller content-sections">
          <RouterView />
        </UtensilScroller>
      </div>
    </div>

    <!-- Bare pages own their chrome (header, theme tools, scrolling) -->
    <div v-else class="bare-page size-container">
      <RouterView />
    </div>

    <ReferenceToastHost :toasts="toasts.toasts.value" :dismiss="toasts.dismiss" :remove="toasts.remove" />
    <UtensilDialog
      :model-value="dialogIsOpen"
      @update:model-value="dialogIsOpen = $event"
      :title="dialogTitle"
      noCancel
      @ok="referenceDialogOk"
      @closed="referenceDialogClosed"
    >
      {{ dialogMessage }}
    </UtensilDialog>
    <UtensilDialog
      :model-value="confirmIsOpen"
      @update:model-value="confirmIsOpen = $event"
      :title="confirmTitle"
      @ok="referenceConfirmOk"
      @cancel="referenceConfirmCancel"
      @closed="referenceConfirmClosed"
    >
      {{ confirmMessage }}
    </UtensilDialog>
  </ReferenceThemeRoot>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import ReferenceThemeRoot from '@/theme/ReferenceThemeRoot.vue'
import UtensilSideMenu from '@gobistories/utensil-vue/components/side-menu/UtensilSideMenu.vue'
import UtensilScroller from '@gobistories/utensil-vue/components/scroller/UtensilScroller.vue'
import UtensilDialog from '@gobistories/utensil-vue/components/dialogs/UtensilDialog.vue'
import { ReferenceSideMenuItem } from '@/theme/components/ReferenceSideMenuItem'
import { ReferenceButton } from '@/theme/components/ReferenceButton'
import { referenceColorPresets, referencePrimaryColors } from '@/theme/reference-color-presets'
import { toasts } from '@/app/reference-toast'
import {
  dialogIsOpen,
  dialogTitle,
  dialogMessage,
  referenceDialogOk,
  referenceDialogClosed,
} from '@/app/reference-dialog'
import {
  confirmIsOpen,
  confirmTitle,
  confirmMessage,
  referenceConfirmOk,
  referenceConfirmCancel,
  referenceConfirmClosed,
} from '@/app/reference-confirm'
import {
  penColor,
  pencilColor,
  paperColor,
  radiusScale,
  paperOptions,
  themePersist,
  themeMode,
  contrast,
  reducedMotion,
} from '@/app/reference-theme-state'
import ThemeEditor from '@gobistories/utensil-vue/theme-editor/ThemeEditor.vue'
import { ReferenceToastHost } from '@/theme/components/ReferenceToastHost'
import { ReferenceIoStrip } from '@/theme/components/ReferenceIoStrip'
import { useRouteLoading } from '@/app/use-route-loading'
import { referencePages, type ReferencePage } from './router'

const route = useRoute()
const router = useRouter()

const routeLoad = useRouteLoading()

const isBarePage = computed(() => route.meta.bare === true)

// --- Navigation ---

const menuGroups = computed(() =>
  (['Theme', 'Components'] as const).map((name) => ({
    name,
    pages: referencePages.filter((page) => page.group === name),
  })),
)

const pageTitle = computed(() => (typeof route.meta.title === 'string' ? route.meta.title : ''))

// Preserve the theme query when switching pages
function navigate(page: ReferencePage) {
  router.push({ path: page.path, query: route.query })
}

// Pages load lazily, so scroll once the new page has rendered: to the hash target when
// deep-linked, to the top when the page changed.
watch(
  () => route.fullPath,
  async (_, previous) => {
    await nextTick()
    const anchor = route.hash ? document.getElementById(route.hash.slice(1)) : null
    if (anchor) {
      anchor.scrollIntoView()
    } else if (!previous || route.path !== new URL(previous, window.location.origin).pathname) {
      const scroller = scrollerRef.value?.$el as HTMLElement | undefined
      if (scroller) scroller.scrollTop = 0
    }
  },
)

const containerRef = ref<HTMLElement>()
const scrollerRef = ref<InstanceType<typeof UtensilScroller>>()
const sideMenuRef = ref<InstanceType<typeof UtensilSideMenu>>()
</script>

<style>
.utensil-side-menu {
  --side-menu-z-index: 1;
}
</style>

<style scoped>
.utensil-reference-app {
  --min-page-width: 375px;
  --header-height: var(--space-8);
  --side-menu-header-height: var(--header-height);
  --theme-mode-transition-duration: 0.2s;

  /* Used to overlay main menu below a certain width */
  container-type: size;
  container-name: size-container;

  position: relative;
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: var(--pencil-2);
}

.bare-page {
  --theme-mode-transition-duration: 0.2s;

  container-type: size;
  container-name: size-container;

  height: 100vh;
  overflow: hidden;
}

.app-io-strip {
  /* Overlays the top edge of the viewport so it survives page swaps and takes no vertical space. */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

.logo-text {
  font-size: var(--font-size-6);
  font-weight: 700;
  color: var(--pen-9);
}

.page-content {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--background);
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
  min-height: var(--header-height);
  padding: 0 var(--space-4);
  background-color: var(--paper-2);
  border-bottom: 1px solid var(--paper-9);
}

.topbar-title {
  flex: 1;
  margin: 0;
  min-width: 0;
  font-size: var(--font-size-5);
  line-height: calc(var(--header-height));
  color: var(--pencil-12);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-toggle {
  display: none;
  margin-right: var(--space-2);
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.content-scroller {
  flex-grow: 1;
  overflow-y: auto;
}

@container size-container (max-width: 900px) {
  .topbar {
    --theme-editor-labels-display: none;
    --theme-editor-roundness-min-width: auto;
  }
}

@container size-container (max-width: 576px) {
  .topbar-title {
    font-size: var(--font-size-3);
  }

  .menu-toggle {
    margin-right: 0;
  }
}

@container size-container (max-width: 530px) {
  .topbar {
    --theme-editor-roundness-display: none;
  }
}

@media (max-width: 576px) {
  .topbar {
    /* Left padding must match side bar menu header to align the toggle button */
    padding-left: var(--space-3);
    padding-right: var(--space-4);
  }

  .menu-toggle {
    display: flex;
  }
}

@media (max-height: 700px) {
  .utensil-side-menu {
    --side-menu-title-display: none;
  }
}

@media (max-height: 600px) {
  .utensil-side-menu {
    --side-menu-section-margin: 0;
  }
}

@media (max-height: 500px) {
  .utensil-side-menu {
    --side-menu-header-margin: 0;
  }
}
</style>
