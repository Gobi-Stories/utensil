import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { VIEW_BOX } from './utensil-data-viz'

// Narrower than this, the drawing scales down rather than crowding its axes
const MIN_WIDTH = 240

/**
 * A viewBox that fills a chart's svg box at the drawing's natural height: its width is the box's width at the height
 * it's drawn at, so text and strokes keep their natural size whatever the box's proportions. The svg's height never
 * follows the viewBox (a box without a height draws at the natural one), so this settles at once.
 *
 * `toBox` places a point of the drawing in the svg's box, as percentages of it, for HTML laid over the drawing. A box
 * narrower than the drawing's minimum width letterboxes it, so the drawing doesn't always fill the box.
 */
export function useFittedViewBox(svg: Readonly<Ref<SVGSVGElement | null>>) {
  const box = ref<{ width: number; height: number }>()
  let observer: ResizeObserver | undefined

  watch(
    svg,
    (element) => {
      observer?.disconnect()
      if (!element || typeof ResizeObserver === 'undefined') {
        return
      }

      observer = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect
        if (width > 0 && height > 0) {
          box.value = { width, height }
        }
      })
      observer.observe(element)
    },
    { immediate: true },
  )

  onBeforeUnmount(() => observer?.disconnect())

  const viewBox = computed(() => ({
    width: box.value
      ? Math.max(MIN_WIDTH, Math.round((box.value.width * VIEW_BOX.height) / box.value.height))
      : VIEW_BOX.width,
    height: VIEW_BOX.height,
  }))

  // As preserveAspectRatio="xMidYMid meet" draws it: scaled to fit, and centered in the box
  function toBox(x: number, y: number): { x: number; y: number } {
    const { width, height } = box.value ?? viewBox.value
    const scale = Math.min(width / viewBox.value.width, height / viewBox.value.height)
    const offsetX = (width - viewBox.value.width * scale) / 2
    const offsetY = (height - viewBox.value.height * scale) / 2
    return {
      x: ((offsetX + x * scale) / width) * 100,
      y: ((offsetY + y * scale) / height) * 100,
    }
  }

  return { viewBox, toBox }
}
