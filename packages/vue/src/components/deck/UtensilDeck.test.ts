import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick, type Component } from 'vue'
import UtensilDeck from './UtensilDeck.vue'

interface DeckScope {
  id: string
  active: boolean
  appear: boolean
  transitionEnded: () => void
}

function mountDeck(current: string, appear = false, fit?: 'container' | 'content') {
  const scopes = new Map<string, DeckScope>()
  const wrapper = mount(UtensilDeck, {
    props: { current, appear, fit },
    slots: {
      default: (scope: DeckScope) => {
        scopes.set(scope.id, scope)
        return h('div', {
          class: 'panel',
          'data-id': scope.id,
          'data-active': String(scope.active),
          'data-appear': String(scope.appear),
        })
      },
    },
  })
  return { wrapper, scopes }
}

function mountedIds(wrapper: VueWrapper) {
  return wrapper.findAll('.panel').map((node) => node.attributes('data-id'))
}

function isActive(wrapper: VueWrapper, id: string) {
  return wrapper.find(`[data-id="${id}"]`).attributes('data-active') === 'true'
}

describe('UtensilDeck', () => {
  it('mounts only the current child initially', () => {
    const { wrapper } = mountDeck('a')
    expect(mountedIds(wrapper)).toEqual(['a'])
    expect(isActive(wrapper, 'a')).toBe(true)
  })

  it('does not animate the initial child by default but does with appear', () => {
    const plain = mountDeck('a')
    expect(plain.wrapper.find('[data-id="a"]').attributes('data-appear')).toBe('false')

    const appearing = mountDeck('a', true)
    expect(appearing.wrapper.find('[data-id="a"]').attributes('data-appear')).toBe('true')
  })

  it('keeps the outgoing child mounted until it reports transition-ended', async () => {
    const { wrapper, scopes } = mountDeck('a')

    await wrapper.setProps({ current: 'b' })
    // Both mounted: current rendered first (underneath), the leaver last (on top).
    expect(mountedIds(wrapper)).toEqual(['b', 'a'])
    expect(isActive(wrapper, 'b')).toBe(true)
    expect(isActive(wrapper, 'a')).toBe(false)
    // The newly-mounted child animates its entrance.
    expect(wrapper.find('[data-id="b"]').attributes('data-appear')).toBe('true')

    // The outgoing child settles → it unmounts and `left` fires.
    scopes.get('a')!.transitionEnded()
    await nextTick()
    expect(mountedIds(wrapper)).toEqual(['b'])
    expect(wrapper.emitted('left')).toEqual([['a']])
  })

  it('emits entered when the active child settles', async () => {
    const { wrapper, scopes } = mountDeck('a')
    await wrapper.setProps({ current: 'b' })

    scopes.get('b')!.transitionEnded()
    await nextTick()
    expect(wrapper.emitted('entered')).toEqual([['b']])
    // Still mounted — settling the active child does not unmount it.
    expect(mountedIds(wrapper)).toContain('b')
  })

  it('reactivates a still-leaving child instead of double-mounting', async () => {
    const { wrapper, scopes } = mountDeck('a')

    await wrapper.setProps({ current: 'b' })
    // Switch back to `a` before it finished leaving.
    await wrapper.setProps({ current: 'a' })

    const ids = mountedIds(wrapper)
    expect(ids).toEqual(['a', 'b'])
    expect(ids.filter((id) => id === 'a')).toHaveLength(1)
    expect(isActive(wrapper, 'a')).toBe(true)
    expect(isActive(wrapper, 'b')).toBe(false)

    // Now `b` is the leaver; settling it unmounts it.
    scopes.get('b')!.transitionEnded()
    await nextTick()
    expect(mountedIds(wrapper)).toEqual(['a'])
    expect(wrapper.emitted('left')).toEqual([['b']])
  })

  it('handles several leavers in flight at once', async () => {
    const { wrapper, scopes } = mountDeck('a')

    await wrapper.setProps({ current: 'b' })
    await wrapper.setProps({ current: 'c' })
    // a and b are both leaving, c is current.
    expect(mountedIds(wrapper)).toEqual(['c', 'a', 'b'])

    scopes.get('a')!.transitionEnded()
    await nextTick()
    expect(mountedIds(wrapper)).toEqual(['c', 'b'])

    scopes.get('b')!.transitionEnded()
    await nextTick()
    expect(mountedIds(wrapper)).toEqual(['c'])
    expect(wrapper.emitted('left')).toEqual([['a'], ['b']])
  })

  it('fills its container by default', () => {
    const { wrapper } = mountDeck('a')
    expect(wrapper.find('.utensil-deck').classes()).toContain('fit-container')
  })

  it('sizes to its content when fit is content', () => {
    const { wrapper } = mountDeck('a', false, 'content')
    expect(wrapper.find('.utensil-deck').classes()).toContain('fit-content')
  })

  it('marks the items of leaving children until they settle', async () => {
    const { wrapper, scopes } = mountDeck('a', false, 'content')
    const item = (id: string) => wrapper.find(`[data-id="${id}"]`).element.parentElement!

    await wrapper.setProps({ current: 'b' })
    expect(item('a').classList).toContain('leaving')
    expect(item('a').hasAttribute('inert')).toBe(true)
    expect(item('b').classList).not.toContain('leaving')
    expect(item('b').hasAttribute('inert')).toBe(false)

    // Returning to a leaving child makes its item active again
    await wrapper.setProps({ current: 'a' })
    expect(item('a').classList).not.toContain('leaving')
    expect(item('b').classList).toContain('leaving')

    scopes.get('b')!.transitionEnded()
    await nextTick()
    expect(wrapper.findAll('.utensil-deck-item')).toHaveLength(1)
  })
})

describe('UtensilDeck focus and height', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  function mountSteps(props: Record<string, unknown>) {
    const scopes = new Map<string, DeckScope>()
    const wrapper = mount(UtensilDeck, {
      props: { current: 'a', ...props },
      attachTo: document.body,
      slots: {
        default: (scope: DeckScope) => {
          scopes.set(scope.id, scope)
          return h('section', { 'data-id': scope.id }, [h('h2', `Step ${scope.id}`), h('button', 'Next')])
        },
      },
    })
    return { wrapper, scopes }
  }

  it('moves focus from the leaving child to the incoming heading once it has entered', async () => {
    const { wrapper, scopes } = mountSteps({ focusOnChange: true })
    wrapper.find<HTMLButtonElement>('[data-id="a"] button').element.focus()

    await wrapper.setProps({ current: 'b' })
    scopes.get('b')!.transitionEnded()

    const heading = wrapper.find('[data-id="b"] h2').element
    expect(document.activeElement).toBe(heading)
    expect(heading.getAttribute('tabindex')).toBe('-1')
  })

  it('leaves focus alone when it was outside the deck, or without focusOnChange', async () => {
    const outside = document.createElement('button')
    document.body.append(outside)
    const { wrapper, scopes } = mountSteps({ focusOnChange: true })
    outside.focus()

    await wrapper.setProps({ current: 'b' })
    scopes.get('b')!.transitionEnded()
    expect(document.activeElement).toBe(outside)

    const plain = mountSteps({})
    plain.wrapper.find<HTMLButtonElement>('[data-id="a"] button').element.focus()
    await plain.wrapper.setProps({ current: 'b' })
    plain.scopes.get('b')!.transitionEnded()
    expect(document.activeElement).not.toBe(plain.wrapper.find('[data-id="b"] h2').element)
  })

  it('holds the active item height in a content deck, animating after the first', async () => {
    const callbacks: (() => void)[] = []
    const observed: Element[] = []
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          callbacks.push(callback)
        }
        observe(target: Element) {
          observed.push(target)
        }
        disconnect() {}
      },
    )
    const { wrapper } = mountSteps({ fit: 'content', animateHeight: true })
    const deck = wrapper.find('.utensil-deck')
    const item = (id: string) => wrapper.find(`[data-id="${id}"]`).element.parentElement!

    Object.defineProperty(item('a'), 'offsetHeight', { value: 120 })
    callbacks[callbacks.length - 1]()
    await nextTick()
    expect(observed[observed.length - 1]).toBe(item('a'))
    expect(deck.attributes('style')).toContain('height: 120px')
    expect(deck.classes()).not.toContain('height-animated')

    await wrapper.setProps({ current: 'b' })
    await nextTick()
    Object.defineProperty(item('b'), 'offsetHeight', { value: 300 })
    callbacks[callbacks.length - 1]()
    await nextTick()
    expect(observed[observed.length - 1]).toBe(item('b'))
    expect(deck.attributes('style')).toContain('height: 300px')
    expect(deck.classes()).toContain('height-animated')
  })

  it('leaves its height to the layout without animateHeight', () => {
    const { wrapper } = mountSteps({ fit: 'content' })
    expect(wrapper.find('.utensil-deck').attributes('style')).toBeUndefined()
  })
})

const childComponents = import.meta.glob<Component>(
  ['./UtensilDeck*.vue', '!./UtensilDeck.vue', '!./UtensilDeckDoc.vue'],
  { import: 'default', eager: true },
)
// jsdom doesn't lay out, so each child's root rule is checked in its source
const childSources = import.meta.glob<string>(['./UtensilDeck*.vue', '!./UtensilDeck.vue', '!./UtensilDeckDoc.vue'], {
  query: '?raw',
  import: 'default',
  eager: true,
})

function childClass(path: string) {
  const name = /UtensilDeck(\w+)\.vue$/.exec(path)?.[1]
  if (!name) {
    throw new Error(`Not a deck child: ${path}`)
  }
  return `utensil-deck-${name.toLowerCase()}`
}

describe('UtensilDeck children', () => {
  const fits = ['container', 'content'] as const
  const cases = Object.keys(childComponents).flatMap((path) => fits.map((fit) => [path, fit] as const))

  it('finds every built-in child', () => {
    expect(Object.keys(childComponents).map(childClass).sort()).toEqual(
      ['fade', 'flip', 'instant', 'reveal', 'scale', 'slide'].map((name) => `utensil-deck-${name}`),
    )
  })

  it.each(cases)('%s fills its item in a %s deck', (path, fit) => {
    const child = childComponents[path]
    const wrapper = mount(UtensilDeck, {
      props: { current: 'a', fit },
      slots: {
        default: ({ id, active }: { id: string; active: boolean }) => h(child, { id, active, appear: false }),
      },
      global: { stubs: { transition: false } },
    })
    expect(wrapper.find(`.utensil-deck.fit-${fit} > .utensil-deck-item > .${childClass(path)}`).exists()).toBe(true)
  })

  // A child taken out of flow collapses a content deck to zero height
  it.each(Object.entries(childSources))('%s stays in flow', (path, source) => {
    const rule = new RegExp(`\\.${childClass(path)} \\{([^}]*)\\}`).exec(source)?.[1]
    expect(rule).toContain('height: 100%')
    expect(rule).not.toMatch(/position:\s*(absolute|fixed)/)
  })
})
