<template>
  <ReferenceComponentDemo
    title="Card"
    anchor="card"
    description="A box with a layout for its content: media, a header with an icon, title and description, the content, and a footer with actions. Every part is optional."
  >
    <div id="card-section" class="component-demo">
      <h3><a class="demo-anchor" href="#card-section">Section</a></h3>
      <p>A titled section of a page, with a control at the end of its header.</p>
      <ReferenceCard icon="user" title="Members" title-element="h4" description="Who can see and edit this project.">
        <template #header-end>
          <ReferenceButton variation="soft" color="pencil" scale="small" icon="share-alt">Invite</ReferenceButton>
        </template>
        <div class="card-members">
          <ReferenceUserProfileCard
            v-for="member in cardMembers"
            :key="member.email"
            :name="member.name"
            :email="member.email"
            :fallback="member.initials"
            :bordered="false"
          />
        </div>
      </ReferenceCard>
    </div>

    <div id="card-choice" class="component-demo">
      <h3><a class="demo-anchor" href="#card-choice">Choice</a></h3>
      <p>Clickable cards that act as a whole, highlighted when chosen.</p>
      <div class="card-grid">
        <ReferenceCard
          v-for="choice in cardChoices"
          :key="choice.id"
          clickable
          :shadow="2"
          :highlighted="cardChoice === choice.id"
          :icon="choice.icon"
          icon-color="primary"
          :title="choice.title"
          :description="choice.description"
          @click="cardChoice = choice.id"
        >
          <template #footer>
            <span class="card-meta">{{ choice.meta }}</span>
          </template>
        </ReferenceCard>
      </div>
    </div>

    <div id="card-media" class="component-demo">
      <h3><a class="demo-anchor" href="#card-media">Media and Actions</a></h3>
      <p>
        Inset media, or media that bleeds to the card's edges. The second card links as a whole with a stretched link,
        while its action stays clickable.
      </p>
      <div class="card-grid">
        <ReferenceCard title="Quarterly report" title-element="h4" description="8 pages">
          <template #media>
            <div class="card-media-art" aria-hidden="true"></div>
          </template>
          <template #actions>
            <ReferenceButton variation="soft" color="pencil" icon="download" icon-only>Download</ReferenceButton>
            <ReferenceButton>Open</ReferenceButton>
          </template>
        </ReferenceCard>
        <ReferenceCard interactive media-bleed footer-divider title-element="h4" description="Updated today">
          <template #media>
            <div class="card-media-art bleed" aria-hidden="true"></div>
          </template>
          <template #title>
            <a class="utensil-card-link" href="#card-media">Annual summary</a>
          </template>
          <template #footer>
            <span class="card-meta">Shared with 4 people</span>
          </template>
          <template #actions>
            <ReferenceButton variation="text" color="pencil" icon="share-alt" icon-only>Share</ReferenceButton>
          </template>
        </ReferenceCard>
      </div>
    </div>

    <div id="card-grid" class="component-demo">
      <h3><a class="demo-anchor" href="#card-grid">Grid with Pinned Footers</a></h3>
      <p>In a grid of cards, each footer stays at the bottom, whatever the length of the content above it.</p>
      <div class="card-grid">
        <ReferenceCard
          v-for="report in cardReports"
          :key="report.title"
          :icon="report.icon"
          :title="report.title"
          title-element="h4"
          footer-divider
        >
          <p class="card-text">{{ report.body }}</p>
          <template #footer>
            <span class="card-meta">{{ report.meta }}</span>
          </template>
          <template #actions>
            <ReferenceButton variation="soft" scale="small">View</ReferenceButton>
          </template>
        </ReferenceCard>
      </div>
    </div>

    <template #api>
      <UtensilCardDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilCardDoc from '@gobistories/utensil-vue/components/card/UtensilCardDoc.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { ReferenceCard } from '@/theme/components/ReferenceCard'
import { ReferenceButton } from '@/theme/components/ReferenceButton'
import { ReferenceUserProfileCard } from '@/theme/components/ReferenceUserProfileCard'

const cardMembers = [
  { name: 'Sofia Chen', email: 'sofia.chen@example.com', initials: 'SC' },
  { name: 'Amir Haddad', email: 'amir.haddad@example.com', initials: 'AH' },
]

const cardChoices = [
  {
    id: 'import',
    icon: 'download',
    title: 'Import a file',
    description: 'Start from a spreadsheet you already have.',
    meta: 'Takes a minute',
  },
  {
    id: 'blank',
    icon: 'edit',
    title: 'Start from scratch',
    description: 'Build the table yourself, one column at a time.',
    meta: 'Most flexible',
  },
] as const

const cardChoice = ref<(typeof cardChoices)[number]['id']>('import')

const cardReports = [
  { icon: 'chart-column', title: 'Traffic', body: 'Visits rose 12% this month.', meta: 'Daily' },
  {
    icon: 'database',
    title: 'Storage',
    body: 'Most of the space is taken by video uploads from the last quarter. Archiving the oldest projects would free about a third of it, and the archive stays searchable.',
    meta: 'Weekly',
  },
  { icon: 'folder', title: 'Projects', body: 'Three projects are waiting for review.', meta: 'Live' },
] as const
</script>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: var(--space-4);
}

.card-members {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.card-meta {
  font-size: var(--font-size-1);
  color: var(--pencil-a11);
}

.card-text {
  margin: 0;
  font-size: var(--font-size-2);
  color: var(--pencil-a11);
}

.card-media-art {
  aspect-ratio: 16 / 9;
  background: linear-gradient(135deg, var(--pen-5), var(--pen-9));
}

.card-media-art.bleed {
  background: linear-gradient(135deg, var(--pencil-5), var(--pen-7));
}
</style>
