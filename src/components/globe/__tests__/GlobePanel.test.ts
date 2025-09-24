import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GlobePanel from '../GlobePanel.vue'

// Mock the D3Globe3D component
vi.mock('../D3Globe3D.vue', () => ({
  default: {
    name: 'D3Globe3D',
    template: '<div data-testid="d3-globe-3d">3D Globe</div>'
  }
}))

// Mock ResizeObserver for consistency
globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

describe('GlobePanel', () => {
  const createWrapper = () => {
    return mount(GlobePanel)
  }

  describe('Component Rendering', () => {
    it('should render the panel container', () => {
      const wrapper = createWrapper()

      const container = wrapper.find('div')
      expect(container.exists()).toBe(true)
      expect(container.classes()).toContain('flex-1')
      expect(container.classes()).toContain('bg-bg-primary')
      expect(container.classes()).toContain('overflow-hidden')
    })

    it('should render D3Globe3D component', () => {
      const wrapper = createWrapper()

      const globe3D = wrapper.findComponent({ name: 'D3Globe3D' })
      expect(globe3D.exists()).toBe(true)
    })

    it('should have proper component structure', () => {
      const wrapper = createWrapper()

      // Check main container
      const mainContainer = wrapper.find(
        'div.flex-1.bg-bg-primary.overflow-hidden'
      )
      expect(mainContainer.exists()).toBe(true)

      // Check that D3Globe3D is inside the container
      const globe3D = mainContainer.findComponent({ name: 'D3Globe3D' })
      expect(globe3D.exists()).toBe(true)
    })
  })

  describe('Layout and Styling', () => {
    it('should have correct CSS classes for layout', () => {
      const wrapper = createWrapper()

      const container = wrapper.find('div')
      expect(container.classes()).toEqual(
        expect.arrayContaining(['flex-1', 'bg-bg-primary', 'overflow-hidden'])
      )
    })

    it('should fill available space with flex-1', () => {
      const wrapper = createWrapper()

      const container = wrapper.find('div')
      expect(container.classes()).toContain('flex-1')
    })

    it('should prevent overflow with overflow-hidden', () => {
      const wrapper = createWrapper()

      const container = wrapper.find('div')
      expect(container.classes()).toContain('overflow-hidden')
    })

    it('should use primary background color', () => {
      const wrapper = createWrapper()

      const container = wrapper.find('div')
      expect(container.classes()).toContain('bg-bg-primary')
    })
  })

  describe('Component Integration', () => {
    it('should properly integrate with D3Globe3D', () => {
      const wrapper = createWrapper()

      // D3Globe3D should be rendered as a direct child
      const globe3D = wrapper.findComponent({ name: 'D3Globe3D' })
      expect(globe3D.exists()).toBe(true)

      // Should be the only child component
      const allComponents = wrapper.findAllComponents({ name: 'D3Globe3D' })
      expect(allComponents).toHaveLength(1)
    })

    it('should maintain component hierarchy', () => {
      const wrapper = createWrapper()

      // Panel container should contain the 3D globe
      const container = wrapper.find('div')
      const globe3D = container.findComponent({ name: 'D3Globe3D' })
      expect(globe3D.exists()).toBe(true)
    })
  })

  describe('Component Metadata', () => {
    it('should have correct component name', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.$options.name).toBe('GlobePanel')
    })

    it('should be a simple wrapper component', () => {
      const wrapper = createWrapper()

      // Should have minimal HTML structure - just container div with D3Globe3D
      const html = wrapper.html()
      expect(html).toContain('flex-1')
      expect(html).toContain('bg-bg-primary')
      expect(html).toContain('overflow-hidden')
    })
  })

  describe('Responsive Behavior', () => {
    it('should handle different container sizes', () => {
      const wrapper = createWrapper()

      // Component should render without issues regardless of size
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'D3Globe3D' }).exists()).toBe(true)
    })

    it('should pass through sizing to D3Globe3D', () => {
      const wrapper = createWrapper()

      const globe3D = wrapper.findComponent({ name: 'D3Globe3D' })
      expect(globe3D.exists()).toBe(true)

      // Container should not impose additional size constraints on D3Globe3D
      const container = wrapper.find('div')
      expect(container.classes()).not.toContain('w-fixed')
      expect(container.classes()).not.toContain('h-fixed')
    })
  })

  describe('3D Globe Integration', () => {
    it('should integrate with 3D globe functionality', () => {
      const wrapper = createWrapper()

      // Should render the 3D globe component
      const globe3D = wrapper.findComponent({ name: 'D3Globe3D' })
      expect(globe3D.exists()).toBe(true)
    })

    it('should provide proper container for 3D rendering', () => {
      const wrapper = createWrapper()

      // Container should be properly configured for 3D globe
      const container = wrapper.find('div')
      expect(container.classes()).toContain('flex-1') // Takes full space
      expect(container.classes()).toContain('overflow-hidden') // Prevents overflow
    })
  })
})
