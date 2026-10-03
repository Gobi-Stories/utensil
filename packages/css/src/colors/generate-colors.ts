import * as RadixColors from '@radix-ui/colors'
import Color from 'colorjs.io'
import BezierEasing from 'bezier-easing'
import type { ColorConfig, ColorMode, ColorScale, Scale } from './colors.js'

const arrayOf12 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const

// prettier-ignore
const grayScaleNames = ['gray', 'mauve', 'slate', 'sage', 'olive', 'sand'] as const;

// prettier-ignore
const scaleNames = [...grayScaleNames, 'tomato', 'red', 'ruby', 'crimson', 'pink',
'plum', 'purple', 'violet', 'iris', 'indigo', 'blue', 'cyan', 'teal', 'jade', 'green',
'grass', 'brown', 'orange', 'sky', 'mint', 'lime', 'yellow', 'amber'] as const;

const lightColors = Object.fromEntries(
  scaleNames.map((scaleName) => [
    scaleName,
    Object.values(RadixColors[`${scaleName}P3`]).map((str) => new Color(str).to('oklch')),
  ]),
) as Record<(typeof scaleNames)[number], Scale<Color>>

const darkColors = Object.fromEntries(
  scaleNames.map((scaleName) => [
    scaleName,
    Object.values(RadixColors[`${scaleName}DarkP3`]).map((str) => new Color(str).to('oklch')),
  ]),
) as Record<(typeof scaleNames)[number], Scale<Color>>

const lightGrayColors = Object.fromEntries(
  grayScaleNames.map((scaleName) => [
    scaleName,
    Object.values(RadixColors[`${scaleName}P3`]).map((str) => new Color(str).to('oklch')),
  ]),
) as Record<(typeof grayScaleNames)[number], Scale<Color>>

const darkGrayColors = Object.fromEntries(
  grayScaleNames.map((scaleName) => [
    scaleName,
    Object.values(RadixColors[`${scaleName}DarkP3`]).map((str) => new Color(str).to('oklch')),
  ]),
) as Record<(typeof grayScaleNames)[number], Scale<Color>>

export interface HslBlendFactors {
  hue?: number
  saturation?: number
  lightness?: number
}

/**
 * Blend HSL channels from a source color into a base color.
 *
 * Each factor (0–1) controls how much of the source's channel replaces the base's:
 * - 0 = keep base value entirely
 * - 1 = use source value entirely
 * - 0.5 = midpoint blend
 *
 * With factor=1, swapping two colors is perfectly reversible:
 * applyHsl(applyHsl(a, b, {hue:1}), applyHsl(b, a, {hue:1}), {hue:1}) === a
 */
export function applyHsl(baseColor: string, sourceColor: string, factors: HslBlendFactors = {}): string {
  const base = new Color(baseColor).to('hsl')
  const source = new Color(sourceColor).to('hsl')

  const { hue = 0, saturation = 0, lightness = 0 } = factors

  const h = lerpHue(base.coords[0], source.coords[0], hue)
  const s = lerp(base.coords[1], source.coords[1], saturation)
  const l = lerp(base.coords[2], source.coords[2], lightness)

  return new Color('hsl', [h, s, l]).to('srgb').toString({ format: 'hex' })
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function lerpHue(a: number, b: number, t: number): number {
  if (isNaN(a)) return isNaN(b) ? 0 : b
  if (isNaN(b)) return a

  // Shortest path around the hue circle
  let diff = b - a
  if (diff > 180) diff -= 360
  if (diff < -180) diff += 360

  return (((a + diff * t) % 360) + 360) % 360
}

export function generatePenColors(
  mode: ColorMode,
  baseColor: string,
  pageBackground?: string,
  textContrast: TextContrast = defaultTextContrast,
): ColorConfig {
  const allScales = mode === 'light' ? lightColors : darkColors
  const background = pageBackground ?? (mode === 'light' ? '#fff' : '#111')
  const backgroundColor = new Color(background).to('oklch')

  const penBaseColor = new Color(baseColor).to('oklch')

  const penScaleColors = getScaleFromColor(penBaseColor, allScales, backgroundColor)

  // Enforce srgb for the background color
  const backgroundHex = backgroundColor.to('srgb').toString({ format: 'hex' })

  const [pen9Color, penContrastColor] = getStep9Colors(penScaleColors, penBaseColor)

  penScaleColors[8] = pen9Color
  penScaleColors[9] = getButtonHoverColor(pen9Color, [penScaleColors])

  // Limit saturation of the text colors
  penScaleColors[10].coords[1] = Math.min(
    Math.max(penScaleColors[8].coords[1], penScaleColors[7].coords[1]),
    penScaleColors[10].coords[1],
  )
  penScaleColors[11].coords[1] = Math.min(
    Math.max(penScaleColors[8].coords[1], penScaleColors[7].coords[1]),
    penScaleColors[11].coords[1],
  )

  penScaleColors[10] = solveTextStep(penScaleColors[10], backgroundColor, resolveTextContrast(mode, textContrast))

  const penScaleHex = penScaleColors.map((color) => color.to('srgb').toString({ format: 'hex' })) as ColorScale

  const penScaleWideGamut = penScaleColors.map(toOklchString) as ColorScale

  const penScaleAlphaHex = penScaleHex.map((color) => getAlphaColorSrgb(color, backgroundHex)) as ColorScale

  const penScaleAlphaWideGamutString = penScaleHex.map((color) => getAlphaColorP3(color, backgroundHex)) as ColorScale

  const penContrastColorHex = penContrastColor.to('srgb').toString({ format: 'hex' })

  const penSurfaceHex =
    mode === 'light'
      ? getAlphaColorSrgb(penScaleHex[1], backgroundHex, 0.8)
      : getAlphaColorSrgb(penScaleHex[1], backgroundHex, 0.5)

  const penSurfaceWideGamutString =
    mode === 'light'
      ? getAlphaColorP3(penScaleWideGamut[1], backgroundHex, 0.8)
      : getAlphaColorP3(penScaleWideGamut[1], backgroundHex, 0.5)

  return {
    source: baseColor,
    background,
    standard: {
      scale: penScaleHex,
      alphaScale: penScaleAlphaHex,
      surface: penSurfaceHex,
    },
    wideGamut: {
      scale: penScaleWideGamut,
      alphaScale: penScaleAlphaWideGamutString,
      surface: penSurfaceWideGamutString,
    },
    contrast: penContrastColorHex,
  }
}

export function generatePencilColors(
  mode: ColorMode,
  baseColor: string,
  pageBackground?: string,
  textContrast: TextContrast = defaultTextContrast,
): ColorConfig {
  const grayScales = mode === 'light' ? lightGrayColors : darkGrayColors
  const background = pageBackground ?? (mode === 'light' ? '#fff' : '#111')
  const backgroundColor = new Color(background).to('oklch')

  const grayBaseColor = new Color(baseColor).to('oklch')
  const grayScaleColors = getScaleFromColor(grayBaseColor, grayScales, backgroundColor)

  grayScaleColors[10] = solveTextStep(grayScaleColors[10], backgroundColor, resolveTextContrast(mode, textContrast))

  // Enforce srgb for the background color
  const backgroundHex = backgroundColor.to('srgb').toString({ format: 'hex' })

  const pencilScaleHex = grayScaleColors.map((color) => color.to('srgb').toString({ format: 'hex' })) as ColorScale

  const pencilScaleWideGamut = grayScaleColors.map(toOklchString) as ColorScale

  const pencilScaleAlphaHex = pencilScaleHex.map((color) => getAlphaColorSrgb(color, backgroundHex)) as ColorScale

  const pencilScaleAlphaWideGamutString = pencilScaleHex.map((color) =>
    getAlphaColorP3(color, backgroundHex),
  ) as ColorScale

  return {
    source: baseColor,
    background,
    standard: {
      scale: pencilScaleHex,
      alphaScale: pencilScaleAlphaHex,
      surface: mode === 'light' ? '#ffffffcc' : 'rgba(0, 0, 0, 0.05)',
    },
    wideGamut: {
      scale: pencilScaleWideGamut,
      alphaScale: pencilScaleAlphaWideGamutString,
      surface: mode === 'light' ? 'color(display-p3 1 1 1 / 80%)' : 'color(display-p3 0 0 0 / 5%)',
    },
    contrast: '#fff',
  }
}

export interface PaperOptions {
  /**
   * 'mode' anchors paper step 1 on the prescribed page lightness for each mode, so any
   * picked color yields a workable page. 'picked' lands step 1 on the picked color's own
   * lightness in its native mode.
   */
  anchor?: 'mode' | 'picked'
  /**
   * Tint strength scaling the paper chroma (0 = neutral, 1 = the full quiet ceiling,
   * higher = bolder). 'auto' derives the strength from the picked color's own
   * saturation, 'direct' keeps the picked hue and saturation and only prescribes the
   * lightness ladder, and 'matched' keeps the gray-matched chroma of the picked color.
   */
  tint?: number | 'auto' | 'direct' | 'matched'
  /**
   * The tone (CIELAB L*) difference between adjacent ladder steps. Rungs are uniform
   * and shared by both modes — light descends from its page, dark ascends from its —
   * so any two steps hold the same perceived contrast whichever mode renders them.
   * Smaller values keep the ladder quiet; larger values separate surfaces harder.
   */
  stepContrast?: number
}

// Paper scales are a tone ladder: each step sits a fixed CIELAB-lightness increment
// from the page. Equal tone difference reads as equal surface contrast (the currency
// Material's HCT system builds its guarantees on), so a uniform rung applied in both
// modes keeps every surface relationship at the same perceived contrast in light and
// dark. Paper exists primarily for backgrounds and surfaces, but the same scale
// also borders and details them at the surface's own visual hierarchy: a near step
// edges a card subtly, a farther step separates two adjacent surfaces. The alpha
// steps elevate relative to whatever paper they sit on, preserving a component's
// internal hierarchy across base paper changes.
// The default rung matches the average rung of the dark gray reference ladder, whose
// luminance hierarchy the tone ladder generalizes to both modes.
export const defaultPaperOptions: Required<PaperOptions> = { anchor: 'mode', tint: 1, stepContrast: 1.75 }

// Prescribed page lightness per mode: near-white (#fcfcfc) rather than pure white, leaving
// headroom for tint and the lighter paper-0 inset, and the dark reference background (#111).
const paperPageLightness = { light: 0.9911, dark: 0.1776 }

// A quiet chroma ceiling keeps every step usable as a background. The square root
// compresses the full picked-chroma range into it while preserving ordering: a more
// vivid pick always yields a more tinted paper.
const paperTintCeiling = 0.025
const paperChromaReference = 0.25

// The same chroma reads less saturated against a light page than a dark one, so light
// mode scales the ladder chroma up to even out the two modes' perceived vividness.
// Dark is the reference at 1; tune the light factor by eye.
const paperModeChromaBoost = { light: 1.5, dark: 1 }

// The seed is tint-independent so the same pick always matches the same reference
// scales; the tint strength scales the resulting chroma afterwards. Applying tint
// before matching would let different strengths land on different scale mixes,
// making the output chroma non-monotonic in tint.
function tintedPaperSeed(picked: Color): Color {
  const pickedChroma = Math.min(picked.coords[1], paperChromaReference)
  const chroma = paperTintCeiling * Math.sqrt(pickedChroma / paperChromaReference)
  return new Color('oklch', [picked.coords[0], chroma, picked.coords[2]])
}

// The 'auto' tint derives the strength from the picked saturation, so the picker alone
// captures the vividness intent. Stacked on the seed's square-root compression the ladder
// chroma responds linearly to the picked chroma, reaching the cap only for a fully
// saturated pick. Lower the cap to quieten what saturated picks produce.
const paperAutoTintCap = 3

function autoPaperTint(picked: Color): number {
  const pickedChroma = Math.min(picked.coords[1], paperChromaReference)
  return paperAutoTintCap * Math.sqrt(pickedChroma / paperChromaReference)
}

// The 'direct' tint applies the picked hue and saturation to the prescribed lightness
// ladder. Normalizing the seed lightness keeps the pick's lightness from influencing
// which reference scales are matched — only hue and chroma choose the mix.
const paperDirectSeedLightness = 0.5

function directPaperSeed(picked: Color): Color {
  const chroma = Math.min(picked.coords[1], paperChromaReference)
  return new Color('oklch', [paperDirectSeedLightness, chroma, picked.coords[2]])
}

export function generatePaperColors(mode: ColorMode, baseColor: string, options?: PaperOptions): ColorConfig {
  const { anchor, tint, stepContrast } = { ...defaultPaperOptions, ...options }
  const rung = Math.max(0.25, Math.min(4, stepContrast))
  const grayScales = mode === 'light' ? lightGrayColors : darkGrayColors
  const pickedColor = new Color(baseColor).to('oklch')

  // Intent extraction: the picked lightness only survives with the 'picked' anchor, and
  // the picked chroma is compressed into the paper ceiling unless 'matched' or 'direct'.
  const paperBaseColor =
    tint === 'matched' ? pickedColor : tint === 'direct' ? directPaperSeed(pickedColor) : tintedPaperSeed(pickedColor)

  const background =
    anchor === 'mode'
      ? new Color('oklch', [paperPageLightness[mode], 0, 0]).to('srgb').toString({ format: 'hex' })
      : defaultPaperBackground(mode, pickedColor, baseColor)
  const backgroundColor = new Color(background).to('oklch')

  // The matched scale donates chroma and hue; the ladder's lightness is tone-solved.
  const matchedScale = getScaleFromColor(paperBaseColor, grayScales, backgroundColor)
  const hue = matchedScale[0].coords[2]

  // The tint strength scales the chroma of the whole ladder; 'matched' and 'direct'
  // keep the chroma the scale matching produced.
  const strength =
    tint === 'matched' || tint === 'direct'
      ? 1
      : (tint === 'auto' ? autoPaperTint(pickedColor) : tint) * paperModeChromaBoost[mode]

  // Paper step 1 is the page itself, so land it exactly on the background lightness.
  const backgroundL = Math.max(0, Math.min(1, backgroundColor.coords[0]))
  const pageChroma = chromaAtLightness(matchedScale, backgroundL) * strength
  const pageColor = new Color('oklch', [backgroundL, pageChroma, hue])
  const pageTone = tone(displayedLuminance(pageColor))

  // Surfaces rise darker than the page in light mode and lighter in dark mode; the
  // inset sits one rung on the opposite side. Solving each step's lightness for its
  // displayed luminance keeps the tone targets exact under tint chroma.
  const direction = mode === 'light' ? -1 : 1

  const stepColor = (offset: number): Color => {
    const targetY = toneLuminance(Math.max(0, Math.min(100, pageTone + direction * offset * rung)))
    const estimate = lightnessForLuminance(pageChroma, hue, targetY)
    const chroma = chromaAtLightness(matchedScale, estimate) * strength
    return new Color('oklch', [lightnessForLuminance(chroma, hue, targetY), chroma, hue])
  }

  const scaleColors = arrayOf12.map((i) => (i === 0 ? pageColor : stepColor(i))) as Scale<Color>

  // Paper 0 is the inset step "below the page": one rung opposite the ladder, lighter
  // than the page in light mode (clamped at the top of the gamut), darker in dark mode.
  const insetColor = stepColor(-1)

  const paperScaleHex = scaleColors.map((color) => color.to('srgb').toString({ format: 'hex' })) as ColorScale

  const paperScaleWideGamut = scaleColors.map(toOklchString) as ColorScale

  // Alpha steps composite over the page itself: paper step 1
  const pageHex = paperScaleHex[0]

  const paperScaleAlphaHex = paperScaleHex.map((color) => getAlphaColorSrgb(color, pageHex)) as ColorScale

  const paperScaleAlphaWideGamutString = paperScaleHex.map((color) => getAlphaColorP3(color, pageHex)) as ColorScale

  const paperSurfaceHex =
    mode === 'light'
      ? getAlphaColorSrgb(paperScaleHex[1], pageHex, 0.8)
      : getAlphaColorSrgb(paperScaleHex[1], pageHex, 0.5)

  const paperSurfaceWideGamutString =
    mode === 'light'
      ? getAlphaColorP3(paperScaleWideGamut[1], pageHex, 0.8)
      : getAlphaColorP3(paperScaleWideGamut[1], pageHex, 0.5)

  return {
    source: baseColor,
    background,
    standard: {
      scale: paperScaleHex,
      alphaScale: paperScaleAlphaHex,
      surface: paperSurfaceHex,
      inset: insetColor.to('srgb').toString({ format: 'hex' }),
    },
    wideGamut: {
      scale: paperScaleWideGamut,
      alphaScale: paperScaleAlphaWideGamutString,
      surface: paperSurfaceWideGamutString,
      inset: toOklchString(insetColor),
    },
    contrast: getTextColor(scaleColors[8]).to('srgb').toString({ format: 'hex' }),
  }
}

/** The page colors a paper color produces: paper step 1 per mode. Pass these as the pen/pencil page backgrounds. */
export function getPaperPageColors(baseColor: string, options?: PaperOptions): { light: string; dark: string } {
  return {
    light: generatePaperColors('light', baseColor, options).standard.scale[0],
    dark: generatePaperColors('dark', baseColor, options).standard.scale[0],
  }
}

// With the 'picked' anchor, the paper color anchors the scale in its native mode; the
// opposite mode falls back to the reference background the built-in scales were designed against.
function defaultPaperBackground(mode: ColorMode, paper: Color, paperHex: string): string {
  const isLightPaper = paper.coords[0] > 0.5

  if (mode === 'light') {
    return isLightPaper ? paperHex : '#fff'
  }

  return isLightPaper ? '#111' : paperHex
}

// Relative luminance of the color as displayed: sRGB-clipped, linearized per the
// sRGB transfer function. Tone targets are solved against this rather than the
// unclipped model so out-of-gamut requests land on what the screen actually shows.
function displayedLuminance(color: Color): number {
  const [r, g, b] = color
    .to('srgb')
    .coords.map((value) => Math.max(0, Math.min(1, value)))
    .map((value) => (value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4)))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// CIELAB lightness (tone) from relative luminance, and its inverse.
function tone(y: number): number {
  return y > 216 / 24389 ? 116 * Math.cbrt(y) - 16 : (24389 / 27) * y
}

function toneLuminance(l: number): number {
  return l > 8 ? Math.pow((l + 16) / 116, 3) : l / (24389 / 27)
}

// The oklch lightness that displays the target luminance at the given chroma and hue.
function lightnessForLuminance(chroma: number, hue: number, targetY: number): number {
  let low = 0
  let high = 1
  for (let i = 0; i < 30; i++) {
    const mid = (low + high) / 2
    if (displayedLuminance(new Color('oklch', [mid, chroma, hue])) < targetY) low = mid
    else high = mid
  }
  return (low + high) / 2
}

// Chroma by lightness from the matched scale: a rung takes the chroma a gray step of
// its own lightness carries, so tint intensity follows depth the way the source
// scales tint theirs. Clamped linear interpolation over the scale's lightness range.
function chromaAtLightness(scale: Scale<Color>, lightness: number): number {
  const points = scale
    .map((color) => ({ lightness: color.coords[0], chroma: color.coords[1] }))
    .sort((a, b) => a.lightness - b.lightness)

  if (lightness <= points[0].lightness) return points[0].chroma
  const last = points[points.length - 1]
  if (lightness >= last.lightness) return last.chroma

  for (let i = 1; i < points.length; i++) {
    if (lightness <= points[i].lightness) {
      const span = points[i].lightness - points[i - 1].lightness
      const t = span === 0 ? 0 : (lightness - points[i - 1].lightness) / span
      return points[i - 1].chroma + t * (points[i].chroma - points[i - 1].chroma)
    }
  }
  return last.chroma
}

// Step 11 is the text step, and the source scales tune it for secondary text —
// too weak against the page for the body-text role it plays here. Re-solving its
// lightness for a prescribed WCAG ratio holds text at the same measured contrast
// on any page color, keeping the scale's hue and capped chroma. The target is
// per-mode: WCAG flatters light-on-dark, so dark mode needs a higher ratio to
// read as strongly as light mode's.
export type TextContrast = number | { light: number; dark: number }
export const defaultTextContrast: TextContrast = { light: 10, dark: 12 }

// Identity floor: text never solves below this ratio, even when preserving the
// step's identity would want less. Saturated hues resolve here; grays reach the
// target. Per text polarity: dark-on-light text muddies fast (a dark red is barely
// red), so it floors lower than light-on-dark.
export const minimumTextContrast = { darkText: 5, lightText: 9 }

export function resolveTextContrast(mode: ColorMode, contrast: TextContrast = defaultTextContrast): number {
  return typeof contrast === 'number' ? contrast : contrast[mode]
}

function solveTextStep(step: Color, background: Color, contrast: number): Color {
  const backgroundY = displayedLuminance(background)
  const darkText = step.coords[0] < background.coords[0]
  const [, chroma, hue] = step.coords

  // Hue-aware target: solving past the contrast where the step's chroma leaves the
  // sRGB gamut just clips the chroma away — the color pays its identity for ratio
  // it can't display. Cap at that limit, floored so text always stays readable.
  const limit = identityContrastLimit(chroma, hue, backgroundY, darkText)
  const minimum = darkText ? minimumTextContrast.darkText : minimumTextContrast.lightText
  const solved = Math.max(Math.min(minimum, contrast), Math.min(contrast, limit))

  const targetY = darkText ? (backgroundY + 0.05) / solved - 0.05 : solved * (backgroundY + 0.05) - 0.05
  return new Color('oklch', [lightnessForLuminance(chroma, hue, Math.max(0, Math.min(1, targetY))), chroma, hue])
}

// The highest WCAG ratio against the background whose solved lightness still renders
// the given chroma in sRGB: the luminance of the most extreme in-gamut lightness in
// the text's direction (lightest for light-on-dark, darkest for dark-on-light).
// Returns 0 when the chroma fits at no lightness, Infinity for achromatic steps.
function identityContrastLimit(chroma: number, hue: number, backgroundY: number, darkText: boolean): number {
  if (chroma < 1e-4 || isNaN(hue)) return Infinity

  const inGamut = (l: number) => new Color('oklch', [l, chroma, hue]).inGamut('srgb')

  // The in-gamut lightness range at fixed chroma is one interval; coarse-scan from
  // the text's direction for its nearest endpoint, then bisect against the
  // out-of-gamut neighbor.
  const steps = 100
  let inside = -1
  for (let i = 0; i <= steps; i++) {
    const l = darkText ? i / steps : 1 - i / steps
    if (inGamut(l)) {
      inside = l
      break
    }
  }
  if (inside < 0) return 0

  let outside = darkText ? Math.max(0, inside - 1 / steps) : Math.min(1, inside + 1 / steps)
  for (let i = 0; i < 20; i++) {
    const mid = (inside + outside) / 2
    if (inGamut(mid)) inside = mid
    else outside = mid
  }

  // Darkening never leaves the gamut the way lightening does — sRGB renders deep
  // maroons and olives that have long lost their hue's identity. Dark text bounds
  // at the hue's cusp (its most vivid lightness) instead of the gamut edge, relaxed
  // toward the edge as the step's chroma fades so tinted grays still darken freely.
  let boundL = inside
  if (darkText) {
    const [cuspL, cuspC] = gamutCusp(hue)
    const vividness = Math.min(1, chroma / cuspC)
    boundL = cuspL + (inside - cuspL) * (1 - vividness)
  }

  const y = displayedLuminance(new Color('oklch', [boundL, chroma, hue]))
  return darkText ? (backgroundY + 0.05) / (y + 0.05) : (y + 0.05) / (backgroundY + 0.05)
}

// The sRGB cusp for a hue: the lightness carrying the hue's highest renderable
// chroma, and that chroma. Coarse lightness scan with a chroma bisection per step.
const cuspCache = new Map<number, [number, number]>()

function gamutCusp(hue: number): [number, number] {
  const key = Math.round(hue * 2)
  const cached = cuspCache.get(key)
  if (cached) return cached

  let cusp: [number, number] = [0.5, 0]
  for (let i = 1; i < 50; i++) {
    const l = i / 50
    let low = 0
    let high = 0.6
    for (let j = 0; j < 16; j++) {
      const mid = (low + high) / 2
      if (new Color('oklch', [l, mid, hue]).inGamut('srgb')) low = mid
      else high = mid
    }
    if (low > cusp[1]) cusp = [l, low]
  }

  cuspCache.set(key, cusp)
  return cusp
}

function getStep9Colors(scale: Scale<Color>, penBaseColor: Color): [Color, Color] {
  const referenceBackgroundColor = scale[0]
  const distance = penBaseColor.deltaEOK(referenceBackgroundColor) * 100

  // If the pen base color is close to the page background color, it's likely
  // white on white or black on black, so we want to return something that makes sense instead
  if (distance < 25) {
    return [scale[8], getTextColor(scale[8])]
  }

  return [penBaseColor, getTextColor(penBaseColor)]
}

function getButtonHoverColor(source: Color, scales: Scale<Color>[]) {
  const [L, C, H] = source.coords
  const newL = L > 0.4 ? L - 0.03 / (L + 0.1) : L + 0.03 / (L + 0.1)
  const newC = L > 0.4 && !isNaN(H) ? C * 0.93 + 0 : C
  const buttonHoverColor = new Color('oklch', [newL, newC, H])

  // Find closest in-scale color to donate the chroma and hue.
  // Especially useful when the source color is pure white or black,
  // but the gray scale is tinted.
  let closestColor = buttonHoverColor
  let minDistance = Infinity

  scales.forEach((scale) => {
    for (const color of scale) {
      const distance = buttonHoverColor.deltaEOK(color)
      if (distance < minDistance) {
        minDistance = distance
        closestColor = color
      }
    }
  })

  buttonHoverColor.coords[1] = closestColor.coords[1]
  buttonHoverColor.coords[2] = closestColor.coords[2]
  return buttonHoverColor
}

function getScaleFromColor(source: Color, scales: Record<string, Scale<Color>>, backgroundColor: Color): Scale<Color> {
  const allColors: { scale: string; color: Color; distance: number }[] = []

  Object.entries(scales).forEach(([name, scale]) => {
    for (const color of scale) {
      const distance = source.deltaEOK(color)
      allColors.push({ scale: name, distance, color })
    }
  })

  allColors.sort((a, b) => a.distance - b.distance)

  // Remove non-unique scales
  const closestColors = allColors.filter((color, i, arr) => i === arr.findIndex((value) => value.scale === color.scale))

  // If the next two closest colors are both grays, remove the second one until it’s not a gray anymore.
  // This is because up next we will be comparing how close the two closest colors are to the source color,
  // and since the grays are all extremely close to each other, we won’t get any useful data from the second
  // closest color if it’s also a gray.
  const grayScaleNamesStr = grayScaleNames as readonly string[]
  const allAreGrays = closestColors.every((color) => grayScaleNamesStr.includes(color.scale))
  if (!allAreGrays && grayScaleNamesStr.includes(closestColors[0].scale)) {
    while (grayScaleNamesStr.includes(closestColors[1].scale)) {
      closestColors.splice(1, 1)
    }
  }

  const colorA = closestColors[0]
  const colorB = closestColors[1]

  // Light trigonometry ahead.
  //
  // We want to determine the color that is the closest to the source color. Sometimes it makes sense
  // to proportionally mix the two closest colors together, but sometimes it is not useful at all.
  // Color coords are spatial in 3D, however we can treat the data we have as a 2D projection that is good enough.
  //
  // Case 1:
  // If the distances between the source color, the 1st closest color (A) and the 2nd closest color (B) form
  // a triangle where NEITHER angle A nor B are larger than 90 degrees, then we want to mix the 1st and the 2nd
  // closest colors in the same proportion as distances AD and BD are to each other. Mixing the two would result
  // in a color that would be closer to the source color than either of the two original closest colors.
  // Example: source color is a desaturated blue, which is between "indigo" and "slate" scales.
  //
  //        C ← Source color
  //       /|⟍
  //      / |  ⟍
  //   b /  |    ⟍  a
  //    /   |      ⟍
  //   /    |        ⟍
  //  A --- D -------- B
  //        ↑
  //        The color we want to use as the base, which is a mix of A and B.
  //
  // Case 2:
  // If the distances between the source color, the 1st closest color (A) and the 2nd closest color (B) form
  // a triangle where EITHER angle A or B are larger than 90 degrees, then we don’t care about point B because it’s
  // directionally the same as A, as mixing A and B can’t provide us with a color that is any closer to the source.
  // Example: source color is a saturated blue, with "blue" being the closest scale, and "indigo" just being further.
  //
  //      C ← Source color
  //       \⟍
  //        \  ⟍
  //         \    ⟍  a
  //        b \      ⟍
  //           \        ⟍
  //            A ------- B
  //            ↑
  //            The color we want to use as the base, which is not influenced by B.

  // We’ll need all the lengths of the triangle sides, named after the angles they look at:
  const a = colorB.distance
  const b = colorA.distance
  const c = colorA.color.deltaEOK(colorB.color)

  // We can get the ratios of AD to BD lengths with trigonometry using tangents,
  // as the ratio of the tangents of the opposite angles will match.
  const cosA = (b ** 2 + c ** 2 - a ** 2) / (2 * b * c)
  const radA = Math.acos(cosA)
  const sinA = Math.sin(radA)

  const cosB = (a ** 2 + c ** 2 - b ** 2) / (2 * a * c)
  const radB = Math.acos(cosB)
  const sinB = Math.sin(radB)

  // Tangent of angle C in the ACD triangle
  const tanC1 = cosA / sinA

  // Tangent of angle C in the BCD triangle
  const tanC2 = cosB / sinB

  // The ratio of the tangents corresponds to the ratio of the distances AD to BD
  // In the end, it means how much of scale B we want to mix into scale A.
  // If it’s "0" or less, this is an obtuse triangle from case 2, and we use just scale A.
  const ratio = Math.max(0, tanC1 / tanC2) * 0.5

  // The base scale is going to be a mix of the two closest scales, with the mix ratio we determined before
  const scaleA = scales[colorA.scale]
  const scaleB = scales[colorB.scale]
  const scale = arrayOf12.map((i) => new Color(Color.mix(scaleA[i], scaleB[i], ratio)).to('oklch')) as Scale<Color>

  // Get the closest color from the pre-mixed scale we created
  const baseColor = scale.slice().sort((a, b) => source.deltaEOK(a) - source.deltaEOK(b))[0]

  // Note the chroma difference between the source color and the base color
  const ratioC = source.coords[1] / baseColor.coords[1]

  // Modify hue and chroma of the scale to match the source color
  scale.forEach((color) => {
    color.coords[1] = Math.min(source.coords[1] * 1.5, color.coords[1] * ratioC)
    color.coords[2] = source.coords[2]
  })

  // Light mode
  if (scale[0].coords[0] > 0.5) {
    const lightnessScale = scale.map(({ coords }) => coords[0])
    const backgroundL = Math.max(0, Math.min(1, backgroundColor.coords[0]))
    const newLightnessScale = transposeProgressionStart(
      backgroundL,
      // Add white as the first "step" of the light scale
      [1, ...lightnessScale],
      lightModeEasing,
    )

    // Remove the step we added
    newLightnessScale.shift()

    newLightnessScale.forEach((lightness, i) => {
      scale[i].coords[0] = lightness
    })

    return scale
  }

  // Dark mode
  const ease: typeof darkModeEasing = [...darkModeEasing]
  const referenceBackgroundColorL = scale[0].coords[0]
  const backgroundColorL = Math.max(0, Math.min(1, backgroundColor.coords[0]))

  // If background is lighter than step 0, we want to gradually change the easing to linear
  const ratioL = backgroundColorL / referenceBackgroundColorL

  if (ratioL > 1) {
    const maxRatio = 1.5

    for (let i = 0; i < ease.length; i++) {
      const metaRatio = (ratioL - 1) * (maxRatio / (maxRatio - 1))
      ease[i] = ratioL > maxRatio ? 0 : Math.max(0, ease[i] * (1 - metaRatio))
    }
  }

  const lightnessScale = scale.map(({ coords }) => coords[0])
  const backgroundL = backgroundColor.coords[0]
  const newLightnessScale = transposeProgressionStart(backgroundL, lightnessScale, ease)

  newLightnessScale.forEach((lightness, i) => {
    scale[i].coords[0] = lightness
  })

  return scale
}

function getTextColor(background: Color) {
  const white = new Color('oklch', [1, 0, 0])

  if (Math.abs(white.contrastAPCA(background)) < 40) {
    const [, C, H] = background.coords
    return new Color('oklch', [0.25, Math.max(0.08 * C, 0.04), H])
  }

  return white
}

// target = background * (1 - alpha) + foreground * alpha
// alpha = (target - background) / (foreground - background)
// Expects 0-1 numbers for the RGB channels
function getAlphaColor(
  targetRgb: number[],
  backgroundRgb: number[],
  rgbPrecision: number,
  alphaPrecision: number,
  targetAlpha?: number,
) {
  const [tr, tg, tb] = targetRgb.map((c) => Math.round(c * rgbPrecision))
  const [br, bg, bb] = backgroundRgb.map((c) => Math.round(c * rgbPrecision))

  if (
    tr === undefined ||
    tg === undefined ||
    tb === undefined ||
    br === undefined ||
    bg === undefined ||
    bb === undefined
  ) {
    throw Error('Color is undefined')
  }

  // Is the background color lighter, RGB-wise, than target color?
  // Decide whether we want to add as little color or as much color as possible,
  // darkening or lightening the background respectively.
  // If at least one of the bits of the target RGB value
  // is lighter than the background, we want to lighten it.
  let desiredRgb = 0
  if (tr > br) {
    desiredRgb = rgbPrecision
  } else if (tg > bg) {
    desiredRgb = rgbPrecision
  } else if (tb > bb) {
    desiredRgb = rgbPrecision
  }

  const alphaR = (tr - br) / (desiredRgb - br)
  const alphaG = (tg - bg) / (desiredRgb - bg)
  const alphaB = (tb - bb) / (desiredRgb - bb)

  const isPureGray = [alphaR, alphaG, alphaB].every((alpha) => alpha === alphaR)

  // No need for precision gymnastics with pure grays, and we can get cleaner output
  if (!targetAlpha && isPureGray) {
    // Convert back to 0-1 values
    const V = desiredRgb / rgbPrecision
    return [V, V, V, alphaR] as const
  }

  const clampRgb = (n: number) => (isNaN(n) ? 0 : Math.min(rgbPrecision, Math.max(0, n)))
  const clampA = (n: number) => (isNaN(n) ? 0 : Math.min(alphaPrecision, Math.max(0, n)))
  const maxAlpha = targetAlpha ?? Math.max(alphaR, alphaG, alphaB)

  const A = clampA(Math.ceil(maxAlpha * alphaPrecision)) / alphaPrecision
  let R = clampRgb(((br * (1 - A) - tr) / A) * -1)
  let G = clampRgb(((bg * (1 - A) - tg) / A) * -1)
  let B = clampRgb(((bb * (1 - A) - tb) / A) * -1)

  R = Math.ceil(R)
  G = Math.ceil(G)
  B = Math.ceil(B)

  const blendedR = blendAlpha(R, A, br)
  const blendedG = blendAlpha(G, A, bg)
  const blendedB = blendAlpha(B, A, bb)

  // Correct for rounding errors in light mode
  if (desiredRgb === 0) {
    if (tr <= br && tr !== blendedR) {
      R = tr > blendedR ? R + 1 : R - 1
    }

    if (tg <= bg && tg !== blendedG) {
      G = tg > blendedG ? G + 1 : G - 1
    }

    if (tb <= bb && tb !== blendedB) {
      B = tb > blendedB ? B + 1 : B - 1
    }
  }

  // Correct for rounding errors in dark mode
  if (desiredRgb === rgbPrecision) {
    if (tr >= br && tr !== blendedR) {
      R = tr > blendedR ? R + 1 : R - 1
    }

    if (tg >= bg && tg !== blendedG) {
      G = tg > blendedG ? G + 1 : G - 1
    }

    if (tb >= bb && tb !== blendedB) {
      B = tb > blendedB ? B + 1 : B - 1
    }
  }

  // Convert back to 0-1 values
  R = R / rgbPrecision
  G = G / rgbPrecision
  B = B / rgbPrecision

  return [R, G, B, A] as const
}

// Important – I empirically discovered that this rounding is how the browser actually overlays
// transparent RGB bits over each other. It does NOT round the whole result altogether.
function blendAlpha(foreground: number, alpha: number, background: number, round = true) {
  if (round) {
    return Math.round(background * (1 - alpha)) + Math.round(foreground * alpha)
  }

  return background * (1 - alpha) + foreground * alpha
}

function getAlphaColorSrgb(targetColor: string, backgroundColor: string, targetAlpha?: number) {
  const [r, g, b, a] = getAlphaColor(
    new Color(targetColor).to('srgb').coords,
    new Color(backgroundColor).to('srgb').coords,
    255,
    255,
    targetAlpha,
  )

  return formatHex(new Color('srgb', [r, g, b], a).toString({ format: 'hex' }))
}

function getAlphaColorP3(targetColor: string, backgroundColor: string, targetAlpha?: number) {
  const [r, g, b, a] = getAlphaColor(
    new Color(targetColor).to('p3').coords,
    new Color(backgroundColor).to('p3').coords,
    // Not sure why, but the resulting P3 alpha colors are blended in the browser most precisely when
    // rounded to 255 integers too. Is the browser using 0-255 rather than 0-1 under the hood for P3 too?
    255,
    1000,
    targetAlpha,
  )

  return (
    new Color('p3', [r, g, b], a)
      .toString({ precision: 4 })
      // Important: in non-browser environments colorjs.io outputs a different format for some reason
      .replace('color(p3 ', 'color(display-p3 ')
  )
}

// Format shortform hex to longform
function formatHex(str: string) {
  if (!str.startsWith('#')) {
    return str
  }

  if (str.length === 4) {
    const hash = str.charAt(0)
    const r = str.charAt(1)
    const g = str.charAt(2)
    const b = str.charAt(3)
    return hash + r + r + g + g + b + b
  }

  if (str.length === 5) {
    const hash = str.charAt(0)
    const r = str.charAt(1)
    const g = str.charAt(2)
    const b = str.charAt(3)
    const a = str.charAt(4)
    return hash + r + r + g + g + b + b + a + a
  }

  return str
}

const darkModeEasing = [1, 0, 1, 0] as [number, number, number, number]
const lightModeEasing = [0, 2, 0, 2] as [number, number, number, number]

function transposeProgressionStart(to: number, arr: number[], curve: [number, number, number, number]) {
  return arr.map((n, i, arr) => {
    const lastIndex = arr.length - 1
    const diff = arr[0] - to
    const fn = BezierEasing(...curve)
    return n - diff * fn(1 - i / lastIndex)
  })
}

// Convert to OKLCH string with percentage for the lightness channel.
// Some browsers misread the unitless 0–1 lightness form, so the percentage form is always written.
function toOklchString(color: Color) {
  const L = +(color.coords[0] * 100).toFixed(1)
  return color
    .to('oklch')
    .toString({ precision: 4 })
    .replace(/(\S+)(.+)/, `oklch(${L}%$2`)
}
