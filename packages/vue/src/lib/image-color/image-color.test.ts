import { describe, expect, it } from 'vitest'
import type { RgbColor } from './image-color'
import { calculateColor, cssColor } from './image-color'

const red: RgbColor = { r: 200, g: 20, b: 30 }
const darkRed: RgbColor = { r: 195, g: 10, b: 20 }
const blue: RgbColor = { r: 10, g: 20, b: 220 }
const white: RgbColor = { r: 255, g: 255, b: 255 }
const black: RgbColor = { r: 0, g: 0, b: 0 }

describe('calculateColor', () => {
  it('returns undefined for no samples', () => {
    expect(calculateColor([], 'average')).toBeUndefined()
    expect(calculateColor([], 'median')).toBeUndefined()
    expect(calculateColor([], 'common')).toBeUndefined()
  })

  it('averages each channel across the samples', () => {
    expect(calculateColor([black, white], 'average')).toEqual({ r: 128, g: 128, b: 128 })
    expect(calculateColor([red, blue], 'average')).toEqual({ r: 105, g: 20, b: 125 })
  })

  it('takes the median as the middle sample by luminance', () => {
    // Luminance orders black < blue < red < white — the median is a real
    // sample, never a blend
    expect(calculateColor([white, black, red, blue, red], 'median')).toEqual(red)
  })

  it('takes the most common as the largest group of similar samples', () => {
    // The two reds land in one bucket and outnumber every other color
    const common = calculateColor([red, darkRed, blue, white], 'common')

    expect(common).toEqual({ r: 198, g: 15, b: 25 })
  })

  it('groups common samples by coarse steps, not exact values', () => {
    // Samples 3 apart share a bucket; a lone exact color loses to the group
    const nearWhites = [
      { r: 250, g: 250, b: 250 },
      { r: 253, g: 253, b: 253 },
    ]

    expect(calculateColor([...nearWhites, blue], 'common')).toEqual({ r: 252, g: 252, b: 252 })
  })
})

describe('cssColor', () => {
  it('formats as a CSS rgb value', () => {
    expect(cssColor(red)).toBe('rgb(200 20 30)')
  })
})
