<template>
  <AcmeThemeRoot :mode="mode">
    <main class="flex column gap-4 padding-5">
      <AcmeButton color="primary" icon="trash" @click="toggleThemeMode">Toggle mode</AcmeButton>
      <!-- @vue-expect-error 'purple' is not an Acme color or variant -->
      <AcmeButton color="purple">Not an Acme color</AcmeButton>
    </main>
  </AcmeThemeRoot>
</template>

<script setup lang="ts">
import AcmeThemeRoot from './acme-theme/AcmeThemeRoot.vue'
import { AcmeButton } from './acme-theme/components/AcmeButton'
import { useUserThemePreferences } from '@gobistories/utensil-vue/theme/useUserThemePreferences'

const { mode, toggleThemeMode } = useUserThemePreferences()
</script>
