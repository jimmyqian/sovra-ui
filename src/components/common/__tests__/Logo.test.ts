import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Logo from '../Logo.vue'

describe('Logo', () => {
  it('renders correctly', () => {
    const wrapper = mount(Logo)

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find('span').exists()).toBe(true)
  })

  it('displays SOVRa text', () => {
    const wrapper = mount(Logo)

    const textElement = wrapper.find('span')
    expect(textElement.text()).toBe('SOVRa')
  })

  it('applies correct text styling classes', () => {
    const wrapper = mount(Logo)

    const textElement = wrapper.find('span')
    expect(textElement.classes()).toContain('text-logo')
    expect(textElement.classes()).toContain('font-semibold')
    expect(textElement.classes()).toContain('text-text-primary')
  })

  it('renders SVG with correct dimensions', () => {
    const wrapper = mount(Logo)

    const svg = wrapper.find('svg')
    expect(svg.attributes('width')).toBe('52')
    expect(svg.attributes('height')).toBe('52')
    expect(svg.attributes('viewBox')).toBe('0 0 51 52')
  })

  it('has correct SVG fill color', () => {
    const wrapper = mount(Logo)

    const paths = wrapper.findAll('svg path')
    expect(paths).toHaveLength(3)

    // All paths should have accessible orange fill
    paths.forEach(path => {
      expect(path.attributes('fill')).toBe('var(--color-brand-orange)')
    })
  })

  it('renders orange accent bar', () => {
    const wrapper = mount(Logo)

    const accentBar = wrapper.find('.absolute.bg-brand-orange')
    expect(accentBar.exists()).toBe(true)
  })

  it('has correct accent bar positioning and dimensions', () => {
    const wrapper = mount(Logo)

    const accentBar = wrapper.find('.absolute.bg-brand-orange')
    const style = accentBar.attributes('style')

    expect(style).toContain('top: 16px')
    expect(style).toContain('left: calc(100% + (-1 * (1em + 6px)))')
    expect(style).toContain('width: calc(1em + 4px)')
    expect(style).toContain('height: 3px')
  })

  it('uses relative positioning for text container', () => {
    const wrapper = mount(Logo)

    const textContainer = wrapper.find('.relative')
    expect(textContainer.exists()).toBe(true)

    // Text and accent bar should be inside relative container
    expect(textContainer.find('span').exists()).toBe(true)
    expect(textContainer.find('.absolute.bg-brand-orange').exists()).toBe(true)
  })

  it('has correct main container layout', () => {
    const wrapper = mount(Logo)

    // Main container should have flex layout with gap
    expect(wrapper.classes()).toContain('flex')
    expect(wrapper.classes()).toContain('items-center')
    expect(wrapper.classes()).toContain('gap-2')
  })

  it('renders all SVG paths with correct structure', () => {
    const wrapper = mount(Logo)

    const svg = wrapper.find('svg')
    const paths = svg.findAll('path')

    expect(paths).toHaveLength(3)

    // Check that all paths have the required attributes
    paths.forEach(path => {
      expect(path.attributes('d')).toBeTruthy()
      expect(path.attributes('fill')).toBe('var(--color-brand-orange)')
    })
  })

  it('maintains SVG namespace', () => {
    const wrapper = mount(Logo)

    const svg = wrapper.find('svg')
    expect(svg.attributes('xmlns')).toBe('http://www.w3.org/2000/svg')
    expect(svg.attributes('fill')).toBe('none')
  })

  it('has accessible structure', () => {
    const wrapper = mount(Logo)

    // SVG should be first, text second for logical reading order
    const children = wrapper.element.children
    expect(children[0].tagName).toBe('svg')
    expect(children[1].querySelector('span')?.textContent).toBe('SOVRa')
  })

  it('accent bar has correct CSS classes', () => {
    const wrapper = mount(Logo)

    const accentBar = wrapper.find('.absolute.bg-brand-orange')
    expect(accentBar.classes()).toContain('absolute')
    expect(accentBar.classes()).toContain('bg-brand-orange')
  })

  it('renders without errors when mounted', () => {
    expect(() => {
      mount(Logo)
    }).not.toThrow()
  })

  it('uses accessible brand orange color value', () => {
    const wrapper = mount(Logo)

    // Verify SVG paths use CSS variable for accessibility
    const paths = wrapper.findAll('svg path')
    paths.forEach(path => {
      expect(path.attributes('fill')).toBe('var(--color-brand-orange)')
    })

    // The CSS variable should resolve to the accessible color #a6480e
    // This is tested in theme-contrast-validation.test.ts where 'brand-orange': '#a6480e'
    // provides 5.91:1 contrast ratio, exceeding WCAG AA requirements
  })
})
