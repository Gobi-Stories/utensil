<template generic="Theme extends ThemeConfig">
  <span
    class="utensil-avatar"
    :class="[...themeClasses, `ui-${variation}`, radiusClass, { loaded: imageLoaded }]"
    :style="style"
    role="img"
    :aria-label="alt || fallback"
  >
    <img
      v-if="src"
      class="utensil-avatar-image"
      :class="{ loaded: imageLoaded }"
      :src="src"
      :alt="alt"
      @load="onImageLoad"
      @error="onImageError"
    />
    <UtensilIcon v-else-if="icon" :icon="icon" class="font-size-4" />
    <span v-if="!imageLoaded && !icon" class="utensil-avatar-fallback">
      <slot name="fallback">
        {{ fallback }}
      </slot>
    </span>
  </span>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed, ref, watch } from 'vue'
import type { ColorProp, IconProp, ThemeConfig, ScaleProp } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'
import type { AvatarVariation, AvatarRadius } from './utensil-avatar-stack'
import UtensilIcon from '../icon/UtensilIcon.vue'

export interface Props<Theme extends ThemeConfig> {
  src?: string
  alt?: string
  icon?: IconProp<Theme>
  fallback?: string
  variation?: AvatarVariation
  color?: ColorProp<Theme>
  radius?: AvatarRadius
  scale?: ScaleProp
  delayMs?: number
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  variation: 'soft',
  color: 'pen',
  radius: 'full',
  scale: 1,
  delayMs: 0,
})

const emit = defineEmits<{
  load: []
  error: []
}>()

const imageLoaded = ref(false)
const imageError = ref(false)

const penColor = computed<ColorProp<Theme>>(() => props.color || 'pen')

const { classes: themeClasses, style } = useTheme({
  pen: penColor,
  relativeScale: () => props.scale,
})

const radiusClass = computed(() => `radius-${props.radius}`)

// Reset state when src changes
watch(
  () => props.src,
  () => {
    imageLoaded.value = false
    imageError.value = false
  },
)

function onImageLoad() {
  if (props.delayMs > 0) {
    setTimeout(() => {
      imageLoaded.value = true
    }, props.delayMs)
  } else {
    imageLoaded.value = true
  }
  emit('load')
}

function onImageError() {
  imageError.value = true
  emit('error')
}
</script>

<style scoped>
@layer utensil {
  .utensil-avatar {
    --avatar-size: var(--utensil-avatar-size, var(--space-7));
    --text-color: var(--avatar-text-color);

    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--avatar-size);
    max-width: var(--avatar-size);
    height: var(--avatar-size);
    aspect-ratio: 1;
    overflow: hidden;
    user-select: none;
    vertical-align: middle;
    flex-shrink: 0;
  }

  /* Radius variants */
  .utensil-avatar.radius-none {
    border-radius: 0;
  }

  .utensil-avatar.radius-small {
    border-radius: var(--radius-2);
  }

  .utensil-avatar.radius-medium {
    border-radius: var(--radius-3);
  }

  .utensil-avatar.radius-large {
    border-radius: var(--radius-4);
  }

  .utensil-avatar.radius-full {
    border-radius: 50%;
  }

  /* Image */
  .utensil-avatar-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.15s ease-in;
  }

  .utensil-avatar-image.loaded {
    opacity: 1;
  }

  /* Fallback */
  .utensil-avatar-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: calc(var(--avatar-size) * 0.4);
    line-height: normal;
    font-weight: 500;
    text-transform: uppercase;
  }

  /* Hide fallback when image is loaded */
  .utensil-avatar.loaded .utensil-avatar-fallback {
    display: none;
  }

  /* Variation color overrides — --text-color fallback for external customization */
  .utensil-avatar.ui-solid {
    color: var(--text-color, var(--pen-contrast));
  }

  .utensil-avatar.ui-soft {
    color: var(--text-color, var(--pen-a11));
  }
}
</style>
