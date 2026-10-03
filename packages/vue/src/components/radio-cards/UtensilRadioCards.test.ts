import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import UtensilRadioCards from './UtensilRadioCards.vue'
import UtensilRadioCard from './UtensilRadioCard.vue'

function createRadioCards(
  options: {
    modelValue?: string
    disabled?: boolean
    variation?: string
    indicatorPosition?: string
    indicator?: boolean
    loop?: boolean
  } = {},
) {
  const TestWrapper = defineComponent({
    components: { UtensilRadioCards, UtensilRadioCard },
    setup() {
      const value = ref(options.modelValue)
      return { value }
    },
    template: `
      <UtensilRadioCards
        v-model="value"
        aria-label="Test cards"
        ${options.disabled ? 'disabled' : ''}
        ${options.variation ? `variation="${options.variation}"` : ''}
        ${options.indicatorPosition ? `indicator-position="${options.indicatorPosition}"` : ''}
        ${options.indicator === false ? ':indicator="false"' : ''}
        ${options.loop === false ? ':loop="false"' : ''}
      >
        <UtensilRadioCard value="a" label="Option A" />
        <UtensilRadioCard value="b" label="Option B" />
        <UtensilRadioCard value="c" label="Option C" />
      </UtensilRadioCards>
    `,
  })

  return mount(TestWrapper, {
    attachTo: document.body,
  })
}

describe('UtensilRadioCards', () => {
  it('renders a radiogroup with radio cards', () => {
    const wrapper = createRadioCards()
    expect(wrapper.find('[role="radiogroup"]').exists()).toBe(true)
    expect(wrapper.findAll('[role="radio"]')).toHaveLength(3)
    wrapper.unmount()
  })

  it('selects the initial value', () => {
    const wrapper = createRadioCards({ modelValue: 'b' })
    const radios = wrapper.findAll('[role="radio"]')
    expect(radios[1].attributes('aria-checked')).toBe('true')
    expect(radios[0].attributes('aria-checked')).toBe('false')
    expect(radios[2].attributes('aria-checked')).toBe('false')
    wrapper.unmount()
  })

  it('changes selection on click', async () => {
    const wrapper = createRadioCards({ modelValue: 'a' })
    const radios = wrapper.findAll('[role="radio"]')

    await radios[2].trigger('click')
    expect(wrapper.vm.value).toBe('c')
    wrapper.unmount()
  })

  it('manages tabindex correctly - selected card is tabbable', () => {
    const wrapper = createRadioCards({ modelValue: 'b' })
    const radios = wrapper.findAll('[role="radio"]')

    expect(radios[0].attributes('tabindex')).toBe('-1')
    expect(radios[1].attributes('tabindex')).toBe('0')
    expect(radios[2].attributes('tabindex')).toBe('-1')
    wrapper.unmount()
  })

  it('navigates with arrow keys', async () => {
    const wrapper = createRadioCards({ modelValue: 'a' })
    const group = wrapper.find('[role="radiogroup"]')
    const radios = wrapper.findAll('[role="radio"]')

    ;(radios[0].element as HTMLElement).focus()

    await group.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.vm.value).toBe('b')

    await group.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.vm.value).toBe('c')
    wrapper.unmount()
  })

  it('loops navigation by default', async () => {
    const wrapper = createRadioCards({ modelValue: 'c' })
    const group = wrapper.find('[role="radiogroup"]')
    const radios = wrapper.findAll('[role="radio"]')

    ;(radios[2].element as HTMLElement).focus()

    await group.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.vm.value).toBe('a')
    wrapper.unmount()
  })

  it('applies disabled state', () => {
    const wrapper = createRadioCards({ modelValue: 'a', disabled: true })
    expect(wrapper.find('.utensil-radio-cards.disabled').exists()).toBe(true)
    wrapper.unmount()
  })

  it('has accessible aria-label', () => {
    const wrapper = createRadioCards()
    expect(wrapper.find('[role="radiogroup"]').attributes('aria-label')).toBe('Test cards')
    wrapper.unmount()
  })

  it('renders label text in cards', () => {
    const wrapper = createRadioCards()
    const radios = wrapper.findAll('[role="radio"]')
    expect(radios[0].text()).toContain('Option A')
    expect(radios[1].text()).toContain('Option B')
    expect(radios[2].text()).toContain('Option C')
    wrapper.unmount()
  })

  it('applies selected class to selected card', () => {
    const wrapper = createRadioCards({ modelValue: 'b' })
    const radios = wrapper.findAll('.utensil-radio-card')
    expect(radios[1].classes()).toContain('selected')
    expect(radios[0].classes()).not.toContain('selected')
    wrapper.unmount()
  })

  it('applies indicator position class', () => {
    const wrapper = createRadioCards({ indicatorPosition: 'end-start' })
    const radios = wrapper.findAll('.utensil-radio-card')
    expect(radios[0].classes()).toContain('indicator-end-start')
    wrapper.unmount()
  })

  it('renders radio indicator SVG', () => {
    const wrapper = createRadioCards()
    expect(wrapper.find('.radio-indicator').exists()).toBe(true)
    wrapper.unmount()
  })

  it('selects on Enter key', async () => {
    const wrapper = createRadioCards({ modelValue: 'a' })
    const radios = wrapper.findAll('[role="radio"]')

    await radios[1].trigger('keydown', { key: 'Enter' })
    expect(wrapper.vm.value).toBe('b')
    wrapper.unmount()
  })

  it('selects on Space key', async () => {
    const wrapper = createRadioCards({ modelValue: 'a' })
    const radios = wrapper.findAll('[role="radio"]')

    await radios[2].trigger('keydown', { key: ' ' })
    expect(wrapper.vm.value).toBe('c')
    wrapper.unmount()
  })

  it('supports individually disabled cards', () => {
    const TestWrapper = defineComponent({
      components: { UtensilRadioCards, UtensilRadioCard },
      setup() {
        const value = ref('a')
        return { value }
      },
      template: `
        <UtensilRadioCards v-model="value" aria-label="Test">
          <UtensilRadioCard value="a" label="A" />
          <UtensilRadioCard value="b" label="B" disabled />
          <UtensilRadioCard value="c" label="C" />
        </UtensilRadioCards>
      `,
    })
    const wrapper = mount(TestWrapper, { attachTo: document.body })
    const radios = wrapper.findAll('.utensil-radio-card')
    expect(radios[1].classes()).toContain('disabled')
    expect(radios[1].attributes('aria-disabled')).toBe('true')
    expect(radios[0].classes()).not.toContain('disabled')
    wrapper.unmount()
  })

  it('does not loop when loop is false', async () => {
    const wrapper = createRadioCards({ modelValue: 'c', loop: false })
    const group = wrapper.find('[role="radiogroup"]')
    const radios = wrapper.findAll('[role="radio"]')

    ;(radios[2].element as HTMLElement).focus()

    await group.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.vm.value).toBe('c')
    wrapper.unmount()
  })

  it('hides all indicators when group indicator is false', () => {
    const wrapper = createRadioCards({ indicator: false })
    expect(wrapper.find('.radio-indicator').exists()).toBe(false)
    wrapper.unmount()
  })

  it('allows per-card indicator override', () => {
    const TestWrapper = defineComponent({
      components: { UtensilRadioCards, UtensilRadioCard },
      setup() {
        const value = ref('a')
        return { value }
      },
      template: `
        <UtensilRadioCards v-model="value" aria-label="Test" :indicator="false">
          <UtensilRadioCard value="a" label="A" :indicator="true" />
          <UtensilRadioCard value="b" label="B" />
        </UtensilRadioCards>
      `,
    })
    const wrapper = mount(TestWrapper, { attachTo: document.body })
    const radios = wrapper.findAll('.utensil-radio-card')
    expect(radios[0].find('.radio-indicator').exists()).toBe(true)
    expect(radios[1].find('.radio-indicator').exists()).toBe(false)
    wrapper.unmount()
  })

  it('renders indicatorIcon instead of SVG when specified on card', () => {
    const TestWrapper = defineComponent({
      components: { UtensilRadioCards, UtensilRadioCard },
      setup() {
        const value = ref('a')
        return { value }
      },
      template: `
        <UtensilRadioCards v-model="value" aria-label="Test">
          <UtensilRadioCard value="a" label="A" indicator-icon="check" />
          <UtensilRadioCard value="b" label="B" />
        </UtensilRadioCards>
      `,
    })
    const wrapper = mount(TestWrapper, { attachTo: document.body })
    const radios = wrapper.findAll('.utensil-radio-card')
    expect(radios[0].find('.radio-icon').exists()).toBe(true)
    expect(radios[0].find('.radio-indicator').exists()).toBe(false)
    expect(radios[1].find('.radio-indicator').exists()).toBe(true)
    expect(radios[1].find('.radio-icon').exists()).toBe(false)
    wrapper.unmount()
  })

  it('applies group indicatorIcon to all cards', () => {
    const TestWrapper = defineComponent({
      components: { UtensilRadioCards, UtensilRadioCard },
      setup() {
        const value = ref('a')
        return { value }
      },
      template: `
        <UtensilRadioCards v-model="value" aria-label="Test" indicator-icon="check">
          <UtensilRadioCard value="a" label="A" />
          <UtensilRadioCard value="b" label="B" />
        </UtensilRadioCards>
      `,
    })
    const wrapper = mount(TestWrapper, { attachTo: document.body })
    const radios = wrapper.findAll('.utensil-radio-card')
    expect(radios[0].find('.radio-icon').exists()).toBe(true)
    expect(radios[0].find('.radio-indicator').exists()).toBe(false)
    expect(radios[1].find('.radio-icon').exists()).toBe(true)
    expect(radios[1].find('.radio-indicator').exists()).toBe(false)
    wrapper.unmount()
  })

  it('card indicatorIcon overrides group indicatorIcon', () => {
    const TestWrapper = defineComponent({
      components: { UtensilRadioCards, UtensilRadioCard },
      setup() {
        const value = ref('a')
        return { value }
      },
      template: `
        <UtensilRadioCards v-model="value" aria-label="Test" indicator-icon="check">
          <UtensilRadioCard value="a" label="A" indicator-icon="star" />
          <UtensilRadioCard value="b" label="B" />
        </UtensilRadioCards>
      `,
    })
    const wrapper = mount(TestWrapper, { attachTo: document.body })
    const radios = wrapper.findAll('.utensil-radio-card')
    expect(radios[0].find('.radio-icon').exists()).toBe(true)
    expect(radios[1].find('.radio-icon').exists()).toBe(true)
    wrapper.unmount()
  })

  it('indicator slot still overrides indicatorIcon', () => {
    const TestWrapper = defineComponent({
      components: { UtensilRadioCards, UtensilRadioCard },
      setup() {
        const value = ref('a')
        return { value }
      },
      template: `
        <UtensilRadioCards v-model="value" aria-label="Test">
          <UtensilRadioCard value="a" label="A" indicator-icon="check">
            <template #indicator="{ selected }">
              <span class="custom-override">{{ selected }}</span>
            </template>
          </UtensilRadioCard>
        </UtensilRadioCards>
      `,
    })
    const wrapper = mount(TestWrapper, { attachTo: document.body })
    expect(wrapper.find('.custom-override').exists()).toBe(true)
    expect(wrapper.find('.radio-icon').exists()).toBe(false)
    wrapper.unmount()
  })

  it('renders custom indicator slot content', () => {
    const TestWrapper = defineComponent({
      components: { UtensilRadioCards, UtensilRadioCard },
      setup() {
        const value = ref('a')
        return { value }
      },
      template: `
        <UtensilRadioCards v-model="value" aria-label="Test">
          <UtensilRadioCard value="a" label="A">
            <template #indicator="{ selected }">
              <span class="custom-indicator" :data-selected="selected">✓</span>
            </template>
          </UtensilRadioCard>
          <UtensilRadioCard value="b" label="B" />
        </UtensilRadioCards>
      `,
    })
    const wrapper = mount(TestWrapper, { attachTo: document.body })
    const radios = wrapper.findAll('.utensil-radio-card')
    expect(radios[0].find('.custom-indicator').exists()).toBe(true)
    expect(radios[0].find('.radio-indicator').exists()).toBe(false)
    expect(radios[0].find('.custom-indicator').attributes('data-selected')).toBe('true')
    expect(radios[1].find('.radio-indicator').exists()).toBe(true)
    wrapper.unmount()
  })
})
