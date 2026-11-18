import { describe, it, expect, afterEach, beforeAll } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import UtensilToolbar from './UtensilToolbar.vue'
import UtensilToolbarSeparator from './UtensilToolbarSeparator.vue'
import UtensilRadioButtons from '../radio-buttons/UtensilRadioButtons.vue'
import UtensilRadioButton from '../radio-buttons/UtensilRadioButton.vue'

const mounted: VueWrapper[] = []

function mountToolbar(props: Record<string, unknown> = {}, disabledSecond = ref(false)) {
  const Host = defineComponent({
    setup() {
      return () =>
        h(UtensilToolbar, { 'aria-label': 'Formatting', ...props }, () => [
          h('button', { class: 'bold' }, 'Bold'),
          h('button', { class: 'italic', disabled: disabledSecond.value }, 'Italic'),
          h(UtensilToolbarSeparator),
          h('input', { class: 'size', type: 'text' }),
          h('button', { class: 'image' }, 'Image'),
          h('button', { class: 'hidden', hidden: true }, 'Hidden'),
          h('div', { popover: 'auto' }, [h('button', { class: 'in-popover' }, 'In a popover')]),
        ])
    },
  })
  const wrapper = mount(Host, { attachTo: document.body })
  mounted.push(wrapper)
  return wrapper
}

function press(wrapper: VueWrapper, selector: string, key: string) {
  return wrapper.find(selector).trigger('keydown', { key })
}

function focused(): string {
  return document.activeElement?.className ?? ''
}

// jsdom lays nothing out, so visibility comes from the hidden attribute alone
beforeAll(() => {
  HTMLElement.prototype.checkVisibility = function (this: HTMLElement) {
    return !this.closest('[hidden]')
  }
})

afterEach(() => {
  while (mounted.length) {
    mounted.pop()?.unmount()
  }
})

describe('UtensilToolbar', () => {
  it('is a labelled toolbar in the given orientation', () => {
    const wrapper = mountToolbar({ orientation: 'vertical' })
    const toolbar = wrapper.find('.utensil-toolbar')
    expect(toolbar.attributes('role')).toBe('toolbar')
    expect(toolbar.attributes('aria-label')).toBe('Formatting')
    expect(toolbar.attributes('aria-orientation')).toBe('vertical')
    expect(toolbar.classes()).toContain('vertical')
  })

  it('takes one place in the tab order, at its first control', () => {
    const wrapper = mountToolbar()
    expect(wrapper.find('.bold').attributes('tabindex')).toBe('0')
    expect(wrapper.find('.italic').attributes('tabindex')).toBe('-1')
    expect(wrapper.find('.image').attributes('tabindex')).toBe('-1')
  })

  it('moves focus between its controls with the arrow keys, Home and End', async () => {
    const wrapper = mountToolbar()
    ;(wrapper.find('.bold').element as HTMLElement).focus()

    await press(wrapper, '.bold', 'ArrowRight')
    expect(focused()).toBe('italic')

    await press(wrapper, '.italic', 'End')
    expect(focused()).toBe('image')

    await press(wrapper, '.image', 'Home')
    expect(focused()).toBe('bold')
    expect(wrapper.find('.bold').attributes('tabindex')).toBe('0')
  })

  it('wraps from the ends unless told not to', async () => {
    const looping = mountToolbar()
    ;(looping.find('.bold').element as HTMLElement).focus()
    await press(looping, '.bold', 'ArrowLeft')
    expect(focused()).toBe('image')

    const stopping = mountToolbar({ loop: false })
    ;(stopping.find('.bold').element as HTMLElement).focus()
    await press(stopping, '.bold', 'ArrowLeft')
    expect(focused()).toBe('bold')
  })

  it('makes the control last used the one Tab returns to', async () => {
    const wrapper = mountToolbar()
    ;(wrapper.find('.image').element as HTMLElement).focus()
    await wrapper.find('.image').trigger('focusin')
    expect(wrapper.find('.image').attributes('tabindex')).toBe('0')
    expect(wrapper.find('.bold').attributes('tabindex')).toBe('-1')
  })

  it('skips disabled and hidden controls', async () => {
    const wrapper = mountToolbar({}, ref(true))
    ;(wrapper.find('.bold').element as HTMLElement).focus()
    await press(wrapper, '.bold', 'ArrowRight')
    expect(focused()).toBe('image')
    await press(wrapper, '.image', 'ArrowRight')
    expect(focused()).toBe('bold')
  })

  it('leaves a text field its arrow keys and its own place in the tab order', async () => {
    const wrapper = mountToolbar()
    expect(wrapper.find('.size').attributes('tabindex')).toBeUndefined()
    ;(wrapper.find('.size').element as HTMLElement).focus()
    await press(wrapper, '.size', 'ArrowRight')
    expect(focused()).toBe('size')
  })

  it("leaves the controls of another widget's content alone", () => {
    const wrapper = mountToolbar()
    expect(wrapper.find('.in-popover').attributes('tabindex')).toBeUndefined()
  })

  it('leaves arrow keys with modifiers alone', async () => {
    const wrapper = mountToolbar()
    ;(wrapper.find('.bold').element as HTMLElement).focus()
    await wrapper.find('.bold').trigger('keydown', { key: 'ArrowRight', shiftKey: true })
    expect(focused()).toBe('bold')
  })

  it('uses the vertical arrow keys in a vertical toolbar', async () => {
    const wrapper = mountToolbar({ orientation: 'vertical' })
    ;(wrapper.find('.bold').element as HTMLElement).focus()
    await press(wrapper, '.bold', 'ArrowRight')
    expect(focused()).toBe('bold')
    await press(wrapper, '.bold', 'ArrowDown')
    expect(focused()).toBe('italic')
  })

  it('keeps a tab stop when its controls are disabled and enabled', async () => {
    const disabled = ref(false)
    const wrapper = mountToolbar({}, disabled)
    ;(wrapper.find('.italic').element as HTMLElement).focus()
    await wrapper.find('.italic').trigger('focusin')

    disabled.value = true
    await nextTick()
    // The observer runs after the DOM change
    await new Promise((resolve) => setTimeout(resolve))
    expect(wrapper.find('.bold').attributes('tabindex')).toBe('0')
  })

  it('keeps an aria-disabled control a stop, so it can be found', async () => {
    const Host = defineComponent({
      setup: () => () =>
        h(UtensilToolbar, { 'aria-label': 'Story' }, () => [
          h('button', { class: 'publish', 'aria-disabled': 'true' }, 'Publish'),
          h('button', { class: 'share' }, 'Share'),
        ]),
    })
    const wrapper = mount(Host, { attachTo: document.body })
    mounted.push(wrapper)

    expect(wrapper.find('.publish').attributes('tabindex')).toBe('0')
    ;(wrapper.find('.publish').element as HTMLElement).focus()
    await press(wrapper, '.publish', 'ArrowRight')
    expect(focused()).toBe('share')
  })

  it("leaves a select's combobox trigger its own tab stop and arrow keys", async () => {
    const Host = defineComponent({
      setup: () => () =>
        h(UtensilToolbar, { 'aria-label': 'Text' }, () => [
          h('button', { class: 'bold' }, 'Bold'),
          h('button', { class: 'font', role: 'combobox', 'aria-expanded': 'false' }, 'Inter'),
          h('button', { class: 'italic' }, 'Italic'),
        ]),
    })
    const wrapper = mount(Host, { attachTo: document.body })
    mounted.push(wrapper)

    expect(wrapper.find('.font').attributes('tabindex')).toBeUndefined()
    ;(wrapper.find('.bold').element as HTMLElement).focus()
    await press(wrapper, '.bold', 'ArrowRight')
    expect(focused()).toBe('italic')
  })

  it('applies its variation', () => {
    const wrapper = mountToolbar({ variation: 'soft' })
    expect(wrapper.find('.utensil-toolbar').classes()).toContain('ui-soft')
  })
})

describe('UtensilToolbar with a radio group', () => {
  function mountWithGroup(props: Record<string, unknown> = {}, align = ref<string | undefined>('center')) {
    const Host = defineComponent({
      setup() {
        return () =>
          h(UtensilToolbar, { 'aria-label': 'Formatting', ...props }, () => [
            h('button', { class: 'bold' }, 'Bold'),
            h(
              UtensilRadioButtons,
              {
                'aria-label': 'Alignment',
                modelValue: align.value,
                'onUpdate:modelValue': (value: string | undefined) => (align.value = value),
              },
              () => [
                h(UtensilRadioButton, { value: 'left', icon: 'check', label: 'Left' }),
                h(UtensilRadioButton, { value: 'center', icon: 'check', label: 'Center' }),
                h(UtensilRadioButton, { value: 'right', icon: 'check', label: 'Right' }),
              ],
            ),
            h('button', { class: 'link' }, 'Link'),
          ])
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    mounted.push(wrapper)
    return { wrapper, align }
  }

  const focusedRadio = () => document.activeElement?.getAttribute('data-value')

  it('is one stop of the arrow keys, at its checked radio', async () => {
    const { wrapper } = mountWithGroup()
    ;(wrapper.find('.bold').element as HTMLElement).focus()

    await press(wrapper, '.bold', 'ArrowRight')
    expect(focusedRadio()).toBe('center')

    await press(wrapper, '[data-value="center"]', 'ArrowRight')
    expect(focused()).toBe('link')

    await press(wrapper, '.link', 'ArrowLeft')
    expect(focusedRadio()).toBe('center')
  })

  it('stops at its first radio while none is checked', async () => {
    const { wrapper } = mountWithGroup({}, ref(undefined))
    ;(wrapper.find('.link').element as HTMLElement).focus()

    await press(wrapper, '.link', 'ArrowLeft')
    expect(focusedRadio()).toBe('left')
  })

  it('leaves the keys across the toolbar to the group, which moves between its radios', async () => {
    const { wrapper, align } = mountWithGroup()
    ;(wrapper.find('[data-value="center"]').element as HTMLElement).focus()

    await press(wrapper, '[data-value="center"]', 'ArrowDown')
    expect(focusedRadio()).toBe('right')
    expect(align.value).toBe('right')
  })

  it('makes the checked radio the one Tab returns to', async () => {
    const { wrapper, align } = mountWithGroup()
    ;(wrapper.find('[data-value="center"]').element as HTMLElement).focus()
    await wrapper.find('[data-value="center"]').trigger('focusin')

    align.value = 'right'
    await nextTick()
    // The observer runs after the DOM change
    await new Promise((resolve) => setTimeout(resolve))

    expect(wrapper.find('[data-value="right"]').attributes('tabindex')).toBe('0')
    expect(wrapper.find('[data-value="center"]').attributes('tabindex')).toBe('-1')
    expect(wrapper.find('.bold').attributes('tabindex')).toBe('-1')
  })

  it('takes Home and End from the group', async () => {
    const { wrapper } = mountWithGroup()
    ;(wrapper.find('[data-value="center"]').element as HTMLElement).focus()

    await press(wrapper, '[data-value="center"]', 'End')
    expect(focused()).toBe('link')
  })
})

describe('UtensilToolbarSeparator', () => {
  it('runs across the toolbar', () => {
    const horizontal = mountToolbar()
    expect(horizontal.find('.utensil-toolbar-separator').attributes('aria-orientation')).toBe('vertical')

    const vertical = mountToolbar({ orientation: 'vertical' })
    expect(vertical.find('.utensil-toolbar-separator').attributes('aria-orientation')).toBe('horizontal')
  })

  it("takes its orientation over the toolbar's", () => {
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(UtensilToolbar, { 'aria-label': 'Formatting' }, () => [
            h(UtensilToolbarSeparator, { orientation: 'horizontal' }),
          ]),
      }),
    )
    mounted.push(wrapper)
    expect(wrapper.find('.utensil-toolbar-separator').attributes('aria-orientation')).toBe('horizontal')
  })

  it('stands alone, vertical by default, or in the orientation given', () => {
    const alone = mount(UtensilToolbarSeparator)
    expect(alone.attributes('role')).toBe('separator')
    expect(alone.attributes('aria-orientation')).toBe('vertical')

    const given = mount(UtensilToolbarSeparator, { props: { orientation: 'horizontal' } })
    expect(given.attributes('aria-orientation')).toBe('horizontal')
  })
})
