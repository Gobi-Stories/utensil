<template generic="Theme extends ThemeConfig">
  <UtensilCard
    class="utensil-user-profile-card"
    :variation="bordered ? 'surface' : 'unstyled'"
    :color="color"
    :scale="scale"
  >
    <slot name="avatar">
      <UtensilAvatar class="profile-avatar" :src="src" :alt="alt ?? name" :fallback="fallback" />
    </slot>
    <div class="profile-info">
      <span class="profile-name">{{ name }}</span>
      <span v-if="email" class="profile-email">{{ email }}</span>
      <div v-if="$slots.default" class="profile-bottom">
        <slot></slot>
      </div>
    </div>
  </UtensilCard>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import type { ColorProp, ScaleProp, ThemeConfig } from '../../theme/utensil-theme'
import UtensilAvatar from '../avatar/UtensilAvatar.vue'
import UtensilCard from '../card/UtensilCard.vue'

// A horizontal identity card: avatar beside the person's name and email, with room for extra
// content underneath. Borderless it doubles as a header inside popovers and panels.
export interface Props<Theme extends ThemeConfig> {
  name: string
  email?: string
  // Avatar image and fallback initials; the avatar slot replaces the whole avatar.
  src?: string
  alt?: string
  fallback?: string
  color?: ColorProp<Theme>
  scale?: ScaleProp
  bordered?: boolean
}

const { color = 'pen', scale = 1, bordered = true } = defineProps<Props<Theme>>()
</script>

<style scoped>
@layer utensil {
  .utensil-user-profile-card {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    min-width: 0;
  }

  .profile-avatar {
    --utensil-avatar-size: var(--user-profile-card-avatar-size, var(--space-8));
    flex-shrink: 0;
  }

  .profile-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    min-width: 0;
  }

  .profile-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: var(--font-size-3);
    font-weight: 600;
    color: var(--pencil-12);
  }

  .profile-email {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: var(--font-size-2);
    color: var(--pencil-a11);
  }

  .profile-bottom {
    margin-block-start: var(--space-1);
  }
}
</style>
