<template>
  <ReferenceComponentDemo
    title="Banner"
    anchor="banner"
    description="A banner across the top or bottom edge of a page, for a message the user can act on without being interrupted. It takes its own space in the layout rather than covering content."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content banner-demo">
          <div class="banner-page">
            <ReferenceBanner label="Announcement" icon="info-circle">A new version is available.</ReferenceBanner>
            <div class="banner-page-content">Page</div>
          </div>
        </div>
        <div class="demo-label always-visible">Top</div>
        <div class="demo-code">
          <code>&lt;UtensilBanner label="Announcement" icon="info-circle"&gt;...&lt;/UtensilBanner&gt;</code>
        </div>
      </div>

      <div class="demo-item">
        <div class="demo-content banner-demo">
          <div class="banner-page">
            <div class="banner-page-content">Page</div>
            <ReferenceBanner label="Cookies" position="bottom"
              >This site uses cookies to keep you signed in.</ReferenceBanner
            >
          </div>
        </div>
        <div class="demo-label always-visible">Bottom</div>
        <div class="demo-code">
          <code>&lt;UtensilBanner label="Cookies" position="bottom"&gt;...&lt;/UtensilBanner&gt;</code>
        </div>
      </div>

      <div class="demo-item">
        <div class="demo-content banner-demo">
          <div class="banner-page tall">
            <ReferenceBanner label="Surface" color="primary">Surface</ReferenceBanner>
            <ReferenceBanner label="Soft" color="primary" variation="soft">Soft</ReferenceBanner>
            <ReferenceBanner label="Outline" color="primary" variation="outline">Outline</ReferenceBanner>
            <ReferenceBanner label="Solid" color="primary" variation="solid">Solid</ReferenceBanner>
            <div class="banner-page-content">Page</div>
          </div>
        </div>
        <div class="demo-label always-visible">Variations</div>
        <div class="demo-code">
          <code>&lt;UtensilBanner variation="soft" color="primary"&gt;...&lt;/UtensilBanner&gt;</code>
        </div>
      </div>

      <div class="demo-item">
        <div class="demo-content banner-demo">
          <div class="banner-page">
            <ReferenceBanner
              label="Trial"
              class="inline-actions-banner"
              color="warning"
              variation="soft"
              icon="exclamation-triangle"
            >
              Your trial ends in 3 days.
              <template #actions>
                <ReferenceButton label="Upgrade" color="warning" scale="small" />
              </template>
            </ReferenceBanner>
            <div class="banner-page-content">Page</div>
          </div>
        </div>
        <div class="demo-label always-visible">Icon and Actions</div>
        <div class="demo-code">
          <code
            >&lt;UtensilBanner icon="exclamation-triangle"&gt;... &lt;template #actions&gt;...&lt;/template&gt;</code
          >
        </div>
      </div>

      <div class="demo-item">
        <div class="demo-content banner-demo">
          <div class="banner-page">
            <ReferenceBanner v-model:open="dismissibleOpen" label="Welcome" color="primary" dismissible>
              Welcome back. Close this banner to watch it shrink away.
            </ReferenceBanner>
            <div class="banner-page-content">
              <ReferenceButton
                v-if="!dismissibleOpen"
                label="Show again"
                variation="soft"
                scale="small"
                @click="dismissibleOpen = true"
              />
            </div>
          </div>
        </div>
        <div class="demo-label always-visible">Dismissible</div>
        <div class="demo-code">
          <code>&lt;UtensilBanner v-model:open="open" dismissible&gt;...&lt;/UtensilBanner&gt;</code>
        </div>
      </div>

      <div class="demo-item">
        <div class="demo-content banner-demo">
          <div class="banner-page">
            <div class="banner-page-content">
              <ReferenceButton
                v-if="!centeredOpen"
                label="Show again"
                variation="soft"
                scale="small"
                @click="centeredOpen = true"
              />
            </div>
            <ReferenceBanner
              v-model:open="centeredOpen"
              class="centered-banner"
              label="Feedback"
              position="bottom"
              icon="message"
              centered
              dismissible
              dismiss-label="Not now"
            >
              How would you rate this page?
              <template #actions>
                <ReferenceButton label="Rate" scale="small" @click="centeredOpen = false" />
              </template>
            </ReferenceBanner>
          </div>
        </div>
        <div class="demo-label always-visible">Centered</div>
        <div class="demo-code">
          <code>&lt;UtensilBanner position="bottom" centered dismissible&gt;...&lt;/UtensilBanner&gt;</code>
        </div>
      </div>

      <div class="demo-item">
        <div class="demo-content banner-demo">
          <div class="banner-page">
            <ReferenceBanner
              v-model:open="offline"
              label="Connection"
              color="warning"
              icon="exclamation-triangle"
              role="status"
            >
              You're offline. Changes will be saved when you reconnect.
            </ReferenceBanner>
            <div class="banner-page-content">
              <ReferenceButton
                :label="offline ? 'Reconnect' : 'Go offline'"
                variation="soft"
                scale="small"
                @click="offline = !offline"
              />
            </div>
          </div>
        </div>
        <div class="demo-label always-visible">Announced When It Opens</div>
        <div class="demo-code">
          <code>&lt;UtensilBanner v-model:open="offline" role="status"&gt;...&lt;/UtensilBanner&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilBannerDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilBannerDoc from '@gobistories/utensil-vue/components/banner/UtensilBannerDoc.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { ReferenceBanner } from '@/theme/components/ReferenceBanner'
import { ReferenceButton } from '@/theme/components/ReferenceButton'

const dismissibleOpen = ref(true)
const centeredOpen = ref(true)
const offline = ref(false)
</script>

<style scoped>
.demo-content.banner-demo {
  align-items: stretch;
  padding: 0;
}

/* A small page: a column filling the viewport, with the banner at one edge and the page taking what's left */
.banner-page {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 220px;
  overflow: hidden;
  background: var(--background);
}

.banner-page.tall {
  height: 320px;
}

.banner-page-content {
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  min-height: 0;
  color: var(--pencil-a10);
}

/* The demo's page is narrow; a smaller minimum keeps the actions beside the message */
.inline-actions-banner {
  --utensil-banner-content-min-width: 10rem;
}

.centered-banner {
  --utensil-banner-content-width: 16rem;
}
</style>
