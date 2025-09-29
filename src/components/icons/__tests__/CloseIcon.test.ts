/**
 * Unit tests for CloseIcon component
 * Tests icon rendering, props, and SVG structure
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CloseIcon from '../CloseIcon.vue'

describe('CloseIcon', () => {
  describe('Basic Rendering', () => {
    it('renders SVG element', () => {
      const wrapper = mount(CloseIcon)

      const svg = wrapper.find('svg')
      expect(svg.exists()).toBe(true)
    })

    it('renders with default size', () => {
      const wrapper = mount(CloseIcon)

      const svg = wrapper.find('svg')
      expect(svg.attributes('width')).toBe('20')
      expect(svg.attributes('height')).toBe('20')
    })

    it('renders with custom size as number', () => {
      const wrapper = mount(CloseIcon, {
        props: { size: 24 }
      })

      const svg = wrapper.find('svg')
      expect(svg.attributes('width')).toBe('24')
      expect(svg.attributes('height')).toBe('24')
    })

    it('renders with custom size as string', () => {
      const wrapper = mount(CloseIcon, {
        props: { size: '32' }
      })

      const svg = wrapper.find('svg')
      expect(svg.attributes('width')).toBe('32')
      expect(svg.attributes('height')).toBe('32')
    })
  })

  describe('SVG Structure', () => {
    it('has correct viewBox', () => {
      const wrapper = mount(CloseIcon)

      const svg = wrapper.find('svg')
      expect(svg.attributes('viewBox')).toBe('0 0 24 24')
    })

    it('has correct fill attribute', () => {
      const wrapper = mount(CloseIcon)

      const svg = wrapper.find('svg')
      expect(svg.attributes('fill')).toBe('none')
    })

    it('has correct xmlns attribute', () => {
      const wrapper = mount(CloseIcon)

      const svg = wrapper.find('svg')
      expect(svg.attributes('xmlns')).toBe('http://www.w3.org/2000/svg')
    })

    it('renders path element with correct attributes', () => {
      const wrapper = mount(CloseIcon)

      const path = wrapper.find('path')
      expect(path.exists()).toBe(true)
      expect(path.attributes('d')).toBe('M18 6L6 18M6 6l12 12')
      expect(path.attributes('stroke')).toBe('currentColor')
      expect(path.attributes('stroke-linecap')).toBe('round')
      expect(path.attributes('stroke-linejoin')).toBe('round')
    })
  })

  describe('Stroke Width', () => {
    it('applies default stroke width', () => {
      const wrapper = mount(CloseIcon)

      const path = wrapper.find('path')
      expect(path.attributes('stroke-width')).toBe('2')
    })

    it('applies custom stroke width', () => {
      const wrapper = mount(CloseIcon, {
        props: { strokeWidth: 3 }
      })

      const path = wrapper.find('path')
      expect(path.attributes('stroke-width')).toBe('3')
    })
  })

  describe('Props Interface', () => {
    it('accepts size prop', () => {
      const wrapper = mount(CloseIcon, {
        props: { size: 16 }
      })

      expect(wrapper.props('size')).toBe(16)
    })

    it('accepts strokeWidth prop', () => {
      const wrapper = mount(CloseIcon, {
        props: { strokeWidth: 1.5 }
      })

      expect(wrapper.props('strokeWidth')).toBe(1.5)
    })
  })

  describe('CSS Classes and Styling', () => {
    it('inherits currentColor for stroke', () => {
      const wrapper = mount(CloseIcon)

      const path = wrapper.find('path')
      expect(path.attributes('stroke')).toBe('currentColor')
    })

    it('can be styled through parent component', () => {
      const wrapper = mount(CloseIcon, {
        attrs: { class: 'text-red-500' }
      })

      const svg = wrapper.find('svg')
      expect(svg.classes()).toContain('text-red-500')
    })
  })

  describe('Accessibility', () => {
    it('provides semantic close icon shape', () => {
      const wrapper = mount(CloseIcon)

      const path = wrapper.find('path')
      // The path should represent an X shape (crossing lines)
      expect(path.attributes('d')).toBe('M18 6L6 18M6 6l12 12')
    })

    it('works with rounded stroke caps for better visibility', () => {
      const wrapper = mount(CloseIcon)

      const path = wrapper.find('path')
      expect(path.attributes('stroke-linecap')).toBe('round')
      expect(path.attributes('stroke-linejoin')).toBe('round')
    })
  })
})
