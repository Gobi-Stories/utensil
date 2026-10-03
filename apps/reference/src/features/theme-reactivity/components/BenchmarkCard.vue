<template>
  <ReferenceCard class="benchmark-card" variation="surface">
    <div class="flex align-center gap-2">
      <ReferenceIcon icon="photo-film" />
      <span class="card-title">Asset {{ index + 1 }}</span>
      <ReferenceBadge label="Video" color="primary" scale="small" />
    </div>
    <div class="flex align-center gap-2">
      <ReferencePill label="4K" variation="soft" scale="small" />
      <ReferenceButton scale="small" variation="soft" icon="play">Play</ReferenceButton>
      <ReferenceCircleButton icon="ellipsis-v" variation="text" scale="small" description="More" />
    </div>
  </ReferenceCard>
</template>

<script setup lang="ts">
import { ReferenceCard } from '@/theme/components/ReferenceCard'
import { ReferenceIcon } from '@/theme/components/ReferenceIcon'
import { ReferenceBadge } from '@/theme/components/ReferenceBadge'
import { ReferencePill } from '@/theme/components/ReferencePill'
import { ReferenceButton } from '@/theme/components/ReferenceButton'
import { ReferenceCircleButton } from '@/theme/components/ReferenceCircleButton'

// One grid card composing several themed primitives — each mounts its own
// useTheme() call, mirroring the asset library's media cards.
interface Props {
  index: number
}

defineProps<Props>()
</script>

<style scoped>
.benchmark-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-3);
}

.card-title {
  flex: 1;
  min-width: 0;
  font-size: var(--font-size-2);
  color: var(--pencil-12);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
