<template>
  <svg
    class="techno-refined-background"
    :class="{ animated: playing }"
    viewBox="0 0 800 800"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="tr-penFade" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--pen-8)" stop-opacity="0.5" />
        <stop offset="100%" stop-color="var(--pen-8)" stop-opacity="0" />
      </linearGradient>
      <radialGradient id="tr-centerGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="var(--pen-9)" stop-opacity="0.08" />
        <stop offset="100%" stop-color="var(--pen-9)" stop-opacity="0" />
      </radialGradient>
      <pattern
        id="tr-dotGrid"
        x="0"
        y="0"
        width="20"
        height="20"
        patternUnits="userSpaceOnUse"
        :patternTransform="dotTransform1"
      >
        <circle cx="10" cy="10" r="0.7" fill="var(--pencil-7)" />
      </pattern>
      <pattern
        id="tr-dotGrid2"
        x="0"
        y="0"
        width="40"
        height="40"
        patternUnits="userSpaceOnUse"
        :patternTransform="dotTransform2"
      >
        <circle cx="20" cy="20" r="1.2" fill="var(--pen-8)" opacity="0.2" />
      </pattern>
    </defs>

    <!-- Dot grid layers -->
    <rect width="800" height="800" fill="url(#tr-dotGrid)" />
    <rect width="800" height="800" fill="url(#tr-dotGrid2)" />

    <!-- Accent arcs — grouped for rotation -->
    <g class="arcs-tl" style="transform-origin: 0px 0px">
      <circle cx="0" cy="0" r="320" fill="none" stroke="url(#tr-penFade)" stroke-width="1" />
      <circle cx="0" cy="0" r="380" fill="none" stroke="url(#tr-penFade)" stroke-width="1" />
      <circle cx="0" cy="0" r="440" fill="none" stroke="url(#tr-penFade)" stroke-width="1" />
    </g>
    <g class="arcs-br" style="transform-origin: 800px 800px">
      <circle cx="800" cy="800" r="280" fill="none" stroke="url(#tr-penFade)" stroke-width="1" />
      <circle cx="800" cy="800" r="340" fill="none" stroke="url(#tr-penFade)" stroke-width="1" />
      <circle cx="800" cy="800" r="400" fill="none" stroke="url(#tr-penFade)" stroke-width="1" />
    </g>

    <!-- Orbiting geometric shapes -->
    <g class="orbit" style="transform-origin: 400px 400px">
      <rect
        x="396"
        y="60"
        width="8"
        height="8"
        rx="1"
        fill="var(--pen-9)"
        opacity="0.35"
        transform="rotate(45 400 64)"
      />
      <circle cx="680" cy="400" r="3" fill="var(--pen-8)" opacity="0.25" />
      <rect
        x="396"
        y="736"
        width="6"
        height="6"
        rx="1"
        fill="var(--pen-8)"
        opacity="0.25"
        transform="rotate(45 399 739)"
      />
      <circle cx="120" cy="400" r="2.5" fill="var(--pen-9)" opacity="0.3" />
    </g>

    <!-- Crosshair dashes -->
    <line
      class="crosshair"
      x1="0"
      y1="400"
      x2="800"
      y2="400"
      stroke="var(--pen-8)"
      stroke-width="0.3"
      stroke-dasharray="4 12"
      opacity="0.3"
    />
    <line
      class="crosshair"
      x1="400"
      y1="0"
      x2="400"
      y2="800"
      stroke="var(--pen-8)"
      stroke-width="0.3"
      stroke-dasharray="4 12"
      opacity="0.3"
    />

    <!-- Subtle center glow — breathing, not pulsing -->
    <circle class="center-glow" cx="400" cy="400" r="220" fill="url(#tr-centerGlow)" />

    <!-- Spark particles — toned down -->
    <circle class="spark spark-1" cx="150" cy="200" r="1.2" fill="var(--pen-9)" opacity="0" />
    <circle class="spark spark-2" cx="650" cy="130" r="0.8" fill="var(--pen-9)" opacity="0" />
    <circle class="spark spark-3" cx="280" cy="620" r="1" fill="var(--pen-9)" opacity="0" />
    <circle class="spark spark-4" cx="560" cy="500" r="0.8" fill="var(--pen-9)" opacity="0" />
    <circle class="spark spark-5" cx="720" cy="340" r="1.2" fill="var(--pen-9)" opacity="0" />
    <circle class="spark spark-6" cx="90" cy="450" r="1" fill="var(--pen-8)" opacity="0" />
  </svg>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const props = defineProps<{
  playing: boolean
}>()

const dotTransform1 = ref('')
const dotTransform2 = ref('')

watchEffect((onCleanup) => {
  if (props.playing) {
    let rafId: number
    function tick(t: number) {
      const s1 = 0.008
      const s2 = 0.004
      dotTransform1.value = `translate(${(t * s1) % 20}, ${(t * s1) % 20})`
      dotTransform2.value = `translate(${-((t * s2) % 40)}, ${(t * s2 * 1.25) % 40})`
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    onCleanup(() => cancelAnimationFrame(rafId))
  }
})
</script>

<style scoped>
/* Arc rotation — slow and majestic */
.techno-refined-background .arcs-tl {
  animation: tr-arcSpinCW 55s linear infinite;
}

.techno-refined-background .arcs-br {
  animation: tr-arcSpinCCW 40s linear infinite;
}

@keyframes tr-arcSpinCW {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes tr-arcSpinCCW {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}

/* Orbiting shapes */
@keyframes tr-orbitSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.techno-refined-background .orbit {
  animation: tr-orbitSpin 22s linear infinite;
}

/* Crosshair marching ants */
@keyframes tr-dashMarch {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: -32;
  }
}

.techno-refined-background .crosshair {
  animation: tr-dashMarch 3s linear infinite;
}

/* Center glow — gentle breathing instead of dramatic pulse */
@keyframes tr-centerBreathe {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(0.9);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.techno-refined-background .center-glow {
  transform-origin: 400px 400px;
  animation: tr-centerBreathe 12s ease-in-out infinite;
}

/* Spark particles — subtler, less frequent flashes */
@keyframes tr-sparkle {
  0%,
  80%,
  100% {
    opacity: 0;
    transform: scale(0.5);
  }
  88% {
    opacity: 0;
    transform: scale(0.5);
  }
  92% {
    opacity: 0.5;
    transform: scale(1.5);
  }
  96% {
    opacity: 0;
    transform: scale(0.5);
  }
}

.techno-refined-background .spark {
  animation: tr-sparkle 8s ease-in-out infinite;
}

.techno-refined-background .spark-1 {
  transform-origin: 150px 200px;
}

.techno-refined-background .spark-2 {
  transform-origin: 650px 130px;
  animation-delay: 1.3s;
}

.techno-refined-background .spark-3 {
  transform-origin: 280px 620px;
  animation-delay: 2.7s;
}

.techno-refined-background .spark-4 {
  transform-origin: 560px 500px;
  animation-delay: 4s;
}

.techno-refined-background .spark-5 {
  transform-origin: 720px 340px;
  animation-delay: 5.3s;
}

.techno-refined-background .spark-6 {
  transform-origin: 90px 450px;
  animation-delay: 6.7s;
}

.techno-refined-background:not(.animated) * {
  animation-play-state: paused;
}
</style>
