<template>
  <UtensilSpinnerOverlay
    class="utensil-resource-loader"
    :show="showSpinner && !loaded && syncing"
    :delay="loaderDelay"
    :scale="spinnerScale"
    :lift="liftUi"
    :vanish="!fadeSpinner"
  >
    <UtensilFader :show="loaded" :enabled="fadeContent" :fadeOut="fadeOut" once>
      <slot v-if="loaded" />
    </UtensilFader>
    <template v-if="showErrors && !loaded && hasError" #default>
      <slot name="error">
        <div v-if="notFound" class="resource-error not-found" :class="{ lift: liftUi }">
          <p>We couldn't find what you are looking for.</p>
          <slot name="notFoundActions" />
        </div>
        <div v-else class="resource-error" :class="{ lift: liftUi }">
          <p>Something went wrong loading this content.</p>
          <UtensilButton v-if="mayRetry" @click="load">Try Again</UtensilButton>
          <slot name="errorActions" />
        </div>
      </slot>
    </template>
  </UtensilSpinnerOverlay>
</template>

<script setup lang="ts">
import UtensilButton from '../button/UtensilButton.vue'
import UtensilFader from '../fader/UtensilFader.vue'
import UtensilSpinnerOverlay from '../spinner/UtensilSpinnerOverlay.vue'
import type { ScaleProp } from '../../theme/utensil-theme'

interface Props {
  load?: () => void
  loaded?: boolean
  syncing?: boolean
  hasError?: boolean
  mayRetry?: boolean
  notFound?: boolean
  showSpinner?: boolean
  showErrors?: boolean
  loaderDelay?: number
  spinnerScale?: ScaleProp
  fadeSpinner?: boolean
  fadeContent?: boolean
  fadeOut?: boolean
  liftUi?: boolean
}

withDefaults(defineProps<Props>(), {
  load: undefined,
  loaded: false,
  syncing: false,
  hasError: false,
  mayRetry: false,
  error: undefined,
  showSpinner: true,
  showErrors: true,
  loaderDelay: 1750,
  spinnerScale: 1,
  fadeSpinner: false,
  fadeContent: false,
  fadeOut: false,
  liftUi: false,
})
</script>

<style scoped>
@layer utensil {
  .utensil-spinner-overlay {
    inset: 0;
  }

  .resource-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: var(--space-5);
    text-align: center;
    color: var(--pencil-11);
  }

  .resource-error.not-found {
    min-height: 200px;
  }

  .resource-error.lift {
    height: 90%;
  }

  .resource-error p {
    margin: 0 0 var(--space-4) 0;
    font-size: var(--font-size-2);
  }
}
</style>
