<template>
  <slot />
</template>

<script setup lang="ts">
import { provideReorderableGroup } from './utensil-reorderable-list'

// Renderless component form of provideReorderableGroup(): descendant UtensilReorderableLists with a
// matching namespace accept each other's items.
provideReorderableGroup()
</script>
