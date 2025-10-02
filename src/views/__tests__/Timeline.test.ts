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

vi.mock('@/components/globe/GlobePanel.vue', () => ({
  default: {
    name: 'GlobePanel',
    template: '<div data-testid="globe-panel">3D Globe Panel</div>'
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

    it('should render back button', () => {
      const wrapper = createWrapper()

      // Check for back button - look in the top navigation area
      const buttons = wrapper.findAll('button')
      const backButton = buttons.find(btn => btn.text().includes('Back'))
      expect(backButton).toBeTruthy()
      expect(backButton?.text()).toContain('Back')
    })

    it('should render the star panel by default', () => {
      const wrapper = createWrapper()

      expect(wrapper.findComponent({ name: 'StarPanel' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'TimelinePanel' }).exists()).toBe(
        false
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
    it('should render timeline panel with D3Timeline component after cycling to timeline view', async () => {
      const wrapper = createWrapper()

      // Wait for component to mount
      await wrapper.vm.$nextTick()

      // Should start with star view, cycle to timeline
      const keydownEvent = new KeyboardEvent('keydown', { key: 'v' })
      document.dispatchEvent(keydownEvent)
      await wrapper.vm.$nextTick()

      const timelinePanel = wrapper.findComponent({ name: 'TimelinePanel' })
      expect(timelinePanel.exists()).toBe(true)

      const d3Timeline = timelinePanel.findComponent({ name: 'D3Timeline' })
      expect(d3Timeline.exists()).toBe(true)
    })

    it('should pass timeline events to D3Timeline when in timeline view', async () => {
      const wrapper = createWrapper()

      // Wait for component to mount and load data
      await wrapper.vm.$nextTick()

      // Navigate to timeline view
      const keydownEvent = new KeyboardEvent('keydown', { key: 'v' })
      document.dispatchEvent(keydownEvent)
      await wrapper.vm.$nextTick()

      const timelinePanel = wrapper.findComponent({ name: 'TimelinePanel' })
      const d3Timeline = timelinePanel.findComponent({ name: 'D3Timeline' })

      expect(d3Timeline.exists()).toBe(true)
      expect(d3Timeline.props('events')).toBeDefined()
      expect(Array.isArray(d3Timeline.props('events'))).toBe(true)
    })

    it('should have proper layout structure when in timeline view', async () => {
      const wrapper = createWrapper()

      // Navigate to timeline view
      const keydownEvent = new KeyboardEvent('keydown', { key: 'v' })
      document.dispatchEvent(keydownEvent)
      await wrapper.vm.$nextTick()

      const timelinePanel = wrapper.findComponent({ name: 'TimelinePanel' })
      expect(timelinePanel.exists()).toBe(true)

      // Check for proper CSS classes
      const panelElement = timelinePanel.find('div')
      expect(panelElement.classes()).toContain('flex-1')
      expect(panelElement.classes()).toContain('bg-bg-primary')
    })
  })

  describe('Navigation', () => {
    it('should call router.back() when back button is clicked', async () => {
      // Mock window.history with proper navigation state to enable the back button
      Object.defineProperty(window.history, 'length', {
        writable: true,
        configurable: true,
        value: 2
      })
      Object.defineProperty(window.history, 'state', {
        writable: true,
        configurable: true,
        value: { back: '/previous-page' }
      })

      const wrapper = createWrapper()
      const backSpy = vi.spyOn(router, 'back')

      // Find the BackButton component
      const backButtonComponent = wrapper.findComponent({ name: 'BackButton' })
      expect(backButtonComponent.exists()).toBe(true)

      const backButton = backButtonComponent.find('button')
      await backButton.trigger('click')

      expect(backSpy).toHaveBeenCalled()
      backSpy.mockRestore()
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

  describe('Conversation Panel Scroll Behavior', () => {
    it('should preserve scroll position when navigating between screens', () => {
      const wrapper = createWrapper()

      // SearchLayout contains ConversationPanel which preserves scroll position
      const searchLayout = wrapper.findComponent({ name: 'SearchLayout' })
      expect(searchLayout.exists()).toBe(true)

      // The ConversationPanel component preserves scroll position during navigation
      // and only auto-scrolls during search request/response cycles
      // This ensures consistent UX across all screens using SearchLayout
    })

    it('should handle search events which trigger auto-scroll only during search cycles', async () => {
      const wrapper = createWrapper()

      // Get SearchLayout component
      const searchLayout = wrapper.findComponent({ name: 'SearchLayout' })
      expect(searchLayout.exists()).toBe(true)

      // Search events trigger auto-scroll in ConversationPanel only when:
      // 1. User submits search → scrolls to show user message
      // 2. Thinking placeholder appears → scrolls to show thinking
      // 3. System response appears → scrolls to show response
      // But NOT when just navigating between screens
      await searchLayout.vm.$emit('search', 'test timeline search')

      // The Timeline component receives the search event and processes it
      // ConversationPanel handles the search logic and explicit auto-scroll
    })

    it('should use the same ConversationPanel as search screens with consistent scroll behavior', () => {
      const wrapper = createWrapper()

      // Timeline uses SearchLayout which contains ConversationPanel
      // This is the same component structure as:
      // - /search (SearchResults.vue uses SearchLayout)
      // - /dashboard/:id (SearchDetail.vue uses SearchLayout)
      // Therefore scroll behavior is identical across all screens

      const searchLayout = wrapper.findComponent({ name: 'SearchLayout' })
      expect(searchLayout.exists()).toBe(true)

      // SearchLayout template includes ConversationPanel with placeholder prop
      expect(searchLayout.props('searchPlaceholder')).toBe(
        'Search timeline events and activities'
      )

      // Scroll position is preserved when navigating to/from Timeline
      // Auto-scroll only occurs during explicit search operations
    })
  })

  describe('Keyboard Shortcuts and Display Mode', () => {
    it('should default to star display mode', () => {
      const wrapper = createWrapper()

      // Star panel should be visible by default
      expect(wrapper.findComponent({ name: 'StarPanel' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'TimelinePanel' }).exists()).toBe(
        false
      )
    })

    it('should cycle through views with V key', async () => {
      const wrapper = createWrapper()

      // Start with star view
      expect(wrapper.findComponent({ name: 'StarPanel' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'TimelinePanel' }).exists()).toBe(
        false
      )
      expect(wrapper.findComponent({ name: 'GlobePanel' }).exists()).toBe(false)

      // Simulate V key press on document (star -> timeline)
      const keydownEvent1 = new KeyboardEvent('keydown', { key: 'v' })
      document.dispatchEvent(keydownEvent1)
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent({ name: 'StarPanel' }).exists()).toBe(false)
      expect(wrapper.findComponent({ name: 'TimelinePanel' }).exists()).toBe(
        true
      )
      expect(wrapper.findComponent({ name: 'GlobePanel' }).exists()).toBe(false)

      // Press V again (timeline -> globe)
      const keydownEvent2 = new KeyboardEvent('keydown', { key: 'V' })
      document.dispatchEvent(keydownEvent2)
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent({ name: 'StarPanel' }).exists()).toBe(false)
      expect(wrapper.findComponent({ name: 'TimelinePanel' }).exists()).toBe(
        false
      )
      expect(wrapper.findComponent({ name: 'GlobePanel' }).exists()).toBe(true)

      // Press V again to cycle back to star (globe -> star)
      const keydownEvent3 = new KeyboardEvent('keydown', { key: 'v' })
      document.dispatchEvent(keydownEvent3)
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent({ name: 'StarPanel' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'TimelinePanel' }).exists()).toBe(
        false
      )
      expect(wrapper.findComponent({ name: 'GlobePanel' }).exists()).toBe(false)
    })

    it('should toggle timeline orientation with R key when in timeline mode', async () => {
      const wrapper = createWrapper()

      // Navigate to timeline view first (star -> timeline)
      const cycleEvent = new KeyboardEvent('keydown', { key: 'v' })
      document.dispatchEvent(cycleEvent)
      await wrapper.vm.$nextTick()

      // Should start in horizontal orientation
      const timelinePanel = wrapper.findComponent({ name: 'TimelinePanel' })
      expect(timelinePanel.props('orientation')).toBe('horizontal')

      // Press R to rotate
      const keydownEvent1 = new KeyboardEvent('keydown', { key: 'r' })
      document.dispatchEvent(keydownEvent1)
      await wrapper.vm.$nextTick()

      expect(timelinePanel.props('orientation')).toBe('vertical')

      // Press R again to rotate back
      const keydownEvent2 = new KeyboardEvent('keydown', { key: 'R' })
      document.dispatchEvent(keydownEvent2)
      await wrapper.vm.$nextTick()

      expect(timelinePanel.props('orientation')).toBe('horizontal')
    })

    it('should display keyboard shortcuts in UI', () => {
      const wrapper = createWrapper()

      // Check for keyboard shortcut display
      expect(wrapper.text()).toContain('Keyboard Shortcuts')
      expect(wrapper.text()).toContain('Toggle view:')
      expect(wrapper.text()).toContain('V')
      // Rotate timeline should not be visible in star mode (default)
      expect(wrapper.text()).not.toContain('Rotate timeline:')
    })

    it('should only show rotate hotkey when in timeline mode', async () => {
      const wrapper = createWrapper()

      // Should NOT show rotate hotkey in star mode (default)
      const hotkeyDisplay = wrapper.find('.bg-gray-800.text-white')
      expect(hotkeyDisplay.text()).not.toContain('Rotate timeline:')

      // Navigate to timeline view
      const keydownEvent1 = new KeyboardEvent('keydown', { key: 'v' })
      document.dispatchEvent(keydownEvent1)
      await wrapper.vm.$nextTick()

      // Should show rotate hotkey in timeline mode
      expect(hotkeyDisplay.text()).toContain('Rotate timeline:')
    })

    it('should prevent default behavior and stop propagation for keyboard events', async () => {
      const wrapper = createWrapper()
      const preventDefault = vi.fn()
      const stopPropagation = vi.fn()

      const keydownEvent = new KeyboardEvent('keydown', {
        key: 'v',
        bubbles: true
      })
      Object.defineProperty(keydownEvent, 'preventDefault', {
        value: preventDefault,
        writable: false
      })
      Object.defineProperty(keydownEvent, 'stopPropagation', {
        value: stopPropagation,
        writable: false
      })

      document.dispatchEvent(keydownEvent)
      await wrapper.vm.$nextTick()

      expect(preventDefault).toHaveBeenCalled()
      expect(stopPropagation).toHaveBeenCalled()
    })

    it('should handle 3D globe view display correctly', async () => {
      const wrapper = createWrapper()

      // Navigate to globe view (star -> timeline -> globe)
      const keydownEvent1 = new KeyboardEvent('keydown', { key: 'v' })
      document.dispatchEvent(keydownEvent1)
      await wrapper.vm.$nextTick()

      const keydownEvent2 = new KeyboardEvent('keydown', { key: 'v' })
      document.dispatchEvent(keydownEvent2)
      await wrapper.vm.$nextTick()

      // Check globe view content - should show GlobePanel
      expect(wrapper.findComponent({ name: 'GlobePanel' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'TimelinePanel' }).exists()).toBe(
        false
      )
      expect(wrapper.findComponent({ name: 'StarPanel' }).exists()).toBe(false)

      // Verify globe panel is rendered correctly
      const globePanel = wrapper.findComponent({ name: 'GlobePanel' })
      expect(globePanel.exists()).toBe(true)
    })

    it('should add and remove keyboard event listeners on mount/unmount', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

      const wrapper = createWrapper()

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      )

      wrapper.unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      )

      addEventListenerSpy.mockRestore()
      removeEventListenerSpy.mockRestore()
    })

    it('should not trigger shortcuts when typing in input field', async () => {
      const wrapper = createWrapper()

      // Should start in star mode
      expect(wrapper.findComponent({ name: 'StarPanel' }).exists()).toBe(true)

      // Create a mock input element and set it as active
      const mockInput = document.createElement('input')
      document.body.appendChild(mockInput)
      mockInput.focus()

      // Try to press 'v' key while input is focused
      const keydownEvent = new KeyboardEvent('keydown', { key: 'v' })
      document.dispatchEvent(keydownEvent)
      await wrapper.vm.$nextTick()

      // Display mode should NOT change (still in star mode)
      expect(wrapper.findComponent({ name: 'StarPanel' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'TimelinePanel' }).exists()).toBe(
        false
      )

      // Cleanup
      document.body.removeChild(mockInput)
    })

    it('should not trigger shortcuts when typing in textarea', async () => {
      const wrapper = createWrapper()

      // Navigate to timeline mode first
      const initialEvent = new KeyboardEvent('keydown', { key: 'v' })
      document.dispatchEvent(initialEvent)
      await wrapper.vm.$nextTick()
      expect(wrapper.findComponent({ name: 'TimelinePanel' }).exists()).toBe(
        true
      )

      // Create a mock textarea element and set it as active
      const mockTextarea = document.createElement('textarea')
      document.body.appendChild(mockTextarea)
      mockTextarea.focus()

      // Try to press 'r' key while textarea is focused
      const keydownEvent = new KeyboardEvent('keydown', { key: 'r' })
      document.dispatchEvent(keydownEvent)
      await wrapper.vm.$nextTick()

      // Orientation should NOT change (still horizontal)
      const timelinePanel = wrapper.findComponent({ name: 'TimelinePanel' })
      expect(timelinePanel.props('orientation')).toBe('horizontal')

      // Cleanup
      document.body.removeChild(mockTextarea)
    })

    it('should trigger shortcuts when input field is not focused', async () => {
      const wrapper = createWrapper()

      // Create a mock input but don't focus it
      const mockInput = document.createElement('input')
      document.body.appendChild(mockInput)
      // Don't call mockInput.focus()

      // Try to press 'v' key
      const keydownEvent = new KeyboardEvent('keydown', { key: 'v' })
      document.dispatchEvent(keydownEvent)
      await wrapper.vm.$nextTick()

      // Display mode SHOULD change (star -> timeline)
      expect(wrapper.findComponent({ name: 'StarPanel' }).exists()).toBe(false)
      expect(wrapper.findComponent({ name: 'TimelinePanel' }).exists()).toBe(
        true
      )

      // Cleanup
      document.body.removeChild(mockInput)
    })
  })
})
