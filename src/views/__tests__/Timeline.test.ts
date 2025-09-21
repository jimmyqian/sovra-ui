import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import Timeline from '../Timeline.vue'

// Mock components to avoid dependency issues
vi.mock('@/components/layout/AppHeader.vue', () => ({
  default: {
    name: 'AppHeader',
    template: '<div data-testid="app-header">Header</div>'
  }
}))

vi.mock('@/components/navigation/AppSidebar.vue', () => ({
  default: {
    name: 'AppSidebar',
    template: '<div data-testid="app-sidebar">Sidebar</div>'
  }
}))

vi.mock('@/components/common/SearchBar.vue', () => ({
  default: {
    name: 'SearchBar',
    props: ['modelValue', 'placeholder'],
    emits: ['update:modelValue', 'search', 'fileUpload'],
    template: `
      <div data-testid="search-bar">
        <input
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          :placeholder="placeholder"
        />
        <button @click="$emit('search', modelValue)">Search</button>
      </div>
    `
  }
}))

// Mock timeline data
vi.mock('../../../timeline-data.json', () => ({
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

// Mock ResizeObserver for D3Timeline
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

describe('Timeline Component', () => {
  let router: any

  beforeEach(() => {
    setActivePinia(createPinia())

    router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/timeline', component: Timeline }]
    })
  })

  const createWrapper = () => {
    return mount(Timeline, {
      global: {
        plugins: [createPinia(), router]
      }
    })
  }

  describe('Component Rendering', () => {
    it('should render all main layout components', () => {
      const wrapper = createWrapper()

      // Check main layout components are present
      expect(wrapper.find('[data-testid="app-header"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="app-sidebar"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="search-bar"]').exists()).toBe(true)
    })

    it('should render the timeline panel', () => {
      const wrapper = createWrapper()

      expect(wrapper.findComponent({ name: 'TimelinePanel' }).exists()).toBe(
        true
      )
    })

    it('should display correct search placeholder', () => {
      const wrapper = createWrapper()

      const searchInput = wrapper.find('[data-testid="search-bar"] input')
      expect(searchInput.attributes('placeholder')).toBe(
        'Search timeline events and activities'
      )
    })
  })

  describe('TimelinePanel Content', () => {
    it('should render timeline panel with D3Timeline component', async () => {
      const wrapper = createWrapper()

      // Wait for component to mount
      await wrapper.vm.$nextTick()

      const timelinePanel = wrapper.findComponent({ name: 'TimelinePanel' })
      expect(timelinePanel.exists()).toBe(true)

      const d3Timeline = timelinePanel.findComponent({ name: 'D3Timeline' })
      expect(d3Timeline.exists()).toBe(true)
    })

    it('should pass timeline events to D3Timeline', async () => {
      const wrapper = createWrapper()

      // Wait for component to mount and load data
      await wrapper.vm.$nextTick()

      const timelinePanel = wrapper.findComponent({ name: 'TimelinePanel' })
      const d3Timeline = timelinePanel.findComponent({ name: 'D3Timeline' })

      expect(d3Timeline.exists()).toBe(true)
      expect(d3Timeline.props('events')).toBeDefined()
      expect(Array.isArray(d3Timeline.props('events'))).toBe(true)
    })

    it('should have proper layout structure', () => {
      const wrapper = createWrapper()

      const timelinePanel = wrapper.findComponent({ name: 'TimelinePanel' })
      expect(timelinePanel.exists()).toBe(true)

      // Check for proper CSS classes
      const panelElement = timelinePanel.find('div')
      expect(panelElement.classes()).toContain('flex-1')
      expect(panelElement.classes()).toContain('bg-bg-primary')
    })
  })

  describe('Search Functionality', () => {
    it('should handle search events', async () => {
      const wrapper = createWrapper()

      const searchInput = wrapper.find('[data-testid="search-bar"] input')
      const searchButton = wrapper.find('[data-testid="search-bar"] button')

      await searchInput.setValue('test query')
      await searchButton.trigger('click')

      // Search functionality is implemented but doesn't produce visible output
      // This test verifies the component doesn't crash when search is triggered
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Layout Structure', () => {
    it('should use SearchLayout component', () => {
      const wrapper = createWrapper()

      expect(wrapper.findComponent({ name: 'SearchLayout' }).exists()).toBe(
        true
      )
    })

    it('should have proper responsive layout', () => {
      const wrapper = createWrapper()

      // Check that the layout container exists
      expect(wrapper.find('.h-screen').exists()).toBe(true)
    })
  })
})
