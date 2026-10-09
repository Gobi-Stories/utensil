<template>
  <ReferenceComponentDemo
    title="User Profile Card"
    anchor="user-profile-card"
    description="Horizontal identity card with an avatar, name, email and room for extra content."
  >
    <div class="demo-grid">
      <div class="demo-item">
        <div class="demo-content profile-card-demo">
          <ReferenceUserProfileCard
            name="Sofia Chen"
            email="sofia.chen@example.com"
            src="https://i.pravatar.cc/150?u=sofia"
            fallback="SC"
          />
        </div>
        <div class="demo-label">Default</div>
        <div class="demo-code">
          <code>&lt;UtensilUserProfileCard name="Sofia Chen" email="..." src="..." /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content profile-card-demo">
          <ReferenceUserProfileCard name="Sofia Chen" email="sofia.chen@example.com" fallback="SC" :bordered="false" />
        </div>
        <div class="demo-label">Borderless</div>
        <div class="demo-code">
          <code>&lt;UtensilUserProfileCard :bordered="false" ... /&gt;</code>
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content profile-card-demo">
          <ReferenceUserProfileCard name="Sofia Chen" email="sofia.chen@example.com" fallback="SC" color="favorite">
            <ReferenceBadge variation="soft" color="favorite" scale="small">Owner</ReferenceBadge>
          </ReferenceUserProfileCard>
        </div>
        <div class="demo-label">Colored with Bottom Slot</div>
        <div class="demo-code">
          <code
            >&lt;UtensilUserProfileCard color="favorite"&gt;&lt;UtensilBadge /&gt;&lt;/UtensilUserProfileCard&gt;</code
          >
        </div>
      </div>
      <div class="demo-item">
        <div class="demo-content profile-card-demo">
          <ReferenceUserProfileCard name="Sofia Chen" email="sofia.chen@example.com" fallback="SC" scale="small" />
          <ReferenceUserProfileCard name="Sofia Chen" email="sofia.chen@example.com" fallback="SC" scale="large" />
        </div>
        <div class="demo-label">Scaled</div>
        <div class="demo-code">
          <code>&lt;UtensilUserProfileCard scale="small" ... /&gt;</code>
        </div>
      </div>
    </div>

    <template #api>
      <UtensilUserProfileCardDoc />
    </template>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import UtensilUserProfileCardDoc from '@gobistories/utensil-vue/components/user-profile-card/UtensilUserProfileCardDoc.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { ReferenceUserProfileCard } from '@/theme/components/ReferenceUserProfileCard'
import { ReferenceBadge } from '@/theme/components/ReferenceBadge'
</script>

<style scoped>
.demo-content.profile-card-demo {
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-3);
}
</style>
