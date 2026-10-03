<template generic="Theme extends ThemeConfig">
  <div
    class="utensil-io-strip"
    :class="themeClasses"
    :style="themeStyle"
    role="progressbar"
    :aria-label="ariaLabel"
    :aria-valuemin="0"
    :aria-valuemax="100"
    :aria-valuenow="shownProgress === undefined ? undefined : Math.round(shownProgress * 100)"
    :aria-hidden="phase === 'idle'"
  >
    <div class="start-scope" :class="startThemeClasses" :style="startThemeStyle">
      <div class="end-scope" :class="endThemeClasses" :style="endScopeStyle">
        <div
          class="fill"
          :class="[phase, gradientMode, { determinate: shownProgress !== undefined }]"
          :style="fillStyle"
        >
          <div class="gradient"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed, onUnmounted, ref, watch } from 'vue'
import type { ColorProp, ThemeConfig } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'

// Slim strip indicating io activity such as page loads and saves: while active, the fill grows out
// quickly to about 30% of the width (then creeps as a fallback for slow io); when the io ends it
// shoots to the far end and fades away. Io that knows how far along it is reports a progress
// instead, and the fill follows it.
export interface Props<Theme extends ThemeConfig> {
  active?: boolean
  /**
   * How far along the io is, 0–1. While set the fill follows it instead of creeping, and it holds
   * the last value if the reports stop before the io ends — the creep never restarts from zero.
   */
  progress?: number
  ariaLabel?: string
  color?: ColorProp<Theme>
  /** Second gradient color; the fill runs from `color` to `endColor`. Defaults to `color` (solid). */
  endColor?: ColorProp<Theme>
  /**
   * How the two colors render: 'always' lays the gradient along the full strip so progress reveals
   * more of it; 'progressive' renders a solid fill that blends from `color` to `endColor` as
   * progress increases.
   */
  gradientMode?: 'always' | 'progressive'
  /**
   * Grace period after `active` drops before the finish sweep starts. Io resuming within it
   * continues the current animation, so a burst of requests reads as one operation.
   */
  settleMs?: number
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  active: false,
  ariaLabel: 'Loading',
  color: 'pen',
  gradientMode: 'always',
  settleMs: 0,
})

const penColor = computed<ColorProp<Theme>>(() => props.color || 'pen')
const endPenColor = computed<ColorProp<Theme>>(() => props.endColor || penColor.value)

// Nested theme scopes capture each color's solid step into its own cvar: the root captures the
// surrounding pen, the start scope resolves `color`, the end scope resolves `endColor`.
const { classes: themeClasses, style: themeStyle } = useTheme()

const { classes: startThemeClasses, style: startThemeStyle } = useTheme({
  pen: penColor,
})

const { classes: endThemeClasses } = useTheme({
  pen: endPenColor,
})

// When `endColor` resolves to the surrounding pen no pen class is emitted, and the end scope would
// inherit the start scope's pen — fall back to the context pen captured at the root instead.
const endScopeStyle = computed(() => {
  const repens = endThemeClasses.value.some((cssClass) => cssClass.endsWith('-pen'))
  return { '--strip-color-end': repens ? 'var(--pen-9)' : 'var(--strip-color-context)' }
})

// Durations mirror the CSS transition times below.
const FINISH_MS = 250
const FADE_MS = 200

type Phase = 'idle' | 'active' | 'finishing' | 'fading'

const phase = ref<Phase>(props.active ? 'active' : 'idle')

// The progress the fill follows: the last one reported during this activation
const heldProgress = ref<number | undefined>(props.progress)

watch(
  () => props.progress,
  (progress) => {
    if (progress !== undefined) {
      heldProgress.value = progress
    }
  },
)

const shownProgress = computed(() => {
  const progress = heldProgress.value

  if (phase.value !== 'active' || progress === undefined) {
    return undefined
  }

  return Math.min(1, Math.max(0, progress))
})

const fillStyle = computed(() => {
  const progress = shownProgress.value

  return progress === undefined ? undefined : { width: `${progress * 100}%`, '--progress': `${progress}` }
})

let timer: ReturnType<typeof setTimeout> | undefined
let restartFrame: number | undefined
let activating = false
let deactivateAfterActivation = false

function clearTimers() {
  if (timer) clearTimeout(timer)
  if (restartFrame !== undefined) cancelAnimationFrame(restartFrame)
  timer = undefined
  restartFrame = undefined
  activating = false
}

function deactivate() {
  if (phase.value !== 'active') return

  const finish = () => {
    phase.value = 'finishing'
    timer = setTimeout(() => {
      phase.value = 'fading'
      timer = setTimeout(() => {
        phase.value = 'idle'
      }, FADE_MS)
    }, FINISH_MS)
  }

  // Reactivating within the settle window clears the pending finish and the
  // still-active animation carries on
  if (props.settleMs > 0) {
    timer = setTimeout(finish, props.settleMs)
  } else {
    finish()
  }
}

watch(
  () => props.active,
  (active) => {
    if (active) {
      deactivateAfterActivation = false
      clearTimers()

      if (phase.value === 'active') return

      // Pass through idle for a frame so the grow animation restarts from zero width.
      phase.value = 'idle'
      heldProgress.value = props.progress
      activating = true
      restartFrame = requestAnimationFrame(() => {
        restartFrame = undefined
        activating = false
        phase.value = 'active'

        if (deactivateAfterActivation) {
          deactivateAfterActivation = false
          deactivate()
        }
      })

      return
    }

    // The io ended before the activation frame landed — let it show, then sweep
    // out, so even sub-frame io is acknowledged
    if (activating) {
      deactivateAfterActivation = true
      return
    }

    clearTimers()
    deactivate()
  },
)

onUnmounted(clearTimers)
</script>

<style scoped>
@layer utensil {
  .utensil-io-strip {
    --height: var(--utensil-io-strip-height, calc(var(--space-1) * 0.75));

    display: block;
    width: 100%;
    height: var(--height);
    background-color: var(--utensil-io-strip-track-background, transparent);
    pointer-events: none;
    overflow: hidden;
    /* Sizes the gradient layer to the strip (100cqw) independently of the fill's animated width. */
    container-type: inline-size;
  }

  .utensil-io-strip {
    --strip-color-context: var(--pen-9);
  }

  .start-scope {
    --strip-color-start: var(--pen-9);
  }

  .start-scope,
  .end-scope {
    width: 100%;
    height: 100%;
  }

  .fill {
    width: 0;
    height: 100%;
    opacity: 0;
    overflow: hidden;
  }

  /* The gradient spans the full strip and is revealed by the fill's animated width. */
  .gradient {
    width: 100cqw;
    height: 100%;
    background-image: linear-gradient(to right, var(--strip-color-start), var(--strip-color-end));
  }

  /* Progressive mode: a solid fill whose color blends from start to end as progress increases. */
  .fill.progressive {
    background-color: var(--strip-color-start);
  }

  .fill.progressive .gradient {
    display: none;
  }

  .fill.active {
    /* Static width matches the animation's resting point so reduced motion lands in a correct state. */
    width: 60%;
    opacity: 1;
    animation: utensil-io-strip-grow 8s forwards;
  }

  .fill.progressive.active {
    animation:
      utensil-io-strip-grow 8s forwards,
      utensil-io-strip-blend 8s forwards;
  }

  /* A reported progress sets the width outright — no creep to fall back on */
  .fill.active.determinate {
    animation: none;
    transition: width 0.25s ease-out;
  }

  .fill.progressive.active.determinate {
    background-color: color-mix(
      in oklab,
      var(--strip-color-start),
      var(--strip-color-end) calc(var(--progress) * 100%)
    );
  }

  .fill.finishing {
    width: 100%;
    opacity: 1;
    transition: width 0.25s ease-in;
  }

  .fill.progressive.finishing {
    background-color: var(--strip-color-end);
    transition:
      width 0.25s ease-in,
      background-color 0.25s ease-in;
  }

  .fill.fading {
    width: 100%;
    opacity: 0;
    transition: opacity 0.2s ease-out;
  }

  .fill.progressive.fading {
    background-color: var(--strip-color-end);
  }

  @keyframes utensil-io-strip-grow {
    0% {
      width: 0;
      animation-timing-function: ease-out;
    }

    /* Grows out to ~30% almost immediately... */
    5% {
      width: 30%;
      animation-timing-function: ease-out;
    }

    /* ...then creeps as a fallback for slow io. */
    100% {
      width: 60%;
    }
  }

  @keyframes utensil-io-strip-blend {
    from {
      background-color: var(--strip-color-start);
    }

    to {
      background-color: var(--strip-color-end);
    }
  }

  .utensil-reduced-motion {
    .fill {
      animation: none;
      transition: none;
    }
  }
}
</style>
