/**
 * Unit tests for LogoIcon component
 * Tests logo rendering, props, and easter egg functionality
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LogoIcon from '../LogoIcon.vue'
import { LOGO_PATHS, EASTER_EGG_LOGO_PATHS } from '@/assets/logo-paths'

describe('LogoIcon', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createWrapper = (props = {}) => {
    return mount(LogoIcon, {
      props
    })
  }

  describe('Basic Rendering', () => {
    it('should render SVG with default props', () => {
      const wrapper = createWrapper()
      const svg = wrapper.find('svg')

      expect(svg.exists()).toBe(true)
      expect(svg.attributes('width')).toBe('24')
      expect(svg.attributes('height')).toBe('24')
      expect(svg.attributes('fill')).toBe('none')
    })

    it('should render with custom size', () => {
      const wrapper = createWrapper({ size: 48 })
      const svg = wrapper.find('svg')

      expect(svg.attributes('width')).toBe('48')
      expect(svg.attributes('height')).toBe('48')
    })

    it('should render with custom color', () => {
      const wrapper = createWrapper({ color: '#ff0000' })
      const paths = wrapper.findAll('path')

      paths.forEach(path => {
        expect(path.attributes('fill')).toBe('#ff0000')
      })
    })

    it('should use default brand orange color', () => {
      const wrapper = createWrapper()
      const paths = wrapper.findAll('path')

      paths.forEach(path => {
        expect(path.attributes('fill')).toBe('var(--color-brand-orange)')
      })
    })
  })

  describe('Logo Paths', () => {
    it('should render correct number of paths for normal logo', () => {
      const wrapper = createWrapper()
      const paths = wrapper.findAll('path')

      expect(paths).toHaveLength(LOGO_PATHS.length)
    })

    it('should render normal logo paths by default', () => {
      const wrapper = createWrapper()
      const paths = wrapper.findAll('path')

      paths.forEach((path, index) => {
        expect(path.attributes('d')).toBe(LOGO_PATHS[index])
      })
    })
  })

  describe('Easter Egg Functionality', () => {
    beforeEach(() => {
      // Clear any existing event listeners
      document.removeEventListener('keydown', vi.fn())
    })

    it('should toggle to easter egg logo on Ctrl+S', async () => {
      const wrapper = createWrapper()

      // Initially should show normal logo
      let paths = wrapper.findAll('path')
      expect(paths).toHaveLength(LOGO_PATHS.length)
      paths.forEach((path, index) => {
        expect(path.attributes('d')).toBe(LOGO_PATHS[index])
      })

      // Simulate Ctrl+S keydown
      const ctrlSEvent = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: true,
        bubbles: true
      })

      // Prevent default to avoid browser save dialog
      const preventDefaultSpy = vi.spyOn(ctrlSEvent, 'preventDefault')

      // Dispatch the event
      document.dispatchEvent(ctrlSEvent)
      await wrapper.vm.$nextTick()

      // Should prevent default browser behavior
      expect(preventDefaultSpy).toHaveBeenCalled()

      // Should now show easter egg logo
      paths = wrapper.findAll('path')
      expect(paths).toHaveLength(EASTER_EGG_LOGO_PATHS.length)
      paths.forEach((path, index) => {
        expect(path.attributes('d')).toBe(EASTER_EGG_LOGO_PATHS[index])
      })
    })

    it('should toggle back to normal logo on second Ctrl+S', async () => {
      const wrapper = createWrapper()

      // First Ctrl+S - activate easter egg
      const ctrlSEvent1 = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: true,
        bubbles: true
      })
      document.dispatchEvent(ctrlSEvent1)
      await wrapper.vm.$nextTick()

      // Should show easter egg
      let paths = wrapper.findAll('path')
      expect(paths).toHaveLength(EASTER_EGG_LOGO_PATHS.length)

      // Second Ctrl+S - deactivate easter egg
      const ctrlSEvent2 = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: true,
        bubbles: true
      })
      document.dispatchEvent(ctrlSEvent2)
      await wrapper.vm.$nextTick()

      // Should show normal logo again
      paths = wrapper.findAll('path')
      expect(paths).toHaveLength(LOGO_PATHS.length)
      paths.forEach((path, index) => {
        expect(path.attributes('d')).toBe(LOGO_PATHS[index])
      })
    })

    it('should not toggle on other key combinations', async () => {
      const wrapper = createWrapper()

      // Test various key combinations that should NOT trigger toggle
      const testEvents = [
        new KeyboardEvent('keydown', { key: 's', bubbles: true }), // Just 's'
        new KeyboardEvent('keydown', {
          key: 'a',
          ctrlKey: true,
          bubbles: true
        }), // Ctrl+A
        new KeyboardEvent('keydown', { key: 's', altKey: true, bubbles: true }), // Alt+S
        new KeyboardEvent('keydown', {
          key: 's',
          shiftKey: true,
          bubbles: true
        }) // Shift+S
      ]

      for (const event of testEvents) {
        document.dispatchEvent(event)
        await wrapper.vm.$nextTick()

        // Should still show normal logo
        const paths = wrapper.findAll('path')
        expect(paths).toHaveLength(LOGO_PATHS.length)
        paths.forEach((path, index) => {
          expect(path.attributes('d')).toBe(LOGO_PATHS[index])
        })
      }
    })

    it('should clean up event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
      const wrapper = createWrapper()

      wrapper.unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      )
    })
  })

  describe('Props Interface', () => {
    it('should accept size as number', () => {
      const wrapper = createWrapper({ size: 32 })
      const svg = wrapper.find('svg')

      expect(svg.attributes('width')).toBe('32')
      expect(svg.attributes('height')).toBe('32')
    })

    it('should accept size as string', () => {
      const wrapper = createWrapper({ size: '64px' })
      const svg = wrapper.find('svg')

      expect(svg.attributes('width')).toBe('64px')
      expect(svg.attributes('height')).toBe('64px')
    })

    it('should accept color as CSS variable', () => {
      const wrapper = createWrapper({ color: 'var(--color-primary)' })
      const paths = wrapper.findAll('path')

      paths.forEach(path => {
        expect(path.attributes('fill')).toBe('var(--color-primary)')
      })
    })

    it('should accept color as hex value', () => {
      const wrapper = createWrapper({ color: '#123456' })
      const paths = wrapper.findAll('path')

      paths.forEach(path => {
        expect(path.attributes('fill')).toBe('#123456')
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper SVG structure', () => {
      const wrapper = createWrapper()
      const svg = wrapper.find('svg')

      expect(svg.attributes('viewBox')).toBe('0 0 51 52')
      expect(svg.attributes('xmlns')).toBe('http://www.w3.org/2000/svg')
    })

    it('should render all path elements with proper attributes', () => {
      const wrapper = createWrapper()
      const paths = wrapper.findAll('path')

      paths.forEach(path => {
        expect(path.attributes('d')).toBeDefined()
        expect(path.attributes('fill')).toBeDefined()
      })
    })
  })
})
