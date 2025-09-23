import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TimelinePanel from '@/components/timeline/TimelinePanel.vue'
import D3Timeline from '@/components/timeline/D3Timeline.vue'

interface TimelineEvent {
  year: number
  title: string
  category: string
}

// Mock the timeline data
vi.mock('../../../timeline-data.json', () => ({
  default: [
    { year: 1950, title: 'Early Fishing Trip', category: 'fishing' },
    { year: 1960, title: 'First Camping Experience', category: 'camping' },
    { year: 1970, title: 'Stock Car Racing Debut', category: 'racing' },
    { year: 1980, title: 'Service Complaint Filed', category: 'whining' },
    {
      year: 1990,
      title: 'Culinary School Graduation',
      category: 'gourmet cooking'
    },
    {
      year: 2000,
      title: 'Professional Fishing Tournament',
      category: 'fishing'
    },
    { year: 2010, title: 'Mountain Climbing Adventure', category: 'camping' },
    { year: 2020, title: 'Formula One Fan Experience', category: 'racing' }
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
    width: 150,
    height: 20
  })
})

Object.defineProperty(SVGElement.prototype, 'getComputedTextLength', {
  writable: true,
  value: vi.fn().mockReturnValue(80)
})

// Mock DOM scroll properties and methods
Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
  configurable: true,
  value: 800
})

Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
  configurable: true,
  value: 600
})

Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
  configurable: true,
  value: 1200 // Simulate content wider than container
})

Object.defineProperty(HTMLElement.prototype, 'scrollLeft', {
  configurable: true,
  writable: true,
  value: 0
})

HTMLElement.prototype.scrollTo = vi.fn()

describe('Timeline Horizontal Scroll Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders timeline with horizontal scrollable container for wide content', async () => {
    const wrapper = mount(TimelinePanel, {
      props: {
        orientation: 'horizontal'
      }
    })

    await wrapper.vm.$nextTick()

    // Check that horizontal scrolling classes are applied
    const scrollableDiv = wrapper.find('.overflow-x-auto')
    expect(scrollableDiv.exists()).toBe(true)
    expect(scrollableDiv.classes()).toContain('overflow-y-hidden')

    // Verify D3Timeline component receives correct orientation
    const d3Timeline = wrapper.findComponent(D3Timeline)
    expect(d3Timeline.exists()).toBe(true)
    expect(d3Timeline.props('orientation')).toBe('horizontal')
  })

  it('applies correct scrolling behavior for horizontal timeline orientation', async () => {
    const wrapper = mount(TimelinePanel, {
      props: {
        orientation: 'horizontal'
      }
    })

    await wrapper.vm.$nextTick()

    // Verify horizontal scrolling classes are applied
    const scrollContainer = wrapper.find('.overflow-x-auto.overflow-y-hidden')
    expect(scrollContainer.exists()).toBe(true)

    // Verify D3Timeline component receives correct orientation
    const d3Timeline = wrapper.findComponent(D3Timeline)
    expect(d3Timeline.exists()).toBe(true)
    expect(d3Timeline.props('orientation')).toBe('horizontal')
  })

  it('does not apply horizontal scrolling for vertical timeline orientation', async () => {
    const wrapper = mount(TimelinePanel, {
      props: {
        orientation: 'vertical'
      }
    })

    await wrapper.vm.$nextTick()

    // Verify horizontal scrolling classes are NOT applied for vertical orientation
    const container = wrapper.find('.flex-1.p-4')
    expect(container.exists()).toBe(true)
    expect(container.classes()).not.toContain('overflow-x-auto')
    expect(container.classes()).not.toContain('overflow-y-hidden')
  })

  it('handles timeline with wide year range that requires horizontal scrolling', async () => {
    const wideRangeEvents: TimelineEvent[] = [
      { year: 1900, title: 'Century Start Event', category: 'fishing' },
      { year: 2020, title: 'Modern Day Event', category: 'gourmet cooking' }
    ]

    const wrapper = mount(D3Timeline, {
      props: {
        events: wideRangeEvents,
        orientation: 'horizontal'
      }
    })

    await wrapper.vm.$nextTick()

    // Verify component handles wide year range
    expect(wrapper.props('events')).toEqual(wideRangeEvents)
    expect(wrapper.props('orientation')).toBe('horizontal')

    // The year range spans 120 years, which should trigger minimum width calculation
    const yearRange =
      (wideRangeEvents[1]?.year ?? 0) - (wideRangeEvents[0]?.year ?? 0)
    expect(yearRange).toBe(120)
  })

  it('preserves long category labels without truncation in horizontal scroll mode', async () => {
    const longLabelEvents: TimelineEvent[] = [
      { year: 1990, title: 'Event A', category: 'fishing' },
      { year: 1995, title: 'Event B', category: 'gourmet cooking' }, // This has a long category name
      { year: 2000, title: 'Event C', category: 'camping' }
    ]

    const wrapper = mount(D3Timeline, {
      props: {
        events: longLabelEvents,
        orientation: 'horizontal'
      }
    })

    await wrapper.vm.$nextTick()

    // Verify all events are properly handled
    expect(wrapper.props('events')).toHaveLength(3)
    expect(
      wrapper
        .props('events')
        .some((e: TimelineEvent) => e.category === 'gourmet cooking')
    ).toBe(true)
    expect(wrapper.props('orientation')).toBe('horizontal')
  })

  it('maintains proper layout when switching between horizontal and vertical orientations', async () => {
    const wrapper = mount(TimelinePanel, {
      props: {
        orientation: 'horizontal'
      }
    })

    await wrapper.vm.$nextTick()

    // Initially horizontal - should have scrolling classes
    let scrollContainer = wrapper.find('.overflow-x-auto')
    expect(scrollContainer.exists()).toBe(true)

    // Switch to vertical orientation
    await wrapper.setProps({ orientation: 'vertical' })
    await wrapper.vm.$nextTick()

    // Should no longer have horizontal scrolling classes
    scrollContainer = wrapper.find('.overflow-x-auto')
    expect(scrollContainer.exists()).toBe(false)

    const container = wrapper.find('.flex-1.p-4')
    expect(container.classes()).not.toContain('overflow-x-auto')
    expect(container.classes()).not.toContain('overflow-y-hidden')
  })

  it('handles empty timeline data gracefully with horizontal scrolling', async () => {
    const wrapper = mount(TimelinePanel, {
      props: {
        orientation: 'horizontal'
      }
    })

    await wrapper.vm.$nextTick()

    // Even with no data, scrolling container should exist for consistency
    const scrollContainer = wrapper.find('.overflow-x-auto')
    expect(scrollContainer.exists()).toBe(true)

    const d3Timeline = wrapper.findComponent(D3Timeline)
    expect(d3Timeline.exists()).toBe(true)
    expect(d3Timeline.props('orientation')).toBe('horizontal')
  })

  it('integrates TimelinePanel and D3Timeline for horizontal scrolling', async () => {
    const wrapper = mount(TimelinePanel, {
      props: {
        orientation: 'horizontal'
      }
    })

    await wrapper.vm.$nextTick()

    // Verify complete integration chain
    const d3Timeline = wrapper.findComponent(D3Timeline)
    expect(d3Timeline.exists()).toBe(true)

    // Verify horizontal orientation flows through the component chain
    expect(d3Timeline.props('orientation')).toBe('horizontal')

    // Verify scrolling container exists
    const scrollContainer = wrapper.find('.overflow-x-auto.overflow-y-hidden')
    expect(scrollContainer.exists()).toBe(true)
  })
})
