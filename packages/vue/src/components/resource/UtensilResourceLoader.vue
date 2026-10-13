<template>
  <UtensilSpinnerOverlay
    class="utensil-resource-loader"
    :show="spinning"
    :delay="0"
    :scale="spinnerScale"
    :lift="liftUi"
    :vanish="!fadeSpinner"
  >
    <UtensilFader :show="loaded && !spinning" :enabled="fadeContent" :fadeOut="fadeOut" once>
      <slot v-if="loaded && !spinning" />
    </UtensilFader>
    <template v-if="showErrors && !loaded && hasError && !spinning" #default>
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
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import UtensilButton from '../button/UtensilButton.vue'
import UtensilFader from '../fader/UtensilFader.vue'
import UtensilSpinnerOverlay from '../spinner/UtensilSpinnerOverlay.vue'
import type { ScaleProp } from '../../theme/utensil-theme'

export interface Props {
  load?: () => void
  loaded?: boolean
  syncing?: boolean
  hasError?: boolean
  mayRetry?: boolean
  notFound?: boolean
  showSpinner?: boolean
  showErrors?: boolean
  loaderDelay?: number
  /** Milliseconds a spinner stays once it appears */
  loaderMinimum?: number
  spinnerScale?: ScaleProp
  fadeSpinner?: boolean
  fadeContent?: boolean
  fadeOut?: boolean
  liftUi?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  load: undefined,
  loaded: false,
  syncing: false,
  hasError: false,
  mayRetry: false,
  showSpinner: true,
  showErrors: true,
  loaderDelay: 1750,
  loaderMinimum: 1000,
  spinnerScale: 1,
  fadeSpinner: false,
  fadeContent: false,
  fadeOut: false,
  liftUi: false,
})

const waiting = computed(() => props.showSpinner && !props.loaded && props.syncing)

const spinning = ref(false)
let shownAt = 0
let timer: ReturnType<typeof setTimeout> | undefined

function spin() {
  spinning.value = true
  shownAt = Date.now()
}

watch(
  waiting,
  (now) => {
    clearTimeout(timer)
    timer = undefined
    if (now) {
      if (!spinning.value) {
        if (props.loaderDelay > 0) {
          timer = setTimeout(spin, props.loaderDelay)
        } else {
          spin()
        }
      }
      return
    }

    const left = props.loaderMinimum - (Date.now() - shownAt)
    if (spinning.value && left > 0) {
      timer = setTimeout(() => (spinning.value = false), left)
    } else {
      spinning.value = false
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => clearTimeout(timer))
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
