<template>
  <ReferenceComponentDemo
    title="Data List"
    anchor="data-list"
    description="Displays structured key-value pairs using semantic definition list markup."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content data-list-demo">
          <UtensilDataList>
            <UtensilDataListItem label="Name">Sofia Chen</UtensilDataListItem>
            <UtensilDataListItem label="Email">sofia.chen@example.com</UtensilDataListItem>
            <UtensilDataListItem label="Role">Administrator</UtensilDataListItem>
            <UtensilDataListItem label="Status">
              <ReferenceBadge variation="soft" color="success" scale="small">Active</ReferenceBadge>
            </UtensilDataListItem>
          </UtensilDataList>
        </div>
        <div class="demo-label">Horizontal</div>
      </div>
      <div class="demo-item">
        <div class="demo-content data-list-demo">
          <UtensilDataList orientation="vertical">
            <UtensilDataListItem label="Description">
              A longer description that benefits from the full width of the container.
            </UtensilDataListItem>
            <UtensilDataListItem label="Labels">
              <ReferencePill variation="outline" label="Design" />
              <ReferencePill variation="outline" label="Frontend" />
              <ReferencePill variation="outline" label="Vue" />
            </UtensilDataListItem>
          </UtensilDataList>
        </div>
        <div class="demo-label">Vertical</div>
      </div>
      <div class="demo-item">
        <div class="demo-content data-list-demo">
          <UtensilDataList block>
            <UtensilDataListItem label="Media type">Video</UtensilDataListItem>
            <UtensilDataListItem label="Dimensions">1920 &times; 1080</UtensilDataListItem>
            <UtensilDataListItem label="Aspect ratio">16:9</UtensilDataListItem>
            <UtensilDataListItem label="Frame rate">30 fps</UtensilDataListItem>
            <UtensilDataListItem label="Duration">0:42</UtensilDataListItem>
            <UtensilDataListItem label="Format">video/mp4</UtensilDataListItem>
          </UtensilDataList>
        </div>
        <div class="demo-label">Block</div>
      </div>
      <div class="demo-item">
        <div class="demo-content data-list-demo">
          <UtensilDataList block>
            <UtensilDataListItem label="Status" alignment="center">
              <ReferenceBadge variation="soft" color="success" scale="small">Published</ReferenceBadge>
            </UtensilDataListItem>
            <UtensilDataListItem label="Team" alignment="center">
              <UtensilAvatarStack :overlap="3">
                <ReferenceAvatar fallback="A" variation="solid" scale="tiny" />
                <ReferenceAvatar fallback="B" variation="solid" color="success" scale="tiny" />
                <ReferenceAvatar fallback="C" variation="solid" color="warning" scale="tiny" />
              </UtensilAvatarStack>
            </UtensilDataListItem>
          </UtensilDataList>
        </div>
        <div class="demo-label">Center Aligned</div>
      </div>
    </div>

    <template #api>
      <UtensilDataListDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import UtensilDataList from 'utensil-vue/components/data-list/UtensilDataList.vue'
import UtensilDataListItem from 'utensil-vue/components/data-list/UtensilDataListItem.vue'
import UtensilDataListDoc from 'utensil-vue/components/data-list/UtensilDataListDoc.vue'
import UtensilAvatarStack from 'utensil-vue/components/avatar/UtensilAvatarStack.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { ReferenceBadge } from '@/theme/components/ReferenceBadge'
import { ReferencePill } from '@/theme/components/ReferencePill'
import { ReferenceAvatar } from '@/theme/components/ReferenceAvatar'
</script>

<style scoped>
.demo-content.data-list-demo {
  align-items: stretch;
  padding: var(--space-4);
}
</style>
