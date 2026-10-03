import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { AcmeButton } from './AcmeButton'

describe('AcmeButton', () => {
  it('renders a Utensil button and emits clicks', async () => {
    const wrapper = mount(AcmeButton, { props: { color: 'primary' }, slots: { default: 'Save' } })

    expect(wrapper.classes()).toContain('utensil-button')
    expect(wrapper.text()).toBe('Save')

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
