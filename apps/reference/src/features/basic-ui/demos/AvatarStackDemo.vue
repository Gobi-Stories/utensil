<template>
  <ReferenceComponentDemo
    title="Avatar Stack"
    anchor="avatar-stack"
    description="Overlapping stack of avatars with configurable overlap and an append slot for extra content."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content">
          <UtensilAvatarStack>
            <ReferenceAvatar fallback="A" variation="solid" color="blue" />
            <ReferenceAvatar fallback="B" variation="solid" color="green" />
            <ReferenceAvatar fallback="C" variation="solid" color="orange" />
            <ReferenceAvatar fallback="D" variation="solid" color="pink" />
            <ReferenceAvatar fallback="E" variation="solid" color="red" />
            <template #append>
              <span class="avatar-stack-count">+12</span>
            </template>
          </UtensilAvatarStack>
        </div>
        <div class="demo-label">Default</div>
        <div class="demo-code">
          <code
            >&lt;UtensilAvatarStack&gt;&lt;UtensilAvatar /&gt;...&lt;template
            #append&gt;+12&lt;/template&gt;&lt;/UtensilAvatarStack&gt;</code
          >
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilAvatarStack :overlap="1">
            <ReferenceAvatar fallback="A" variation="solid" />
            <ReferenceAvatar fallback="B" variation="solid" color="success" />
            <ReferenceAvatar fallback="C" variation="solid" color="warning" />
            <ReferenceAvatar fallback="D" variation="solid" color="error" />
          </UtensilAvatarStack>
        </div>
        <div class="demo-label">Loose</div>
        <div class="demo-code">
          <code>&lt;UtensilAvatarStack :overlap="1"&gt;...&lt;/UtensilAvatarStack&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilAvatarStack :overlap="4">
            <ReferenceAvatar fallback="A" variation="solid" color="blue" />
            <ReferenceAvatar fallback="B" variation="solid" color="green" />
            <ReferenceAvatar fallback="C" variation="solid" color="orange" />
          </UtensilAvatarStack>
        </div>
        <div class="demo-label">Tight</div>
        <div class="demo-code">
          <code>&lt;UtensilAvatarStack :overlap="4"&gt;...&lt;/UtensilAvatarStack&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilAvatarStack radius="medium">
            <ReferenceStackedAvatar fallback="A" color="blue" />
            <ReferenceStackedAvatar fallback="B" color="green" />
            <ReferenceStackedAvatar fallback="C" color="orange" />
            <ReferenceStackedAvatar fallback="D" color="pink" />
          </UtensilAvatarStack>
        </div>
        <div class="demo-label">Shared Config</div>
        <div class="demo-code">
          <code
            >&lt;UtensilAvatarStack radius="medium"&gt;&lt;UtensilStackedAvatar
            /&gt;...&lt;/UtensilAvatarStack&gt;</code
          >
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content">
          <UtensilAvatarStack scale="small">
            <ReferenceStackedAvatar fallback="A" color="blue" />
            <ReferenceStackedAvatar fallback="B" color="green" />
            <ReferenceStackedAvatar fallback="C" color="orange" />
            <ReferenceStackedAvatar fallback="D" color="pink" />
            <ReferenceStackedAvatar fallback="E" color="red" />
          </UtensilAvatarStack>
        </div>
        <div class="demo-label">Scaled</div>
        <div class="demo-code">
          <code>&lt;UtensilAvatarStack scale="small"&gt;...&lt;/UtensilAvatarStack&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilAvatarStackDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import UtensilAvatarStack from 'utensil-vue/components/avatar/UtensilAvatarStack.vue'
import UtensilAvatarStackDoc from 'utensil-vue/components/avatar/UtensilAvatarStackDoc.vue'
import { ReferenceAvatar } from '@/theme/components/ReferenceAvatar'
import { ReferenceStackedAvatar } from '@/theme/components/ReferenceStackedAvatar'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
</script>

<style scoped>
.demo-content {
  min-height: 80px;
}

.avatar-stack-count {
  margin-left: var(--space-2);
  font-size: var(--font-size-2);
  font-weight: 500;
  color: var(--pencil-11);
}
</style>
