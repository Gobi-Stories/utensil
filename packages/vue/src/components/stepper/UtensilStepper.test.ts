import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilStepper from './UtensilStepper.vue'

const threeSteps = ['Details', 'Review', 'Confirm']

describe('UtensilStepper', () => {
  it('renders with the correct number of steps', () => {
    const wrapper = mount(UtensilStepper, { props: { steps: threeSteps } })
    expect(wrapper.findAll('.step')).toHaveLength(3)
  })

  it('renders step labels', () => {
    const wrapper = mount(UtensilStepper, { props: { steps: threeSteps } })
    const labels = wrapper.findAll('.step-label')
    expect(labels[0].text()).toBe('Details')
    expect(labels[1].text()).toBe('Review')
    expect(labels[2].text()).toBe('Confirm')
  })

  it('renders step numbers by default', () => {
    const wrapper = mount(UtensilStepper, { props: { steps: threeSteps } })
    const numbers = wrapper.findAll('.indicator-number')
    expect(numbers[0].text()).toBe('1')
    expect(numbers[1].text()).toBe('2')
    expect(numbers[2].text()).toBe('3')
  })

  it('marks the first step as active by default', () => {
    const wrapper = mount(UtensilStepper, { props: { steps: threeSteps } })
    const steps = wrapper.findAll('.step')
    expect(steps[0].classes()).toContain('active')
    expect(steps[1].classes()).toContain('upcoming')
    expect(steps[2].classes()).toContain('upcoming')
  })

  it('marks steps before activeStep as completed', () => {
    const wrapper = mount(UtensilStepper, { props: { steps: threeSteps, activeStep: 2 } })
    const steps = wrapper.findAll('.step')
    expect(steps[0].classes()).toContain('completed')
    expect(steps[1].classes()).toContain('completed')
    expect(steps[2].classes()).toContain('active')
  })

  it('accepts a number for unlabelled steps', () => {
    const wrapper = mount(UtensilStepper, { props: { steps: 4 } })
    expect(wrapper.findAll('.step')).toHaveLength(4)
    expect(wrapper.findAll('.step-label')).toHaveLength(0)
  })

  it('has correct aria attributes', () => {
    const wrapper = mount(UtensilStepper, { props: { steps: threeSteps } })
    const root = wrapper.find('.utensil-stepper')
    expect(root.attributes('role')).toBe('group')
    expect(root.attributes('aria-label')).toBe('Progress steps')
  })

  it('accepts custom aria-label', () => {
    const wrapper = mount(UtensilStepper, {
      props: { steps: threeSteps, ariaLabel: 'Checkout steps' },
    })
    expect(wrapper.find('.utensil-stepper').attributes('aria-label')).toBe('Checkout steps')
  })

  describe('progressBar="connected" (default)', () => {
    it('renders connectors between steps', () => {
      const wrapper = mount(UtensilStepper, { props: { steps: threeSteps } })
      expect(wrapper.findAll('.connector')).toHaveLength(2)
    })

    it('does not render progress bar', () => {
      const wrapper = mount(UtensilStepper, { props: { steps: threeSteps } })
      expect(wrapper.findComponent({ name: 'UtensilProgressBar' }).exists()).toBe(false)
    })

    it('applies progress-connected class', () => {
      const wrapper = mount(UtensilStepper, { props: { steps: threeSteps } })
      expect(wrapper.find('.utensil-stepper').classes()).toContain('progress-connected')
    })

    it('colors completed connectors', () => {
      const wrapper = mount(UtensilStepper, {
        props: { steps: threeSteps, activeStep: 2 },
      })
      const steps = wrapper.findAll('.step')
      expect(steps[0].classes()).toContain('completed')
      expect(steps[0].find('.connector').exists()).toBe(true)
    })
  })

  describe('variation', () => {
    it('applies ui-solid class to active and completed indicator circles by default', () => {
      const wrapper = mount(UtensilStepper, {
        props: { steps: threeSteps, activeStep: 1 },
      })
      const circles = wrapper.findAll('.indicator-circle')
      expect(circles[0].classes()).toContain('ui-solid')
      expect(circles[1].classes()).toContain('ui-solid')
      expect(circles[2].classes()).not.toContain('ui-solid')
    })

    it('applies the specified variation class to active and completed circles', () => {
      const wrapper = mount(UtensilStepper, {
        props: { steps: threeSteps, activeStep: 1, variation: 'outline' },
      })
      const circles = wrapper.findAll('.indicator-circle')
      expect(circles[0].classes()).toContain('ui-outline')
      expect(circles[1].classes()).toContain('ui-outline')
      expect(circles[2].classes()).not.toContain('ui-outline')
    })

    it('does not apply variation class to upcoming indicator circles', () => {
      const wrapper = mount(UtensilStepper, {
        props: { steps: threeSteps, activeStep: 0, variation: 'soft' },
      })
      const circles = wrapper.findAll('.indicator-circle')
      expect(circles[0].classes()).toContain('ui-soft')
      expect(circles[1].classes()).not.toContain('ui-soft')
      expect(circles[2].classes()).not.toContain('ui-soft')
    })
  })

  describe('completedColor', () => {
    it('passes completedColor as pen to completed steps', () => {
      const wrapper = mount(UtensilStepper, {
        props: { steps: threeSteps, activeStep: 2, completedColor: 'success' },
      })
      const themes = wrapper.findAllComponents({ name: 'UtensilTheme' })
      expect(themes[0].props('pen')).toBe('success')
      expect(themes[1].props('pen')).toBe('success')
    })

    it('does not pass pen to active or upcoming steps', () => {
      const wrapper = mount(UtensilStepper, {
        props: { steps: threeSteps, activeStep: 1, completedColor: 'success' },
      })
      const themes = wrapper.findAllComponents({ name: 'UtensilTheme' })
      expect(themes[1].props('pen')).toBeUndefined()
      expect(themes[2].props('pen')).toBeUndefined()
    })
  })

  describe('progressBar="underline"', () => {
    it('renders progress bar', () => {
      const wrapper = mount(UtensilStepper, {
        props: { steps: threeSteps, progressBar: 'underline' },
      })
      expect(wrapper.findComponent({ name: 'UtensilProgressBar' }).exists()).toBe(true)
    })

    it('does not render connectors', () => {
      const wrapper = mount(UtensilStepper, {
        props: { steps: threeSteps, progressBar: 'underline' },
      })
      expect(wrapper.findAll('.connector')).toHaveLength(0)
    })

    it('does not apply progress-connected class', () => {
      const wrapper = mount(UtensilStepper, {
        props: { steps: threeSteps, progressBar: 'underline' },
      })
      expect(wrapper.find('.utensil-stepper').classes()).not.toContain('progress-connected')
    })

    it('computes progress value correctly at first step', () => {
      const wrapper = mount(UtensilStepper, {
        props: { steps: threeSteps, activeStep: 0, progressBar: 'underline' },
      })
      const progressBar = wrapper.findComponent({ name: 'UtensilProgressBar' })
      expect(progressBar.props('value')).toBe(0)
    })

    it('computes progress value correctly at middle step', () => {
      const wrapper = mount(UtensilStepper, {
        props: { steps: threeSteps, activeStep: 1, progressBar: 'underline' },
      })
      const progressBar = wrapper.findComponent({ name: 'UtensilProgressBar' })
      expect(progressBar.props('value')).toBe(50)
    })

    it('computes progress value correctly at last step', () => {
      const wrapper = mount(UtensilStepper, {
        props: { steps: threeSteps, activeStep: 2, progressBar: 'underline' },
      })
      const progressBar = wrapper.findComponent({ name: 'UtensilProgressBar' })
      expect(progressBar.props('value')).toBe(100)
    })
  })
})
