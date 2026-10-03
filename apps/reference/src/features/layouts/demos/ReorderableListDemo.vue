<template>
  <ReferenceComponentDemo
    title="Reorderable List"
    anchor="reorderable-list"
    description="Drag-and-drop reordering of arbitrary child elements — mouse, touch (long press), and keyboard. The consumer owns the order and re-renders on drop."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content demo-content-column">
          <UtensilReorderableList class="reorder-demo-list" keyboard-grab @dropped="reorderDemoItems">
            <template #default="{ state }">
              <div
                v-for="item in reorderItems"
                :key="item.id"
                :data-reorderable-id="item.id"
                class="reorder-demo-item"
                :class="`is-${state(item.id)}`"
                tabindex="0"
              >
                {{ item.label }}
              </div>
            </template>
          </UtensilReorderableList>
        </div>
        <div class="demo-label always-visible">Drag to reorder — or focus an item, press Enter, then use arrows</div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilReorderableListGroup>
            <div class="kanban-demo">
              <div class="kanban-demo-column">
                <h4>To Do</h4>
                <UtensilReorderableList
                  class="kanban-demo-list"
                  namespace="demo-cards"
                  target-placeholder="animated"
                  @grabbed="movingKanbanId = $event.id"
                  @dropped="reorderKanban(kanbanTodo, $event)"
                  @removed="removeKanban(kanbanTodo, $event)"
                  @added="addKanban(kanbanTodo, $event)"
                >
                  <div
                    v-for="card in kanbanTodo"
                    :key="card.id"
                    :data-reorderable-id="card.id"
                    class="kanban-demo-card"
                  >
                    {{ card.label }}
                  </div>
                  <template #home-placeholder="{ targeted }">
                    <div class="kanban-demo-home" :class="{ targeted }"></div>
                  </template>
                  <template #moving-placeholder>
                    <div class="kanban-demo-card kanban-demo-card-moving">{{ movingKanbanLabel }}</div>
                  </template>
                </UtensilReorderableList>
              </div>
              <div class="kanban-demo-column">
                <h4>Done</h4>
                <UtensilReorderableList
                  class="kanban-demo-list"
                  namespace="demo-cards"
                  target-placeholder="animated"
                  @grabbed="movingKanbanId = $event.id"
                  @dropped="reorderKanban(kanbanDone, $event)"
                  @removed="removeKanban(kanbanDone, $event)"
                  @added="addKanban(kanbanDone, $event)"
                >
                  <div
                    v-for="card in kanbanDone"
                    :key="card.id"
                    :data-reorderable-id="card.id"
                    class="kanban-demo-card"
                  >
                    {{ card.label }}
                  </div>
                  <template #home-placeholder="{ targeted }">
                    <div class="kanban-demo-home" :class="{ targeted }"></div>
                  </template>
                  <template #moving-placeholder>
                    <div class="kanban-demo-card kanban-demo-card-moving">{{ movingKanbanLabel }}</div>
                  </template>
                </UtensilReorderableList>
              </div>
            </div>
          </UtensilReorderableListGroup>
        </div>
        <div class="demo-label always-visible">Drag cards between columns — the placeholder travels to the target</div>
      </div>
      <div class="demo-item demo-item-double">
        <div class="demo-content">
          <UtensilReorderableListGroup>
            <div class="team-demo">
              <div v-for="team in demoTeams" :key="team.name" class="team-demo-column">
                <h4>{{ team.name }}</h4>
                <UtensilReorderableList
                  class="team-demo-list"
                  namespace="demo-members"
                  :target-placeholder="true"
                  clone
                  @dropped="reorderTeam(team.members, $event)"
                  @removed="removeTeamMember(team.members, $event)"
                  @added="addTeamMember(team.members, $event)"
                >
                  <template #default="{ state }">
                    <ReferenceUserProfileCard
                      v-for="member in team.members"
                      :key="member.id"
                      :data-reorderable-id="member.id"
                      class="team-demo-card"
                      :class="{ 'is-moving': state(member.id) === 'moving' }"
                      :name="member.name"
                      :email="member.email"
                      :fallback="member.initials"
                    />
                  </template>
                  <template #home-placeholder>
                    <div class="team-demo-home"></div>
                  </template>
                </UtensilReorderableList>
              </div>
            </div>
          </UtensilReorderableListGroup>
        </div>
        <div class="demo-label always-visible">
          Drag people between teams — the clone prop ghosts the grabbed card itself, styled through its moving class
        </div>
      </div>
    </div>

    <div id="reorderable-strip" class="component-demo">
      <h3><a class="demo-anchor" href="#reorderable-strip">Scrolling Strip with Context Menu</a></h3>
      <p>
        A single row inside a horizontal scroller that the clips overflow. Drag to reorder, right-click a clip for its
        menu, or focus one and press Enter to move it with the arrow keys.
      </p>
      <div class="demo-grid strip-demo-grid">
        <div class="demo-item">
          <div class="demo-content strip-demo-content">
            <UtensilScroller class="strip-demo-scroller" horizontal envelope>
              <UtensilReorderableList
                class="strip-demo-list"
                keyboard-grab
                clone
                @grabbed="stripMenuRef?.close()"
                @dropped="reorderStrip"
              >
                <template #default="{ state }">
                  <div
                    v-for="clip in stripClips"
                    :key="clip.id"
                    :data-reorderable-id="clip.id"
                    class="strip-demo-clip"
                    :class="`is-${state(clip.id)}`"
                    tabindex="0"
                    @contextmenu.prevent="openStripMenu(clip, $event)"
                  >
                    <div class="strip-demo-thumb" :style="{ '--clip-hue': clip.hue }">
                      <span class="strip-demo-duration">{{ clip.duration }}</span>
                    </div>
                    <span class="strip-demo-label">{{ clip.label }}</span>
                  </div>
                </template>
              </UtensilReorderableList>
            </UtensilScroller>
          </div>
          <div class="demo-label always-visible">
            Drag to reorder within the scroller — right-click a clip to duplicate, move, or delete it
          </div>
        </div>
      </div>
    </div>

    <UtensilContextMenu ref="stripMenuRef" :position="stripMenuPosition">
      <template #default="{ close }">
        <UtensilMenuItem icon="copy" label="Duplicate" @click="(duplicateStripClip(), close())" />
        <UtensilMenuItem
          icon="chevron-left"
          label="Move to start"
          :disabled="stripMenuIndex === 0"
          @click="(moveStripClip(0), close())"
        />
        <UtensilMenuItem
          icon="chevron-right"
          label="Move to end"
          :disabled="stripMenuIndex === stripClips.length - 1"
          @click="(moveStripClip(stripClips.length - 1), close())"
        />
        <UtensilMenuDivider />
        <UtensilMenuItem icon="trash-alt" label="Delete" color="error" @click="(deleteStripClip(), close())" />
      </template>
    </UtensilContextMenu>

    <template #api>
      <UtensilReorderableListDoc />
      <UtensilReorderableListGroupDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import UtensilReorderableList from 'utensil-vue/components/reorderable-list/UtensilReorderableList.vue'
import UtensilReorderableListGroup from 'utensil-vue/components/reorderable-list/UtensilReorderableListGroup.vue'
import UtensilReorderableListDoc from 'utensil-vue/components/reorderable-list/UtensilReorderableListDoc.vue'
import UtensilReorderableListGroupDoc from 'utensil-vue/components/reorderable-list/UtensilReorderableListGroupDoc.vue'
import UtensilScroller from 'utensil-vue/components/scroller/UtensilScroller.vue'
import UtensilContextMenu from 'utensil-vue/components/context-menu/UtensilContextMenu.vue'
import UtensilMenuDivider from 'utensil-vue/components/menu/UtensilMenuDivider.vue'
import type { ReorderableEvent } from 'utensil-vue/components/reorderable-list/utensil-reorderable-list'
import { ReferenceUserProfileCard } from '@/theme/components/ReferenceUserProfileCard'
import { ReferenceMenuItem as UtensilMenuItem } from '@/theme/components/ReferenceMenuItem'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

const reorderItems = ref(
  ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo'].map((label) => ({ id: label.toLowerCase(), label })),
)

function reorderDemoItems(event: ReorderableEvent) {
  const from = reorderItems.value.findIndex((item) => item.id === event.id)
  const [moved] = reorderItems.value.splice(from, 1)
  reorderItems.value.splice(event.index, 0, moved)
}

interface KanbanCard {
  id: string
  label: string
}

const kanbanTodo = ref<KanbanCard[]>([
  { id: 'card-1', label: 'Design review' },
  { id: 'card-2', label: 'Write copy' },
  { id: 'card-3', label: 'Fix layout' },
])
const kanbanDone = ref<KanbanCard[]>([{ id: 'card-4', label: 'Ship beta' }])

// removed fires on the source before added fires on the destination
let movedKanbanCard: KanbanCard | null = null

const movingKanbanId = ref<string | number | null>(null)
const movingKanbanLabel = computed(
  () => [...kanbanTodo.value, ...kanbanDone.value].find((card) => card.id === movingKanbanId.value)?.label ?? '',
)

function reorderKanban(cards: KanbanCard[], event: ReorderableEvent) {
  const from = cards.findIndex((card) => card.id === event.id)
  const [moved] = cards.splice(from, 1)
  cards.splice(event.index, 0, moved)
}

function removeKanban(cards: KanbanCard[], event: ReorderableEvent) {
  const from = cards.findIndex((card) => card.id === event.id)
  movedKanbanCard = cards.splice(from, 1)[0]
}

function addKanban(cards: KanbanCard[], event: ReorderableEvent) {
  if (movedKanbanCard) cards.splice(event.index, 0, movedKanbanCard)
  movedKanbanCard = null
}

interface TeamMember {
  id: string
  name: string
  email: string
  initials: string
}

const demoTeams = ref<{ name: string; members: TeamMember[] }[]>([
  {
    name: 'Design',
    members: [
      { id: 'maya', name: 'Maya Chen', email: 'maya@example.com', initials: 'MC' },
      { id: 'jonas', name: 'Jonas Weber', email: 'jonas@example.com', initials: 'JW' },
      { id: 'priya', name: 'Priya Sharma', email: 'priya@example.com', initials: 'PS' },
    ],
  },
  {
    name: 'Engineering',
    members: [
      { id: 'liam', name: 'Liam Okafor', email: 'liam@example.com', initials: 'LO' },
      { id: 'sofia', name: 'Sofia Ruiz', email: 'sofia@example.com', initials: 'SR' },
    ],
  },
  {
    name: 'Marketing',
    members: [
      { id: 'noah', name: 'Noah Kim', email: 'noah@example.com', initials: 'NK' },
      { id: 'elena', name: 'Elena Petrova', email: 'elena@example.com', initials: 'EP' },
    ],
  },
])

let movedTeamMember: TeamMember | null = null

function reorderTeam(members: TeamMember[], event: ReorderableEvent) {
  const from = members.findIndex((member) => member.id === event.id)
  const [moved] = members.splice(from, 1)
  members.splice(event.index, 0, moved)
}

function removeTeamMember(members: TeamMember[], event: ReorderableEvent) {
  const from = members.findIndex((member) => member.id === event.id)
  movedTeamMember = members.splice(from, 1)[0]
}

function addTeamMember(members: TeamMember[], event: ReorderableEvent) {
  if (movedTeamMember) members.splice(event.index, 0, movedTeamMember)
  movedTeamMember = null
}

interface StripClip {
  id: string
  label: string
  duration: string
  hue: number
}

const stripClips = ref<StripClip[]>(
  [
    'Intro',
    'Unboxing',
    'First look',
    'Setup',
    'Build quality',
    'Display',
    'Camera',
    'Battery',
    'Audio',
    'Gaming',
    'Verdict',
    'Outro',
  ].map((label, index) => ({
    id: `clip-${index + 1}`,
    label,
    duration: `0:${String(8 + ((index * 7) % 40)).padStart(2, '0')}`,
    // Spread around the wheel so neighboring thumbnails read as different clips
    hue: (index * 137) % 360,
  })),
)

let nextStripClipId = stripClips.value.length + 1

const stripMenuRef = ref<InstanceType<typeof UtensilContextMenu>>()
const stripMenuPosition = ref({ x: 0, y: 0 })
const stripMenuClipId = ref<string | null>(null)
const stripMenuIndex = computed(() => stripClips.value.findIndex((clip) => clip.id === stripMenuClipId.value))

function openStripMenu(clip: StripClip, event: MouseEvent) {
  stripMenuClipId.value = clip.id
  stripMenuPosition.value = { x: event.clientX, y: event.clientY }
  stripMenuRef.value?.forceOpen()
}

function reorderStrip(event: ReorderableEvent) {
  const from = stripClips.value.findIndex((clip) => clip.id === event.id)
  const [moved] = stripClips.value.splice(from, 1)
  stripClips.value.splice(event.index, 0, moved)
}

function duplicateStripClip() {
  const index = stripMenuIndex.value
  if (index < 0) return
  stripClips.value.splice(index + 1, 0, { ...stripClips.value[index], id: `clip-${nextStripClipId++}` })
}

function moveStripClip(to: number) {
  const from = stripMenuIndex.value
  if (from < 0) return
  const [moved] = stripClips.value.splice(from, 1)
  stripClips.value.splice(to, 0, moved)
}

function deleteStripClip() {
  const index = stripMenuIndex.value
  if (index >= 0) stripClips.value.splice(index, 1)
}
</script>

<style scoped>
.demo-content {
  min-height: 200px;
}

/* Two grid tracks where the grid is wide enough to have them */
@media (min-width: 960px) {
  .demo-item-double {
    grid-column: span 2;
  }
}

.reorder-demo-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
  max-width: 280px;
}

.reorder-demo-item {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-3);
  background: var(--pencil-a3);
  cursor: grab;
  outline: 2px solid transparent;
  outline-offset: -2px;
}

.reorder-demo-item:focus-visible {
  outline-color: var(--pen-8);
}

.reorder-demo-item.is-grabbed {
  background: var(--pen-a4);
}

.reorder-demo-item.is-invalid {
  opacity: 0.5;
}

/* Fixed height with stretching columns, so card moves never resize or jiggle the layout */
.kanban-demo {
  display: flex;
  align-items: stretch;
  gap: var(--space-4);
  width: 100%;
  min-height: 260px;
}

.kanban-demo-column {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.kanban-demo-column h4 {
  margin: 0;
  font-size: var(--font-size-1);
  color: var(--pencil-a11);
}

.kanban-demo-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-2);
  border-radius: var(--radius-3);
  background: var(--pencil-a2);
}

.kanban-demo-card {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-2);
  background: var(--surface);
  box-shadow: var(--shadow-border-1);
  cursor: grab;
}

/* Fills the ghost, which carries the grabbed card's exact size */
.kanban-demo-card-moving {
  box-sizing: border-box;
  height: 100%;
  display: flex;
  align-items: center;
  box-shadow: var(--shadow-3);
  rotate: 2deg;
}

/* Fills the home overlay covering the vacated card's space */
.kanban-demo-home {
  box-sizing: border-box;
  height: 100%;
  border: 1px dashed var(--pencil-a7);
  border-radius: var(--radius-2);
  background: var(--pencil-a2);
}

/* In target-placeholder mode the traveling placeholder lights up when the target is home */
.kanban-demo-home.targeted {
  border: 1px solid var(--pen-9);
  background: var(--pen-a3);
}

.team-demo {
  display: flex;
  align-items: stretch;
  gap: var(--space-4);
  width: 100%;
  min-height: 300px;
}

.team-demo-column {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.team-demo-column h4 {
  margin: 0;
  font-size: var(--font-size-1);
  color: var(--pencil-a11);
}

.team-demo-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 624px;
  gap: var(--space-2);
  padding: var(--space-2);
  border-radius: var(--radius-3);
  background: var(--pencil-a2);
}

.utensil-card.team-demo-card.pencil.ui-surface {
  cursor: grab;
  background-color: var(--pencil-1);
}

/* Worn by the ghost — the clone is taken with the moving class already on the card */
.team-demo-card.is-moving {
  box-shadow: var(--shadow-3);
}

.team-demo-home {
  box-sizing: border-box;
  height: 100%;
  border-radius: var(--radius-4);
  background: var(--pencil-a2);
}

.strip-demo-grid {
  grid-template-columns: 1fr;
}

.demo-content.strip-demo-content {
  min-height: 0;
  padding: var(--space-3);
  align-items: stretch;
}

/* The scroller is the overflow element; flex keeps the envelope sentinels at the row's ends */
.strip-demo-scroller {
  display: flex;
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
}

/* A single row that grows past the scroller instead of wrapping */
.strip-demo-list {
  display: flex;
  flex-shrink: 0;
  min-width: 100%;
  gap: var(--space-2);
  padding: var(--space-2);
}

.strip-demo-clip {
  flex: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  width: 140px;
  padding: var(--space-1);
  border-radius: var(--radius-1);
  background: var(--pencil-a3);
  cursor: grab;
  outline: 2px solid transparent;
  outline-offset: -2px;
}

.strip-demo-clip:focus-visible {
  outline-color: var(--pen-8);
}

.strip-demo-clip.is-grabbed {
  background: var(--pen-a4);
}

/* Worn by the ghost, which clones the card in its moving state — opaque so the page doesn't show through */
.strip-demo-clip.is-moving {
  background: var(--panel-solid);
  box-shadow: var(--shadow-3);
}

.strip-demo-clip.is-invalid {
  opacity: 0.5;
}

/* Thumbnails stand in for media, so their colors stay fixed across modes */
.strip-demo-thumb {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-1);
  background: oklch(58% 0.12 var(--clip-hue));
}

.strip-demo-duration {
  position: absolute;
  right: var(--space-1);
  bottom: var(--space-1);
  padding: 0 var(--space-1);
  border-radius: var(--radius-1);
  background: oklch(15% 0 0 / 0.7);
  color: oklch(98% 0 0);
  font-size: var(--font-size-1);
  font-variant-numeric: tabular-nums;
}

.strip-demo-label {
  padding: 0 var(--space-1);
  font-size: var(--font-size-1);
  color: var(--pencil-12);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
