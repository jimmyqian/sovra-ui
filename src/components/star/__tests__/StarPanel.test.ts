import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import StarPanel from '../StarPanel.vue'
import D3StarGraph from '../D3StarGraph.vue'

// Mock ResizeObserver
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

describe('StarPanel', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    vi.clearAllMocks()
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        {
          path: '/dashboard/:id',
          component: { template: '<div>Dashboard</div>' }
        }
      ]
    })
  })

  const createWrapper = (props = {}) => {
    return mount(StarPanel, {
      props,
      global: {
        plugins: [router]
      }
    })
  }

  it('renders star panel container', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('div').exists()).toBe(true)
    expect(wrapper.find('div').classes()).toContain('flex-1')
    expect(wrapper.find('div').classes()).toContain('flex')
    expect(wrapper.find('div').classes()).toContain('flex-col')
    expect(wrapper.find('div').classes()).toContain('max-h-full')
    expect(wrapper.find('div').classes()).toContain('overflow-hidden')
    expect(wrapper.find('div').classes()).toContain('bg-bg-primary')
  })

  it('renders D3StarGraph component', () => {
    const wrapper = createWrapper()

    const d3StarGraph = wrapper.findComponent(D3StarGraph)
    expect(d3StarGraph.exists()).toBe(true)
  })

  it('passes nodeCount prop to D3StarGraph component', () => {
    const wrapper = createWrapper({ nodeCount: 10 })

    const d3StarGraph = wrapper.findComponent(D3StarGraph)
    expect(d3StarGraph.exists()).toBe(true)
    expect(d3StarGraph.props('nodeCount')).toBe(10)
  })

  it('uses default nodeCount when not provided', () => {
    const wrapper = createWrapper()

    const d3StarGraph = wrapper.findComponent(D3StarGraph)
    expect(d3StarGraph.exists()).toBe(true)
    expect(d3StarGraph.props('nodeCount')).toBe(7)
  })

  it('has proper component structure', () => {
    const wrapper = createWrapper()

    const outerDiv = wrapper.find('div')
    expect(outerDiv.exists()).toBe(true)

    const innerDiv = outerDiv.find('div')
    expect(innerDiv.exists()).toBe(true)
    expect(innerDiv.classes()).toContain('flex-1')
    expect(innerDiv.classes()).toContain('p-4')
  })

  it('validates nodeCount prop interface', () => {
    const wrapper = createWrapper({ nodeCount: 5 })

    expect(wrapper.props('nodeCount')).toBe(5)
    expect(typeof wrapper.props('nodeCount')).toBe('number')
  })

  it('handles nodeCount prop changes', async () => {
    const wrapper = createWrapper({ nodeCount: 7 })

    const d3StarGraph = wrapper.findComponent(D3StarGraph)
    expect(d3StarGraph.props('nodeCount')).toBe(7)

    await wrapper.setProps({ nodeCount: 12 })
    expect(d3StarGraph.props('nodeCount')).toBe(12)
  })

  it('maintains proper layout structure', () => {
    const wrapper = createWrapper()

    // Check outer container
    const container = wrapper.find('div')
    expect(container.classes()).toEqual([
      'flex-1',
      'flex',
      'flex-col',
      'max-h-full',
      'overflow-hidden',
      'bg-bg-primary'
    ])

    // Check inner container
    const innerContainer = container.find('div')
    expect(innerContainer.classes()).toEqual(['flex-1', 'p-4'])
  })

  it('correctly instantiates with different node counts', () => {
    const nodeCounts = [3, 5, 7, 10, 15]

    nodeCounts.forEach(nodeCount => {
      const wrapper = createWrapper({ nodeCount })

      const d3StarGraph = wrapper.findComponent(D3StarGraph)
      expect(d3StarGraph.exists()).toBe(true)
      expect(d3StarGraph.props('nodeCount')).toBe(nodeCount)
    })
  })

  it('validates star panel concept for hub-and-spoke visualization', () => {
    const wrapper = createWrapper({ nodeCount: 7 })

    // Star panel should contain the D3StarGraph component
    const d3StarGraph = wrapper.findComponent(D3StarGraph)
    expect(d3StarGraph.exists()).toBe(true)

    // Should pass the correct number of nodes for star graph generation
    expect(d3StarGraph.props('nodeCount')).toBe(7)

    // Component should be properly structured for display
    expect(wrapper.find('div').exists()).toBe(true)
  })
})
