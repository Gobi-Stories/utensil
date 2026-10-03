import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilDigitInput from './UtensilDigitInput.vue'

function boxes(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('input')
}

describe('UtensilDigitInput', () => {
  it('renders one box per digit', () => {
    const wrapper = mount(UtensilDigitInput, { props: { length: 4 } })
    expect(boxes(wrapper)).toHaveLength(4)
  })

  it('shows the model value across the boxes', () => {
    const wrapper = mount(UtensilDigitInput, { props: { modelValue: '12' } })
    const inputs = boxes(wrapper)
    expect((inputs[0].element as HTMLInputElement).value).toBe('1')
    expect((inputs[1].element as HTMLInputElement).value).toBe('2')
    expect((inputs[2].element as HTMLInputElement).value).toBe('')
  })

  it('emits the code as digits are typed', async () => {
    const wrapper = mount(UtensilDigitInput)
    const inputs = boxes(wrapper)
    await inputs[0].setValue('4')
    expect(wrapper.emitted('update:modelValue')?.pop()).toEqual(['4'])
  })

  it('rejects non-numeric characters', async () => {
    const wrapper = mount(UtensilDigitInput)
    await boxes(wrapper)[0].setValue('a')
    expect(wrapper.emitted('update:modelValue')?.pop()).toEqual([''])
  })

  it('completes when every digit is filled', async () => {
    const wrapper = mount(UtensilDigitInput, { props: { length: 3, modelValue: '12' } })
    await boxes(wrapper)[2].setValue('3')
    expect(wrapper.emitted('complete')?.pop()).toEqual(['123'])
  })

  it('fills the whole code from an OTP-style single-box insert', async () => {
    const wrapper = mount(UtensilDigitInput, { props: { length: 6 } })
    await boxes(wrapper)[0].setValue('123456')
    expect(wrapper.emitted('complete')?.pop()).toEqual(['123456'])
  })

  it('fills the whole code from a paste', async () => {
    const wrapper = mount(UtensilDigitInput, { props: { length: 6 } })
    await wrapper.find('.utensil-digit-input').trigger('paste', {
      clipboardData: { getData: () => '654321' },
    })
    expect(wrapper.emitted('complete')?.pop()).toEqual(['654321'])
  })

  it('ignores non-numeric pastes', async () => {
    const wrapper = mount(UtensilDigitInput, { props: { length: 6 } })
    await wrapper.find('.utensil-digit-input').trigger('paste', {
      clipboardData: { getData: () => 'abcdef' },
    })
    expect(wrapper.emitted('complete')).toBeUndefined()
  })

  it('clears the focused box and everything after it', async () => {
    const wrapper = mount(UtensilDigitInput, { props: { length: 4, modelValue: '1234' } })
    await boxes(wrapper)[1].trigger('focus')
    expect(wrapper.emitted('update:modelValue')?.pop()).toEqual(['1'])
  })

  it('clears back on backspace', async () => {
    const wrapper = mount(UtensilDigitInput, { props: { length: 4, modelValue: '123' } })
    await boxes(wrapper)[2].trigger('keydown', { key: 'Backspace' })
    expect(wrapper.emitted('update:modelValue')?.pop()).toEqual(['12'])
  })

  it('marks the group invalid', () => {
    const wrapper = mount(UtensilDigitInput, { props: { invalid: true } })
    expect(wrapper.find('.utensil-digit-input').classes()).toContain('invalid')
  })
})
