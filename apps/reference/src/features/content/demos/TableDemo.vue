<template>
  <ReferenceComponentDemo
    title="Table"
    anchor="table"
    description="A data table laid out on a column template. Rows link somewhere with a stretched row link, or act with interactive."
  >
    <div class="demo-grid">
      <div class="demo-item table-demo-item">
        <div class="demo-content table-demo">
          <UtensilTable :columns="['1fr', '96px', '48px']" :narrow-columns="['1fr', '48px']">
            <UtensilTableHeader>
              <span role="columnheader">Story</span>
              <span role="columnheader" class="wide-only">Views</span>
              <span role="columnheader"></span>
            </UtensilTableHeader>
            <UtensilTableRow v-for="story in stories" :key="story.id">
              <span role="cell"
                ><a class="utensil-table-row-link" href="#table">{{ story.title }}</a></span
              >
              <span role="cell" class="wide-only">{{ story.views.toLocaleString() }}</span>
              <span role="cell">
                <ReferenceCircleButton
                  icon="ellipsis-v"
                  variation="text"
                  color="pencil"
                  scale="small"
                  :description="`More actions for ${story.title}`"
                  @click="action = `More actions for ${story.title}`"
                />
              </span>
            </UtensilTableRow>
          </UtensilTable>
          <p class="table-demo-status">{{ action }}</p>
        </div>
        <div class="demo-label always-visible">Row links &middot; the action stays clickable</div>
      </div>

      <div class="demo-item table-demo-item">
        <div class="demo-content table-demo">
          <UtensilTable :columns="['1fr', '1fr']">
            <UtensilTableHeader>
              <span role="columnheader">Member</span>
              <span role="columnheader">Role</span>
            </UtensilTableHeader>
            <UtensilTableRow
              v-for="member in members"
              :key="member.name"
              interactive
              @click="
                showReferenceDialog({
                  title: member.name,
                  message: `${member.name} is ${member.role.toLowerCase()} of the team.`,
                })
              "
            >
              <span role="cell">{{ member.name }}</span>
              <span role="cell">{{ member.role }}</span>
            </UtensilTableRow>
            <UtensilTableRow variant="muted">
              <span role="cell">Invited</span>
              <span role="cell">Pending</span>
            </UtensilTableRow>
          </UtensilTable>
        </div>
        <div class="demo-label always-visible">Interactive rows &middot; Enter opens a dialog</div>
      </div>
      <div class="demo-item table-demo-item">
        <div class="demo-content table-demo">
          <UtensilTable :columns="['72px', '1fr']">
            <UtensilTableRow
              v-for="entry in log"
              :key="entry.text"
              :variant="entry.clustered ? 'clustered' : 'default'"
            >
              <span role="cell">{{ entry.time }}</span>
              <span role="cell">{{ entry.text }}</span>
            </UtensilTableRow>
          </UtensilTable>
        </div>
        <div class="demo-label always-visible">Clustered rows &middot; a headerless log</div>
      </div>
    </div>

    <template #api>
      <UtensilTableRowDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilTable from '@gobistories/utensil-vue/components/table/UtensilTable.vue'
import UtensilTableHeader from '@gobistories/utensil-vue/components/table/UtensilTableHeader.vue'
import UtensilTableRow from '@gobistories/utensil-vue/components/table/UtensilTableRow.vue'
import UtensilTableRowDoc from '@gobistories/utensil-vue/components/table/UtensilTableRowDoc.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { ReferenceCircleButton } from '@/theme/components/ReferenceCircleButton'
import { showReferenceDialog } from '@/app/reference-dialog'

const stories = [
  { id: 'launch', title: 'Spring launch', views: 12480 },
  { id: 'tour', title: 'Product tour', views: 9213 },
  { id: 'recap', title: 'Year in review', views: 1024 },
]

const members = [
  { name: 'Ada Lovelace', role: 'Owner' },
  { name: 'Alan Turing', role: 'Editor' },
]

const log = [
  { time: '09:12', text: 'Ada Lovelace published Spring launch', clustered: false },
  { time: '09:13', text: 'Ada Lovelace changed its cover', clustered: true },
  { time: '09:13', text: 'Ada Lovelace added two chapters', clustered: true },
  { time: '10:40', text: 'Alan Turing commented on Product tour', clustered: false },
]

const action = ref('Choose a row, or its action')
</script>

<style scoped>
.table-demo-item {
  grid-column: 1 / -1;
}

.demo-content.table-demo {
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-3);
}

.table-demo-status {
  margin: 0;
  font-size: var(--font-size-1);
  color: var(--pencil-a11);
}

@container size-container (max-width: 576px) {
  .wide-only {
    display: none;
  }
}
</style>
