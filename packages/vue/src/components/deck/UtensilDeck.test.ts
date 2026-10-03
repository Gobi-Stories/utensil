import { describe, it, expect } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import UtensilDeck from './UtensilDeck.vue'

interface DeckScope {
  id: string
  active: boolean
  appear: boolean
  transitionEnded: () => void
}

function mountDeck(current: string, appear = false) {
  const scopes = new Map<string, DeckScope>()
  const wrapper = mount(UtensilDeck, {
    props: { current, appear },
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
})
