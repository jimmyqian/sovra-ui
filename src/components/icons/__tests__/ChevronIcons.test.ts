/**
 * Unit tests for Chevron icon components
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ChevronUpIcon from '../ChevronUpIcon.vue'
import ChevronDownIcon from '../ChevronDownIcon.vue'

describe('ChevronUpIcon', () => {
  it('renders correctly', () => {
    const wrapper = mount(ChevronUpIcon)

    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('width')).toBe('20')
    expect(svg.attributes('height')).toBe('20')
    expect(svg.attributes('viewBox')).toBe('0 0 24 24')
  })

  it('has correct path for up chevron', () => {
    const wrapper = mount(ChevronUpIcon)

    const path = wrapper.find('path')
    expect(path.exists()).toBe(true)
    expect(path.attributes('d')).toBe('M18 15L12 9L6 15')
    expect(path.attributes('stroke')).toBe('currentColor')
  })

  it('has proper accessibility attributes', () => {
    const wrapper = mount(ChevronUpIcon)

    const svg = wrapper.find('svg')
    expect(svg.attributes('fill')).toBe('none')
  })
})

describe('ChevronDownIcon', () => {
  it('renders correctly', () => {
    const wrapper = mount(ChevronDownIcon)

    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('width')).toBe('20')
    expect(svg.attributes('height')).toBe('20')
    expect(svg.attributes('viewBox')).toBe('0 0 24 24')
  })

  it('has correct path for down chevron', () => {
    const wrapper = mount(ChevronDownIcon)

    const path = wrapper.find('path')
    expect(path.exists()).toBe(true)
    expect(path.attributes('d')).toBe('M6 9L12 15L18 9')
    expect(path.attributes('stroke')).toBe('currentColor')
  })

  it('has proper accessibility attributes', () => {
    const wrapper = mount(ChevronDownIcon)

    const svg = wrapper.find('svg')
    expect(svg.attributes('fill')).toBe('none')
  })

  it('has consistent styling with ChevronUpIcon', () => {
    const upWrapper = mount(ChevronUpIcon)
    const downWrapper = mount(ChevronDownIcon)

    const upSvg = upWrapper.find('svg')
    const downSvg = downWrapper.find('svg')

    // Should have same dimensions
    expect(upSvg.attributes('width')).toBe(downSvg.attributes('width'))
    expect(upSvg.attributes('height')).toBe(downSvg.attributes('height'))
    expect(upSvg.attributes('viewBox')).toBe(downSvg.attributes('viewBox'))

    const upPath = upWrapper.find('path')
    const downPath = downWrapper.find('path')

    // Should have same stroke properties
    expect(upPath.attributes('stroke')).toBe(downPath.attributes('stroke'))
    expect(upPath.attributes('stroke-width')).toBe(
      downPath.attributes('stroke-width')
    )
    expect(upPath.attributes('stroke-linecap')).toBe(
      downPath.attributes('stroke-linecap')
    )
    expect(upPath.attributes('stroke-linejoin')).toBe(
      downPath.attributes('stroke-linejoin')
    )
  })
})
