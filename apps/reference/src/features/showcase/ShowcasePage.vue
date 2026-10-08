<template>
  <!-- Showcase UI -->
  <div class="showcase-page">
    <UtensilMaximizer class="showcase-maximize">
      <ReferenceTheme pen="custom-pen" pencil="custom-pencil" class="showcase-container">
        <!-- Left Sidebar -->
        <aside class="showcase-sidebar utensil-calculate">
          <div class="sidebar-header">
            <span class="sidebar-logo">Studio</span>
          </div>

          <div class="sidebar-section">
            <span class="sidebar-section-title">Navigation</span>
            <ReferenceSideMenuItem icon="inbox" title="Inbox" :selected="isSelected('inbox')" @click="select('inbox')">
              <template #badge>
                <UtensilFader :show="newInbox" :fadeIn="false">
                  <ReferenceBadge variation="solid" rounded>New</ReferenceBadge>
                </UtensilFader>
              </template>
            </ReferenceSideMenuItem>
            <ReferenceSideMenuItem
              icon="star"
              title="Starred"
              :selected="isSelected('starred')"
              iconColor="favorite"
              @click="select('starred')"
            />
            <ReferenceSideMenuItem
              icon="file"
              title="Drafts"
              :selected="isSelected('drafts')"
              @click="select('drafts')"
            />
            <ReferenceSideMenuItem
              icon="tags"
              title="Labels"
              :selected="isSelected('labels')"
              @click="select('labels')"
            >
              <template #badge>
                <ReferenceBadge variation="soft" color="warning" rounded>Beta</ReferenceBadge>
              </template>
            </ReferenceSideMenuItem>
          </div>

          <div class="sidebar-section">
            <span class="sidebar-section-title">Workspace</span>
            <ReferenceSideMenuItem
              icon="cubes"
              title="Projects"
              :selected="isSelected('projects')"
              @click="select('projects')"
            >
              <template #badge>
                <ReferenceBadge variation="surface" color="blue" rounded>Pro</ReferenceBadge>
              </template>
            </ReferenceSideMenuItem>
            <ReferenceSideMenuItem
              icon="database"
              title="Storage"
              :selected="isSelected('storage')"
              @click="select('storage')"
            />
            <ReferenceSideMenuItem
              icon="cog"
              title="Settings"
              :selected="isSelected('settings')"
              @click="select('settings')"
            />
          </div>

          <div class="sidebar-spacer"></div>

          <div class="sidebar-section">
            <ReferenceCallout icon="info-circle" variation="soft" color="success" center>
              <span>New version available!</span>
            </ReferenceCallout>
          </div>

          <div class="sidebar-section">
            <UtensilDivider />
          </div>

          <div class="sidebar-footer">
            <UtensilBox
              class="sidebar-user"
              :variation="profileSelected('kara') ? 'surface' : 'unstyled'"
              @click="selectProfile('kara')"
            >
              <ReferenceAvatar fallback="KL" :variation="profileSelected('kara') ? 'solid' : 'soft'" radius="medium" />
              <div class="user-info">
                <span class="user-name">Kara Lindqvist</span>
                <span class="user-email">kara@example.com</span>
              </div>
            </UtensilBox>
            <UtensilBox
              class="sidebar-user"
              :variation="profileSelected('theo') ? 'surface' : 'unstyled'"
              @click="selectProfile('theo')"
            >
              <ReferenceAvatar
                fallback="TM"
                :variation="profileSelected('theo') ? 'solid' : 'soft'"
                color="error"
                radius="medium"
              />
              <div class="user-info">
                <span class="user-name">Theo Marsh</span>
                <span class="user-email">theo@example.com</span>
              </div>
            </UtensilBox>
            <UtensilBox
              class="sidebar-user"
              :variation="profileSelected('dana') ? 'surface' : 'unstyled'"
              @click="selectProfile('dana')"
            >
              <ReferenceAvatar
                fallback="DG"
                :variation="profileSelected('dana') ? 'solid' : 'soft'"
                color="warning"
                radius="medium"
              />
              <div class="user-info">
                <span class="user-name">Dana Grant</span>
                <span class="user-email">dana@example.com</span>
              </div>
            </UtensilBox>
            <UtensilBox
              class="sidebar-user"
              :variation="profileSelected('june') ? 'surface' : 'unstyled'"
              @click="selectProfile('june')"
            >
              <ReferenceAvatar
                fallback="JG"
                :variation="profileSelected('june') ? 'solid' : 'soft'"
                color="favorite"
                radius="medium"
              />
              <div class="user-info">
                <span class="user-name">June Garcia</span>
                <span class="user-email">june@example.com</span>
              </div>
            </UtensilBox>
          </div>
        </aside>

        <!-- Center Content - Demo Showcase -->
        <main
          class="showcase-main"
          :class="{
            animated: enableAnimations,
            'scroll-vertical': currentDemo.scroll === 'vertical',
            'scroll-horizontal': currentDemo.scroll === 'horizontal',
          }"
          tabindex="0"
          @keydown.left.prevent="previousDemo"
          @keydown.right.prevent="nextDemo"
        >
          <ReferenceTechnoRefinedBackground
            class="showcase-background"
            :class="{ hidden: !enableAnimations }"
            :playing="enableAnimations && themeReducedMotion !== 'reduced'"
          />

          <ReferenceBox class="showcase-card" :variation="enableAnimations ? 'unstyled' : 'surface'">
            <UtensilComponentLoader :path="currentPath" :modules="demoModules">
              <SignUpFormDemo />
            </UtensilComponentLoader>
          </ReferenceBox>

          <div class="showcase-paginator">
            <ReferenceCircleButton icon="chevron-left" variation="text" scale="small" @click="previousDemo" />
            <span class="paginator-label">{{ currentIndex + 1 }} / {{ demoManifest.length }}</span>
            <ReferenceCircleButton icon="chevron-right" variation="text" scale="small" @click="nextDemo" />
          </div>
        </main>

        <!-- Right Panel -->
        <aside class="showcase-panel utensil-calculate">
          <UtensilTabs v-model="activeTab" class="panel-tabs">
            <ReferenceTabsList>
              <UtensilTabsTrigger value="actions">Actions</UtensilTabsTrigger>
              <UtensilTabsTrigger value="themes">Themes</UtensilTabsTrigger>
              <UtensilTabsTrigger value="preview">Preview</UtensilTabsTrigger>
              <UtensilTabsTrigger value="colors">Colors</UtensilTabsTrigger>
            </ReferenceTabsList>

            <div class="tab-content">
              <!-- Dropdown Menu -->
              <div class="panel-section">
                <div class="flex nowrap space-between">
                  <ReferenceButton variation="solid" size="small" @click="workModal = true">Work</ReferenceButton>
                  <ReferenceButton variation="soft" size="small" @click="playModal = true">Play</ReferenceButton>
                  <ReferenceButton variation="outline" size="small" @click="sleepModal = true">Sleep</ReferenceButton>
                  <UtensilDropdownMenu>
                    <template #trigger="{ toggle, isOpen }">
                      <ReferenceButton
                        variation="text"
                        icon="ellipsis-v"
                        iconPosition="end"
                        @click="toggle"
                        :class="{ 'is-active': isOpen }"
                      >
                        Menu
                      </ReferenceButton>
                    </template>
                    <template #default="{ close }">
                      <ReferenceMenuItem icon="edit" label="Edit" @click="menuAction('edit', close)" />
                      <ReferenceMenuItem
                        icon="copy"
                        label="Copy"
                        shortcut="Ctrl+C"
                        @click="menuAction('copy', close)"
                      />
                      <ReferenceMenuItem
                        icon="paste"
                        label="Paste"
                        shortcut="Ctrl+P"
                        @click="menuAction('paste', close)"
                      />
                      <UtensilMenuDivider />
                      <ReferenceMenuItem icon="share-alt" label="Share" @click="menuAction('share', close)" />
                      <UtensilMenuDivider />
                      <ReferenceMenuItem icon="download" label="Download" @click="menuAction('download', close)" />
                      <ReferenceMenuItem
                        icon="trash"
                        label="Delete"
                        shortcut="Del"
                        @click="menuAction('delete', close)"
                      />
                    </template>
                  </UtensilDropdownMenu>
                </div>

                <UtensilDialog v-model="workModal" class="modal-demo" title="Work">
                  <ReferenceBlockquote color="success">
                    Successful people are not gifted; they just work hard, then succeed on purpose.
                  </ReferenceBlockquote>
                </UtensilDialog>

                <UtensilDialog v-model="playModal" class="modal-demo" title="Play">
                  <ReferenceBlockquote color="warning">
                    All work and no play makes Jack a dull boy.
                  </ReferenceBlockquote>
                </UtensilDialog>

                <UtensilDialog v-model="sleepModal" class="modal-demo" title="Sleep">
                  <ReferenceBlockquote color="error">
                    Tomorrow is a new day, with no mistakes in it yet.
                  </ReferenceBlockquote>
                </UtensilDialog>
              </div>

              <!-- Stacked Avatars -->
              <div class="panel-section">
                <UtensilAvatarStack :overlap="3">
                  <ReferenceStackedAvatar fallback="A" color="pen" />
                  <ReferenceStackedAvatar fallback="B" color="brand" />
                  <ReferenceStackedAvatar fallback="C" color="green" />
                  <ReferenceStackedAvatar fallback="D" color="orange" />
                  <ReferenceStackedAvatar fallback="E" color="pink" />
                  <ReferenceStackedAvatar fallback="F" color="red" />
                  <template #append>
                    <span class="avatar-count">+12</span>
                  </template>
                </UtensilAvatarStack>
              </div>

              <!-- Toolbar -->
              <div class="panel-section theme-options">
                <ReferenceTheme pen="pencil" class="toolbar-simulation">
                  <ReferenceToggleButton variation="text" icon="bold" size="tiny">Bold</ReferenceToggleButton>
                  <ReferenceToggleButton variation="text" icon="italic" size="tiny">Italic</ReferenceToggleButton>
                  <ReferenceToggleButton variation="text" icon="underline" size="tiny">Underline</ReferenceToggleButton>
                  <div class="toolbar-divider"></div>
                  <ReferenceRadioButtons variation="text">
                    <ReferenceRadioButton value="align-left" icon="align-left" icon-only size="tiny" />
                    <ReferenceRadioButton value="align-center" icon="align-center" icon-only size="tiny" />
                    <ReferenceRadioButton value="align-right" icon="align-right" icon-only size="tiny" />
                  </ReferenceRadioButtons>
                </ReferenceTheme>
              </div>

              <!-- Toggle buttons -->
              <div class="panel-section toggle-switches">
                <div class="theme-option">
                  <UtensilToggleSwitch v-model="themeMode" onValue="dark" offValue="light" />
                  <span class="theme-label">Dark mode</span>
                </div>
                <div class="theme-option">
                  <UtensilToggleSwitch v-model="themeContrast" onValue="high" offValue="normal" />
                  <span class="theme-label">High contrast</span>
                </div>
                <div class="theme-option">
                  <UtensilToggleSwitch v-model="themeReducedMotion" onValue="reduced" offValue="normal" />
                  <span class="theme-label">Reduced motion</span>
                </div>
                <div class="theme-option">
                  <UtensilToggleSwitch v-model="enableAnimations" />
                  <span class="theme-label">Demo mode</span>
                </div>
              </div>

              <!-- Action Callout -->
              <div class="panel-section">
                <UtensilFader :show="showCallout">
                  <ReferenceCallout icon="exclamation-triangle" variation="surface" color="warning" text-pencil center>
                    <div class="flex space-between align-center">
                      <span style="flex-grow: 1">Remember to eat lunch.</span>
                      <ReferenceButton
                        class="align-self-center"
                        @click="showCallout = false"
                        variation="soft"
                        scale="small"
                      >
                        <span>Dismiss</span>
                      </ReferenceButton>
                    </div>
                  </ReferenceCallout>
                </UtensilFader>
              </div>

              <div class="panel-spacer"></div>

              <div class="panel-section">
                <h6 style="margin-bottom: 0">Thinking...</h6>
                <UtensilProgressBar :value="progressValue" @click="toggleProgress" rounded />
              </div>

              <!-- Blockquote -->
              <div class="panel-section">
                <ReferenceBlockquote color="pencil">
                  A designer knows he has achieved perfection not when there is nothing left to add, but when there is
                  nothing left to take away.
                </ReferenceBlockquote>
                <div class="quote-attribution">
                  <a href="#" class="attribution-link">Antoine de Saint-Exupéry</a>
                </div>
              </div>
            </div>
          </UtensilTabs>
        </aside>
      </ReferenceTheme>
    </UtensilMaximizer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide, onMounted, onUnmounted } from 'vue'
import UtensilMaximizer from 'utensil-vue/components/maximizer/UtensilMaximizer.vue'
import UtensilDivider from 'utensil-vue/components/divider/UtensilDivider.vue'
import UtensilMenuDivider from 'utensil-vue/components/menu/UtensilMenuDivider.vue'
import UtensilDropdownMenu from 'utensil-vue/components/dropdown-menu/UtensilDropdownMenu.vue'
import UtensilToggleSwitch from 'utensil-vue/components/toggle-switch/UtensilToggleSwitch.vue'
import UtensilProgressBar from 'utensil-vue/components/progress/UtensilProgressBar.vue'
import UtensilTabs from 'utensil-vue/components/tabs/UtensilTabs.vue'
import UtensilTabsTrigger from 'utensil-vue/components/tabs/UtensilTabsTrigger.vue'
import UtensilComponentLoader from 'utensil-vue/components/component-loader/UtensilComponentLoader.vue'
import { ReferenceTheme } from '@/theme/ReferenceTheme'
import { ReferenceBox } from '@/theme/components/ReferenceBox'
import { ReferenceButton } from '@/theme/components/ReferenceButton'
import { ReferenceToggleButton } from '@/theme/components/ReferenceToggleButton'
import { ReferenceMenuItem } from '@/theme/components/ReferenceMenuItem'
import { ReferenceAvatar } from '@/theme/components/ReferenceAvatar'
import { ReferenceStackedAvatar } from '@/theme/components/ReferenceStackedAvatar'
import { ReferenceBlockquote } from '@/theme/components/ReferenceBlockquote'
import { ReferenceCallout } from '@/theme/components/ReferenceCallout'
import { ReferenceBadge } from '@/theme/components/ReferenceBadge'
import { ReferenceCircleButton } from '@/theme/components/ReferenceCircleButton'
import { ReferenceSideMenuItem } from '@/theme/components/ReferenceSideMenuItem'
import { ReferenceRadioButtons } from '@/theme/components/ReferenceRadioButtons'
import { ReferenceRadioButton } from '@/theme/components/ReferenceRadioButton'
import { ReferenceTabsList } from '@/theme/components/ReferenceTabsList'
import UtensilAvatarStack from 'utensil-vue/components/avatar/UtensilAvatarStack.vue'
import UtensilDialog from 'utensil-vue/components/dialogs/UtensilDialog.vue'
import UtensilFader from 'utensil-vue/components/fader/UtensilFader.vue'
import ReferenceTechnoRefinedBackground from '@/features/components/backgrounds/ReferenceTechnoRefinedBackground.vue'
import { toasts } from '@/app/reference-toast'
import UtensilBox from 'utensil-vue/components/box/UtensilBox.vue'
import { useUserThemePreferences } from 'utensil-vue/theme/useUserThemePreferences'
import { demoManifest } from './demo-components/demo-manifest'
import { showcaseContextKey } from './showcase-context'
import SignUpFormDemo from './demo-components/SignUpFormDemo.vue'

const demoModules = import.meta.glob('./demo-components/*.vue')

const currentIndex = ref(0)
const userNavigated = ref(false)
const currentDemo = computed(() => demoManifest[currentIndex.value])
const currentPath = computed(() => (userNavigated.value ? currentDemo.value.path : undefined))

function nextDemo() {
  userNavigated.value = true
  currentIndex.value = (currentIndex.value + 1) % demoManifest.length
}

function previousDemo() {
  userNavigated.value = true
  currentIndex.value = (currentIndex.value - 1 + demoManifest.length) % demoManifest.length
}

const newInbox = ref(true)
const selectedMenuItem = ref('starred')
const activeTab = ref('actions')
const progressValue = ref(0)
const showCallout = ref(true)
const selectedProfile = ref('kara')
const workModal = ref(false)
const playModal = ref(false)
const sleepModal = ref(false)
const { mode: themeMode, contrast: themeContrast, reducedMotion: themeReducedMotion } = useUserThemePreferences()
const enableAnimations = ref(false)

provide(showcaseContextKey, { immersive: enableAnimations })

onMounted(() => {
  toggleProgress()
})

onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
})

// Animate progress bar
let progressInterval: number | undefined
function toggleProgress() {
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = undefined
    return
  }

  progressInterval = window.setInterval(() => {
    progressValue.value = (progressValue.value + 1) % 101
  }, 50)
}

function select(item: string) {
  selectedMenuItem.value = item

  if ('inbox' == item) {
    newInbox.value = false
  }
}

function isSelected(item: string) {
  return selectedMenuItem.value === item
}

function profileSelected(profile: string) {
  return selectedProfile.value == profile
}

function selectProfile(profile: string) {
  selectedProfile.value = profile
}

function menuAction(action: string, close: () => void) {
  const message = {
    edit: 'Edit mode enabled',
    copy: 'Copied to clipboard',
    paste: 'Pasted from clipboard',
    delete: 'Deleted',
    share: 'Shared',
    download: 'Downloaded',
  }[action]

  toasts.add(message || 'Action performed', { color: 'primary', scale: 'super' })
  close()
}
</script>

<style scoped>
/* ===== SHOWCASE LAYOUT ===== */
.showcase-page {
  --showcase-height: 804px;
  --showcase-width: 1200px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--space-5);
  height: 100%;
}

.showcase-maximize {
  flex: 1;
  --utensil-maximizer-min-width: 1064;
  --utensil-maximizer-max-width: 1573;
  --utensil-maximizer-min-height: 763;
  --utensil-maximizer-max-height: 803;
}

.showcase-container {
  --panel-width: 351px;
  --sidebar-width: min(280px);

  align-self: center;

  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr var(--panel-width);

  min-width: calc(var(--utensil-maximizer-min-width) * 1px);
  max-width: calc(var(--utensil-maximizer-max-width) * 1px);
  min-height: calc(var(--utensil-maximizer-min-height) * 1px);
  max-height: calc(var(--utensil-maximizer-max-height) * 1px);
  width: 100%;
  height: 100%;
  overflow: hidden;

  background-color: var(--paper-1);
  border-radius: var(--radius-3);
  border: 1px solid var(--paper-9);
}

/* ===== SIDEBAR ===== */
.showcase-sidebar {
  display: flex;
  flex-direction: column;
  background: var(--paper-2);
  border-right: 1px solid var(--paper-9);
  padding: var(--space-3);
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2);
  padding-left: 0;
  margin-bottom: var(--space-3);
}

.sidebar-logo {
  margin-left: var(--space-2);
  font-size: var(--font-size-4);
  font-weight: 600;
  color: var(--pencil-12);
  letter-spacing: -0.02em;
}

.sidebar-section {
  margin-bottom: var(--space-4);
}

.sidebar-section-title {
  display: block;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--pencil-10);
  padding: var(--space-2) var(--space-2);
  margin-bottom: var(--space-1);
}

.sidebar-spacer {
  flex: 1;
}

.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2);
  border-radius: var(--radius-2);
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.sidebar-user:hover {
  background: var(--pencil-a3);
}

.user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-name {
  font-size: var(--font-size-2);
  font-weight: 500;
  color: var(--pencil-12);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 11px;
  color: var(--pencil-10);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ===== MAIN CONTENT ===== */
.showcase-main {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  position: relative;
  overflow: hidden;
  outline: none;
  background-color: var(--paper-0);
}

.dark-mode .showcase-main.animated {
  background-image:
    radial-gradient(ellipse 90% 90% at 20% 5%, var(--pen-a2) 0%, transparent 100%),
    radial-gradient(ellipse 95% 60% at 75% 105%, var(--pen-a2) 0%, transparent 100%),
    radial-gradient(ellipse 40% 75% at 80% 15%, var(--pencil-a1) 0%, transparent 100%),
    radial-gradient(ellipse 65% 35% at 20% 85%, var(--pencil-a1) 0%, transparent 100%);
}

.showcase-background {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  transition: opacity 0.4s ease;
}

.showcase-background.hidden {
  opacity: 0;
}

.showcase-card {
  position: relative;
  min-width: 250px;
  max-width: 500px;
}

.showcase-card.surface {
  background-color: var(--panel-translucent);
  box-shadow: var(--shadow-4);
  border: 2px solid transparent;
  transition:
    background-color 0.2s ease,
    border 0.2s ease,
    box-shadow 0.2s ease;
}

.showcase-card.ui-unstyled {
  background: color-mix(in srgb, var(--panel-translucent) 1%, transparent);
  border: 2px solid var(--pen-a7);
  box-shadow:
    0 8px 32px -8px var(--pen-a4),
    0 1px 3px var(--pen-2),
    inset 0 0 0 color-mix(in srgb, var(--panel-solid) 50%, transparent);
  backdrop-filter: blur(6px) saturate(0.8);
}

.light-mode .showcase-card.surface {
  box-shadow: var(--shadow-border-3);
}

.light-mode .showcase-card.ui-unstyled {
  border: 2px solid var(--pen-a7);
  box-shadow:
    0 8px 32px -8px var(--pen-a6),
    0 1px 3px var(--pen-a2),
    inset 0 1px 0 color-mix(in srgb, var(--panel-solid) 50%, transparent);
}

.showcase-main.scroll-vertical {
  overflow-y: auto;
}

.showcase-main.scroll-horizontal {
  overflow-x: auto;
}

/* ===== PAGINATOR ===== */
.showcase-paginator {
  position: absolute;
  inset-block-end: var(--space-3);
  inset-inline-end: var(--space-3);
  display: flex;
  align-items: center;
  gap: var(--space-1);
  background: var(--panel-translucent);
  backdrop-filter: blur(8px);
  border-radius: var(--radius-3);
  padding-inline: var(--space-1);
  padding-block: var(--space-1);
  border: 1px solid var(--pencil-a6);
}

.paginator-label {
  font-size: var(--font-size-1);
  font-weight: 500;
  color: var(--pencil-11);
  min-width: 3ch;
  text-align: center;
}

/* ===== RIGHT PANEL ===== */
.showcase-panel {
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  background: var(--paper-2);
  border-left: 1px solid var(--paper-9);
  overflow-y: auto;
}

.panel-tabs {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.panel-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

/* Tab content */
.tab-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding: var(--space-3) 0;
  flex: 1;
}

.panel-spacer {
  flex: 1;
}

.themes-content {
  padding: var(--space-3);
}

.theme-options {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.toggle-switches {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.theme-option {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.toolbar-simulation {
  display: flex;
  width: fit-content;
  gap: var(--space-2);
  padding: var(--space-1);
  background-color: var(--panel-solid);
  border: 1px solid var(--pencil-a6);
  border-radius: var(--radius-2);
  align-items: center;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background-color: var(--pencil-7);
  margin: 0 var(--space-1);
}

.theme-label {
  font-size: var(--font-size-2);
  color: var(--pencil-11);
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.button-showcase {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.colors-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.center-buttons {
  display: flex;
  gap: var(--space-2);
  justify-content: center;
}

.avatar-count {
  margin-left: var(--space-2);
  font-size: var(--font-size-2);
  font-weight: 500;
  color: var(--pencil-11);
}

/* Quote attribution */
.quote-attribution {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-2);
  margin-top: var(--space-2);
  font-size: var(--font-size-1);
}

.attribution-link {
  color: var(--pen-a11);
  text-decoration: none;
}

.attribution-link:hover {
  text-decoration: underline;
}

@container size-container (max-width: 960px) {
  .showcase-page {
    height: initial;
    width: initial;
    padding: 0;
  }

  .showcase-maximize {
    --utensil-maximizer-disabled: 1;
  }

  .showcase-container {
    --panel-width: 263px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    border: none;

    width: 80%;
    height: auto;

    min-width: unset;
    max-width: unset;
    min-height: unset;
    max-height: unset;

    flex: 1;
    align-self: center;
  }

  .showcase-sidebar {
    --scale: 0.75;
    border-right: none;
    border-bottom: 1px solid var(--paper-9);
    --scale: 1;
  }

  .showcase-main {
    height: 600px;
  }

  .showcase-panel {
    --scale: 0.75;
    border-left: none;
    border-top: 1px solid var(--paper-9);
    --scale: 1;
  }
}

@container size-container (max-width: 680px) {
  .showcase-container {
    width: 100%;
  }
}
</style>
