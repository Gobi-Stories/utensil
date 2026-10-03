import { describe, it, expect, vi, afterEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { useModalKeyboard } from './use-modal-keyboard'

let wrappers: VueWrapper[] = []

afterEach(() => {
  wrappers.forEach((wrapper) => wrapper.unmount())
  wrappers = []
})

describe('useModalKeyboard', () => {
  it('keeps keys pressed in the modal from the page beneath, leaving their default actions', async () => {
    const page = vi.fn()
    const component = defineComponent({
      setup() {
        const dialog = ref<HTMLDialogElement | null>(null)
        useModalKeyboard(dialog)
        return { dialog, page }
      },
      template: `
        <div @keydown="page" @keyup="page">
          <dialog ref="dialog" open tabindex="-1"><button class="control" /></dialog>
        </div>
      `,
    })
    const wrapper = mount(component, { attachTo: document.body })
    wrappers.push(wrapper)
    await nextTick()
    const control = wrapper.find('.control').element

    const keydown = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })
    control.dispatchEvent(keydown)
    control.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', bubbles: true }))

    expect(page).not.toHaveBeenCalled()
    expect(keydown.defaultPrevented).toBe(false)
  })
})
