import type { Component } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import type { IconProp } from '@gobistories/utensil-vue/theme/utensil-theme'
import type { ReferenceThemeConfig } from '@/theme/reference-theme'

export interface ReferencePage {
  path: string
  title: string
  // Shorter side menu label when the title is too long for the menu
  menuTitle?: string
  icon: IconProp<ReferenceThemeConfig>
  group: 'Theme' | 'Components'
  // Renders without the app shell; the page owns its chrome (header, theme tools, scrolling)
  bare?: boolean
  component: () => Promise<Component>
}

export const referencePages: ReferencePage[] = [
  {
    path: '/showcase',
    title: 'Showcase',
    icon: 'palette',
    group: 'Theme',
    component: () => import('./features/showcase/ShowcasePage.vue'),
  },
  {
    path: '/color-scales',
    title: 'Color Scales',
    icon: 'swatchbook',
    group: 'Theme',
    component: () => import('./features/color-scales/ColorScalesPage.vue'),
  },
  {
    path: '/paper-surfaces',
    title: 'Paper Surfaces',
    menuTitle: 'Paper',
    icon: 'file',
    group: 'Theme',
    bare: true,
    component: () => import('./features/paper-surfaces/PaperSurfacesPage.vue'),
  },
  {
    path: '/ui-variations',
    title: 'UI Variations',
    icon: 'layer-group',
    group: 'Theme',
    component: () => import('./features/ui-variations/UIVariationsPage.vue'),
  },
  {
    path: '/text-themes',
    title: 'Text Themes',
    icon: 'font',
    group: 'Theme',
    component: () => import('./features/text-themes/TextThemesPage.vue'),
  },
  {
    path: '/theme-reactivity',
    title: 'Theme Reactivity',
    menuTitle: 'Reactivity',
    icon: 'reactivity',
    group: 'Theme',
    component: () => import('./features/theme-reactivity/ThemeReactivityPage.vue'),
  },
  {
    path: '/basic-ui',
    title: 'Basic UI',
    icon: 'square',
    group: 'Components',
    component: () => import('./features/basic-ui/BasicUIPage.vue'),
  },
  {
    path: '/content',
    title: 'Content',
    icon: 'align-left',
    group: 'Components',
    component: () => import('./features/content/ContentPage.vue'),
  },
  {
    path: '/inputs',
    title: 'Inputs',
    icon: 'keyboard',
    group: 'Components',
    component: () => import('./features/inputs/InputsPage.vue'),
  },
  {
    path: '/dialogs',
    title: 'Dialogs',
    icon: 'window-maximize',
    group: 'Components',
    component: () => import('./features/dialogs/DialogsPage.vue'),
  },
  {
    path: '/date-pickers',
    title: 'Date Pickers',
    icon: 'calendar',
    group: 'Components',
    component: () => import('./features/date-pickers/DatePickersPage.vue'),
  },
  {
    path: '/layouts',
    title: 'Layouts',
    icon: 'table-cells',
    group: 'Components',
    component: () => import('./features/layouts/LayoutsPage.vue'),
  },
  {
    path: '/progress',
    title: 'Progress',
    icon: 'spinner',
    group: 'Components',
    component: () => import('./features/progress/ProgressPage.vue'),
  },
  {
    path: '/popovers',
    title: 'Popovers',
    icon: 'message',
    group: 'Components',
    component: () => import('./features/popovers/PopoversPage.vue'),
  },
  {
    path: '/navigation',
    title: 'Navigation',
    icon: 'layer-group',
    group: 'Components',
    component: () => import('./features/navigation/NavigationPage.vue'),
  },
  {
    path: '/uploads',
    title: 'Uploads',
    icon: 'upload',
    group: 'Components',
    component: () => import('./features/uploads/UploadsPage.vue'),
  },
  {
    path: '/data-viz',
    title: 'Data Visualization',
    menuTitle: 'Data Viz',
    icon: 'chart-column',
    group: 'Components',
    component: () => import('./features/data-viz/DataVizPage.vue'),
  },
  {
    path: '/media',
    title: 'Media',
    icon: 'photo-film',
    group: 'Components',
    component: () => import('./features/media/MediaPage.vue'),
  },
  {
    path: '/resources',
    title: 'Resources',
    icon: 'list-check',
    group: 'Components',
    component: () => import('./features/resources/ResourcesPage.vue'),
  },
  {
    path: '/extended-library',
    title: 'Extended Library',
    icon: 'cubes',
    group: 'Components',
    component: () => import('./features/extended-library/ExtendedLibraryPage.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/showcase' },
    ...referencePages.map((page) => ({
      path: page.path,
      component: page.component,
      meta: { title: page.title, bare: page.bare },
    })),
  ],
})
