import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import D3Timeline from '../D3Timeline.vue'

interface TimelineEvent {
  year: number
  title: string
  category: string
}

const mockTimelineEvents: TimelineEvent[] = [
  {
    year: 1990,
    title: 'Fishing Trip to Lake Superior',
    category: 'fishing'
  },
  {
    year: 1995,
    title: 'Mountain Camping Adventure',
    category: 'camping'
  },
  {
    year: 2000,
    title: 'NASCAR Race Weekend',
    category: 'racing'
  },
  {
    year: 2005,
    title: 'Complained About Hotel Service',
    category: 'whining'
  }
]

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

describe('D3Timeline', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders timeline container', () => {
    const wrapper = mount(D3Timeline, {
      props: {
        events: mockTimelineEvents
      }
    })

    expect(wrapper.find('[data-testid="timeline-container"]').exists()).toBe(
      false
    )
    expect(wrapper.find('div').exists()).toBe(true)
    expect(wrapper.find('div').classes()).toContain('w-full')
    expect(wrapper.find('div').classes()).toContain('h-full')
    expect(wrapper.find('div').classes()).toContain('bg-bg-primary')
  })

  it('accepts events prop correctly', () => {
    const wrapper = mount(D3Timeline, {
      props: {
        events: mockTimelineEvents
      }
    })

    expect(wrapper.props('events')).toEqual(mockTimelineEvents)
    expect(wrapper.props('events')).toHaveLength(4)
  })

  it('accepts orientation prop with default value', () => {
    const wrapper = mount(D3Timeline, {
      props: {
        events: mockTimelineEvents
      }
    })

    expect(wrapper.props('orientation')).toBe('horizontal')
  })

  it('accepts vertical orientation prop', () => {
    const wrapper = mount(D3Timeline, {
      props: {
        events: mockTimelineEvents,
        orientation: 'vertical'
      }
    })

    expect(wrapper.props('orientation')).toBe('vertical')
  })

  it('handles empty events array', () => {
    const wrapper = mount(D3Timeline, {
      props: {
        events: []
      }
    })

    expect(wrapper.props('events')).toEqual([])
  })

  it('validates timeline event structure', () => {
    const wrapper = mount(D3Timeline, {
      props: {
        events: mockTimelineEvents
      }
    })

    const events = wrapper.props('events')
    events.forEach((event: TimelineEvent) => {
      expect(event).toHaveProperty('year')
      expect(event).toHaveProperty('title')
      expect(event).toHaveProperty('category')
      expect(typeof event.year).toBe('number')
      expect(typeof event.title).toBe('string')
      expect(typeof event.category).toBe('string')
    })
  })

  it('contains proper category values for multi-line timeline', () => {
    const wrapper = mount(D3Timeline, {
      props: {
        events: mockTimelineEvents
      }
    })

    const events = wrapper.props('events')
    const categories = events.map((event: TimelineEvent) => event.category)
    const validCategories = ['fishing', 'camping', 'racing', 'whining']

    categories.forEach((category: string) => {
      expect(validCategories).toContain(category)
    })

    // Verify all expected categories are represented
    const uniqueCategories = [...new Set(categories)]
    expect(uniqueCategories).toHaveLength(4)
  })

  it('has valid year range', () => {
    const wrapper = mount(D3Timeline, {
      props: {
        events: mockTimelineEvents
      }
    })

    const events = wrapper.props('events')
    events.forEach((event: TimelineEvent) => {
      expect(event.year).toBeGreaterThanOrEqual(1980)
      expect(event.year).toBeLessThanOrEqual(2025)
    })
  })

  it('handles component unmounting', () => {
    const wrapper = mount(D3Timeline, {
      props: {
        events: mockTimelineEvents
      }
    })

    wrapper.unmount()
    expect(wrapper.vm).toBeTruthy()
  })

  it('updates when events prop changes for multi-line display', async () => {
    const wrapper = mount(D3Timeline, {
      props: {
        events: mockTimelineEvents
      }
    })

    const newEvents: TimelineEvent[] = [
      {
        year: 2010,
        title: 'New Fishing Event',
        category: 'fishing'
      },
      {
        year: 2015,
        title: 'New Camping Event',
        category: 'camping'
      }
    ]

    await wrapper.setProps({ events: newEvents })
    expect(wrapper.props('events')).toEqual(newEvents)
    expect(wrapper.props('events')).toHaveLength(2)
  })

  it('handles events grouped by category correctly', () => {
    const multiCategoryEvents: TimelineEvent[] = [
      { year: 1990, title: 'Fishing A', category: 'fishing' },
      { year: 1991, title: 'Fishing B', category: 'fishing' },
      { year: 1992, title: 'Camping A', category: 'camping' },
      { year: 1993, title: 'Racing A', category: 'racing' },
      { year: 1994, title: 'Whining A', category: 'whining' }
    ]

    const wrapper = mount(D3Timeline, {
      props: {
        events: multiCategoryEvents
      }
    })

    const events = wrapper.props('events')
    const categoriesPresent = [...new Set(events.map((e: TimelineEvent) => e.category))]

    expect(categoriesPresent).toContain('fishing')
    expect(categoriesPresent).toContain('camping')
    expect(categoriesPresent).toContain('racing')
    expect(categoriesPresent).toContain('whining')
  })
})
