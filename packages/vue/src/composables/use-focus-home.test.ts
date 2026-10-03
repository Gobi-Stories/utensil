import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { useFocusHome } from './use-focus-home'

let wrappers: VueWrapper[] = []

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'requestAnimationFrame'] })
})

afterEach(() => {
  wrappers.forEach((wrapper) => wrapper.unmount())
  wrappers = []
  vi.useRealTimers()
})

async function mountHome() {
  const component = defineComponent({
    setup() {
      const home = ref<HTMLElement | null>(null)
      useFocusHome(home)
      return { home }
    },
    template: `
      <div ref="home" class="home" tabindex="-1">
        <button class="first" />
        <button class="second" />
      </div>
    `,
  })

  const wrapper = mount(component, { attachTo: document.body })
  wrappers.push(wrapper)
  await nextTick()

  const find = (selector: string) => wrapper.find(selector).element as HTMLElement
  return { home: find('.home'), find }
}

// Browsers send the focusout a removed element's focus leaves with; the test DOM doesn't
function removeFocused(element: HTMLElement) {
  element.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }))
  element.remove()
}

describe('useFocusHome', () => {
  it('returns focus home when the focused control leaves', async () => {
    const { home, find } = await mountHome()
    const first = find('.first')
    first.focus()

    removeFocused(first)
    vi.runAllTimers()

    expect(document.activeElement).toBe(home)
  })

  it('leaves focus that the content returned itself', async () => {
    const { find } = await mountHome()
    const first = find('.first')
    first.focus()

    removeFocused(first)
    find('.second').focus()
    vi.runAllTimers()

    expect(document.activeElement).toBe(find('.second'))
  })

  it('leaves focus that moved on to somewhere else', async () => {
    const { find } = await mountHome()
    find('.first').focus()

    find('.second').focus()
    vi.runAllTimers()

    expect(document.activeElement).toBe(find('.second'))
  })
})
