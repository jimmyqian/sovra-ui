/**
 * Unit tests for AppHeader component
 * Tests header rendering, styling, and Logo component integration
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeader from '../AppHeader.vue'
import Logo from '@/components/common/Logo.vue'

describe('AppHeader', () => {
  describe('Basic Rendering', () => {
    it('renders header element with correct structure', () => {
      const wrapper = mount(AppHeader, {
        global: {
          components: { Logo }
        }
      })

      const header = wrapper.find('header')
      expect(header.exists()).toBe(true)
      expect(wrapper.element.tagName).toBe('HEADER')
    })

    it('contains Logo component', () => {
      const wrapper = mount(AppHeader, {
        global: {
          components: { Logo }
        }
      })

      const logo = wrapper.findComponent(Logo)
      expect(logo.exists()).toBe(true)
    })

    it('renders only Logo component inside header', () => {
      const wrapper = mount(AppHeader, {
        global: {
          components: { Logo }
        }
      })

      const headerContent = wrapper.find('header').element
      const logoElement = wrapper.findComponent(Logo).element

      expect(headerContent.children.length).toBe(1)
      expect(headerContent.contains(logoElement)).toBe(true)
    })
  })

  describe('CSS Styling', () => {
    it('applies correct background styling classes', () => {
      const wrapper = mount(AppHeader, {
        global: {
          components: { Logo }
        }
      })

      const header = wrapper.find('header')
      expect(header.classes()).toContain('bg-bg-card')
    })

    it('applies correct padding classes', () => {
      const wrapper = mount(AppHeader, {
        global: {
          components: { Logo }
        }
      })

      const header = wrapper.find('header')
      expect(header.classes()).toContain('px-8')
      expect(header.classes()).toContain('py-4')
    })

    it('applies correct border styling classes', () => {
      const wrapper = mount(AppHeader, {
        global: {
          components: { Logo }
        }
      })

      const header = wrapper.find('header')
      expect(header.classes()).toContain('border-b')
      expect(header.classes()).toContain('border-border-light')
    })

    it('applies all expected CSS classes', () => {
      const wrapper = mount(AppHeader, {
        global: {
          components: { Logo }
        }
      })

      const header = wrapper.find('header')
      const expectedClasses = [
        'bg-bg-card',
        'px-8',
        'py-4',
        'border-b',
        'border-border-light'
      ]

      expectedClasses.forEach(className => {
        expect(header.classes()).toContain(className)
      })
    })
  })

  describe('Semantic Structure', () => {
    it('uses proper semantic header element', () => {
      const wrapper = mount(AppHeader, {
        global: {
          components: { Logo }
        }
      })

      expect(wrapper.element.tagName).toBe('HEADER')
      expect(wrapper.element.getAttribute('role')).toBeFalsy() // Native header provides implicit role
    })

    it('provides proper landmark structure for navigation', () => {
      const wrapper = mount(AppHeader, {
        global: {
          components: { Logo }
        }
      })

      // Header element provides banner landmark by default
      const header = wrapper.find('header')
      expect(header.exists()).toBe(true)
    })
  })

  describe('Component Integration', () => {
    it('successfully mounts with Logo component dependency', () => {
      expect(() => {
        mount(AppHeader, {
          global: {
            components: { Logo }
          }
        })
      }).not.toThrow()
    })

    it('passes no props to Logo component', () => {
      const wrapper = mount(AppHeader, {
        global: {
          components: { Logo }
        }
      })

      const logo = wrapper.findComponent(Logo)
      expect(Object.keys(logo.props())).toHaveLength(0)
    })
  })

  describe('Layout Behavior', () => {
    it('maintains consistent header height with padding', () => {
      const wrapper = mount(AppHeader, {
        global: {
          components: { Logo }
        }
      })

      const header = wrapper.find('header')
      expect(header.classes()).toContain('py-4')
    })

    it('provides horizontal spacing for header content', () => {
      const wrapper = mount(AppHeader, {
        global: {
          components: { Logo }
        }
      })

      const header = wrapper.find('header')
      expect(header.classes()).toContain('px-8')
    })

    it('creates visual separation with bottom border', () => {
      const wrapper = mount(AppHeader, {
        global: {
          components: { Logo }
        }
      })

      const header = wrapper.find('header')
      expect(header.classes()).toContain('border-b')
      expect(header.classes()).toContain('border-border-light')
    })
  })
})
