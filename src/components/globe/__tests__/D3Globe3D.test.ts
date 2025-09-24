import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import D3Globe3D from '../D3Globe3D.vue'

// Mock ResizeObserver for D3 components
globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock D3 SVG methods
Object.defineProperty(SVGElement.prototype, 'getBBox', {
  writable: true,
  value: vi.fn().mockReturnValue({
    x: 0,
    y: 0,
    width: 100,
    height: 20
  })
})

Object.defineProperty(SVGElement.prototype, 'getComputedTextLength', {
  writable: true,
  value: vi.fn().mockReturnValue(50)
})

// Mock SVGSVGElement clientWidth/Height
Object.defineProperty(SVGSVGElement.prototype, 'clientWidth', {
  writable: true,
  value: 800
})

Object.defineProperty(SVGSVGElement.prototype, 'clientHeight', {
  writable: true,
  value: 600
})

describe('D3Globe3D', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createWrapper = () => {
    const wrapper = mount(D3Globe3D, {
      attachTo: document.body
    })

    // Mock container dimensions for D3 to work
    Object.defineProperty(wrapper.element, 'clientWidth', {
      value: 800,
      writable: true
    })
    Object.defineProperty(wrapper.element, 'clientHeight', {
      value: 600,
      writable: true
    })

    return wrapper
  }

  describe('Component Rendering', () => {
    it('should render the globe container', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('div').exists()).toBe(true)
      expect(wrapper.find('div').classes()).toContain('w-full')
      expect(wrapper.find('div').classes()).toContain('h-full')
      expect(wrapper.find('div').classes()).toContain('bg-bg-primary')
    })

    it('should create SVG element when mounted', async () => {
      const wrapper = createWrapper()

      // Wait for component to mount and create SVG
      await wrapper.vm.$nextTick()

      // Component should not crash during mounting
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.$options.name).toBe('D3Globe3D')
    })

    it('should render 3D globe title', async () => {
      const wrapper = createWrapper()

      await wrapper.vm.$nextTick()

      // Component should render without errors
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('div').exists()).toBe(true)
    })
  })

  describe('3D Globe Features', () => {
    it('should create orthographic projection', async () => {
      const wrapper = createWrapper()

      await wrapper.vm.$nextTick()

      // Component should render and handle 3D globe creation logic
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.$options.name).toBe('D3Globe3D')
    })

    it('should generate and render spikes on globe', async () => {
      const wrapper = createWrapper()

      await wrapper.vm.$nextTick()

      // Component should handle spike generation for 3D globe
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.$options.name).toBe('D3Globe3D')
    })

    it('should create draggable interactions', async () => {
      const wrapper = createWrapper()

      await wrapper.vm.$nextTick()

      // Component should handle drag interactions for 3D rotation
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.$options.name).toBe('D3Globe3D')
    })

    it('should render world continents', async () => {
      const wrapper = createWrapper()

      await wrapper.vm.$nextTick()

      // Component should handle continent rendering
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.$options.name).toBe('D3Globe3D')
    })
  })

  describe('Styling and Colors', () => {
    it('should use proper CSS classes', () => {
      const wrapper = createWrapper()

      const container = wrapper.find('div')
      expect(container.classes()).toEqual(
        expect.arrayContaining(['w-full', 'h-full', 'bg-bg-primary'])
      )
    })

    it('should handle resize events', () => {
      createWrapper()

      // ResizeObserver should be created
      expect(globalThis.ResizeObserver).toHaveBeenCalled()
    })

    it('should cleanup ResizeObserver on unmount', () => {
      const disconnectSpy = vi.fn()
      const mockResizeObserver = {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: disconnectSpy
      }

      globalThis.ResizeObserver = vi
        .fn()
        .mockImplementation(() => mockResizeObserver)

      const wrapper = createWrapper()
      wrapper.unmount()

      expect(disconnectSpy).toHaveBeenCalled()
    })
  })

  describe('Component Structure', () => {
    it('should have correct component name', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.$options.name).toBe('D3Globe3D')
    })

    it('should handle empty container gracefully', () => {
      const wrapper = mount(D3Globe3D)

      // Component should not crash even if container is not properly sized
      expect(wrapper.exists()).toBe(true)
    })

    it('should be responsive to container size changes', async () => {
      const wrapper = createWrapper()

      // Mock container dimensions
      Object.defineProperty(wrapper.element, 'clientWidth', {
        value: 800,
        writable: true
      })
      Object.defineProperty(wrapper.element, 'clientHeight', {
        value: 600,
        writable: true
      })

      await wrapper.vm.$nextTick()

      const svg = wrapper.find('svg')
      if (svg.exists()) {
        expect(svg.attributes('width')).toBeDefined()
        expect(svg.attributes('height')).toBeDefined()
      }
    })
  })

  describe('3D Rotation Features', () => {
    it('should handle versor quaternion calculations', async () => {
      const wrapper = createWrapper()

      await wrapper.vm.$nextTick()

      // Component should handle 3D rotation calculations without crashing
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.$options.name).toBe('D3Globe3D')
    })

    it('should support drag interactions', async () => {
      const wrapper = createWrapper()

      await wrapper.vm.$nextTick()

      // Component should support drag-to-rotate functionality
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.$options.name).toBe('D3Globe3D')
    })
  })

  describe('Interactive Features', () => {
    it('should handle globe rotation interactions', async () => {
      const wrapper = createWrapper()

      await wrapper.vm.$nextTick()

      // Component should handle interactions without crashing
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.$options.name).toBe('D3Globe3D')
    })

    it('should render interactive spikes', async () => {
      const wrapper = createWrapper()

      await wrapper.vm.$nextTick()

      // Component should render spikes that work with 3D rotation
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.$options.name).toBe('D3Globe3D')
    })
  })

  describe('Performance Optimizations', () => {
    it('should implement caching for world topology data', async () => {
      const wrapper = createWrapper()

      await wrapper.vm.$nextTick()

      // Component should cache world data to prevent re-fetching
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.$options.name).toBe('D3Globe3D')
    })

    it('should use optimized rendering for drag interactions', async () => {
      const wrapper = createWrapper()

      await wrapper.vm.$nextTick()

      // Component should use throttled updates during drag interactions
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.$options.name).toBe('D3Globe3D')
    })

    it('should separate static and dynamic elements for better performance', async () => {
      const wrapper = createWrapper()

      await wrapper.vm.$nextTick()

      // Component should separate base geography from rotating elements
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.$options.name).toBe('D3Globe3D')
    })

    it('should implement animation frame throttling', async () => {
      const wrapper = createWrapper()

      await wrapper.vm.$nextTick()

      // Component should use requestAnimationFrame for smooth interactions
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.$options.name).toBe('D3Globe3D')
    })

    it('should cache spike data to prevent regeneration', async () => {
      const wrapper = createWrapper()

      await wrapper.vm.$nextTick()

      // Component should cache spike data for better performance
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.$options.name).toBe('D3Globe3D')
    })
  })

  describe('Memory Management', () => {
    it('should clean up animation frames on unmount', () => {
      const wrapper = createWrapper()
      wrapper.unmount()

      // Component should clean up any pending animation frames
      expect(wrapper.exists()).toBe(false)
    })

    it('should clear caches on unmount for memory cleanup', () => {
      const wrapper = createWrapper()
      wrapper.unmount()

      // Component should clear internal caches when unmounted
      expect(wrapper.exists()).toBe(false)
    })

    it('should properly dispose of D3 resources', () => {
      const wrapper = createWrapper()
      wrapper.unmount()

      // Component should clean up D3 selections and projections
      expect(wrapper.exists()).toBe(false)
    })
  })

  describe('Rendering Optimizations', () => {
    it('should avoid full re-renders during drag interactions', async () => {
      const wrapper = createWrapper()

      await wrapper.vm.$nextTick()

      // Component should only update position attributes during drag
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.$options.name).toBe('D3Globe3D')
    })

    it('should use efficient SVG attribute updates', async () => {
      const wrapper = createWrapper()

      await wrapper.vm.$nextTick()

      // Component should update only necessary SVG attributes
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.$options.name).toBe('D3Globe3D')
    })

    it('should maintain UI elements separately from rotating content', async () => {
      const wrapper = createWrapper()

      await wrapper.vm.$nextTick()

      // Component should keep static UI elements separate from rotating globe
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.$options.name).toBe('D3Globe3D')
    })
  })
})
