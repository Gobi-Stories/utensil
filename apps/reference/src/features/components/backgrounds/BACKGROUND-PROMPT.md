# Showcase Background Animation — Sub-Agent Prompt

## Inspiration

The best backgrounds emerged from **emergent visual complexity from simple primitives**. The Moiré background works because it uses just two overlapping line grids rotating against each other — the mesmerizing interference patterns arise from the interaction, not from explicitly drawn shapes. This principle (simple rules producing complex visuals) should guide all future backgrounds.

Avoid these overused tropes:

- Expanding circles / ripples / rings
- Dot grids and particle fields
- Scanlines and glitch effects
- Circuit board traces
- Liquid / lava lamp blobs
- Constellation / star fields
- Wave lines and audio waveforms
- Equalizer bars

Instead look for inspiration in:

- Optical phenomena (moiré, caustics, refraction, diffraction)
- Mathematical visualisations (Lissajous curves, harmonographs, strange attractors, Penrose tilings)
- Analog processes (pendulum drawings, spirograph traces, darkroom exposures)

---

## Prompt Template

Copy and adapt this prompt when spawning a sub-agent to create a new background.

---

Create a new SVG background animation component for a Vue 3 app's design system reference page.

Write the file to: `utensil/reference/src/features/components/backgrounds/Reference<Name>Background.vue`

**Structure requirements (follow exactly):**

- Vue SFC with `<template>`, `<script setup lang="ts">`, `<style scoped>`
- SVG root with class `<name>-background`, `:class="{ animated: playing }"`, `viewBox="0 0 800 800"`, `preserveAspectRatio="xMidYMid slice"`, `aria-hidden="true"`
- Props: `defineProps<{ playing: boolean }>()`
- All CSS animations scoped under `.<name>-background .element-class`
- Final CSS rule: `.<name>-background:not(.animated) * { animation-play-state: paused; }`
- Use only CSS variables for colors: `--pen-8`, `--pen-9`, `--pen-a2`, `--pencil-7`, `--pencil-8`
- Keep opacity values subtle (0.05–0.3 range) — this is a background behind content
- Use CSS animations only (no JS animation loops unless truly needed for dynamic SVG attributes like patternTransform)
- SVG `<defs>` for gradients, filters, patterns
- Prefix all SVG `id` attributes with a short unique prefix to avoid collisions with other backgrounds

**Quality bar:**

- Visually rich but not overpowering — it must sit behind a signup form card
- Elegant, editorial quality — not flashy or gimmicky
- Animation should be slow, meditative, barely perceptible — not attention-grabbing
- Use long animation durations (15–120s) with prime-ish values so loops don't obviously repeat
- Radial vignette mask to fade edges is often a good idea

**CONCEPT: <Describe the specific concept, visual design, and animation here>**

---

## Reference: Moiré Prompt (the one that worked best)

### Concept: Moiré Interference Patterns

This is about the mesmerizing visual effect when two fine-line grids overlap and rotate against each other. Like those optical illusion toys, or the effect when you put two window screens on top of each other.

### Specific visual design:

1. Create TWO SVG `<pattern>` elements, each containing parallel lines (use thin `<line>` or `<rect>` elements spaced ~8-10px apart). One pattern has vertical lines, the other also has lines at a very slight angle.

2. Apply each pattern as the fill of a separate full-canvas `<rect>`.

3. The two rects should have very low opacity (0.08-0.15 each) using `--pencil-7` or `--pen-8` for the line color.

4. The KEY animation: each rect rotates VERY slowly in opposite directions around the center of the canvas. One clockwise at ~120s per revolution, the other counter-clockwise at ~90s. The slight speed difference means the interference pattern constantly shifts and evolves.

5. The visual magic: where the lines from both grids nearly align, you get bright bands (constructive interference). Where they cross at angles, you get darker areas. This creates large-scale flowing curves and shapes that emerge purely from the interaction — no explicit shapes drawn.

6. Add a THIRD optional layer: a much coarser grid (wider spacing, ~30-40px) rotating at a third speed, very faint (0.04 opacity), adding another interference dimension.

7. Gentle radial vignette mask to fade edges.

8. Optional: a very subtle radial glow at center (--pen-9, opacity 0.03-0.05) that breathes slowly.

The beauty of this background is that the visual complexity emerges from extremely simple elements — just overlapping grids. The animation should be hypnotic and almost impossible to look away from, yet subtle enough to sit behind content.
