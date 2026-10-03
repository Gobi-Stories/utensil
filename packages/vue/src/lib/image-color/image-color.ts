// Derives a single representative color from image pixels. sampleImage reads a
// spread of point samples from an image element; calculateColor reduces any set
// of samples to one color, so other sources (raw ImageData, video frames) can
// feed the same reduction.

export type RgbColor = { r: number; g: number; b: number }

// 'common' groups similar samples and returns the largest group's average,
// 'median' the middle sample by luminance, 'average' the per-channel mean
export type ImageColorMode = 'common' | 'median' | 'average'

// Samples are read from a small redraw of the image — cheap to read, and the
// downscale pre-blends detail so point samples aren't hostage to single pixels
const SAMPLE_CANVAS_SIZE = 64

// Reads point samples from a loaded image on a square grid inset from the
// edges, so borders and letterboxing weigh less. Throws when the image taints
// the canvas (cross-origin without CORS approval) — callers treat that as
// "no color available".
export function sampleImage(image: HTMLImageElement, points = 16): RgbColor[] {
  const side = Math.max(1, Math.round(Math.sqrt(points)))
  const canvas = document.createElement('canvas')
  canvas.width = SAMPLE_CANVAS_SIZE
  canvas.height = SAMPLE_CANVAS_SIZE

  const context = canvas.getContext('2d', { willReadFrequently: true })

  if (!context) {
    return []
  }

  context.drawImage(image, 0, 0, SAMPLE_CANVAS_SIZE, SAMPLE_CANVAS_SIZE)

  const data = context.getImageData(0, 0, SAMPLE_CANVAS_SIZE, SAMPLE_CANVAS_SIZE).data
  const samples: RgbColor[] = []

  for (let row = 0; row < side; row++) {
    for (let column = 0; column < side; column++) {
      const x = Math.floor(((column + 0.5) / side) * SAMPLE_CANVAS_SIZE)
      const y = Math.floor(((row + 0.5) / side) * SAMPLE_CANVAS_SIZE)
      const offset = (y * SAMPLE_CANVAS_SIZE + x) * 4

      samples.push({ r: data[offset], g: data[offset + 1], b: data[offset + 2] })
    }
  }

  return samples
}

export function calculateColor(samples: RgbColor[], mode: ImageColorMode): RgbColor | undefined {
  if (!samples.length) {
    return undefined
  }

  if (mode === 'average') {
    return averageColor(samples)
  }

  if (mode === 'median') {
    const ordered = [...samples].sort((a, b) => luminance(a) - luminance(b))

    return ordered[Math.floor(ordered.length / 2)]
  }

  return commonColor(samples)
}

// The color as a CSS color value
export function cssColor({ r, g, b }: RgbColor): string {
  return `rgb(${r} ${g} ${b})`
}

function averageColor(samples: RgbColor[]): RgbColor {
  let r = 0
  let g = 0
  let b = 0

  for (const sample of samples) {
    r += sample.r
    g += sample.g
    b += sample.b
  }

  return {
    r: Math.round(r / samples.length),
    g: Math.round(g / samples.length),
    b: Math.round(b / samples.length),
  }
}

function luminance({ r, g, b }: RgbColor): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// Quantizes each channel into coarse steps so near-identical samples count as
// one color, then averages the winning group
const BUCKET_STEP = 32

function commonColor(samples: RgbColor[]): RgbColor {
  const buckets = new Map<string, RgbColor[]>()

  for (const sample of samples) {
    const key = [sample.r, sample.g, sample.b].map((channel) => Math.floor(channel / BUCKET_STEP)).join(':')
    const bucket = buckets.get(key)

    if (bucket) {
      bucket.push(sample)
    } else {
      buckets.set(key, [sample])
    }
  }

  let winner: RgbColor[] = []

  for (const bucket of buckets.values()) {
    if (bucket.length > winner.length) {
      winner = bucket
    }
  }

  return averageColor(winner)
}
