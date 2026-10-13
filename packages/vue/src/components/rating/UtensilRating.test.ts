import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import UtensilRating from './UtensilRating.vue'

function icons(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAllComponents({ name: 'UtensilIcon' }).map((icon) => icon.props('icon'))
}

function radios(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('input[type="radio"]')
}

describe('UtensilRating', () => {
  it('is a labelled radio group with a radio per point, as stars by default', () => {
    const wrapper = mount(UtensilRating, { props: { label: 'Rate it' } })

    expect(wrapper.attributes('role')).toBe('radiogroup')
    expect(wrapper.attributes('aria-label')).toBe('Rate it')
    expect(wrapper.classes()).toContain('stars')
    expect(radios(wrapper).map((radio) => radio.attributes('value'))).toEqual(['1', '2', '3', '4', '5'])
    expect(icons(wrapper)).toEqual(Array(5).fill('rating-star-outline'))
  })

  it('fills the rating and everything below it, and outlines what is above', () => {
    const wrapper = mount(UtensilRating, { props: { label: 'Rate it', modelValue: 3 } })

    expect(icons(wrapper)).toEqual([
      'rating-star',
      'rating-star',
      'rating-star',
      'rating-star-outline',
      'rating-star-outline',
    ])
    expect(radios(wrapper).map((radio) => (radio.element as HTMLInputElement).checked)).toEqual([
      false,
      false,
      true,
      false,
      false,
    ])
  })

  it('draws smilies from very negative to very positive, filled the same way', () => {
    const wrapper = mount(UtensilRating, { props: { label: 'Rate it', ratingStyle: 'smilies', modelValue: 2 } })

    expect(icons(wrapper)).toEqual([
      'rating-very-negative',
      'rating-negative',
      'rating-neutral-outline',
      'rating-positive-outline',
      'rating-very-positive-outline',
    ])
  })

  it('spreads the smilies over a scale of any length', () => {
    const wrapper = mount(UtensilRating, { props: { label: 'Rate it', ratingStyle: 'smilies', min: 0, max: 2 } })

    expect(icons(wrapper)).toEqual([
      'rating-very-negative-outline',
      'rating-neutral-outline',
      'rating-very-positive-outline',
    ])
  })

  it('draws numbers, solid at or below the rating and outlined above it', () => {
    const wrapper = mount(UtensilRating, { props: { label: 'Rate it', ratingStyle: 'numbers', modelValue: 2 } })
    const marks = wrapper.findAll('.utensil-rating-mark')

    expect(marks.map((mark) => mark.text())).toEqual(['1', '2', '3', '4', '5'])
    expect(marks.map((mark) => mark.classes('ui-solid'))).toEqual([true, true, false, false, false])
    expect(marks.map((mark) => mark.classes('ui-outline'))).toEqual([false, false, true, true, true])
    expect(wrapper.findAllComponents({ name: 'UtensilIcon' })).toHaveLength(0)
  })

  it('covers the scale it is given', () => {
    const wrapper = mount(UtensilRating, { props: { label: 'Rate it', min: 0, max: 10 } })

    expect(radios(wrapper)).toHaveLength(11)
  })

  it('shows and reads what the ends of the scale mean', () => {
    const wrapper = mount(UtensilRating, { props: { label: 'Rate it', minLabel: 'Poor', maxLabel: 'Great' } })

    expect(wrapper.find('.utensil-rating-labels').text()).toBe('PoorGreat')
    expect(radios(wrapper).map((radio) => radio.attributes('aria-label'))).toEqual([
      '1, Poor',
      '2',
      '3',
      '4',
      '5, Great',
    ])
  })

  it('leaves out the end labels when there are none', () => {
    const wrapper = mount(UtensilRating, { props: { label: 'Rate it' } })

    expect(wrapper.find('.utensil-rating-labels').exists()).toBe(false)
  })

  it('updates the rating when a point is chosen', async () => {
    const wrapper = mount(UtensilRating, { props: { label: 'Rate it' } })

    await radios(wrapper)[3].setValue()

    expect(wrapper.emitted('update:modelValue')).toEqual([[4]])
  })

  it('groups its radios apart from other ratings', () => {
    const wrapper = mount({
      components: { UtensilRating },
      template: '<UtensilRating label="First" /><UtensilRating label="Second" />',
    })
    const [first, second] = wrapper.findAllComponents(UtensilRating)

    expect(first.find('input').attributes('name')).not.toBe(second.find('input').attributes('name'))
  })

  it('disables every point', () => {
    const wrapper = mount(UtensilRating, { props: { label: 'Rate it', disabled: true } })

    expect(wrapper.classes()).toContain('disabled')
    expect(radios(wrapper).every((radio) => radio.attributes('disabled') !== undefined)).toBe(true)
  })

  it('shows a rating read-only, as one image of its value', () => {
    const wrapper = mount(UtensilRating, { props: { label: 'Score', modelValue: 4, readonly: true } })

    expect(wrapper.attributes('role')).toBe('img')
    expect(wrapper.attributes('aria-label')).toBe('Score: 4 of 5')
    expect(radios(wrapper)).toHaveLength(0)
    expect(icons(wrapper)).toEqual([...Array(4).fill('rating-star'), 'rating-star-outline'])
  })

  it('fills up to the point a mouse is over, as it would be once chosen', async () => {
    const wrapper = mount(UtensilRating, { props: { label: 'Rate it', modelValue: 4 } })
    const points = wrapper.findAll('.utensil-rating-option')

    await points[1].trigger('pointerenter', { pointerType: 'mouse' })
    expect(icons(wrapper)).toEqual([...Array(2).fill('rating-star'), ...Array(3).fill('rating-star-outline')])

    await wrapper.find('.utensil-rating-options').trigger('pointerleave')
    expect(icons(wrapper)).toEqual([...Array(4).fill('rating-star'), 'rating-star-outline'])
  })

  it('previews nothing for a touch, or while read-only or disabled', async () => {
    for (const props of [{}, { readonly: true }, { disabled: true }]) {
      const pointerType = Object.keys(props).length ? 'mouse' : 'touch'
      const wrapper = mount(UtensilRating, { props: { label: 'Rate it', ...props } })

      await wrapper.findAll('.utensil-rating-option')[2].trigger('pointerenter', { pointerType })

      expect(icons(wrapper)).toEqual(Array(5).fill('rating-star-outline'))
    }
  })

  it('leaves out the end labels when compact, still reading them', () => {
    const wrapper = mount(UtensilRating, {
      props: { label: 'Score', modelValue: 2, readonly: true, compact: true, minLabel: 'Poor', maxLabel: 'Great' },
    })

    expect(wrapper.classes()).toContain('compact')
    expect(wrapper.find('.utensil-rating-labels').exists()).toBe(false)
    expect(wrapper.attributes('aria-label')).toBe('Score: 2 of 5')
  })

  it('wraps onto even rows when its points would shrink below their smallest', async () => {
    let resized: ResizeObserverCallback = () => {}
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: ResizeObserverCallback) {
          resized = callback
        }
        observe() {}
        disconnect() {}
      },
    )
    const wrapper = mount(UtensilRating, { props: { label: 'Rate it', min: 0, max: 10, wrap: true } })
    const columns = () => (wrapper.element as HTMLElement).style.getPropertyValue('--utensil-rating-columns')
    await nextTick()

    expect(columns()).toBe('11')

    wrapper.find<HTMLElement>('.utensil-rating-options').element.style.columnGap = '4px'
    wrapper.findAll<HTMLElement>('.utensil-rating-option').forEach((option) => (option.element.style.minWidth = '32px'))
    resized([{ contentRect: { width: 280 } } as ResizeObserverEntry], {} as ResizeObserver)
    await nextTick()

    expect(columns()).toBe('6')
    vi.unstubAllGlobals()
  })

  it('partly fills the point above a rating that falls between two', () => {
    const wrapper = mount(UtensilRating, { props: { label: 'Average', modelValue: 3.4, readonly: true } })
    const parts = wrapper.findAll('.utensil-rating-part')

    expect(icons(wrapper)).toEqual([
      ...Array(3).fill('rating-star'),
      'rating-star-outline',
      'rating-star',
      'rating-star-outline',
    ])
    expect(parts).toHaveLength(1)
    expect(parts[0].element.parentElement).toBe(wrapper.findAll('.utensil-rating-option')[3].element)
    expect(Number(parts[0].attributes('style')?.match(/--utensil-rating-part: ([\d.]+)/)?.[1])).toBeCloseTo(0.4)
    expect(wrapper.attributes('aria-label')).toBe('Average: 3.4 of 5')
  })

  it('partly fills a smiley with its own filled face, and a number with its solid circle', () => {
    const smilies = mount(UtensilRating, {
      props: { label: 'Average', ratingStyle: 'smilies', modelValue: 1.5, readonly: true },
    })
    expect(smilies.find('.utensil-rating-part').findComponent({ name: 'UtensilIcon' }).props('icon')).toBe(
      'rating-negative',
    )

    const numbers = mount(UtensilRating, {
      props: { label: 'Average', ratingStyle: 'numbers', modelValue: 2.5, readonly: true },
    })
    const part = numbers.find('.utensil-rating-part')
    expect(part.text()).toBe('3')
    expect(part.classes()).toContain('ui-solid')
  })

  it('fills no point partly on a whole rating, and reads a long average to a tenth', () => {
    expect(
      mount(UtensilRating, { props: { label: 'Score', modelValue: 3 } })
        .find('.utensil-rating-part')
        .exists(),
    ).toBe(false)

    const wrapper = mount(UtensilRating, { props: { label: 'Average', modelValue: 3.4166, readonly: true } })
    expect(wrapper.attributes('aria-label')).toBe('Average: 3.4 of 5')
  })

  it('reads a read-only rating without a value as its scale', () => {
    const wrapper = mount(UtensilRating, {
      props: { label: 'Range', readonly: true, minLabel: 'Very poor', maxLabel: 'Excellent' },
    })

    expect(wrapper.attributes('aria-label')).toBe('Range: 1, Very poor to 5, Excellent')
    expect(icons(wrapper)).toEqual(Array(5).fill('rating-star-outline'))
  })
})
