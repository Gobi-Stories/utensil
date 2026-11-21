import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilMenuDivider from './UtensilMenuDivider.vue'

describe('UtensilMenuDivider', () => {
  it('is a separator', () => {
    const wrapper = mount(UtensilMenuDivider)
    expect(wrapper.find('.utensil-menu-divider').attributes('role')).toBe('separator')
  })
})
