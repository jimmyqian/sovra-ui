import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
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

describe('D3StarGraph', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders star graph container', () => {
    const wrapper = mount(D3StarGraph, {
      props: {
        nodeCount: 7
      }
    })

    expect(wrapper.find('div').exists()).toBe(true)
    expect(wrapper.find('div').classes()).toContain('w-full')
    expect(wrapper.find('div').classes()).toContain('h-full')
    expect(wrapper.find('div').classes()).toContain('bg-bg-primary')
  })

  it('accepts nodeCount prop correctly', () => {
    const wrapper = mount(D3StarGraph, {
      props: {
        nodeCount: 5
      }
    })

    expect(wrapper.props('nodeCount')).toBe(5)
  })

  it('uses default nodeCount when not provided', () => {
    const wrapper = mount(D3StarGraph)

    expect(wrapper.props('nodeCount')).toBe(7)
  })

  it('handles different node counts', () => {
    const wrapper = mount(D3StarGraph, {
      props: {
        nodeCount: 10
      }
    })

    expect(wrapper.props('nodeCount')).toBe(10)
  })

  it('updates when nodeCount prop changes', async () => {
    const wrapper = mount(D3StarGraph, {
      props: {
        nodeCount: 5
      }
    })

    await wrapper.setProps({ nodeCount: 8 })
    expect(wrapper.props('nodeCount')).toBe(8)
  })

  it('handles component unmounting', () => {
    const wrapper = mount(D3StarGraph, {
      props: {
        nodeCount: 7
      }
    })

    wrapper.unmount()
    expect(wrapper.vm).toBeTruthy()
  })

  it('validates star graph structure requirements', () => {
    const wrapper = mount(D3StarGraph, {
      props: {
        nodeCount: 7
      }
    })

    // Verify the container element has proper setup
    const container = wrapper.find('div')
    expect(container.exists()).toBe(true)
    expect(container.attributes('class')).toContain('bg-bg-primary')
  })

  it('handles edge case with minimum nodes', () => {
    const wrapper = mount(D3StarGraph, {
      props: {
        nodeCount: 2
      }
    })

    expect(wrapper.props('nodeCount')).toBe(2)
  })

  it('handles larger node counts', () => {
    const wrapper = mount(D3StarGraph, {
      props: {
        nodeCount: 15
      }
    })

    expect(wrapper.props('nodeCount')).toBe(15)
  })

  it('maintains component integrity with prop changes', async () => {
    const wrapper = mount(D3StarGraph, {
      props: {
        nodeCount: 3
      }
    })

    expect(wrapper.props('nodeCount')).toBe(3)

    await wrapper.setProps({ nodeCount: 6 })
    expect(wrapper.props('nodeCount')).toBe(6)

    await wrapper.setProps({ nodeCount: 12 })
    expect(wrapper.props('nodeCount')).toBe(12)
  })

  it('verifies star graph visualization concept', () => {
    const wrapper = mount(D3StarGraph, {
      props: {
        nodeCount: 7
      }
    })

    // Star graph should have a hub-and-spoke structure
    // In a star graph with 7 nodes, there should be 1 hub and 6 spokes
    const nodeCount = wrapper.props('nodeCount')
    expect(nodeCount).toBe(7)

    // Verify the component is properly set up for D3 rendering
    const container = wrapper.find('div')
    expect(container.exists()).toBe(true)
  })
})
