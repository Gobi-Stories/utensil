<template>
  <div ref="containerEl" class="utensil-maximizer" :class="{ disabled: isDisabled }">
    <div v-show="visible" class="utensil-maximizer-child" :style="childStyle">
      <slot :disabled="isDisabled"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { calculateMaximizerLayout, type MaximizerConstraints, CONSTRAINT_DEFAULTS } from './utensil-maximizer'

interface Props {
  disabled?: boolean
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const containerEl = ref<HTMLElement>()
const containerWidth = ref(0)
const containerHeight = ref(0)
const mounted = ref(false)
const cvarDisabled = ref(false)
const cvarConstraints = ref<Partial<MaximizerConstraints>>({})

const isDisabled = computed(() => props.disabled || cvarDisabled.value)

function resolveConstraint(prop: number | undefined, cvar: number | undefined, fallback: number): number {
  return prop ?? cvar ?? fallback
}

const constraints = computed<MaximizerConstraints>(() => ({
  minWidth: resolveConstraint(props.minWidth, cvarConstraints.value.minWidth, CONSTRAINT_DEFAULTS.minWidth),
  maxWidth: resolveConstraint(props.maxWidth, cvarConstraints.value.maxWidth, CONSTRAINT_DEFAULTS.maxWidth),
  minHeight: resolveConstraint(props.minHeight, cvarConstraints.value.minHeight, CONSTRAINT_DEFAULTS.minHeight),
  maxHeight: resolveConstraint(props.maxHeight, cvarConstraints.value.maxHeight, CONSTRAINT_DEFAULTS.maxHeight),
}))

const layout = computed(() => calculateMaximizerLayout(containerWidth.value, containerHeight.value, constraints.value))

const visible = computed(() => {
  if (isDisabled.value) return true
  return mounted.value && layout.value !== null
})

const childStyle = computed(() => {
  if (isDisabled.value || !layout.value) return undefined

  const { childWidth, childHeight, left, top, scale } = layout.value

  return {
    width: `${childWidth}px`,
    height: `${childHeight}px`,
    left: `${left}px`,
    top: `${top}px`,
    transform: `scale(${scale})`,
  }
})

function readCvarNumber(style: CSSStyleDeclaration, name: string): number | undefined {
  const raw = style.getPropertyValue(name).trim()
  if (!raw) return undefined
  const value = Number(raw)
  return Number.isFinite(value) ? value : undefined
}

function readCvars() {
  if (!containerEl.value) return
  const style = getComputedStyle(containerEl.value)

  cvarDisabled.value = style.getPropertyValue('--utensil-maximizer-disabled').trim() === '1'

  cvarConstraints.value = {
    minWidth: readCvarNumber(style, '--utensil-maximizer-min-width'),
    maxWidth: readCvarNumber(style, '--utensil-maximizer-max-width'),
    minHeight: readCvarNumber(style, '--utensil-maximizer-min-height'),
    maxHeight: readCvarNumber(style, '--utensil-maximizer-max-height'),
  }
}

let containerObserver: ResizeObserver | undefined
let viewportObserver: ResizeObserver | undefined

function startContainerObserver() {
  if (containerObserver || !containerEl.value) return
  containerObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      containerWidth.value = entry.contentRect.width
      containerHeight.value = entry.contentRect.height
    }
    readCvars()
  })
  containerObserver.observe(containerEl.value)
}

function stopContainerObserver() {
  containerObserver?.disconnect()
  containerObserver = undefined
}

// While disabled the container has no layout of its own (display: contents), so
// cvars are re-read on viewport resize instead to notice when it is re-enabled.
function startViewportObserver() {
  if (viewportObserver) return
  viewportObserver = new ResizeObserver(() => {
    readCvars()
  })
  viewportObserver.observe(document.documentElement)
}

function stopViewportObserver() {
  viewportObserver?.disconnect()
  viewportObserver = undefined
}

function syncObservers() {
  if (isDisabled.value) {
    stopContainerObserver()
    startViewportObserver()
  } else {
    stopViewportObserver()
    startContainerObserver()
  }
}

watch(isDisabled, syncObservers)

onMounted(() => {
  if (!containerEl.value) return
  mounted.value = true
  readCvars()
  syncObservers()
})

onUnmounted(() => {
  stopContainerObserver()
  stopViewportObserver()
})
</script>

<style scoped>
@layer utensil {
  .utensil-maximizer {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  .utensil-maximizer.disabled {
    display: contents;
  }

  .utensil-maximizer-child {
    position: absolute;
    transform-origin: top left;
    flex-shrink: 0;
    container-type: size;
    container-name: size-container;
  }

  .utensil-maximizer.disabled .utensil-maximizer-child {
    display: contents;
    container-type: none;
    container-name: none;
  }
}
</style>
