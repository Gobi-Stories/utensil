<template>
  <div class="paper-surfaces-page">
    <header class="paper-header">
      <RouterLink class="back-link" :to="{ path: '/color-scales', query: route.query }">Reference</RouterLink>
      <h1 class="page-title">Paper</h1>
      <div class="header-tools">
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

    <main class="page-body">
      <section class="paper-controls">
        <div class="control-group">
          <span class="control-label">Tint</span>
          <div class="mode-buttons">
            <ReferenceButton
              :variation="tintIsManual ? 'solid' : 'outline'"
              scale="small"
              @click="setTintMode('slider')"
            >
              Slider
            </ReferenceButton>
            <ReferenceButton
              :variation="paperOptions.tint === 'auto' ? 'solid' : 'outline'"
              scale="small"
              @click="setTintMode('auto')"
            >
              From Color
            </ReferenceButton>
            <ReferenceButton
              :variation="paperOptions.tint === 'direct' ? 'solid' : 'outline'"
              scale="small"
              @click="setTintMode('direct')"
            >
              Direct
            </ReferenceButton>
          </div>
        </div>

        <div v-if="tintIsManual" class="control-group slider-group">
          <UtensilRangeSlider
            :model-value="paperTint"
            :min="0"
            :max="3"
            :step="0.05"
            show-values-in-label
            :format-value="formatTintValue"
            label="Strength"
            label-placement="inline"
            aria-label="Paper tint strength"
            @update:model-value="setPaperTint"
            rounded
          />
        </div>

        <div class="control-group slider-group">
          <UtensilRangeSlider
            :model-value="paperOptions.stepContrast"
            :min="0.5"
            :max="3.5"
            :step="0.05"
            show-values-in-label
            :format-value="formatStepContrastValue"
            label="Step contrast"
            label-placement="inline"
            aria-label="Tone difference between adjacent paper steps"
            @update:model-value="setStepContrast"
            rounded
          />
        </div>
      </section>

      <section class="sample-section">
        <h2 class="section-title">Showcase</h2>
        <p class="section-description">
          The showcase entry UI on paper: the menus and form step up the ladder, the stage insets below the page on
          paper 0, and pen and pencil carry the accents and details.
        </p>

        <div class="showcase-app">
          <!-- Left menu -->
          <aside class="showcase-sidebar">
            <div class="sidebar-header">
              <span class="sidebar-logo">Studio</span>
            </div>

            <div class="sidebar-section">
              <span class="sidebar-section-title">Navigation</span>
              <ReferenceSideMenuItem
                icon="inbox"
                title="Inbox"
                :selected="isSelected('inbox')"
                @click="select('inbox')"
              >
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
                <ReferenceAvatar
                  fallback="KL"
                  :variation="profileSelected('kara') ? 'solid' : 'soft'"
                  radius="medium"
                />
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

          <!-- Stage: the inset showcase background -->
          <div class="showcase-stage">
            <div class="signup-card">
              <SignUpFormDemo />
            </div>
          </div>

          <!-- Right menu -->
          <aside class="showcase-panel">
            <UtensilTabs v-model="activeTab" class="panel-tabs">
              <ReferenceTabsList>
                <UtensilTabsTrigger value="actions">Actions</UtensilTabsTrigger>
                <UtensilTabsTrigger value="themes">Themes</UtensilTabsTrigger>
                <UtensilTabsTrigger value="preview">Preview</UtensilTabsTrigger>
                <UtensilTabsTrigger value="colors">Colors</UtensilTabsTrigger>
              </ReferenceTabsList>

              <div class="tab-content">
                <!-- Modal and synthetic dropdown attachments -->
                <div class="panel-section">
                  <div class="flex nowrap space-between">
                    <ReferenceButton variation="solid" size="small" @click="activeModal = 'work'">Work</ReferenceButton>
                    <ReferenceButton variation="soft" size="small" @click="activeModal = 'play'">Play</ReferenceButton>
                    <ReferenceButton variation="outline" size="small" @click="activeModal = 'sleep'"
                      >Sleep</ReferenceButton
                    >
                    <div class="dropdown-host">
                      <ReferenceButton
                        variation="text"
                        icon="ellipsis-v"
                        iconPosition="end"
                        @click="dropdownOpen = !dropdownOpen"
                        :class="{ 'is-active': dropdownOpen }"
                      >
                        Menu
                      </ReferenceButton>
                      <div v-if="dropdownOpen" class="sim-backdrop" @click="dropdownOpen = false"></div>
                      <div v-if="dropdownOpen" class="sim-dropdown">
                        <template v-for="item in menuItems" :key="item.label">
                          <div v-if="item.dividerBefore" class="sim-menu-divider"></div>
                          <button class="sim-dropdown-item" @click="menuAction(item)">
                            <span>{{ item.label }}</span>
                            <span v-if="item.shortcut" class="item-shortcut">{{ item.shortcut }}</span>
                          </button>
                        </template>
                      </div>
                    </div>
                  </div>
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
                <div class="panel-section">
                  <ReferenceTheme pen="pencil" class="toolbar-simulation">
                    <ReferenceToggleButton variation="text" icon="bold" size="tiny">Bold</ReferenceToggleButton>
                    <ReferenceToggleButton variation="text" icon="italic" size="tiny">Italic</ReferenceToggleButton>
                    <ReferenceToggleButton variation="text" icon="underline" size="tiny"
                      >Underline</ReferenceToggleButton
                    >
                    <div class="toolbar-divider"></div>
                    <ReferenceRadioButtons variation="text">
                      <ReferenceRadioButton value="align-left" icon="align-left" icon-only size="tiny" />
                      <ReferenceRadioButton value="align-center" icon="align-center" icon-only size="tiny" />
                      <ReferenceRadioButton value="align-right" icon="align-right" icon-only size="tiny" />
                    </ReferenceRadioButtons>
                  </ReferenceTheme>
                </div>

                <!-- Theme toggles -->
                <div class="panel-section toggle-switches">
                  <div class="theme-option">
                    <UtensilToggleSwitch v-model="themeMode" onValue="dark" offValue="light" />
                    <span class="theme-label">Dark mode</span>
                  </div>
                  <div class="theme-option">
                    <UtensilToggleSwitch v-model="contrast" onValue="high" offValue="normal" />
                    <span class="theme-label">High contrast</span>
                  </div>
                  <div class="theme-option">
                    <UtensilToggleSwitch v-model="reducedMotion" onValue="reduced" offValue="normal" />
                    <span class="theme-label">Reduced motion</span>
                  </div>
                </div>

                <!-- Action Callout -->
                <div class="panel-section">
                  <UtensilFader :show="showCallout">
                    <ReferenceCallout
                      icon="exclamation-triangle"
                      variation="surface"
                      color="warning"
                      text-pencil
                      center
                    >
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
        </div>
      </section>

      <section class="sample-section">
        <h2 class="section-title">Adjacent ladder</h2>
        <p class="section-description">Every solid step side by side, for judging the relative deltas.</p>
        <div class="ladder">
          <div
            v-for="step in allSteps"
            :key="step"
            class="ladder-cell"
            :style="{ backgroundColor: `var(--paper-${step})` }"
          >
            <span class="step-label">{{ step }}</span>
          </div>
        </div>
      </section>

      <section class="sample-section">
        <h2 class="section-title">Isolated steps</h2>
        <p class="section-description">
          Each step surrounded by the page, so a neighbor's lightness can't skew the read (the checker-shadow illusion).
        </p>
        <div class="isolated-grid">
          <div
            v-for="step in allSteps"
            :key="step"
            class="isolated-swatch"
            :style="{ backgroundColor: `var(--paper-${step})` }"
          >
            <span class="step-label">{{ step }}</span>
          </div>
        </div>
      </section>

      <section class="sample-section">
        <h2 class="section-title">Alpha ladder</h2>
        <p class="section-description">Alpha steps over the page, compositing back to their solid siblings.</p>
        <div class="ladder">
          <div v-for="step in 12" :key="step" class="ladder-cell" :style="{ backgroundColor: `var(--paper-a${step})` }">
            <span class="step-label">a{{ step }}</span>
          </div>
        </div>
      </section>
    </main>

    <div v-if="activeModal" class="sim-scrim" @click.self="activeModal = null">
      <div class="sim-modal" role="dialog" :aria-label="modalContent[activeModal].title">
        <h3 class="modal-title">{{ modalContent[activeModal].title }}</h3>
        <ReferenceBlockquote :color="modalContent[activeModal].color" class="modal-quote">
          {{ modalContent[activeModal].quote }}
        </ReferenceBlockquote>
        <div class="modal-actions">
          <button class="sim-button primary" @click="activeModal = null">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import UtensilRangeSlider from '@gobistories/utensil-vue/components/range-slider/UtensilRangeSlider.vue'
import UtensilFader from '@gobistories/utensil-vue/components/fader/UtensilFader.vue'
import UtensilDivider from '@gobistories/utensil-vue/components/divider/UtensilDivider.vue'
import UtensilBox from '@gobistories/utensil-vue/components/box/UtensilBox.vue'
import UtensilAvatarStack from '@gobistories/utensil-vue/components/avatar/UtensilAvatarStack.vue'
import UtensilTabs from '@gobistories/utensil-vue/components/tabs/UtensilTabs.vue'
import UtensilTabsTrigger from '@gobistories/utensil-vue/components/tabs/UtensilTabsTrigger.vue'
import UtensilToggleSwitch from '@gobistories/utensil-vue/components/toggle-switch/UtensilToggleSwitch.vue'
import UtensilProgressBar from '@gobistories/utensil-vue/components/progress/UtensilProgressBar.vue'
import ThemeEditor from '@gobistories/utensil-vue/theme-editor/ThemeEditor.vue'
import { ReferenceTheme } from '@/theme/ReferenceTheme'
import { ReferenceButton } from '@/theme/components/ReferenceButton'
import { ReferenceToggleButton } from '@/theme/components/ReferenceToggleButton'
import { ReferenceAvatar } from '@/theme/components/ReferenceAvatar'
import { ReferenceStackedAvatar } from '@/theme/components/ReferenceStackedAvatar'
import { ReferenceBlockquote } from '@/theme/components/ReferenceBlockquote'
import { ReferenceCallout } from '@/theme/components/ReferenceCallout'
import { ReferenceBadge } from '@/theme/components/ReferenceBadge'
import { ReferenceSideMenuItem } from '@/theme/components/ReferenceSideMenuItem'
import { ReferenceRadioButtons } from '@/theme/components/ReferenceRadioButtons'
import { ReferenceRadioButton } from '@/theme/components/ReferenceRadioButton'
import { ReferenceTabsList } from '@/theme/components/ReferenceTabsList'
import SignUpFormDemo from '@/features/showcase/demo-components/SignUpFormDemo.vue'
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
import { referenceColorPresets, referencePrimaryColors } from '@/theme/reference-color-presets'
import { toasts } from '@/app/reference-toast'

const route = useRoute()

const allSteps = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

// --- Paper generation controls (shared theme state; the ThemeEditor v-model persists them) ---

const tintIsManual = computed(() => typeof paperOptions.value.tint === 'number')
const paperTint = computed(() => (typeof paperOptions.value.tint === 'number' ? paperOptions.value.tint : 1))

// Remember the slider position across mode switches so returning to Slider restores it
const lastManualTint = ref(1)
watch(
  () => paperOptions.value.tint,
  (tint) => {
    if (typeof tint === 'number') lastManualTint.value = tint
  },
  { immediate: true },
)

function setTintMode(mode: 'slider' | 'auto' | 'direct') {
  paperOptions.value = { ...paperOptions.value, tint: mode === 'slider' ? lastManualTint.value : mode }
}

function setPaperTint(tint: number) {
  paperOptions.value = { ...paperOptions.value, tint }
}

function setStepContrast(stepContrast: number) {
  paperOptions.value = { ...paperOptions.value, stepContrast }
}

function formatTintValue(value: number): string {
  return value.toFixed(2)
}

function formatStepContrastValue(value: number): string {
  return value.toFixed(2)
}

// --- Showcase state ---

const newInbox = ref(true)
const selectedMenuItem = ref('starred')
const selectedProfile = ref('kara')
const activeTab = ref('actions')
const showCallout = ref(true)

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

// --- Synthetic overlays ---

const dropdownOpen = ref(false)

interface SimMenuItem {
  label: string
  message: string
  shortcut?: string
  dividerBefore?: boolean
}

const menuItems: SimMenuItem[] = [
  { label: 'Edit', message: 'Edit mode enabled' },
  { label: 'Copy', message: 'Copied to clipboard', shortcut: 'Ctrl+C' },
  { label: 'Paste', message: 'Pasted from clipboard', shortcut: 'Ctrl+P' },
  { label: 'Share', message: 'Shared', dividerBefore: true },
  { label: 'Download', message: 'Downloaded', dividerBefore: true },
  { label: 'Delete', message: 'Deleted', shortcut: 'Del' },
]

function menuAction(item: SimMenuItem) {
  toasts.add(item.message, { color: 'primary', scale: 'super' })
  dropdownOpen.value = false
}

const activeModal = ref<'work' | 'play' | 'sleep' | null>(null)

const modalContent = {
  work: {
    title: 'Work',
    color: 'success',
    quote: 'Successful people are not gifted; they just work hard, then succeed on purpose.',
  },
  play: {
    title: 'Play',
    color: 'warning',
    quote: 'All work and no play makes Jack a dull boy.',
  },
  sleep: {
    title: 'Sleep',
    color: 'error',
    quote: 'Tomorrow is a new day, with no mistakes in it yet.',
  },
} as const

// --- Progress animation ---

const progressValue = ref(0)
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

onMounted(() => {
  toggleProgress()
})

onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
})
</script>

<style scoped>
.paper-surfaces-page {
  height: 100%;
  overflow-y: auto;
  background-color: var(--paper-1);
}

/* ===== Header: the page's own chrome, sitting directly on the page ===== */
.paper-header {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-5);
  background-color: var(--paper-3);
  border-bottom: solid 1px var(--paper-7);
}

.back-link {
  font-size: var(--font-size-2);
  color: var(--pencil-a11);
  text-decoration: none;
}

.back-link:hover {
  color: var(--pencil-12);
  text-decoration: none;
}

.back-link::before {
  content: '← ';
}

.page-title {
  margin: 0;
  font-size: var(--font-size-5);
  color: var(--pencil-12);
}

.header-tools {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

@container size-container (max-width: 900px) {
  .paper-header {
    --theme-editor-labels-display: none;
    --theme-editor-roundness-min-width: auto;
  }
}

@container size-container (max-width: 530px) {
  .paper-header {
    --theme-editor-roundness-display: none;
  }
}

/* ===== Body ===== */
.page-body {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-5) var(--space-5) var(--space-9);
  display: flex;
  flex-direction: column;
  gap: var(--space-7);
}

/* ===== Paper generation controls ===== */
.paper-controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-5);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-3);
  background-color: var(--paper-4);
  border: solid 1px var(--paper-4);
}

.control-group {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.control-label {
  font-size: var(--font-size-2);
  font-weight: 500;
  color: var(--pencil-11);
}

.mode-buttons {
  display: flex;
  gap: var(--space-2);
}

.slider-group {
  min-width: 220px;
  --range-slider-control-width: 120px;
}

.section-title {
  margin: 0 0 var(--space-1);
  font-size: var(--font-size-4);
  color: var(--pencil-12);
}

.section-description {
  margin: 0 0 var(--space-4);
  font-size: var(--font-size-2);
  color: var(--pencil-11);
  max-width: 70ch;
}

.step-label {
  font-size: 11px;
  font-family: monospace;
  color: var(--pencil-a10);
}

/* ===== Showcase app ===== */
.showcase-app {
  --sidebar-width: 280px;
  --panel-width: 350px;

  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr var(--panel-width);
  height: 780px;
  overflow: hidden;
  border-radius: var(--radius-3);
  border: 1px solid var(--paper-6);
}

/* Left menu — one step off the page */
.showcase-sidebar {
  display: flex;
  flex-direction: column;
  background-color: var(--paper-3);
  border-right: 1px solid var(--paper-8);
  padding: var(--space-3);
  overflow-y: auto;
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
  background-color: var(--paper-4);
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

/* Stage — the inset showcase background on paper-0 */
.showcase-stage {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  background-color: var(--paper-0);
  overflow-y: auto;
}

.signup-card {
  background-color: var(--paper-2);
  border-radius: var(--radius-3);
  box-shadow: var(--shadow-border-4);
  padding: var(--space-6);
  min-width: 250px;
  max-width: 420px;
}

/* Right menu — one step off the page */
.showcase-panel {
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  background-color: var(--paper-2);
  border-left: 1px solid var(--paper-8);
  overflow-y: auto;
}

.panel-tabs {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding: var(--space-3) 0;
  flex: 1;
}

.panel-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.panel-spacer {
  flex: 1;
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

.theme-label {
  font-size: var(--font-size-2);
  color: var(--pencil-11);
}

.toolbar-simulation {
  display: flex;
  width: fit-content;
  gap: var(--space-2);
  padding: var(--space-1);
  background-color: var(--paper-a5);
  border-radius: var(--radius-2);
  align-items: center;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background-color: var(--pencil-7);
  margin: 0 var(--space-1);
}

.avatar-count {
  margin-left: var(--space-2);
  font-size: var(--font-size-2);
  font-weight: 500;
  color: var(--pencil-11);
}

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

/* ===== Ladders ===== */
.ladder {
  display: flex;
  border-radius: var(--radius-2);
  overflow: hidden;
}

.ladder-cell {
  flex: 1;
  height: var(--space-9);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: var(--space-1);
}

.isolated-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-5);
}

.isolated-swatch {
  width: var(--space-9);
  aspect-ratio: 1;
  border-radius: var(--radius-2);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: var(--space-1);
}

/* ===== Synthetic overlays (local, full style control) ===== */
.sim-button {
  padding: var(--space-2) var(--space-4);
  border: none;
  border-radius: var(--radius-3);
  background-color: var(--paper-3);
  color: var(--pencil-12);
  font-size: var(--font-size-2);
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.sim-button:hover {
  background-color: var(--paper-4);
}

.sim-button:active {
  background-color: var(--paper-5);
}

.sim-button.primary {
  background-color: var(--pen-9);
  color: var(--pen-contrast);
}

.sim-button.primary:hover {
  background-color: var(--pen-10);
}

.dropdown-host {
  position: relative;
}

.sim-backdrop {
  position: fixed;
  inset: 0;
  z-index: 8;
}

.sim-dropdown {
  position: absolute;
  top: calc(100% + var(--space-1));
  right: 0;
  z-index: 9;
  min-width: 200px;
  padding: var(--space-1);
  border-radius: var(--radius-3);
  background-color: var(--paper-2);
  box-shadow: var(--shadow-4);
  display: flex;
  flex-direction: column;
}

.sim-dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-2) var(--space-3);
  border: none;
  border-radius: var(--radius-2);
  background: none;
  color: var(--pencil-12);
  font-size: var(--font-size-2);
  text-align: left;
  cursor: pointer;
}

.sim-dropdown-item:hover {
  background-color: var(--paper-4);
}

.item-shortcut {
  font-size: var(--font-size-1);
  color: var(--pencil-10);
}

.sim-menu-divider {
  height: 1px;
  margin: var(--space-1) var(--space-2);
  background-color: var(--pencil-a6);
}

.sim-scrim {
  position: fixed;
  inset: 0;
  z-index: 10;
  display: grid;
  place-items: center;
  background-color: var(--black-a6);
}

.sim-modal {
  width: min(90vw, 420px);
  padding: var(--space-6);
  border-radius: var(--radius-4);
  background-color: var(--paper-2);
  box-shadow: var(--shadow-5);
}

.modal-title {
  margin: 0 0 var(--space-3);
  font-size: var(--font-size-4);
  color: var(--pencil-12);
}

.modal-quote {
  margin-bottom: var(--space-5);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}

@container size-container (max-width: 960px) {
  .showcase-app {
    display: flex;
    flex-direction: column;
    height: auto;
  }

  .showcase-sidebar {
    border-right: none;
    border-bottom: 1px solid var(--pencil-6);
  }

  .showcase-stage {
    min-height: 480px;
  }

  .showcase-panel {
    border-left: none;
    border-top: 1px solid var(--pencil-6);
  }
}
</style>
