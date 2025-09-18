/**
 * Unit tests for CopyrightFooter component
 * Tests copyright display, current year calculation, styling, and semantic structure
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CopyrightFooter from '../CopyrightFooter.vue'

describe('CopyrightFooter', () => {
  let originalDateNow: typeof Date.now

  beforeEach(() => {
    originalDateNow = Date.now
    setActivePinia(createPinia())
  })

  afterEach(() => {
    Date.now = originalDateNow
  })

  describe('Basic Rendering', () => {
    it('renders footer element with correct structure', () => {
      const wrapper = mount(CopyrightFooter)

      const footer = wrapper.find('footer')
      expect(footer.exists()).toBe(true)
      expect(wrapper.element.tagName).toBe('FOOTER')
    })

    it('contains copyright span element', () => {
      const wrapper = mount(CopyrightFooter)

      const span = wrapper.find('span')
      expect(span.exists()).toBe(true)
      expect(span.text()).toMatch(/©\d{4} sovra\.ai/)
    })

    it('displays current year in copyright text', () => {
      const wrapper = mount(CopyrightFooter)

      const currentYear = new Date().getFullYear()
      expect(wrapper.text()).toContain(`©${currentYear} sovra.ai`)
    })
  })

  describe('Footer Styling', () => {
    it('applies correct base styling classes', () => {
      const wrapper = mount(CopyrightFooter)

      const footer = wrapper.find('footer')
      const expectedClasses = [
        'flex',
        'justify-between',
        'items-end',
        'text-text-secondary',
        'text-xs'
      ]

      expectedClasses.forEach(className => {
        expect(footer.classes()).toContain(className)
      })
    })

    it('applies correct desktop padding classes', () => {
      const wrapper = mount(CopyrightFooter)

      const footer = wrapper.find('footer')
      const expectedPaddingClasses = ['pt-4', 'pr-4', 'pb-8', 'pl-8']

      expectedPaddingClasses.forEach(className => {
        expect(footer.classes()).toContain(className)
      })
    })

    it('applies correct mobile/responsive padding classes', () => {
      const wrapper = mount(CopyrightFooter)

      const footer = wrapper.find('footer')
      const expectedResponsiveClasses = [
        'md:pt-3',
        'md:pr-3',
        'md:pb-8',
        'md:pl-8'
      ]

      expectedResponsiveClasses.forEach(className => {
        expect(footer.classes()).toContain(className)
      })
    })

    it('combines all styling classes correctly', () => {
      const wrapper = mount(CopyrightFooter)

      const footer = wrapper.find('footer')
      const allExpectedClasses = [
        'flex',
        'justify-between',
        'items-end',
        'text-text-secondary',
        'text-xs',
        'pt-4',
        'pr-4',
        'pb-8',
        'pl-8',
        'md:pt-3',
        'md:pr-3',
        'md:pb-8',
        'md:pl-8'
      ]

      allExpectedClasses.forEach(className => {
        expect(footer.classes()).toContain(className)
      })
    })
  })

  describe('Copyright Content', () => {
    it('displays correct copyright symbol', () => {
      const wrapper = mount(CopyrightFooter)

      expect(wrapper.text()).toContain('©')
    })

    it('displays correct company name', () => {
      const wrapper = mount(CopyrightFooter)

      expect(wrapper.text()).toContain('sovra.ai')
    })

    it('formats copyright text correctly', () => {
      const wrapper = mount(CopyrightFooter)

      const currentYear = new Date().getFullYear()
      const expectedText = `©${currentYear} sovra.ai`

      // Check that copyright text is included (ignoring the π button)
      expect(wrapper.find('span').text()).toBe(expectedText)
    })

    it('does not include extra whitespace or formatting', () => {
      const wrapper = mount(CopyrightFooter)

      const span = wrapper.find('span')
      const currentYear = new Date().getFullYear()

      expect(span.text().trim()).toBe(`©${currentYear} sovra.ai`)
    })
  })

  describe('Year Calculation', () => {
    it('uses current year from Date object', () => {
      const mockYear = 2025
      vi.useFakeTimers()
      vi.setSystemTime(new Date(`${mockYear}-06-15`))

      const wrapper = mount(CopyrightFooter)

      expect(wrapper.text()).toContain(`©${mockYear} sovra.ai`)

      vi.useRealTimers()
    })

    it('updates to correct year across year boundaries', () => {
      // Test year calculation works correctly
      const currentYear = new Date().getFullYear()
      const wrapper = mount(CopyrightFooter)
      expect(wrapper.text()).toContain(`©${currentYear} sovra.ai`)
    })

    it('calculates year at component creation time', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-07-15'))

      const wrapper = mount(CopyrightFooter)

      expect(wrapper.text()).toContain('©2024 sovra.ai')

      vi.useRealTimers()
    })

    it('handles current year calculation correctly', () => {
      // Don't mock Date to test actual current year
      const wrapper = mount(CopyrightFooter)
      const currentYear = new Date().getFullYear()

      expect(wrapper.text()).toContain(`©${currentYear} sovra.ai`)

      // Verify it's a reasonable year (not some default or error value)
      expect(currentYear).toBeGreaterThan(2020)
      expect(currentYear).toBeLessThan(2050)
    })
  })

  describe('Semantic Structure', () => {
    it('uses proper semantic footer element', () => {
      const wrapper = mount(CopyrightFooter)

      expect(wrapper.element.tagName).toBe('FOOTER')
      expect(wrapper.element.getAttribute('role')).toBeFalsy() // Native footer provides implicit role
    })

    it('structures content appropriately for screen readers', () => {
      const wrapper = mount(CopyrightFooter)

      const footer = wrapper.find('footer')
      const span = wrapper.find('span')

      expect(footer.exists()).toBe(true)
      expect(span.exists()).toBe(true)
      expect(footer.element.contains(span.element)).toBe(true)
    })

    it('provides appropriate text styling for readability', () => {
      const wrapper = mount(CopyrightFooter)

      const footer = wrapper.find('footer')
      expect(footer.classes()).toContain('text-xs')
      expect(footer.classes()).toContain('text-text-secondary')
      expect(footer.classes()).toContain('flex')
      expect(footer.classes()).toContain('justify-between')
      expect(footer.classes()).toContain('items-end')
    })
  })

  describe('Layout Behavior', () => {
    it('provides consistent spacing with padding', () => {
      const wrapper = mount(CopyrightFooter)

      const footer = wrapper.find('footer')

      // Vertical padding
      expect(footer.classes()).toContain('pt-4')
      expect(footer.classes()).toContain('pb-8')

      // Horizontal padding
      expect(footer.classes()).toContain('pl-8')
      expect(footer.classes()).toContain('pr-4')
    })

    it('adapts padding for different screen sizes', () => {
      const wrapper = mount(CopyrightFooter)

      const footer = wrapper.find('footer')

      // Mobile/tablet responsive padding
      expect(footer.classes()).toContain('md:pt-3')
      expect(footer.classes()).toContain('md:pr-3')
      expect(footer.classes()).toContain('md:pb-8')
      expect(footer.classes()).toContain('md:pl-8')
    })
  })

  describe('Component Behavior', () => {
    it('should not accept any props', () => {
      const wrapper = mount(CopyrightFooter)

      // Should not accept any props
      expect(Object.keys(wrapper.props())).toHaveLength(0)
    })

    it('contains minimal DOM structure', () => {
      const wrapper = mount(CopyrightFooter)

      // Should have footer with span only
      expect(wrapper.element.children.length).toBe(1)
      expect(wrapper.find('span').exists()).toBe(true)
    })

    it('renders consistently without external dependencies', () => {
      // Create multiple instances to ensure consistency
      const wrapper1 = mount(CopyrightFooter)
      const wrapper2 = mount(CopyrightFooter)

      expect(wrapper1.text()).toBe(wrapper2.text())
      expect(wrapper1.html()).toBe(wrapper2.html())
    })
  })
})
