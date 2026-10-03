<template>
  <ReferenceComponentDemo
    title="Toggle Button"
    anchor="toggle-button"
    description="Icon-only toggle button with an optional label. Combines UtensilButton with toggle state management."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceToggleButton v-model="toggleNoLabel" icon="bold" />
          <ReferenceToggleButton v-model="toggleNoLabel2" icon="italic" variation="soft" />
          <ReferenceToggleButton v-model="toggleNoLabel3" icon="underline" variation="outline" />
        </div>
        <div class="demo-label">Without Labels</div>
        <div class="demo-code">
          <code>&lt;UtensilToggleButton v-model="on" icon="bold" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <div class="demo-stack">
            <ReferenceToggleButton v-model="toggleBold" icon="bold" label="Bold" />
            <ReferenceToggleButton v-model="toggleItalic" icon="italic" label="Italic" />
            <ReferenceToggleButton v-model="toggleUnderline" icon="underline" label="Underline" />
          </div>
        </div>
        <div class="demo-label">With Labels</div>
        <div class="demo-code">
          <code>&lt;UtensilToggleButton v-model="on" icon="bold" label="Bold" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <div class="demo-stack align-start">
            <ReferenceToggleButton v-model="toggleBold2" icon="bold" label="Bold" label-position="end" />
            <ReferenceToggleButton v-model="toggleItalic2" icon="italic" label="Italic" label-position="end" />
            <ReferenceToggleButton v-model="toggleUnderline2" icon="underline" label="Underline" label-position="end" />
          </div>
        </div>
        <div class="demo-label">Label Position: End</div>
        <div class="demo-code">
          <code>&lt;UtensilToggleButton label="Bold" label-position="end" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <div class="demo-stack">
            <ReferenceToggleButton v-model="toggleSolid" icon="star" variation="solid" label="Solid" />
            <ReferenceToggleButton v-model="toggleSoft" icon="star" label="Soft" />
            <ReferenceToggleButton v-model="toggleText" icon="star" variation="text" label="Text" />
            <ReferenceToggleButton v-model="toggleOutline" icon="star" variation="outline" label="Outline" />
            <ReferenceToggleButton v-model="toggleSurface" icon="star" variation="surface" label="Surface" />
          </div>
        </div>
        <div class="demo-label">Variations</div>
        <div class="demo-code">
          <code>&lt;UtensilToggleButton variation="soft" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <div class="demo-stack">
            <ReferenceToggleButton
              v-model="toggleStarred"
              icon="star"
              label="Starred"
              on-variation="solid"
              on-color="pen"
              off-variation="outline"
              off-color="pencil"
            />
            <ReferenceToggleButton
              v-model="toggleLiked"
              icon="heart"
              label="Liked"
              on-variation="solid"
              on-color="pen"
              off-variation="outline"
              off-color="pencil"
            />
          </div>
        </div>
        <div class="demo-label always-visible">On: solid pen. Off: outline pencil</div>
        <div class="demo-code">
          <code
            >&lt;UtensilToggleButton on-variation="solid" on-color="pen" off-variation="outline" off-color="pencil"
            /&gt;</code
          >
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <div class="demo-stack label-end">
            <ReferenceToggleButton
              v-model="toggleColor1"
              icon="heart"
              color="error"
              label="Favorite"
              label-position="end"
            />
            <ReferenceToggleButton
              v-model="toggleColor2"
              icon="check"
              color="success"
              label="Approve"
              label-position="end"
            />
            <ReferenceToggleButton
              v-model="toggleColor3"
              icon="tag"
              color="warning"
              label="Bookmark"
              label-position="end"
            />
          </div>
        </div>
        <div class="demo-label">Colors</div>
        <div class="demo-code">
          <code>&lt;UtensilToggleButton icon="heart" color="error" /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <div class="demo-stack">
            <ReferenceToggleButton icon="lock" label="Locked Off" disabled />
            <ReferenceToggleButton :model-value="true" icon="lock" label="Locked On" disabled />
          </div>
        </div>
        <div class="demo-label">Disabled</div>
        <div class="demo-code">
          <code>&lt;UtensilToggleButton icon="lock" disabled /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <ReferenceToggleButton v-model="toggleRound" icon="heart" round color="error" />
          <ReferenceToggleButton v-model="toggleRound2" icon="star" round color="warning" />
        </div>
        <div class="demo-label">Round</div>
        <div class="demo-code">
          <code>&lt;UtensilToggleButton icon="heart" round /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilToggleButtonDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilToggleButtonDoc from 'utensil-vue/components/toggle-button/UtensilToggleButtonDoc.vue'
import { ReferenceToggleButton } from '@/theme/components/ReferenceToggleButton'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'

const toggleBold = ref(false)
const toggleItalic = ref(true)
const toggleUnderline = ref(false)
const toggleBold2 = ref(true)
const toggleItalic2 = ref(false)
const toggleUnderline2 = ref(false)
const toggleNoLabel = ref(true)
const toggleNoLabel2 = ref(false)
const toggleNoLabel3 = ref(true)
const toggleText = ref(false)
const toggleSolid = ref(false)
const toggleSoft = ref(false)
const toggleOutline = ref(false)
const toggleSurface = ref(false)
const toggleStarred = ref(true)
const toggleLiked = ref(false)
const toggleColor1 = ref(false)
const toggleColor2 = ref(false)
const toggleColor3 = ref(false)
const toggleRound = ref(false)
const toggleRound2 = ref(false)
</script>

<style scoped>
.demo-content {
  min-height: 80px;
}

.demo-stack.label-end {
  align-items: flex-start;
}
</style>
