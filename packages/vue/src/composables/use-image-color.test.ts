import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'
import type { ImageColorMode } from '../lib/image-color/image-color'
import { useImageColor } from './use-image-color'

const { sampleImage, calculateColor } = vi.hoisted(() => ({
  sampleImage: vi.fn(() => [{ r: 100, g: 150, b: 200 }]),
  calculateColor: vi.fn((samples: { r: number; g: number; b: number }[]) => samples[0]),
}))

vi.mock('../lib/image-color/image-color', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  sampleImage,
  calculateColor,
}))

// The test DOM's images never load for real — completeness is stubbed
function testImage(complete: boolean): HTMLImageElement {
  const image = document.createElement('img')
  Object.defineProperty(image, 'complete', { value: complete })
  Object.defineProperty(image, 'naturalWidth', { value: complete ? 10 : 0 })

  return image
}

const scopes: ReturnType<typeof effectScope>[] = []

function createImageColor(...parameters: Parameters<typeof useImageColor>) {
  const scope = effectScope()
  scopes.push(scope)

  return scope.run(() => useImageColor(...parameters))!
}

afterEach(() => {
  scopes.splice(0).forEach((scope) => scope.stop())
  vi.clearAllMocks()
})

describe('useImageColor', () => {
  it('samples an already-loaded image', async () => {
    const color = createImageColor(testImage(true))
    await nextTick()

    expect(color.value).toBe('rgb(100 150 200)')
  })

  it('stays undefined until the image loads, then samples', async () => {
    const image = testImage(false)
    const color = createImageColor(image)
    await nextTick()

    expect(color.value).toBeUndefined()

    image.dispatchEvent(new Event('load'))

    expect(color.value).toBe('rgb(100 150 200)')
  })

  it('clears the color when the image errors', async () => {
    const image = testImage(true)
    const color = createImageColor(image)
    await nextTick()

    expect(color.value).toBe('rgb(100 150 200)')

    image.dispatchEvent(new Event('error'))

    expect(color.value).toBeUndefined()
  })

  it('clears the color when the element goes away', async () => {
    const image = ref<HTMLImageElement | null>(testImage(true))
    const color = createImageColor(image)
    await nextTick()

    expect(color.value).toBe('rgb(100 150 200)')

    image.value = null
    await nextTick()

    expect(color.value).toBeUndefined()
  })

  it('resamples when the mode changes', async () => {
    const mode = ref<ImageColorMode>('average')
    createImageColor(testImage(true), { mode })
    await nextTick()

    expect(calculateColor).toHaveBeenLastCalledWith(expect.anything(), 'average')

    mode.value = 'median'
    await nextTick()

    expect(calculateColor).toHaveBeenLastCalledWith(expect.anything(), 'median')
  })

  it('reports no color when sampling throws (tainted canvas)', async () => {
    sampleImage.mockImplementationOnce(() => {
      throw new Error('SecurityError')
    })

    const color = createImageColor(testImage(true))
    await nextTick()

    expect(color.value).toBeUndefined()
  })
})
