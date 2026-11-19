import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import UtensilTable from './UtensilTable.vue'
import UtensilTableHeader from './UtensilTableHeader.vue'

describe('UtensilTableHeader', () => {
  it('is a row of the column headers it is given', () => {
    const wrapper = mount(UtensilTableHeader, {
      slots: { default: '<span role="columnheader">Story</span><span role="columnheader">Views</span>' },
    })

    expect(wrapper.attributes('role')).toBe('row')
    expect(wrapper.findAll('[role="columnheader"]').map((cell) => cell.text())).toEqual(['Story', 'Views'])
  })

  it('sits in a table', () => {
    const wrapper = mount(UtensilTable, {
      props: { columns: ['1fr', '96px'] },
      slots: { default: () => [h(UtensilTableHeader, () => [h('span', { role: 'columnheader' }, 'Story')])] },
    })

    expect(wrapper.attributes('role')).toBe('table')
    expect(wrapper.find('[role="row"] [role="columnheader"]').text()).toBe('Story')
  })
})
