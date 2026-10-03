import type { MaybeRefOrGetter, Ref } from 'vue'
import { readonly, ref, toValue, watch } from 'vue'
import { type ImageColorMode, calculateColor, cssColor, sampleImage } from '../lib/image-color/image-color'

// A reactive representative color for an image element. The image is point-
// sampled when it has loaded (and again whenever it loads a new source) and
// the samples reduce to a single CSS color. The ref holds undefined until a
// sample lands, and whenever the image can't be read — missing, failed, or
// tainting the canvas without CORS approval. How the color is applied or
// adjusted is the consumer's concern.

export interface ImageColorOptions {
  // How the samples reduce to one color
  mode?: MaybeRefOrGetter<ImageColorMode>
  // How many points are sampled, as a square grid inset from the image's edges
  points?: number
}

export function useImageColor(
  image: MaybeRefOrGetter<HTMLImageElement | null | undefined>,
  { mode = 'average', points = 16 }: ImageColorOptions = {},
): Readonly<Ref<string | undefined>> {
  const color = ref<string | undefined>()

  function sample(element: HTMLImageElement) {
    try {
      const derived = calculateColor(sampleImage(element, points), toValue(mode))
      color.value = derived && cssColor(derived)
    } catch {
      // Reading pixels from a non-CORS-approved cross-origin image throws
      color.value = undefined
    }
  }

  watch(
    [() => toValue(image), () => toValue(mode)],
    ([element], _, onCleanup) => {
      if (!element) {
        color.value = undefined

        return
      }

      const onLoad = () => sample(element)
      const onError = () => (color.value = undefined)

      element.addEventListener('load', onLoad)
      element.addEventListener('error', onError)
      onCleanup(() => {
        element.removeEventListener('load', onLoad)
        element.removeEventListener('error', onError)
      })

      if (element.complete && element.naturalWidth) {
        sample(element)
      }
    },
    { immediate: true },
  )

  return readonly(color)
}
