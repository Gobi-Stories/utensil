import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import UtensilListbox from './UtensilListbox.vue'

type ListboxApi = {
  focusNext: () => void
  focusPrev: () => void
  focusFirst: () => void
  focusLast: () => void
  setFocusedValue: (value: string | null) => void
  typeahead: (character: string) => boolean
  reset: () => void
  activeDescendant: string | null
}

const fruit = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry', disabled: true },
  { value: 'date', label: 'Date' },
]

let wrapper: VueWrapper | undefined

const scrollIntoView = vi.fn()

beforeAll(() => {
  HTMLElement.prototype.scrollIntoView = scrollIntoView
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

function mountListbox(props: Record<string, unknown> = {}) {
  wrapper = mount(UtensilListbox, {
    props: { ariaLabel: 'Fruit', ...props },
    slots: {
      default: () =>
        fruit.map((option) =>
          h(
            'div',
            {
              id: `option-${option.value}`,
              role: 'option',
              'data-value': option.value,
              'data-focusable': option.disabled ? undefined : '',
              'aria-disabled': option.disabled || undefined,
            },
            option.label,
          ),
        ),
    },
    attachTo: document.body,
  })
  return wrapper
}

const api = (w: VueWrapper) => w.vm as unknown as ListboxApi
const focused = (w: VueWrapper) => w.find('[data-focused]').text()

describe('UtensilListbox', () => {
  it('is a named listbox', () => {
    const listbox = mountListbox()
    expect(listbox.attributes('role')).toBe('listbox')
    expect(listbox.attributes('aria-label')).toBe('Fruit')
    expect(listbox.attributes('aria-multiselectable')).toBeUndefined()
  })

  it('is named by a visible label in preference to ariaLabel', () => {
    const listbox = mountListbox({ ariaLabelledby: 'fruit-label' })
    expect(listbox.attributes('aria-labelledby')).toBe('fruit-label')
    expect(listbox.attributes('aria-label')).toBeUndefined()
  })

  it('marks itself multiselectable', () => {
    expect(mountListbox({ multiselectable: true }).attributes('aria-multiselectable')).toBe('true')
  })

  it('moves through its items, passing over disabled ones, and reports the focused value', async () => {
    const listbox = mountListbox()
    api(listbox).focusFirst()
    api(listbox).focusNext()
    api(listbox).focusNext()
    api(listbox).focusNext()
    await nextTick()
    expect(focused(listbox)).toBe('Date')
    expect(api(listbox).activeDescendant).toBe('option-date')
    expect(listbox.emitted('update:focusedValue')?.slice(-1)[0]).toEqual(['date'])

    api(listbox).focusPrev()
    expect(focused(listbox)).toBe('Blueberry')
  })

  it('leaves focus where it is when asked to focus a disabled item', () => {
    const listbox = mountListbox()
    api(listbox).setFocusedValue('banana')
    api(listbox).setFocusedValue('cherry')
    expect(focused(listbox)).toBe('Banana')
    expect(listbox.emitted('update:focusedValue')).toEqual([['banana']])
  })

  it('focuses the controlled value it starts with, scrolled into view', async () => {
    const listbox = mountListbox({ focusedValue: 'date' })
    await nextTick()
    expect(focused(listbox)).toBe('Date')
    expect(scrollIntoView).toHaveBeenCalled()
  })

  it('jumps to an item by the start of its text, and on through those that start with a repeated character', () => {
    const listbox = mountListbox()
    expect(api(listbox).typeahead('b')).toBe(true)
    expect(focused(listbox)).toBe('Banana')
    api(listbox).typeahead('b')
    expect(focused(listbox)).toBe('Blueberry')
    expect(api(listbox).typeahead('z')).toBe(false)
  })

  it('matches a longer search typed in quick succession', () => {
    const listbox = mountListbox()
    api(listbox).typeahead('b')
    api(listbox).typeahead('l')
    expect(focused(listbox)).toBe('Blueberry')
  })

  it('clears its focus on reset', () => {
    const listbox = mountListbox()
    api(listbox).focusFirst()
    api(listbox).reset()
    expect(listbox.find('[data-focused]').exists()).toBe(false)
    expect(listbox.emitted('update:focusedValue')?.slice(-1)[0]).toEqual([null])
  })

  it('takes focus on a press inside it when it takes focus itself', async () => {
    const listbox = mountListbox()
    await listbox.find('#option-banana').trigger('mousedown')
    expect(document.activeElement).not.toBe(listbox.element)
    wrapper?.unmount()

    const focusable = mount(UtensilListbox, {
      props: { ariaLabel: 'Fruit' },
      attrs: { tabindex: '0' },
      slots: { default: () => h('div', { id: 'only', role: 'option', 'data-value': 'only' }, 'Only') },
      attachTo: document.body,
    })
    wrapper = focusable
    await focusable.find('#only').trigger('mousedown')
    expect(document.activeElement).toBe(focusable.element)
  })

  it('scrolls past its maximum height unless full', () => {
    expect(mountListbox().classes()).not.toContain('full')
    wrapper?.unmount()
    expect(mountListbox({ full: true }).classes()).toContain('full')
  })
})
