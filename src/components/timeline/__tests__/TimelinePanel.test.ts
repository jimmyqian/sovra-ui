import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TimelinePanel from '../TimelinePanel.vue'
import D3Timeline from '../D3Timeline.vue'

// Mock the timeline data
vi.mock('../../../../timeline-data.json', () => ({
  default: [
    {
      year: 1990,
      title: 'Test Fishing Trip',
      category: 'fishing'
    },
    {
      year: 1995,
      title: 'Test Camping Adventure',
      category: 'camping'
    }
  ]
}))

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

describe('TimelinePanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders timeline panel container', () => {
    const wrapper = mount(TimelinePanel)

    expect(wrapper.find('div').exists()).toBe(true)
    expect(wrapper.find('div').classes()).toContain('flex-1')
    expect(wrapper.find('div').classes()).toContain('flex')
    expect(wrapper.find('div').classes()).toContain('flex-col')
    expect(wrapper.find('div').classes()).toContain('max-h-full')
    expect(wrapper.find('div').classes()).toContain('overflow-hidden')
    expect(wrapper.find('div').classes()).toContain('bg-bg-primary')
  })

  it('renders D3Timeline component', () => {
    const wrapper = mount(TimelinePanel)

    const d3Timeline = wrapper.findComponent(D3Timeline)
    expect(d3Timeline.exists()).toBe(true)
  })

  it('passes events to D3Timeline component', async () => {
    const wrapper = mount(TimelinePanel)

    // Wait for mounted hook to execute
    await wrapper.vm.$nextTick()

    const d3Timeline = wrapper.findComponent(D3Timeline)
    expect(d3Timeline.exists()).toBe(true)

    const events = d3Timeline.props('events')
    expect(events).toBeDefined()
    expect(Array.isArray(events)).toBe(true)
  })

  it('passes orientation prop to D3Timeline component', async () => {
    const wrapper = mount(TimelinePanel)

    // Wait for mounted hook to execute
    await wrapper.vm.$nextTick()

    const d3Timeline = wrapper.findComponent(D3Timeline)
    expect(d3Timeline.exists()).toBe(true)

    const orientation = d3Timeline.props('orientation')
    expect(orientation).toBe('horizontal')
  })

  it('loads timeline events on mount', async () => {
    const wrapper = mount(TimelinePanel)

    // Wait for mounted hook to execute
    await wrapper.vm.$nextTick()

    // Check that timeline events are loaded
    const d3Timeline = wrapper.findComponent(D3Timeline)
    const events = d3Timeline.props('events')

    expect(events).toHaveLength(2)
    expect(events[0]).toEqual({
      year: 1990,
      title: 'Test Fishing Trip',
      category: 'fishing'
    })
    expect(events[1]).toEqual({
      year: 1995,
      title: 'Test Camping Adventure',
      category: 'camping'
    })
  })

  it('has proper component structure', () => {
    const wrapper = mount(TimelinePanel)

    const outerDiv = wrapper.find('div')
    expect(outerDiv.exists()).toBe(true)

    const innerDiv = outerDiv.find('div')
    expect(innerDiv.exists()).toBe(true)
    expect(innerDiv.classes()).toContain('flex-1')
    expect(innerDiv.classes()).toContain('p-4')
  })

  it('validates timeline event interface', async () => {
    const wrapper = mount(TimelinePanel)

    // Wait for mounted hook to execute
    await wrapper.vm.$nextTick()

    const d3Timeline = wrapper.findComponent(D3Timeline)
    const events = d3Timeline.props('events')

    events.forEach(
      (event: { year: number; title: string; category: string }) => {
        expect(event).toHaveProperty('year')
        expect(event).toHaveProperty('title')
        expect(event).toHaveProperty('category')
        expect(typeof event.year).toBe('number')
        expect(typeof event.title).toBe('string')
        expect(typeof event.category).toBe('string')
      }
    )
  })

  it('applies horizontal scrolling classes for horizontal orientation', () => {
    const wrapper = mount(TimelinePanel, {
      props: {
        orientation: 'horizontal'
      }
    })

    const innerDiv = wrapper.find('.flex-1.p-4')
    expect(innerDiv.exists()).toBe(true)
    expect(innerDiv.classes()).toContain('overflow-x-auto')
    expect(innerDiv.classes()).toContain('overflow-y-hidden')
  })

  it('does not apply horizontal scrolling classes for vertical orientation', () => {
    const wrapper = mount(TimelinePanel, {
      props: {
        orientation: 'vertical'
      }
    })

    const innerDiv = wrapper.find('.flex-1.p-4')
    expect(innerDiv.exists()).toBe(true)
    expect(innerDiv.classes()).not.toContain('overflow-x-auto')
    expect(innerDiv.classes()).not.toContain('overflow-y-hidden')
  })

  it('defaults to horizontal orientation', () => {
    const wrapper = mount(TimelinePanel)

    const innerDiv = wrapper.find('.flex-1.p-4')
    expect(innerDiv.exists()).toBe(true)
    expect(innerDiv.classes()).toContain('overflow-x-auto')
    expect(innerDiv.classes()).toContain('overflow-y-hidden')
  })
})
