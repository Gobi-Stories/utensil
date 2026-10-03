import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import UtensilItemStack from './UtensilItemStack.vue'

// Test utils stub TransitionGroup by default, which swallows the tag and the
// transition hooks — mount with the real one
const realTransitions = { global: { stubs: { 'transition-group': false } } }

function stackHost(initial: string[]) {
  const items = ref(initial)

  const host = defineComponent({
    setup() {
      return () =>
        h(UtensilItemStack, null, {
          default: () => items.value.map((item) => h('div', { key: item, class: 'stack-item' }, item)),
        })
    },
  })

  return { items, wrapper: mount(host, realTransitions) }
}

describe('UtensilItemStack', () => {
  it('renders keyed children in order', () => {
    const { wrapper } = stackHost(['one', 'two', 'three'])

    const rendered = wrapper.findAll('.stack-item').map((item) => item.text())
    expect(rendered).toEqual(['one', 'two', 'three'])
  })

  it('renders as the configured tag', () => {
    const wrapper = mount(UtensilItemStack, { props: { tag: 'ul' }, ...realTransitions })

    expect(wrapper.find('ul.utensil-item-stack').exists()).toBe(true)
  })

  it('adds new items into the stack', async () => {
    const { items, wrapper } = stackHost(['one'])

    items.value = ['one', 'two']
    await nextTick()

    const rendered = wrapper.findAll('.stack-item').map((item) => item.text())
    expect(rendered).toEqual(['one', 'two'])
  })

  it('removes items from the stack', async () => {
    const { items, wrapper } = stackHost(['one', 'two'])

    items.value = ['two']
    // Leave transitions have no duration in the test DOM, so removal settles on a timer tick
    await new Promise((resolve) => setTimeout(resolve, 50))

    const rendered = wrapper.findAll('.stack-item').map((item) => item.text())
    expect(rendered).toEqual(['two'])
  })

  it('pins a leaving item to its measured position', async () => {
    const { items, wrapper } = stackHost(['one', 'two'])

    const leaving = wrapper.findAll('.stack-item')[0].element as HTMLElement
    items.value = ['two']
    await nextTick()

    // Set by the before-leave hook so the absolute item holds its place
    expect(leaving.style.insetBlockStart).not.toBe('')
    expect(leaving.style.inlineSize).not.toBe('')
  })
})
